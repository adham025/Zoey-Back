import { Router } from "express";
import * as apiController from "./controller/api.controller.js";

const router = Router();

router.post("/add", apiController.addApi);
router.patch("/reorder", apiController.reorderApis);
router.put("/updateApi/:id", apiController.updateApi);
router.get("/allApis", apiController.getAllApis);
router.get("/games", apiController.getGames);
router.delete("/delete/:id", apiController.deleteApi);

export default router;
