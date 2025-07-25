const location = require('../controllers/LocationController');
const router = require('express').Router();
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');

module.exports = app => {
  //router.use(isAuthenticated);

  router.get('/', location.getAllLocations);

  router.post('/create', checkRole('admin'), location.createLocation);

  router.put('/:id', checkRole('admin'), location.updateLocation);

  router.delete('/:id', checkRole('admin'), location.deleteLocation);

  router.get('/create-qr', location.generateQr);

  router.post('/:uuid/verify', location.verifyQR);

  router.post('/manager-invite', location.sendManagerInviteEmail);

  router.get('/retrieve-manager-email', location.retrieveManagerEmail);

  app.use('/api/location', router);
};
