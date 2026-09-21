import type { MainPageReviewsResponse } from "../Models/dto";
import { apiRequest } from "./apiRequest";


export async function getLatestReviews(): Promise<MainPageReviewsResponse> {
    return apiRequest<MainPageReviewsResponse>(
        "/reviews/",
        { method: "GET" },
    );
}