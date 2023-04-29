import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import { endPoints } from "./brand.endpoint.js"
import * as brandController from "./controller/brand.controller.js"
const router = Router()

router.post("/add", auth(endPoints.createBrand), myMulter(fileValidation.image).single("image"), HME, brandController.addBrand)
router.put("/update/:brandId", auth(endPoints.updateBrand), myMulter(fileValidation.image).single("image"), HME, brandController.updateBrand)



export default router