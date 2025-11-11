import { Schema, model } from "mongoose";
import { Photo } from "../models/photo";

const PhotoSchema = new Schema<Photo>(
  {
    src: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true }
  },
  { collection: "photos" }
);

const PhotoModel = model<Photo>("Photo", PhotoSchema);

function index(): Promise<Photo[]> {
  return PhotoModel.find();
}

function get(id: string): Promise<Photo> {
  return PhotoModel.findById(id)
    .then((photo) => {
      if (!photo) throw `${id} Not Found`;
      return photo;
    });
}

export default { index, get };
