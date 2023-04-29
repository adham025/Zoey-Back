import { asyncHandler } from "../../../services/asyncHandler.js";
import slugify from "slugify"
import { create, findByIdAndUpdate, findById } from "../../../DB/DBMethods.js"
import cloudinary from "../../../services/cloudinary.js";
import brandModel from "../../../DB/model/brand.model.js";


export const addBrand = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        next(new Error("You have to add image", { cause: 422 }))
    } else {
        let { name } = req.body;
        let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "brands"
        })
        req.body.image = secure_url
        req.body.public_id = public_id
        req.body.slug = slugify(req.body.name)
        req.body.createdBy = req.user._id;

        const result = await create({ model: brandModel, data: req.body })
        res.status(202).json({ message: "Created", result })
    }
})

export const updateBrand = asyncHandler(async (req, res, next) => {
    let { brandId } = req.params
    if (req.file) {
        let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "brands"
        })
        req.body.image = secure_url
        req.body.public_id = public_id
    }
    if (req.body.name) {
        req.body.slug = slugify(req.body.name)
    }
    let results = await findByIdAndUpdate({ model: brandModel, condition: { _id: brandId }, data: req.body, options: { new: true } })
    if (!results) {
        await cloudinary.uploader.destroy(req.body.public_id)
        next(new Error("Brand not found", { cause: 404 }))
    } else {
        res.status(200).json({ message: "updated", results })
    }
})


