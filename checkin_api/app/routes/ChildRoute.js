const child = require('../controllers/ChildController');
const router = require('express').Router();
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');

module.exports = app => {
  //router.use(isAuthenticated);

  router.get('/', child.getAllChildren);

  router.get('/location/:locationId', child.getChildrenByLocation);

  router.post('/create', child.createChild);

  router.put('/:id', child.updateChild);

  router.delete('/:id', child.deleteChild);

  router.post('/invite-email', child.sendInviteEmail);

  router.get('/show-child-location', child.showChildrenAndLocationList);

  router.get('/list', child.showChildrenAndLocationList);

  router.post('/force-checkin', child.forceCheckin);

  router.put('/guardian-settings/:childId', child.updateGuardianSettings);

  app.use('/api/children', router);
};
