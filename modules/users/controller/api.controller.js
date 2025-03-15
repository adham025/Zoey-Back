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
  const count = await apiModel.countDocuments({ categoryId });
  const result = await apiModel.create({
    api_name,
    api_url,
    api_image,
    categoryId,
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

  res.status(200).json({ message: "API updated successfully", result: updatedApi });
});


export const getAllApis = asyncHandler(async (req, res) => {
  const apis = await apiModel.find().populate("categoryId", "name");
  res.status(200).json({ allApis: apis });
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

    // Fetch all APIs from the database and populate the categoryId field
    const allApis = await apiModel.find().populate("categoryId");
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

    // Reorder the categories based on the 'order' field
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

export const changePosition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { position } = req.body;

  if (!position || position < 1) {
    return res.status(400).json({ message: "Invalid position value" });
  }

  try {
    const game = await apiModel.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    game.position = position;
    await game.save();
    res.status(200).json({ message: "Position updated", game });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export const reorderGames = asyncHandler(async (req, res) => {
  const { categoryId, games } = req.body;
  const bulkOps = games.map((game) => ({
    updateOne: {
      filter: { _id: game.id, categoryId },
      update: { $set: { order: game.order } },
    },
  }));
  await apiModel.bulkWrite(bulkOps);
  res.status(200).json({ message: "Order updated successfully" });
});
