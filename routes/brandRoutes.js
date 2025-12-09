import express from "express";
import { 
  getAllBrands, 
  getBrandById, 
  getBrandWheels, 
  getWheelById, 
  
} from "../controllers/brandController.js";
const router = express.Router();
router.get("/", getAllBrands);             
router.get("/:id", getBrandById);           
router.get("/:id/wheels", getBrandWheels); 
router.get("/wheel/:wheelId", getWheelById);
               

export default router;
