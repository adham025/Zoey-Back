import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });
import express from "express";
import * as indexRouter from "./modules/index.route.js";
import connection from "./DB/connection.js";
import { globalError } from "./services/asyncHandler.js";

const app = express();
// setup port and the baseUrl
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

connection();
//Setup API Routing
app.use(`/api`, indexRouter.apiRouter);

app.use("*", (req, res, next) => {
  res.send("In-valid Routing Plz check url or method");
});

app.use(globalError);

app.listen(port, () => console.log(`App listening on port ${port}!`));






