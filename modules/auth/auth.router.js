import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoints } from "./auth.endPoint.js";
import { signUpValidation, updateRole } from "./auth.validation.js";
import * as registerControl from './controller/auth.controller.js'
import { HME, fileValidation, myMulter } from "../../services/multer.js";
const router = Router()


router.get("/", (req, res) => {
    res.status(200).json({ message: "Auth Module" })
})

router.post("/signup", validation(signUpValidation), myMulter(fileValidation.image).single("image"), HME, registerControl.signUp)
router.get("/confirmEmail/:token", registerControl.confirmEmail)
router.post("/login", registerControl.logIn)
router.put("/updateRole", validation(updateRole), auth(endPoints.updateRole), registerControl.updateRole)
router.post("/getCode", registerControl.sendCode)
router.post("/forgetPassword", registerControl.forgetPassword)


export default router