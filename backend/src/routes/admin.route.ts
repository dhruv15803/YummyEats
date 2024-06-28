import express from 'express'
import { addCity, addCuisine, deleteCity, deleteCuisine, editCity, editCuisine, getCities, getCuisines } from '../controllers/admin.controller.js';
import { authenticatedUser } from '../middlewares/user.middleware.js';

const router = express.Router();

router.get('/getCuisines',getCuisines);
router.post('/addCuisine',authenticatedUser,addCuisine);
router.delete('/deleteCuisine/:id',authenticatedUser,deleteCuisine);
router.put('/editCuisine',authenticatedUser,editCuisine);
router.post('/addCity',authenticatedUser,addCity);
router.get('/getCities',getCities);
router.delete('/deleteCity/:id',authenticatedUser,deleteCity);
router.put('/editCity',authenticatedUser,editCity);

export default router;
