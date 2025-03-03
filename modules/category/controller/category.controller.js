import { create, find } from "../../../DB/DBMethods.js";
import categoryModel from "../../../DB/model/category.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

export const addCategory = asyncHandler(async (req, res, next) => {
  let { name } = req.body;
  const result = await create({ model: categoryModel, data: { name } });
  res.status(201).json({ message: "Created", result });
});

export const categories = asyncHandler(async (req, res, next) => {
  let allCategories = await find({ model: categoryModel });
  res.status(200).json({ message: " Done", allCategories });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedApi = await categoryModel.findByIdAndDelete(id);

  if (!deletedApi) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json({ message: "Deleted", deletedApi });
});
