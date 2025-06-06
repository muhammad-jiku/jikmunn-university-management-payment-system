import express from "express";
import { PaymentRoutes } from "../modules/payment/payment.routes";

const router = express.Router();

const moduleRoutes = [
  // ...routes
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.route);
});

export default router;
