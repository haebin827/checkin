const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.user;
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id, {
            attributes: ['id', 'username', 'eng_name', 'kor_name', 'email', 'role']
        });

        if (user) {
            done(null, user);
        } else {
            done(new Error('User not found'), null);
        }
    } catch (err) {
        console.error('Deserialize User Error:', err);
        done(err, null);
    }
});

// -------------------------------------------
// Google Strategy
// -------------------------------------------

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            passReqToCallback: true
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                if (!profile.id || !profile.emails || !profile.emails[0].value || !profile.displayName) {
                    throw new Error('No profile info.');
                }

                const email = profile.emails[0].value.toLowerCase();
                const googleId = profile.id;
                const displayName = profile.displayName.trim();

                const transaction = await db.sequelize.transaction();

                try {
                    // 1. 이미 Google로 가입한 사용자 처리
                    let user = await User.findOne({
                        where: { googleId: googleId },
                        attributes: ['id', 'username', 'eng_name', 'kor_name', 'email', 'role'],
                        transaction
                    });

                    if (user) {
                        await transaction.commit();
                        return done(null, user);
                    }

                    // 2. 일반 계정으로 가입했지만 Google 계정과 동일한 이메일을 사용하는 사용자 처리
                    user = await User.findOne({
                        where: { email: email },
                        transaction
                    });

                    if (user) {
                        user.googleId = googleId;
                        await user.save({ transaction });
                        
                        await transaction.commit();
                        return done(null, user);
                    }

                    // 3. 새 사용자 가입 처리
                    let username = displayName;
                    let isUnique = false;
                    let counter = 1;

                    while (!isUnique) {
                        const existingUser = await User.findOne({
                            where: { username: username },
                            transaction
                        });

                        if (!existingUser) {
                            isUnique = true;
                        } else {
                            username = `${displayName}${counter}`;
                            counter++;
                        }
                    }

                    const newUser = await User.create({
                        googleId: googleId,
                        email: email,
                        username: username,
                        eng_name: displayName,
                        kor_name: '',
                        phone: '',
                        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // 임의 비밀번호 생성
                        role: 'guardian'
                    }, { transaction });

                    await transaction.commit();
                    return done(null, newUser);
                } catch (err) {
                    await transaction.rollback();
                    throw err;
                }
            } catch (err) {
                console.error('Google OAuth error:', err);
                return done(err, null);
            }
        }
    )
);

// -------------------------------------------
// Kakao Strategy
// -------------------------------------------
passport.use(
    new KakaoStrategy(
        {
            clientID: process.env.KAKAO_CLIENT_ID,
            callbackURL: '/auth/kakao/callback',
            passReqToCallback: true
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                if (!profile.id || !profile._json || !profile._json.kakao_account) {
                    throw new Error('No profile info.');
                }

                const kakaoAccount = profile._json.kakao_account;
                const email = kakaoAccount.email ? kakaoAccount.email.toLowerCase() : `${profile.id}@kakao.user`;
                const kakaoId = profile.id.toString();
                const displayName = profile.displayName ||
                    (kakaoAccount.profile && kakaoAccount.profile.nickname) ||
                    `Kakao User ${profile.id}`;

                const transaction = await db.sequelize.transaction();

                try {
                    // 1. 이미 Kakao로 가입한 사용자 처리
                    let user = await User.findOne({
                        where: { kakaoId: kakaoId },
                        attributes: ['id', 'username', 'eng_name', 'kor_name', 'email', 'role'],
                        transaction
                    });

                    if (user) {
                        await transaction.commit();
                        return done(null, user);
                    }

                    // 2. 일반 계정으로 가입했지만 Kakao 계정과 동일한 이메일을 사용하는 사용자 처리
                    user = await User.findOne({
                        where: { email: email },
                        transaction
                    });

                    if (user) {
                        user.kakaoId = kakaoId;
                        await user.save({ transaction });
                        
                        await transaction.commit();
                        return done(null, user);
                    }

                    // 3. 새 사용자 가입 처리
                    let username = displayName;
                    let isUnique = false;
                    let counter = 1;

                    while (!isUnique) {
                        const existingUser = await User.findOne({
                            where: { username: username },
                            transaction
                        });

                        if (!existingUser) {
                            isUnique = true;
                        } else {
                            username = `${displayName}${counter}`;
                            counter++;
                        }
                    }

                    const newUser = await User.create({
                        kakaoId: kakaoId,
                        email: email,
                        username: username,
                        eng_name: displayName,
                        kor_name: '',
                        phone: '',
                        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // 임의 비밀번호 생성
                        role: 'guardian'
                    }, { transaction });

                    await transaction.commit();
                    return done(null, newUser);
                } catch (err) {
                    await transaction.rollback();
                    throw err;
                }
            } catch (err) {
                console.error('Kakao OAuth error:', err);
                return done(err, null);
            }
        }
    )
);

module.exports = passport;