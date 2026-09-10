import type {
    AuthAccountDTO,
    UserProfileResponse,
    UserProfileUpdateDTO,
} from "../Models/dto";
import { apiRequest, jsonBody } from "./apiRequest";

export async function sendAuthCode(account: AuthAccountDTO): Promise<string> {
    return apiRequest<string>("/user/sendAuthCode", {
        method: "POST",
        ...jsonBody(account),
    });
}

export async function createAccount(account: AuthAccountDTO): Promise<string> {
    return apiRequest<string>("/user/createAccount", {
        method: "POST",
        ...jsonBody(account),
    });
}

export async function verifyAccount(account: AuthAccountDTO): Promise<string> {
    return apiRequest<string>("/user/verifyAccount", {
        method: "PUT",
        ...jsonBody(account),
    });
}

export async function updateUserProfile(
    userId: number,
    profile: UserProfileUpdateDTO,
): Promise<UserProfileResponse> {
    return apiRequest<UserProfileResponse>(`/user/${userId}/profile`, {
        method: "PATCH",
        ...jsonBody(profile),
    });
}
