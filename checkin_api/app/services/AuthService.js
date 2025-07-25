const db = require('../models');
const User = db.user;
const bcrypt = require('bcryptjs');
const EmailService = require('./EmailService');
const AppError = require('../middlewares/AppError');

const AuthService = {
  async login(username, password, req) {
    const user = await User.findOne({
      where: { username: username },
      attributes: ['id', 'username', 'password', 'engName', 'korName', 'role', 'location_id'],
      include: [
        {
          model: db.location,
          as: 'location',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      if (req.rateLimit) {
        req.rateLimit.current = (req.rateLimit.current || 0) + 1;
        req.rateLimit.remaining = Math.max(0, 5 - req.rateLimit.current);
      }
      throw new AppError('Invalid credentials', 401);
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
      locationId: user.location_id,
    };

    if (req.rateLimit) {
      req.rateLimit.current = 0;
    }

    return req.session.user;
  },

  async logout(session, res) {
    await new Promise((resolve, reject) => {
      session.destroy(err => {
        if (err) {
          return reject(new AppError('Internal server error', 500));
        }
        if (res && res.clearCookie) {
          res.clearCookie('sessionId');
        }
        resolve();
      });
    });
  },

  async findCurrentSession(session) {
    if (!session.user) {
      throw new AppError('Authentication required', 401);
    }

    try {
      const user = await User.findByPk(session.user.id);

      if (!user) {
        throw new AppError('Invalid credentials', 401);
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
        locationId: user.location_id,
      };
    } catch (err) {
      throw err;
    }
  },

  async register(data, locationId = null) {
    const transaction = await db.sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await User.create(
        {
          engName: data.engName,
          korName: data.korName || '',
          username: data.username,
          password: hashedPassword,
          email: data.email,
          phone: data.phone,
          role: data.role || 'guardian',
          location_id: locationId ? locationId : null,
        },
        { transaction },
      );

      await transaction.commit();
      return {
        engName: newUser.engName,
        korName: newUser.korName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        location_id: locationId ? locationId : null,
      };
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  },

  async findUserByUsername(username) {
    try {
      const user = await User.findOne({
        where: { username: username },
      });

      return user ? user : null;
    } catch (err) {
      throw err;
    }
  },

  async findUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email: email },
      });

      return user ? user : null;
    } catch (err) {
      throw err;
    }
  },

  async findUserByPhone(phone) {
    try {
      const user = await User.findOne({
        where: { phone: phone },
      });

      return user ? user : null;
    } catch (err) {
      throw err;
    }
  },

  async updateUserByPassword(password, email) {
    const transaction = await db.sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.update(
        { password: hashedPassword },
        {
          where: { email },
          transaction,
        },
      );

      await transaction.commit();

      if (result[0] === 0) {
        throw new AppError('Invalid credentials', 401);
      }

      return { affected: result[0] };
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  },

  async handleFindRequest(email, searchType) {
    try {
      const exists = await User.count({ where: { email } });

      if (exists) {
        if (searchType === 'id') {
          await EmailService.sendFindIdEmail(email);
        } else if (searchType === 'pw') {
          await EmailService.sendPasswordResetEmail(email);
        } else {
          throw new AppError('This action is not allowed.', 404);
        }
      }
      return;
    } catch (err) {
      return;
    }
  },

  async changePassword(userId, currentPassword, newPassword) {
    const transaction = await db.sequelize.transaction();

    try {
      const user = await User.findByPk(userId, {
        attributes: ['id', 'password'],
      });

      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword }, { transaction });

      await transaction.commit();
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async getUser(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: [
          'id',
          'username',
          'password',
          'eng_name',
          'kor_name',
          'phone',
          'email',
          'role',
        ],
        include: [
          {
            model: db.location,
            as: 'location',
            attributes: ['name'],
          },
        ],
      });

      if (!user) {
        throw new Error('User not found.');
      }

      return user;
    } catch (err) {
      throw new Error('Failed to fetch user data');
    }
  },

  async updateUser(data) {
    const transaction = await db.sequelize.transaction();

    try {
      const updateData = await User.update(
        { ...data },
        {
          where: { id: data.id },
          transaction,
        },
      );

      if (updateData[0] === 0) {
        throw new AppError('Invalid credentials', 401);
      }
      await transaction.commit();
      return updateData;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new AppError('Invalid credentials', 401);
    }
  },

  async completeRegistration(req) {
    const tempUser = req.session.tempUser;

    if (!tempUser || !tempUser.isTemporary) {
      throw new AppError('Invalid credentials', 400);
    }

    const { engName, korName, phone } = req.body;

    if (!engName || !phone) {
      throw new AppError('English name and phone number are required', 400);
    }

    const transaction = await db.sequelize.transaction();

    try {
      const userData = {
        googleId: tempUser.googleId || null,
        kakaoId: tempUser.kakaoId || null,
        email: tempUser.email,
        username: tempUser.username,
        role: tempUser.role,
        engName: engName,
        korName: korName || null,
        phone: phone,
      };

      const newUser = await db.user.create(userData, { transaction });
      await transaction.commit();

      delete req.session.tempUser;

      req.session.user = {
        id: newUser.id,
        username: newUser.username,
        name: newUser.engName,
        role: newUser.role,
        email: newUser.email,
        phone: newUser.phone,
      };
      return req.session.user;
    } catch (err) {
      await transaction.rollback();
      throw new AppError('Invalid credentials', 400);
    }
  },
};

module.exports = AuthService;
