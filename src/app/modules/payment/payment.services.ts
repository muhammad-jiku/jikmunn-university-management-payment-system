import prisma from "../../../shared/prisma";
import { SSLServices } from "../ssl/ssl.services";

const initPayment = async (data: any) => {
  const paymentSession = await SSLServices.initPayment({
    total_amount: data.amount,
    tran_id: data.transactionId,
    cus_name: data.studentName,
    cus_email: data.studentEmail,
    cus_add1: data.address,
    cus_phone: data.phone,
  });

  await prisma.payment.create({
    data: {
      amount: data.amount,
      transactionId: data.transactionId,
      studentId: data.studentId,
    },
  });
  console.log(paymentSession);

  //   return paymentSession.redirectGatewayURL;
  return paymentSession;
};

export const PaymentServices = {
  initPayment,
};
