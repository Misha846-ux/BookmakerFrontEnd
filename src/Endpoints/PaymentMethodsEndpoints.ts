import type { CreatePaymentMethodDTO, DebitCardDTO, PaginatedPaymentMethodsResponse, PaginationDTO, PaymentMethodDTO } from "../Models/dto";
import { apiRequest, jsonBody, paginationQuery } from "./apiRequest";

export async function getPaymentMethods(
    pagination: PaginationDTO,
): Promise<PaginatedPaymentMethodsResponse> {
    return apiRequest<PaginatedPaymentMethodsResponse>(
        `/payment-methods/${paginationQuery(pagination)}`,
        { method: "GET" },
    );
}

export async function getPaymentMethod(
    paymentMethodId: number,
): Promise<PaymentMethodDTO> {
    return apiRequest<PaymentMethodDTO>(
        `/payment-methods/${paymentMethodId}/`,
        { method: "GET" },
    );
}

export async function createPaymentMethod(
    paymentMethod: CreatePaymentMethodDTO,
): Promise<PaymentMethodDTO> {
    return apiRequest<PaymentMethodDTO>("/payment-methods/create/", {
        method: "POST",
        ...jsonBody(paymentMethod),
    });
}

export async function getMyPaymentMethods(): Promise<PaymentMethodDTO[]> {
    return apiRequest<PaymentMethodDTO[]>("/user/payment-methods/", {
        method: "GET",
    });
}

export async function getDebitCards(): Promise<DebitCardDTO[]> {
    return apiRequest<DebitCardDTO[]>("/debit-cards/");
}