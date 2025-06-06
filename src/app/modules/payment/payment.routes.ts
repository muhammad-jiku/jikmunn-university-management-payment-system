import express from "express";
import { PaymentControllers } from "./payment.controllers";

const router = express.Router();

router.route("/init").post(PaymentControllers.initPayment);

export const PaymentRoutes = router;
