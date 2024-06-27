import express from 'express'
import { addCuisine, deleteCuisine, editCuisine, getCuisines } from '../controllers/admin.controller.js';
import { authenticatedUser } from '../middlewares/user.middleware.js';

const router = express.Router();

router.get('/getCuisines',getCuisines);
router.post('/addCuisine',authenticatedUser,addCuisine);
router.delete('/deleteCuisine/:id',authenticatedUser,deleteCuisine);
router.put('/editCuisine',authenticatedUser,editCuisine);

export default router;
