import express from "express";
import { userRoutes } from "./users/user.routes";
import dotenv from "dotenv";
import { sendContactMail } from "./controllers/contactController";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.post("/api/send-mail", sendContactMail);

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});