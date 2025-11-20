import { validationResult } from 'express-validator';
import { badRequest } from '../utils/http.js';

export default function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return badRequest(res, errors.array());
    return next();
}
