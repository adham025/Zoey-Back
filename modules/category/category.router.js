import { Router } from "express";
import * as categoryController from "./controller/category.controller.js";
const router = Router();

router.post("/add", categoryController.addCategory);
router.get("/all", categoryController.categories);
router.delete("/delete/:id", categoryController.deleteCategory);

export default router;
