import { Router } from "express";
import * as categoryController from "./controller/category.controller.js";
const router = Router();

router.post("/add", categoryController.addCategory);
router.get("/all", categoryController.categories);
router.delete("/delete/:id", categoryController.deleteCategory);
router.put("/reorder", categoryController.reorderCategories);
router.put('/updateCategory/:id', categoryController.updateCategory);

export default router;

