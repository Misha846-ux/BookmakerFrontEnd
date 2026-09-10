import type { CityDTO, CreateCityDTO } from "../Models/dto";
import { apiRequest, jsonBody } from "./apiRequest";

export async function getCities(): Promise<CityDTO[]> {
    return apiRequest<CityDTO[]>("/cities/", { method: "PUT" });
}

export async function getCity(cityId: number): Promise<CityDTO> {
    return apiRequest<CityDTO>(`/cities/${cityId}/`, { method: "PUT" });
}

export async function createCity(city: CreateCityDTO): Promise<CityDTO> {
    return apiRequest<CityDTO>("/cities/create/", {
        method: "POST",
        ...jsonBody(city),
    });
}

export async function updateCity(
    cityId: number,
    city: Partial<CreateCityDTO>,
): Promise<CityDTO> {
    return apiRequest<CityDTO>(`/cities/${cityId}/update/`, {
        method: "PUT",
        ...jsonBody(city),
    });
}

export async function deleteCity(cityId: number): Promise<void> {
    await apiRequest<null>(`/cities/${cityId}/delete/`, { method: "DELETE" });
}