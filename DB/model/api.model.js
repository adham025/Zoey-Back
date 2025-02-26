import { Schema, model, Types } from "mongoose";

const apiSchema = new Schema({
  api_name: { type: String, required: true },
  api_url: { type: String, required: true },
  api_image: { type: String}
});

const apiModel = model("api", apiSchema);
export default apiModel;
