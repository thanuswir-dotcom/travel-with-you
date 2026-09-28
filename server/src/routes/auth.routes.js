import { Router } from 'express';
import { 
  login, 
  signup, 
  sendOtp, 
  verifyOtp, 
  googleLogin, 
  getMe, 
  updateProfile 
} from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/google', googleLogin);
router.get('/me', getMe);
router.put('/profile', updateProfile);

export default router;
