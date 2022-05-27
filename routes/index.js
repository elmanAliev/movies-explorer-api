const router = require('express').Router();

const signupRouter = require('./signup');
const signinRouter = require('./signin');
const usersRouter = require('./user');
const moviesRouter = require('./movie');
const authorize = require('../middlewares/auth');

router.use(signinRouter);
router.use(signupRouter);

router.use(authorize);

router.use(usersRouter);
router.use(moviesRouter);

module.exports = router;
