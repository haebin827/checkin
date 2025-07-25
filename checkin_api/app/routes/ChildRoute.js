const child = require('../controllers/ChildController');
const router = require('express').Router();
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');

module.exports = app => {
  //router.use(isAuthenticated);

  router.get('/location/:locationId', child.getChildrenByLocation);

  router.post('/create', checkRole('admin', 'manager'), child.createChild);

  router.put('/:id', checkRole('admin', 'manager'), child.updateChild);

  router.delete('/:id', checkRole('admin', 'manager'), child.deleteChild);

  router.post('/invite-email', checkRole('admin', 'manager'), child.sendInviteEmail);

  router.get('/list', child.showChildrenAndLocationList);

  router.post('/force-checkin', checkRole('admin', 'manager'), child.forceCheckin);

  router.put('/guardian-settings/:childId', checkRole('guardian'), child.updateGuardianSettings);

  app.use('/api/children', router);
};
