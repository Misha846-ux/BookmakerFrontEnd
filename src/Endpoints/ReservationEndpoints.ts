import type { CreateReservationDTO, ReservationDTO } from "../Models/dto";
import { apiRequest, jsonBody } from "./apiRequest";

export async function createReservation(
    reservation: CreateReservationDTO,
): Promise<ReservationDTO> {
    return apiRequest<ReservationDTO>("/reservation/create/", {
        method: "POST",
        ...jsonBody(reservation),
    });
}
