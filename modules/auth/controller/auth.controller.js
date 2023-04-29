import userModel from '../../../DB/model/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../../services/email.js'
import { asyncHandler } from "../../../services/asyncHandler.js"
import { nanoid } from 'nanoid';
import { findById, findByIdAndUpdate, findOneAndUpdate, findOne } from "../../../DB/DBMethods.js"
// import expressAsyncHandler from 'express-async-handler'

export const signUp = asyncHandler(async (req, res, next) => {
    // try {
    const { userName, email, password } = req.body

    // const user = await userModel.findOne({ email }).select("email")
    const user = await findOne({ model: userModel, condition: { email }, select: "email" })
    if (user) {

        // res.status(409).json({ message: "This email already registered" })
        next(new Error("This email already registered", { cause: 409 }))
    } else {
        let hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND))
        let addUser = new userModel({ userName, email, password: hashedPassword })

        let token = jwt.sign({ id: addUser._id, isLoggedIn: true }, process.env.emailToken, { expiresIn: 60 * 60 * 24 })

        let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
        let message = `Click here to verify your email <a href="${link}">here</a>`
        let result = await sendEmail(email, 'confirm to register', message)
        if (result.accepted.length) {
            let savedUser = await addUser.save()
            // let savedUser = userModel.saveUser()
            res.status(201).json({ message: "Created successfully, please check your email for verification", savedUser })
        } else {
            // res.status(404).json({ message: "Invalid email" })
            next(new Error("Invalid email", { cause: 404 }))
        }

    }
    // } catch (error) {
    //     res.status(500).json({ message: "catch error", error: error.message, stack: error.stack })
    // }

})

export const confirmEmail = asyncHandler(async (req, res, next) => {
    // try {
    let { token } = req.params;
    let decoded = jwt.verify(token, process.env.emailToken);
    if (!decoded && !decoded.id) {
        res.status(400).json({ message: "invalid token data" })
        next(new Error("Invalid token data", { cause: 400 }))
    } else {
        // let updatedUser = await userModel.findOneAndUpdate({ _id: decoded.id, confirmEmail: false }, { confirmEmail: true }, { new: true })
        let updatedUser = await findOneAndUpdate({ model: userModel, condition: { _id: decoded.id, confirmEmail: false }, data: { confirmEmail: true }, options: { new: true } })
        if (updatedUser) {
            res.status(200).json({ message: "confirmed" })
        } else {
            // res.status(400).json({ message: "invalid token data" })
            next(new Error("Invalid token data", { cause: 400 }))
        }
    }
    // } catch (error) {
    //     res.status(500).json({ message: "catch error", error: error.message, stack: error.stack })
    // }

})

export const logIn = asyncHandler(async (req, res, next) => {
    // try {
    const { email, password } = req.body
    // const user = await userModel.findOne({ email });
    const user = await findOne({ model: userModel, condition: { email } })
    if (!user) {
        // res.status(404).json({ message: "You have to register first" })
        next(new Error("You have to register first", { cause: 404 }))
    } else {
        let matched = bcrypt.compareSync(password, user.password)
        if (matched) {
            if (!user.confirmEmail) {
                // res.status(400).json({ message: "You have to confirm ur email first" })
                next(new Error("You have to confirm ur email first", { cause: 400 }))

            } else {
                let token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature, { expiresIn: 60 * 60 * 24 * 2 })
                res.status(200).json({ message: "Welcome", token })
            }
        } else {
            // res.status(400).json({ message: "Password don't match" })
            next(new Error("Password is not correct", { cause: 400 }))
        }
    }
    // } catch (error) {
    //     res.status(500).json({ message: "catch error", error: error.message, stack: error.stack })
    // }

})

export const updateRole = asyncHandler(async (req, res, next) => {
    let { userId } = req.body;
    let user = await findById({ model: userModel, id: userId });
    if (!user) {
        next(new Error("invalid user", { cause: 404 }))
    } else {
        if (!user.confirmEmail) {
            next(new Error("please confirm ur email", { cause: 400 }))
        } else {
            let updated = await findByIdAndUpdate({ model: userModel, condition: { _id: user._id }, data: { role: 'Admin' }, options: { new: true } })
            res.status(200).json({ message: "updated", updated })
        }
    }
})

export const sendCode = asyncHandler(async (req, res, next) => {
    let { email } = req.body;
    let user = await findOne({ model: userModel, condition: { email }, select: "email" })
    if (!user) {
        next(new Error("Email not found", { cause: 400 }))
    } else {
        let OTPCode = nanoid();
        await findByIdAndUpdate({ model: userModel, condition: { _id: user._id }, data: { code: OTPCode } })
        let message = `Your OTPCODE is ${OTPCode}`;
        await sendEmail(user.email, message);
        res.json({ message: "Please check your email for a message with your code" })
    }
})

export const forgetPassword = asyncHandler(async (req, res, next) => {
    // try {
    let { code, email, password } = req.body;
    if (!code) {
        next(new Error(" code is not valid", { cause: 400 }))
    } else {
        let user = await findOne({ model: userModel, condition: { email, code } })
        if (!user) {
            next(new Error(" email or code is not valid", { cause: 400 }))
        } else {
            const hashPass = await bcrypt.hash(password, 5);
            let updated = await findByIdAndUpdate({ model: userModel, condition: { _id: user._id }, data: { code: null, password: hashPass }, options: { new: true } })
            res.json({ message: "password changed successfully", updated });
        }
    }
    // } catch (error) {
    //     res.json({ message: " error", error });
    // }
})