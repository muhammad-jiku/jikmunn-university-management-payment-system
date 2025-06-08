import express from "express";
import { USER_ROLES } from "../../../enums";
import auth from "../../middlewares/auth";
import { PaymentControllers } from "./payment.controllers";

const router = express.Router();

router
  .route("/")
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    PaymentControllers.getAllFromDB,
  );

router
  .route("/:id")
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    PaymentControllers.getByIdFromDB,
  );

router.route("/init").post(PaymentControllers.initPayment);

router.route("/webhook").post(PaymentControllers.webhook);

export const PaymentRoutes = router;
