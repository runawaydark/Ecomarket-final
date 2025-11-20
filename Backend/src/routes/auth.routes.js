// src/routes/auth.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import * as ctrl from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';


const r = Router();
r.post('/register',
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({min:6}),
    validate, ctrl.register);

r.post('/login',
    body('email').isEmail(),
    body('password').notEmpty(),
    validate, ctrl.login);

r.get('/me', auth, ctrl.me);

export default r;
