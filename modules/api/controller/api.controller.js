import apiModel from "../../../DB/model/api.model.js";
import categoryModel from "../../../DB/model/category.model.js";
import axios from "axios";
import { asyncHandler } from "../../../services/asyncHandler.js";
import { Types } from "mongoose";

export const addApi = asyncHandler(async (req, res) => {
  const { api_name, api_url, api_image, categoryId } = req.body;

  if (!Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Invalid categoryId" });
  }

  const categoryExists = await categoryModel.findById(categoryId);
  if (!categoryExists) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Find the highest order in the category and increment it by 1
  const lastApi = await apiModel.findOne({ categoryId }).sort({ order: -1 });
  const newOrder = lastApi ? Number(lastApi.order) + 1 : 1;

  const result = await apiModel.create({
    api_name,
    api_url,
    api_image,
    categoryId,
    order: newOrder,
  });

  res.status(201).json({ message: "Created", result });
});

export const updateApi = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { api_name, api_url, api_image, categoryId } = req.body;

  // Check if the provided ID is a valid ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid API ID" });
  }

  // Find the existing API
  const api = await apiModel.findById(id);
  if (!api) {
    return res.status(404).json({ message: "API not found" });
  }

  // Validate categoryId if it's provided
  if (categoryId) {
    if (!Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    const categoryExists = await categoryModel.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
  }

  api.api_name = api_name || api.api_name;
  api.api_url = api_url || api.api_url;
  api.api_image = api_image || api.api_image;
  api.categoryId = categoryId || api.categoryId;

  const updatedApi = await api.save();

  res
    .status(200)
    .json({ message: "API updated successfully", result: updatedApi });
});

export const getAllApis = asyncHandler(async (req, res) => {
  try {
    const apis = await apiModel.find().populate("categoryId", "name");
    apis.sort((a, b) => Number(a.order) - Number(b.order));
    res.status(200).json({ allApis: apis });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch apis." });
  }
});

export const deleteApi = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedApi = await apiModel.findByIdAndDelete(id);

  if (!deletedApi) {
    return res.status(404).json({ message: "API not found" });
  }
  res.status(200).json({ message: "Deleted", deletedApi });
});

export const getGames = asyncHandler(async (req, res) => {
  try {
    // Fetch all categories sorted by 'order'
    const allCategories = await categoryModel.find().sort({ order: 1 });

    // Fetch all APIs from the database, sorted by their 'order' field, and populate the categoryId field
    const allApis = await apiModel
      .find()
      .sort({ order: 1 })
      .populate("categoryId");

    if (!allApis.length) {
      return res.status(200).json({
        message: "No APIs found in the database",
        games: {},
        totalGames: 0,
      });
    }

    // Object to store games categorized by category name
    const categorizedGames = {};

    for (const api of allApis) {
      try {
        let gamesData = [];

        // 🔍 Case 1: Single HTML Game URLs (Direct Links)
        if (
          !api.api_url.includes("gamepix.com") &&
          !api.api_url.endsWith(".json")
        ) {
          gamesData = [
            {
              id: api._id.toString(),
              title: api.api_name,
              url: api.api_url,
              thumbnailUrl: api.api_image || "/default-thumbnail.jpg",
              description: "Direct HTML game",
              categories: [api.categoryId?.name || "Mix"],
              metadata: {},
              order: api.order,
            },
          ];
        }

        // 🔍 Case 2: JSON Games (GamePix or other APIs)
        else {
          const response = await axios.get(api.api_url);
          const rawData = response.data?.data || response.data;

          gamesData = (Array.isArray(rawData) ? rawData : [rawData]).map(
            (game) => ({
              id: game.id || api._id.toString(),
              title: game.title || api.api_name,
              url: game.url || api.api_url,
              thumbnailUrl:
                game.thumbnailUrl || api.api_image || "/default-thumbnail.jpg",
              description: game.description || "Game",
              categories: game.categories || [
                api.categoryId?.name || "Uncategorized",
              ],
              metadata: {
                orientation: game.orientation || "N/A",
                featured: game.featured || false,
                score: game.rkScore || 0,
              },
              order: api.order,
            })
          );
        }

        // ✅ Categorize games by their categories
        gamesData.forEach((game) => {
          (game.categories || ["Uncategorized"]).forEach((category) => {
            if (!categorizedGames[category]) categorizedGames[category] = [];
            categorizedGames[category].push(game);
          });
        });
      } catch (error) {
        console.error(
          `❌ Error fetching games from ${api.api_name}:`,
          error.message
        );
      }
    }

    // 🔄 Sort games within each category by their 'order' field
    for (const category in categorizedGames) {
      categorizedGames[category].sort((a, b) => a.order - b.order);
    }

    // 🔥 Create an ordered object to match category order from the database
    const orderedGames = {};
    allCategories.forEach((category) => {
      if (categorizedGames[category.name]) {
        orderedGames[category.name] = categorizedGames[category.name];
      }
    });

    // 🔥 Send the ordered games to the frontend
    res.status(200).json({
      message: "Games fetched successfully",
      games: orderedGames,
      totalGames: Object.values(orderedGames).flat().length,
    });
  } catch (error) {
    console.error("❌ Global error fetching games:", error.message);
    res.status(500).json({
      message: "Failed to fetch games",
      error: error.message,
      games: {},
      totalGames: 0,
    });
  }
});

export const reorderApis = async (req, res) => {
  const { updatedApis } = req.body;

  try {
    const updatePromises = updatedApis.map((api) =>
      apiModel.findByIdAndUpdate(api._id, { order: api.order })
    );

    await Promise.all(updatePromises);
    res.status(200).json({ message: "APIs reordered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder APIs." });
  }
};
