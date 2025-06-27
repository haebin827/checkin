const db = require("../models");
const { v4: uuidv4 } = require('uuid');
const EmailService = require("./EmailService");
const Child = db.child;
const ChildLocation = db.childLocation;
const User = db.user;
const { Op } = db.Sequelize;

const ChildService = {

    async findAllChildren() {
        try {
            const children = await Child.findAll();
            return children;
        } catch(err) {
            console.error('ChildService/findAllChildren:', err);
            throw err;
        }
    },

    async findChildrenByLocation(locationId) {
        try {
            const children = await Child.findAll({
                where: {
                    locationId: locationId
                }
            });
            return children;
        } catch(err) {
            console.error('ChildService/findChildrenByLocation:', err);
            throw err;
        }
    },

    async createChild(childData) {
        if (!childData.engName || !childData.locationId) {
            throw new Error('English name and location are required');
        }

        try {
            const child = await Child.create(childData);
            return child;
        } catch(err) {
            console.error('ChildService/createChild:', err);
            throw err;
        }
    },

    async updateChild(childId, childData) {
        const transaction = await db.sequelize.transaction();
        try {
            const child = await Child.findByPk(childId);
            if (!child) {
                throw new Error('Child not found');
            }

            await child.update(childData, { transaction });
            await transaction.commit();
            return child;
        } catch(err) {
            await transaction.rollback();
            console.error('ChildService/updateChild:', err);
            throw err;
        }
    },

    async deleteChild(childId) {
        const transaction = await db.sequelize.transaction();
        try {
            const child = await Child.findByPk(childId);
            if (!child) {
                throw new Error('Child not found');
            }

            // Soft delete by updating status
            await child.update({ status: '0' }, { transaction });
            await transaction.commit();
        } catch(err) {
            await transaction.rollback();
            console.error('ChildService/deleteChild:', err);
            throw err;
        }
    },

    async sendInviteEmail(guardianEmail, childId, locationId) {
        const transaction = await db.sequelize.transaction();
        try {
            const child = await Child.findByPk(childId);
            if (!child) {
                throw new Error('Child not found');
            }

            const childLocation = await ChildLocation.findOne({
                where: {
                    childId: childId,
                    locationId: locationId
                }
            });

            if (!childLocation) {
                throw new Error('Child does not belong to this location');
            }

            const guardian = await User.findOne({
                where: {
                    email: guardianEmail,
                    role: 'guardian'
                }
            });

            if (!guardian) {
                throw new Error('Guardian with this email not found');
            }

            await db.userChild.create({
                user_id: guardian.id,
                child_id: childId,
                location_id: locationId,
                relationship: 'parent'
            }, { transaction });

            await EmailService.sendInviteEmail(guardianEmail, child.engName);

            await transaction.commit();

            return {
                success: true,
                message: 'Invitation sent and relationship created successfully'
            };

        } catch (error) {
            await transaction.rollback();
            console.error('ChildService/sendInviteEmail:', error);

            let errorMessage = 'Failed to send invitation';
            if (error.message === 'Guardian with this email not found') {
                errorMessage = 'No registered guardian found with this email address';
            } else if (error.message === 'Child not found') {
                errorMessage = 'Selected child not found';
            } else if (error.message === 'Child does not belong to this location') {
                errorMessage = 'Child is not registered to this location';
            }

            throw {
                success: false,
                message: errorMessage
            };
        }
    }
};

module.exports = ChildService;