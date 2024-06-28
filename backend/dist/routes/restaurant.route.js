import express from 'express';
import { authenticatedUser } from '../middlewares/user.middleware.js';
import { getFileUrl, getMyRestaurants } from '../controllers/restaurant.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = express.Router();
router.get('/getMyRestaurants', authenticatedUser, getMyRestaurants);
router.post('/getFileUrl', upload.single('restaurantThumbnailFile'), getFileUrl);
export default router;
