import { Schema, model, Types } from "mongoose";


const categorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'Category name is required'],
        min: [2, 'Category name minimum length 2 char'],
        max: [20, 'Category name max length 20 char']

    },
    image: {
        type: String,
        required: [true, 'Category image is required'],
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'Created by is required'],

    },
    publicImageId: {
        type: String
    },
}, {
    timestamps: true
})


const categoryModel = model('Category', categorySchema)
export default categoryModel