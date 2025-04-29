import express from 'express';
import * as userController from '../controllers/userController';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { registerSchema, otpSchema, createProfileSchema, loginSchema } from '../utils/validation';

const router = express.Router();

router.post('/register', validate(registerSchema), userController.createUser);
router.post('/verify-otp', validate(otpSchema), userController.verifyOTP);
router.post('/create-profile', upload.single('document'), userController.createProfile);
router.post('/login', validate(loginSchema), userController.loginUser);

export default router;
