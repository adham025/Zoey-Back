import { Router } from "express";
import { auth, roles } from "../../middleware/auth.js";
import { fileValidation, HME, myMulter } from "../../services/multer.js";
import { endPoints } from "./category.endpoint.js";
import * as categoryController from "./controller/category.controller.js"
const router = Router()


router.post("/add", auth(endPoints.addCategory), myMulter(fileValidation.image).single("image"), HME, categoryController.addCategory)
router.get("/allCategories", categoryController.categories)
router.get("/:name", categoryController.getCategoryById)
router.put("/update/:id", auth(endPoints.updateCategory), myMulter(fileValidation.image).single("image"), HME, categoryController.updateCategory)

export default router