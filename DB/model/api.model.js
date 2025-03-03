import { Schema, model, Types } from "mongoose";

const apiSchema = new Schema({
  api_name: { type: String, required: true },
  api_url: { type: String, required: true },
  api_image: { type: String },
  categoryId: {
    type: Types.ObjectId,
    ref: "Category",
    required: [true, "CategoryId is required"],
  },
});

const apiModel = model("api", apiSchema);
export default apiModel;
