import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/response";
import { paymentFilterableFields } from "./payment.constants";
import { PaymentServices } from "./payment.services";

const initPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PaymentServices.initPayment(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment init successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const webhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PaymentServices.webhook(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment verified!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filters = pick(req.query, paymentFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await PaymentServices.getAllFromDB(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payments fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getByIdFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await PaymentServices.getByIdFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const PaymentControllers = {
  initPayment,
  webhook,
  getAllFromDB,
  getByIdFromDB,
};
