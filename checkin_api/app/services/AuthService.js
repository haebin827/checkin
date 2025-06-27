const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const { Op } = db.Sequelize;
const EmailService = require("./EmailService");

const AuthService = {

    async login(username, password, req) {
        try {
            const user = await User.findOne({
                where: { username: username },
                include: [{
                    model: db.location,
                    as: 'location',
                    attributes: ['id', 'name']
                }]
            });

            if(!user) {
                throw new Error("User not found");
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                if (req.rateLimit) {
                    req.rateLimit.current = (req.rateLimit.current || 0) + 1;
                    req.rateLimit.remaining = Math.max(0, 5 - req.rateLimit.current);
                }
                throw new Error('Invalid password');
            }

            /*await new Promise((resolve, reject) => {
                session.regenerate((err) => {
                    if (err) return reject(new Error("Session regeneration failed"));
                    resolve();
                });
            });*/

            req.session.user = {
                id: user.id,
                username: user.username,
                engName: user.engName,
                korName: user.korName,
                role: user.role,
                locationId: user.location_id
            };

            console.log("LOGIN USER: ", req.session.user)

            if (req.rateLimit) {
                req.rateLimit.current = 0;
            }

            return req.session.user;

        } catch (err) {
            console.error('AuthService/login: ', err);
            throw err;
        }
    },

    async logout(session, res) {
        try {
            await new Promise((resolve, reject) => {
                session.destroy((err) => {
                    if(err) {
                        return reject(new Error("Failed to delete session"));
                    }
                    if(res && res.clearCookie) {
                        res.clearCookie("sessionId");
                    }
                    resolve();
                });
            })
        } catch (err) {
            throw err;
        }
    },

    async findCurrentSession(session) {
        if (!session.user) {
            throw new Error("Authentication required");
        }

        try {
            const user = await User.findByPk(session.user.id);

            if (!user) {
                throw new Error("User not found");
            }

            const authProvider = user.googleId ? 'google' : user.kakaoId ? 'kakao' : 'local';

            return {
                id: session.user.id,
                username: session.user.username,
                engName: user.engName,
                korName: user.korName,
                role: session.user.role,
                email: session.user.email,
                phone: session.user.phone,
                provider: authProvider,
                locationId: user.location_id
            };

        } catch(err) {
            console.error('Session find error:', err);
            throw err;
        }
    },

    async register(data) {

        const transaction = await db.sequelize.transaction();

        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const newUser = await User.create({
                engName: data.engName,
                korName: data.korName || '',
                username: data.username,
                password: hashedPassword,
                email: data.email,
                phone: data.phone || '',
                role: data.role || 'guardian'
            }, { transaction });

            await transaction.commit();
            return {
                id: newUser.id,
                engName: newUser.engName,
                korName: newUser.korName,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            };
        } catch (err) {
            if (transaction) await transaction.rollback();
            console.error('Register error:', err);
            throw err;
        }
    },

    async findUserByUsername(username) {
        try {
            const user = await User.findOne({
                where: { username: username }
            });

            return user ? user : null;
        } catch (err) {
            console.error('Username check error:', err);
            throw err;
        }
    },

    async findUserByEmail(email) {
        try {
            const user = await User.findOne({
                where: { email: email }
            });

            return user ? user : null;
        } catch (err) {
            console.error('Email check error:', err);
            throw err;
        }
    },

    async findUserByPhone(phone) {
        try {
            const user = await User.findOne({
                where: { phone: phone }
            });

            return user ? user : null;
        } catch (err) {
            console.error('Phone check error:', err);
            throw err;
        }
    },

    async updateUserByPassword(password, email) {
        const transaction = await db.sequelize.transaction();

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.findOne({
                where: { email: email },
                transaction
            });

            if (!user) {
                await transaction.rollback();
                throw new Error('User not found');
            }

            const result = await User.update(
                { password: hashedPassword },
                { 
                    where: { email: email },
                    transaction
                }
            );

            await transaction.commit();

            return { affected: result[0] };
        } catch (error) {
            if (transaction) await transaction.rollback();
            console.error('Password update error:', error);
            throw error;
        }
    },

    async handleFindRequest(email, searchType) {
        try {
            const user = await User.findOne({
                where: { email: email }
            });

            if (searchType === 'id') {
                if(!user) {
                    return {message: 'ID recovery email sent successfully'};
                }
                await EmailService.sendFindIdEmail(email);
                return {message: 'ID recovery email sent successfully'};
            } else if (searchType === 'pw') {
                await EmailService.sendPasswordResetEmail(email);
                if(!user) {
                    return {message: 'Password reset email sent successfully'};
                }
                return {message: 'Password reset email sent successfully'};
            } else {
                throw new Error('Invalid search type');
            }
        } catch (err) {
            console.error('Find ID/PW error:', err);
            throw err;
        }
    },

    async changePassword(userId, currentPassword, newPassword) {
        const transaction = await db.sequelize.transaction();

        try {
            const user = await User.findByPk(userId, {
                attributes: ['password']
            });

            if (!user) {
                throw new Error("User not found");
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new Error("Current password is incorrect");
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.update(
                { password: hashedPassword },
                { 
                    where: { id: userId },
                    transaction 
                }
            );

            await transaction.commit();
            return { success: true };
        } catch (error) {
            await transaction.rollback();
            console.error('Password change error:', error);
            throw error;
        }
    },

    async getUser(id) {
        try {
            const user = await User.findByPk(id, {
                include: [{
                    model: db.location,
                    as: 'location',
                    attributes: ['id', 'name']
                }]
            });

            if (!user) {
                throw new Error('User not found.');
            }

            return user;
        } catch (err) {
            console.error('Get user error:', err);
            throw new Error('Failed to fetch user data');
        }
    },

    async updateUser(data) {
        const transaction = await db.sequelize.transaction();

        try {
            const user = await User.findByPk(data.id, { transaction });

            if (!user) {
                await transaction.rollback();
                throw new Error('User not found');
            }

            const updateData = {
                engName: data.engName,
                korName: data.korName,
                username: data.username,
                phone: data.phone,
            };

            await User.update(
                updateData,
                {
                    where: { id: data.id },
                    transaction
                }
            );

            await transaction.commit();
            return updateData;
        } catch (error) {
            if (transaction) await transaction.rollback();
            console.error('Update user error:', error);
            throw error;
        }
    }
}

module.exports = AuthService;