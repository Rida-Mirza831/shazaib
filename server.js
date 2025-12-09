import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import brandRoutes from "./routes/brandRoutes.js";
import { swaggerDocs } from "./swagger/swagger.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

swaggerDocs(app);

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.use("/api/brands", brandRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

