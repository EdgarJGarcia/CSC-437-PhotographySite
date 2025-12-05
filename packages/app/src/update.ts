import { Auth } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Photo } from "./model";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | [Model, ...Promise<Msg>[]] {
  switch (message[0]) {
    case "photo/request": {
      return [
        model,
        requestPhoto(message[1], user).then((photo) => [
          "photo/load",
          { photoId: message[1].photoId, photo }
        ])
      ];
    }
    case "photo/load": {
      const { photo } = message[1];
      return { ...model, photo };
    }
    case "gallery/request": {
      return [
        model,
        requestGallery(user).then((photos) => [
          "gallery/load",
          { photos }
        ])
      ];
    }
    case "gallery/load": {
      const { photos } = message[1];
      console.log("Setting gallery in model:", photos);
      return { ...model, gallery: photos };
    }
    default: {
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  }
}

function requestPhoto(
  payload: { photoId: string },
  user: Auth.User
): Promise<Photo> {
  return fetch(`/api/photos/${payload.photoId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("Failed to load photo");
    })
    .then((json: unknown) => json as Photo);
}

function requestGallery(
  user: Auth.User
): Promise<Photo[]> {
  return fetch(`/api/photos`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("Failed to load gallery");
    })
    .then((json: unknown) => json as Photo[]);
}
