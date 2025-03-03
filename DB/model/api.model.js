import { Schema, model, Types } from "mongoose";

const apiSchema = new Schema({
  api_name: { type: String, required: true },
  api_url: { type: String, required: true },
  api_image: { type: String },
  game_category: { type: String },
  position: { type: Number, required: true, default: 1 },
});

const apiModel = model("api", apiSchema);
export default apiModel;
