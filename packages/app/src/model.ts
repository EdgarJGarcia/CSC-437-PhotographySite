export interface Photo {
  _id?: string;
  src: string;
  alt: string;
  href: string;
}

export interface Model {
  photo?: Photo;
  gallery?: Photo[];
}

export const init: Model = {};
