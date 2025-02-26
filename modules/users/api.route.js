import { Router } from "express";
import * as apiController from "./controller/api.controller.js";

const router = Router();

router.post("/add", apiController.addApi);
router.get("/allApis", apiController.getApis);
router.get("/games", apiController.getGames);
router.delete("/delete/:id", apiController.deleteApi);

export default router;
