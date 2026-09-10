import type { CreatePaymentMethodDTO, PaymentMethodDTO } from "../Models/dto";
import { apiRequest, jsonBody } from "./apiRequest";

export async function createPaymentMethod(
    paymentMethod: CreatePaymentMethodDTO,
): Promise<PaymentMethodDTO> {
    return apiRequest<PaymentMethodDTO>("/payment-methods/create/", {
        method: "POST",
        ...jsonBody(paymentMethod),
    });
}