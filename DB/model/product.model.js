import { Schema, model, Types } from "mongoose";


const productSchema = new Schema({

    name: {
        type: String,
        required: [true, 'product name is required'],
        min: [2, 'product name minimum length 2 char'],
        max: [20, 'product name max length 2 char']

    },
    slug: String,
    description: {
        type: String,
        required: [true, 'description is required'],
        min: [2, 'description minimum length 2 char'],
        max: [200, 'description max length 2 char']
    },
    images: {
        type: [String],
        required: [true, 'product images are required'],
    },
    publicImageIds: [String],
    stock: {
        type: Number,
        default: 0,
        required: [true, 'stock images are required']
    },
    endStock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
    },
    discount: {
        type: Number
    },
    finalPrice: {
        type: Number
    },
    colors: {
        type: [String],
    },
    size: {
        type: String,
        default: "free",
        enums: ["sm", "med", "lg", "xl", "free"]
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "Category",
        required: [true, 'CategoryId is required']
    },
    subCategoryId: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: [true, 'subCategoryId is required']
    },
    brandId: {
        type: Types.ObjectId,
        ref: "Brand",
        required: [true, 'brandId is required']
    },

    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'Created by is required']
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    soldItems: Number,
    totalItems: Number,
}, {
    timestamps: true
})


const productModel = model('Product', productSchema)
export default productModel