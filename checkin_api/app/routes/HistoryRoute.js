const history = require('../controllers/HistoryController');
const router = require('express').Router();
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');

module.exports = app => {
  //router.use(isAuthenticated);

  router.get('/list', history.showHistoriesAndLocationList);

  app.use('/api/history', router);
};
