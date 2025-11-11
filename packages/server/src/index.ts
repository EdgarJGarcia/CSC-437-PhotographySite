import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import photosRouter from "./routes/photos";
import auth, { authenticateUser } from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("photography");

app.use(express.static(staticDir));
app.use(express.json());

app.use("/auth", auth);

app.use("/api/photos", authenticateUser, photosRouter);

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

