import express from 'express'
import { authenticatedUser } from '../middlewares/user.middleware.js';
import { addMenuItem, deleteMenuItem, editMenuItem, getFileUrl, getMenuItems, getMyRestaurants, getRestaurantById, registerRestaurant } from '../controllers/restaurant.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = express.Router();

router.get('/getMyRestaurants',authenticatedUser,getMyRestaurants);
router.post('/getFileUrl',upload.single('restaurantThumbnailFile'),getFileUrl);
router.post('/register',authenticatedUser,registerRestaurant);
router.get('/getRestaurantById/:id',getRestaurantById);
router.get('/getMenuItems/:id',getMenuItems);
router.post('/addMenuItem',authenticatedUser,addMenuItem);
router.delete('/deleteMenuItem/:id',authenticatedUser,deleteMenuItem);
router.put('/editMenuItem',authenticatedUser,editMenuItem);



export default router;
