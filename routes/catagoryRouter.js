import express from 'express'
const CatagoryRouter=express.Router()
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { createCatagoryControoler,

        updateCatagoryController,
        getAllcategoryControlller,
        singleCategoryController,
        deleteCategoryCOntroller} from '../controllers/catagoryController.js'


CatagoryRouter.post('/create', requireSignIn,isAdmin,createCatagoryControoler);
CatagoryRouter.get('/get-single/:slug',singleCategoryController)
CatagoryRouter.get('/get-all',getAllcategoryControlller)
CatagoryRouter.put('/update/:id', requireSignIn,isAdmin ,updateCatagoryController)
CatagoryRouter.delete('/delete/:id', requireSignIn,isAdmin, deleteCategoryCOntroller)
export default CatagoryRouter;
