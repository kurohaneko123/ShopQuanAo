// backend/src/routes/ghnRoutes.js
import express from "express";
import {
  getProvinces,
  getDistricts,
  getWards,
  calcFee,
} from "../controllers/ghnController.js";

const router = express.Router();

router.get("/provinces", getProvinces);
router.get("/districts", getDistricts);
router.get("/wards", getWards);
router.post("/fee", calcFee);

export default router;
