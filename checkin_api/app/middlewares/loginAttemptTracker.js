const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const loginAttemptTracker = (req, res, next) => {

    const { username } = req.body;
    const ip = req.ip;

    // -------------------------------------------
    // Check based on IP
    // -------------------------------------------
    const ipKey = `ip:${ip}`;                    // IP 시도 횟수 저장 키
    const ipLockKey = `iplock:${ip}`;            // IP 잠금 상태 저장 키
    const ipIsLocked = cache.get(ipLockKey);     // 현재 IP가 잠겼는지 확인

    if (!ipIsLocked && cache.get(ipKey) >= 20) {
        cache.del(ipKey); // IP 시도 횟수 초기화
        console.log(`IP ${ip} lock released, attempt counter reset`);
    }

    const ipAttempts = cache.get(ipKey) || 0;

    if (ipIsLocked) {
        const ttl = cache.getTtl(ipLockKey);
        const remainingTime = ttl ? Math.ceil((ttl - Date.now()) / 1000) : 300;

        return res.status(429).json({
            success: false,
            message: "Too many login attempts from this IP. Please try again later.",
            isLocked: true,
            remainingTime: remainingTime
        });
    }

    // -------------------------------------------
    // Check based on username
    // -------------------------------------------
    if (!username) return next();

    const userKey = `login:${username}:${ip}`;   // 사용자+IP 시도 횟수 저장 키
    const userLockKey = `lock:${username}:${ip}`; // 사용자+IP 잠금 상태 저장 키
    const userIsLocked = cache.get(userLockKey); // 현재 사용자가 잠겼는지 확인

    if (!userIsLocked && cache.get(userKey) > 5) {
        cache.del(userKey);
        console.log(`User ${username} lock released, attempt counter reset`);
    }

    if (userIsLocked) {
        const ttl = cache.getTtl(userLockKey);
        const remainingTime = ttl ? Math.ceil((ttl - Date.now()) / 1000) : 300;

        return res.status(429).json({
            success: false,
            message: "Too many login attempts for this user. Please try again later.",
            isLocked: true,
            remainingTime: remainingTime,
            attempts: 5
        });
    }

    let userAttempts = cache.get(userKey) || 0;

    req.rateLimit = {
        current: userAttempts + 1,
        remaining: Math.max(0, 4 - userAttempts),
        isLocked: false
    };

    // ------------------------------------------
    // Login Monkey Patching
    // ------------------------------------------
    const originalSend = res.send;
    res.send = function(body) {
        let responseBody;
        try {
            responseBody = JSON.parse(body);
        } catch (e) {
            responseBody = body;
        }

        if (responseBody && responseBody.success === true) {
            cache.del(userKey);
            cache.del(userLockKey);
        }
        else if (responseBody && responseBody.success === false) {
            const newIpAttempts = ipAttempts + 1;
            cache.set(ipKey, newIpAttempts, 900);

            userAttempts += 1;
            cache.set(userKey, userAttempts, 900);

            if (newIpAttempts >= 20) {
                cache.set(ipLockKey, true, 300);

                responseBody.isLocked = true;
                responseBody.remainingTime = 300;
                responseBody.message = "Too many login attempts from this IP. Please try again later.";

                res.status(429);
                body = JSON.stringify(responseBody);
            }
            else if (userAttempts >= 5) {
                cache.set(userLockKey, true, 300);

                responseBody.isLocked = true;
                responseBody.remainingTime = 300;
                responseBody.attempts = 5;
                responseBody.remaining = 0;
                responseBody.message = "Too many login attempts for this user. Please try again later.";

                res.status(429);
                body = JSON.stringify(responseBody);
            }
        }
        originalSend.call(this, body);
    };

    next();
};

module.exports = loginAttemptTracker;