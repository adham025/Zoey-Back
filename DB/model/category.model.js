import { Schema, model, Types } from "mongoose";


const categorySchema = new Schema({

    name: {
        type: String,
    },
})


const categoryModel = model('Category', categorySchema)
export default categoryModel