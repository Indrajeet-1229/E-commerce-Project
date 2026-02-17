import express from "express";

import { addToCart, getUseCart, updateCart } from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter=express.Router()
cartRouter.post('/get', authUser, getUseCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, updateCart)
export default cartRouter