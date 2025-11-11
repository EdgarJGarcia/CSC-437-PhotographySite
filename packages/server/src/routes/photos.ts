import express, { Request, Response } from "express";
import { Photo } from "../models/photo";
import Photos from "../services/photo-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Photos.index()
    .then((list) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:photoId", (req: Request, res: Response) => {
  const { photoId } = req.params;

  Photos.get(photoId)
    .then((photo) => res.json(photo))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newPhoto = req.body;

  Photos.create(newPhoto)
    .then((photo) => res.status(201).json(photo))
    .catch((err) => res.status(500).send(err));
});

router.put("/:photoId", (req: Request, res: Response) => {
  const { photoId } = req.params;
  const newPhotoData = req.body;

  Photos.update(photoId, newPhotoData)
    .then((photo) => res.json(photo))
    .catch((err) => res.status(404).end());
});

router.delete("/:photoId", (req: Request, res: Response) => {
  const { photoId } = req.params;

  Photos.remove(photoId)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
