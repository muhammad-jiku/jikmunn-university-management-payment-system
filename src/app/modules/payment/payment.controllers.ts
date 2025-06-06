import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/response";
import { PaymentServices } from "./payment.services";

const initPayment = async (req: Request, res: Response, next: NextFunction) => {
  const result = await PaymentServices.initPayment(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment init successfully",
    data: result,
  });
};

export const PaymentControllers = {
  initPayment,
};
