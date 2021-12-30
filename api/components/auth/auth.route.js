import express from 'express';
const router = express.Router();

import authController from './auth.controller.js';
import passport from '../../modules/passport/index.js';

router.post('/login', passport.authenticate('local', {session: false}), authController.login);

router.post('/google', authController.google);

router.post('/register', authController.register);

router.post('/sendPasswordChangeEmail', authController.sendPasswordChangeEmail);

router.get('/loginHelping/getUserChangePassword/:id', authController.getUserChangePassword);

router.post('/loginHelping/changePassword', authController.changePassword);

export default router;
