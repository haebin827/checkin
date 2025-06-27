const child = require("../controllers/ChildController");
const router = require("express").Router();
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');

module.exports = (app) => {
    //router.use(isAuthenticated);

    router.get('/', child.getAllChildren);

    router.get('/location/:locationId', child.getChildrenByLocation);

    router.post('/create', child.createChild);

    router.put('/:id', child.updateChild);

    router.delete('/:id', child.deleteChild);

    router.post('/invite-email', child.sendInviteEmail);

    app.use('/api/children', router);
};