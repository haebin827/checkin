const location = require('../controllers/LocationController');
const router = require('express').Router();
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');

module.exports = app => {
  //router.use(isAuthenticated);

  router.get('/', location.getAllLocations);

  router.post('/create', location.createLocation);

  router.put('/:id', location.updateLocation);

  router.delete('/:id', location.deleteLocation);

  router.get('/create-qr', location.generateQr);

  router.post('/:uuid/verify', location.verifyQR);

  app.use('/api/location', router);
};
