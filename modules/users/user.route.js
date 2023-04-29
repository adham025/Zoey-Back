import { Router } from "express";
import { changePassword, deleteUser, getAllUsers, search, profilePic } from "./controller/user.controller.js";
import { auth } from "../../middleware/auth.js"
import { updatePasswordSchema } from "./user.validate.js";
import { validation } from '../../middleware/validation.js'
import { myMulter, fileValidation, HME } from "../../services/multer.js"
import * as userController from "./controller/user.controller.js"
import { endPoints } from "./user.endpoint.js";


const router = Router();


router.patch("/changepassword", auth(), validation(updatePasswordSchema), userController.changePassword)
router.get("/profilePic", auth(), myMulter(fileValidation.image, "user/profilePic").single("image"), HME, userController.profilePic)
router.delete("/delete", auth(), userController.deleteUser)
router.get("/getUsers", userController.getAllUsers)
router.get("/search", userController.search)



export default router