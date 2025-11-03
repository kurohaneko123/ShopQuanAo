// src/data/mockData.js
import Aosomi from "../assets/aosomi.jpg";
import Aokhoac from "../assets/aokhoac.jpg";
import Aopolo from "../assets/aopolo.jpeg";
import Aothunbasic from "../assets/aothunbasic.jpg";
import Quanjean from "../assets/quanjean.jpg";
import Quanjooger from "../assets/quanjooger.jpg";

export const mockProducts = [
  {
    id: 1,
    name: "Áo Thun Basic Horizon",
    brand: "Horizon",
    description: "Áo thun cotton mềm mịn, thoáng khí, form oversize năng động.",
    material: "Cotton 100%",
    category: "Áo Thun",
    price: 249000,
    colors: ["black", "white", "red"],
    sizes: ["M", "L", "XL"],
    gender: "Nam",
    images: [Aothunbasic, Aosomi, Aopolo],
  },
  {
    id: 2,
    name: "Áo Sơ Mi Trơn Dáng Rộng",
    brand: "Horizon",
    description: "Áo sơ mi dáng rộng unisex, phối layer cực đẹp.",
    material: "Cotton linen",
    category: "Áo Sơ Mi",
    price: 299000,
    colors: ["white", "gray", "blue"],
    sizes: ["S", "M", "L"],
    gender: "Nam",
    images: [Aosomi, Aokhoac],
  },
  {
    id: 3,
    name: "Quần Jean Trơn Dáng Slim",
    brand: "Horizon",
    description: "Chất jean co giãn nhẹ, ôm vừa vặn, dễ phối đồ.",
    material: "Denim Cotton",
    category: "Quần Jean",
    price: 359000,
    colors: ["black", "blue"],
    sizes: ["M", "L", "XL"],
    gender: "Nam",
    images: [Quanjean, Quanjooger],
  },
];
