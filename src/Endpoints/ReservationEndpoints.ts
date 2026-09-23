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

export async function getReservation(
    reservationId: number,
    viewToken?: string | null,
): Promise<ReservationDTO> {
    const query = viewToken ? `?token=${encodeURIComponent(viewToken)}` : "";
    return apiRequest<ReservationDTO>(
        `/reservation/${reservationId}/${query}`,
        { method: "GET" },
    );
}
