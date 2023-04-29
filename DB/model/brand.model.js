import { Schema, model, Types } from "mongoose";


const brandSchema = new Schema({

    name: {
        type: String,
        required: [true, 'brand name is required'],
        min: [2, 'brand name minimum length 2 char'],
        max: [20, 'brand name max length 20 char'],
        trim: true

    },
    slug: String,
    image: {
        type: String,
        required: [true, 'brand image is required'],
    },
    public_id: {
        type: String
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'Created by is required'],
    },

}, {
    timestamps: true
})


const brandModel = model('Brand', brandSchema)
export default brandModel