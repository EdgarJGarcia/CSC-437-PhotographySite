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

function get(photoId: string): Promise<Photo> {
  return PhotoModel.findOne({ src: photoId })
    .then((photo) => {
      if (!photo) throw `${photoId} Not Found`;
      return photo;
    });
}

function create(json: Photo): Promise<Photo> {
  const p = new PhotoModel(json);
  return p.save();
}

function update(photoId: string, photo: Photo): Promise<Photo> {
  return PhotoModel.findOneAndUpdate({ src: photoId }, photo, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${photoId} not updated`;
    return updated as Photo;
  });
}

function remove(photoId: string): Promise<void> {
  return PhotoModel.findOneAndDelete({ src: photoId }).then((deleted) => {
    if (!deleted) throw `${photoId} not deleted`;
  });
}

export default { index, get, create, update, remove };
