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

export const getAllApis = asyncHandler(async (req, res) => {
  const apis = await apiModel.find().populate("categoryId", "name"); // Populate the category name
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
    // Step 1: Fetch all APIs from the database and populate the categoryId field
    const allApis = await apiModel.find().populate("categoryId");
    if (!allApis.length) {
      return res.status(200).json({
        message: "No APIs found in the database",
        games: [],
        totalGames: 0,
      });
    }

    // Step 2: Fetch games from each API in parallel
    const gameRequests = allApis.map(async (api) => {
      try {
        // Step 2a: Handle single HTML game URLs
        if (!api.api_url.includes("gamepix.com")) {
          return [
            {
              id: api._id,
              title: api.api_name,
              url: api.api_url,
              thumbnailUrl: api.api_image || "/default-thumbnail.jpg",
              description: "Direct HTML game",
              // Use categoryId.name if it exists, otherwise default to "Mix"
              categories: api.categoryId?.name
                ? [api.categoryId.name]
                : ["Mix"],
              metadata: {},
            },
          ];
        }

        // Step 2b: Fetch data from the external API (for APIs like GamePix)
        const response = await axios.get(api.api_url);

        // Step 2c: Check if the response contains valid data
        if (!response.data?.data) {
          throw new Error(
            `Invalid response structure from API: ${api.api_name}`
          );
        }

        // Step 2d: Normalize the game data
        const normalizedGames = response.data.data.map((game) => ({
          id: game.id,
          title: game.title,
          url: game.url,
          thumbnailUrl: game.thumbnailUrl,
          description: game.description,
          // Use the game's categories if they exist, otherwise default to "Uncategorized"
          categories: game.categories || ["Uncategorized"],
          metadata: {
            orientation: game.orientation,
            featured: game.featured,
            score: game.rkScore,
          },
        }));

        return normalizedGames;
      } catch (error) {
        console.error(
          `Error fetching games from ${api.api_name}:`,
          error.message
        );

        // Step 2e: Return a fallback game entry for failed APIs
        return [
          {
            id: api._id,
            title: api.api_name,
            url: api.api_url,
            thumbnailUrl: api.api_image || "/default-thumbnail.jpg",
            description: "Fallback game entry",
            // Use categoryId.name if it exists, otherwise default to "Mix"
            categories: api.categoryId?.name ? [api.categoryId.name] : ["Mix"],
            metadata: {},
          },
        ];
      }
    });

    // Step 3: Wait for all requests to complete
    const gameResponses = await Promise.allSettled(gameRequests);

    // Step 4: Combine results from all APIs
    const allGames = gameResponses.flatMap((response) =>
      response.status === "fulfilled" ? response.value : []
    );

    // Step 5: Send the combined games to the frontend
    res.status(200).json({
      message: "Games fetched successfully",
      games: allGames,
      totalGames: allGames.length,
    });
  } catch (error) {
    console.error("Global error fetching games:", error.message);
    res.status(500).json({
      message: "Failed to fetch games",
      error: error.message,
      games: [],
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
