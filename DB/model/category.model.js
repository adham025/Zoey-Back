import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
});

const categoryModel = model("Category", categorySchema);
export default categoryModel;
