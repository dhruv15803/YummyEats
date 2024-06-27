import express from 'express'
import { getLoggedInUser, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';
import { authenticatedUser } from '../middlewares/user.middleware.js';
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/getLoggedInUser',authenticatedUser,getLoggedInUser);
router.get('/logout',authenticatedUser,logoutUser);


export default router;
