import { Router } from "express";
import * as apiController from "./controller/api.controller.js";

const router = Router();

router.post("/add", apiController.addApi);
router.put("/:id", apiController.changePosition);
router.get("/allApis", apiController.getAllApis);
router.post("/reorder", apiController.reorderGames);
router.get("/games", apiController.getGames);
router.delete("/delete/:id", apiController.deleteApi);

export default router;
