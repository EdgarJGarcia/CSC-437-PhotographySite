import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Photos from "./services/photo-svc";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

connect("photography");

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/api/photos", (req: Request, res: Response) => {
  Photos.index()
    .then((photos) => res.json(photos))
    .catch((err) => res.status(500).send(err));
});

app.get("/api/photos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  
  Photos.get(id)
    .then((photo) => res.json(photo))
    .catch((err) => res.status(404).send(err));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
