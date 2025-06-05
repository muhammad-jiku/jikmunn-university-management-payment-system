import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { IGenericErrorResponse } from "../interfaces/common";

export default function handlePrismaValidationError(
  // error: Prisma.PrismaClientValidationError
  error: PrismaClientValidationError,
): IGenericErrorResponse {
  const statusCode = 400;
  const message = "ValidationError";
  const errorMessages = [
    {
      path: "",
      message: error.message,
    },
  ];

  return {
    statusCode,
    message,
    errorMessages,
  };
}
