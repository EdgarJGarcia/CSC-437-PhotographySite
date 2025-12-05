import { Photo } from "./model";

export type Msg =
  | ["photo/request", { photoId: string }]
  | ["gallery/request", {}]
  | ["photo/load", { photoId: string; photo: Photo }]
  | ["gallery/load", { photos: Photo[] }];
