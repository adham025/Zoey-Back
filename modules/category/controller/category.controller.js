import { create, find } from "../../../DB/DBMethods.js";
import categoryModel from "../../../DB/model/category.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

export const addCategory = asyncHandler(async (req, res, next) => {
  let { name } = req.body;

  const lastCategory = await categoryModel.findOne().sort({ order: -1 });
  const newOrder = lastCategory ? Number(lastCategory.order) + 1 : 1;

  const result = await create({
    model: categoryModel,
    data: { name, order: newOrder },
  });
  res.status(201).json({ message: "Created", result });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const updatedCategory = await categoryModel.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  if (!updatedCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.status(200).json({ message: "Updated", result: updatedCategory });
});

export const categories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    categories.sort((a, b) => Number(a.order) - Number(b.order));
    res.status(200).json({ allCategories: categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedApi = await categoryModel.findByIdAndDelete(id);

  if (!deletedApi) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json({ message: "Deleted", deletedApi });
});
export const reorderCategories = async (req, res) => {
  const { updatedCategories } = req.body;

  try {
    const updatePromises = updatedCategories.map((category) =>
      categoryModel.findByIdAndUpdate(category._id, { order: category.order })
    );

    await Promise.all(updatePromises);
    res.status(200).json({ message: "Categories reordered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder categories." });
  }
};
