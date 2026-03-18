import express from "express";
import { userRoutes } from "./users/user.routes";
import dotenv from "dotenv";
import { sendContactMail } from "./controllers/contactController";
import projectRoutes from "./routes/project.routes";
import requestRoutes from "./routes/request.routes";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.post("/api/send-mail", sendContactMail);
app.use("/api", projectRoutes);
app.use("/api", requestRoutes);
app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});