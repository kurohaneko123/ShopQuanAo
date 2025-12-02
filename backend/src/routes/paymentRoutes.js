import express from "express";

import { ZaloPayCreateOrder } from "../controllers/zalopay/OrderCreation.js";
import { ZaloPayCallback } from "../controllers/zalopay/Callback.js";
import { ZaloPayGetOrderStatus } from "../controllers/zalopay/getOrderStatus_Controller.js";
import { ZaloPayRefund } from "../controllers/zalopay/ZalopayRefund_Controller.js";
import { ZaloPayQueryRefund } from "../controllers/zalopay/ZalopayQueryRefund_Controller.js";


const router = express.Router();

router.post("/zalopay/create", ZaloPayCreateOrder);
router.post("/zalopay/callback", ZaloPayCallback);
router.get("/zalopay/status", ZaloPayGetOrderStatus);
router.post("/zalopay/refund", ZaloPayRefund);
router.get("/zalopay/refund-status", ZaloPayQueryRefund);

export default router;
