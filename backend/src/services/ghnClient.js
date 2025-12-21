// backend/src/services/ghnClient.js
import axios from "axios";

const GHN_API = process.env.GHN_API;
const TOKEN = process.env.GHN_TOKEN;
const SHOP_ID = process.env.GHN_SHOP_ID;

if (!GHN_API || !TOKEN || !SHOP_ID) {
  console.warn("Thiếu GHN_API / GHN_TOKEN / GHN_SHOP_ID trong .env");
}

const ghnClient = axios.create({
  baseURL: GHN_API,
  headers: {
    "Content-Type": "application/json",
    Token: TOKEN,
    ShopId: SHOP_ID,
  },
  timeout: 15000,
});

export default ghnClient;
