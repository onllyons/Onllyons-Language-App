// images
declare module "*.svg" {
  import type React from "react";
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
declare module "*.png" {
  import { ImageSource } from "expo-image";
  const content: ImageSource;
  export default content;
}
declare module "*.jpeg" {
  import { ImageSource } from "expo-image";
  const content: ImageSource;
  export default content;
}
declare module "*.jpg" {
  import { ImageSource } from "expo-image";
  const content: ImageSource;
  export default content;
}
declare module "*.webp";
declare module "*.css";

// video
declare module "*.gif";
declare module "*.mp4";
