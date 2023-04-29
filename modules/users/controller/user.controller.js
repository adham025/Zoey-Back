import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs'
import { findById, findByIdAndUpdate } from "../../../DB/DBMethods.js"
import { asyncHandler } from "../../../services/asyncHandler.js";

// import { nanoid } from 'nanoid'

export const changePassword = asyncHandler(async (req, res, next) => {
    // try {
    let { currentPassword, newPassword, cNewPassword } = req.body;
    if (newPassword == cNewPassword) {
        let user = await findById({ model: userModel, id: req.user._id });
        let matched = bcrypt.compareSync(currentPassword, user.password)
        if (matched) {
            const hashed = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND));
            let updatedUser = await findByIdAndUpdate({ model: userModel, condition: { _id: req.user._id }, data: { password: hashed }, options: { new: true } })
            res.json({ message: "updated", updatedUser })
        } else {
            next(new Error("current password invalid", { cause: 400 }))
        }
    } else {
        next(new Error("password doesn't match", { cause: 400 }))
    }
    // } catch (error) {
    //     res.status(500).json({ message: "catch error", error: error.message, stack: error.stack })
    // }
})


export const deleteUser = async (req, res) => {
    try {
        let { email } = req.body
        const deletedUser = await userModel.deleteOne({ email });
        res.json({ message: "deleted", deletedUser })
    } catch (error) {
        res.json({ message: "not deleted", error })
    }
}


export const getAllUsers = async (req, res) => {
    const allUsers = await userModel.find({ confirmEmail: true })
    res.json({ message: "All users", allUsers })
}

export const search = async (req, res) => {
    const email = req.body;
    const user = await userModel.findOne(email)
    res.json({ message: "Done", user })
}

export const profilePic = async (req, res) => {
    console.log(req.file);
    if (req.imageError) {
        res.json({ message: "Invalid file" })
    } else {

        if (!req.file) {
            res.json({ message: "Please upload image" })
        } else {
            await userModel.updateOne({ _id: req.user._id }, { profilePic: req.file.path })
            res.json({ message: "Done" })

        }
    }
}

