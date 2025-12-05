import { connect } from "./services/mongo.js";
import Photos from "./services/photo-svc.js";

connect("photography");

const samplePhotos = [
  // Row 1
  {
    src: "/images/DSC_0213-2.jpg",
    alt: "Golden hour portrait",
    href: "/app/photo/1"
  },
  {
    src: "/images/DSC_0237.jpg",
    alt: "Sunset portrait",
    href: "/app/photo/2"
  },
  {
    src: "/images/DSC_0851.jpg",
    alt: "Beach portrait",
    href: "/app/photo/3"
  },
  {
    src: "/images/DSC_0164.jpg",
    alt: "Downtown portrait",
    href: "/app/photo/4"
  },
  // Row 2
  {
    src: "/images/DSC_0008 copy.jpg",
    alt: "Portrait photo",
    href: "/app/photo/5"
  },
  {
    src: "/images/DSC_8536.jpg",
    alt: "Portrait photo",
    href: "/app/photo/6"
  },
  {
    src: "/images/DSC_8435.jpg",
    alt: "Portrait photo",
    href: "/app/photo/7"
  },
  {
    src: "/images/DSC_0153.jpg",
    alt: "Portrait photo",
    href: "/app/photo/8"
  },
  // Row 3
  {
    src: "/images/DSC_0818.jpg",
    alt: "Portrait photo",
    href: "/app/photo/9"
  },
  {
    src: "/images/DSC_0726.jpg",
    alt: "Portrait photo",
    href: "/app/photo/10"
  },
  {
    src: "/images/DSC_0880.jpg",
    alt: "Portrait photo",
    href: "/app/photo/11"
  },
  {
    src: "/images/DSC_0114.jpg",
    alt: "Portrait photo",
    href: "/app/photo/12"
  }
];

async function seedPhotos() {
  console.log("Clearing old photos from database...");
  
  try {
    const photos = await Photos.index();
    await Promise.all(photos.map(photo => Photos.remove(photo.src)));
    console.log(`Cleared ${photos.length} old photos`);
  } catch (err) {
    console.log("No photos to clear");
  }
  
  console.log("Seeding new photos...");
  
  for (const photo of samplePhotos) {
    try {
      await Photos.create(photo);
      console.log(`Created photo: ${photo.alt} - ${photo.src}`);
    } catch (err) {
      console.error(`Error creating photo ${photo.alt}:`, err);
    }
  }
  
  console.log("Done seeding photos!");
  process.exit(0);
}

seedPhotos();
