export type CountryDTO = {
    id: number;
    name: string;
};

export type CurrencyDTO = {
    id: number;
    currency: string;
};

export type DebitCardDTO = {
    id: number;
    name: string;
};

export type CityDTO = {
    id: number;
    name: string;
    center: string | null;
    center_latitude: string | null;
    center_longitude: string | null;
    country: number;
};

export type CreateCityDTO = Omit<
    CityDTO,
    "id" | "center_latitude" | "center_longitude"
>;

export type PaymentMethodDTO = {
    id: number;
    cardType: number;
    cardNumber: string;
    date: string;
};

export type CreatePaymentMethodDTO = Omit<PaymentMethodDTO, "id">;

export type ReservationDTO = {
    id: number;
    checkIn: string;
    checkOut: string;
    name: string;
    sureName: string;
    email: string;
    phoneNumber: string;
    cityGuide: boolean;
    room: number;
    user: number | null;
    country: number | null;
    payMethod: number | null;
};

export type CreateReservationDTO = Omit<ReservationDTO, "id">;

export type HotelDTO = {
    id: number;
    name: string;
    description: string | null;
    address: string;
    latitude: string | null;
    longitude: string | null;
    phone: string;
    email: string;
    stars: number;
    photo: string | null;
    city: number;
};

export type CreateHotelDTO = {
    name: string;
    description: string | null;
    address: string;
    phone: string;
    email: string;
    stars: number;
    photo: string | null;
    city: number;
};

export type RoomDTO = {
    id: number;
    roomNumber: string;
    description: string | null;
    wifi: boolean;
    privatePool: boolean;
    Bath: boolean;
    price: string;
    beds: number;
    photo: string | null;
    hotel: number;
};

export type CreateRoomDTO = Omit<RoomDTO, "id">;

export type UserDTO = {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthday: string | null;
    photo: string;
    ampthill: string;
    city: number | null;
    currency: number | null;
    payMethod: number | null;
};

export type PaginatedHotelsResponse = {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: HotelDTO[];
};

export type PaginatedRoomsResponse = {
    count: number;
    page: number;
    el: number;
    total_pages: number;
    results: RoomDTO[];
};

export type PaginatedPaymentMethodsResponse = {
    count: number;
    page: number;
    el: number;
    total_pages: number;
    results: PaymentMethodDTO[];
};

export type GetHotelsDTO = {
    city?: number;
    minPrice?: number;
    rating?: number;
    stars?: number;
};

export type PaginationDTO = {
    el: number;
    page: number;
};

export type GetHotelRoomsDTO = AdvancedSearchDTO & PaginationDTO;

export type PhotosResponse = {
    photos: Array<{ photo: string }>;
};

export type PhotoUploadResponse = {
    message: string;
    photo_url: string;
};

export type NearestPlaceResponse = {
    hotel_id: number;
    type: string;
    address: string;
    distance: number;
};

export type UserProfileResponse = {
    id: number;
    email: string;
    phone: string;
    birthday: string | null;
    ampthill: string;
    city: number | null;
    country: number | null;
    currency: number | null;
};

export type AuthAccountDTO = {
    email: string;
    password: string;
};

export type AdvancedSearchDTO = {
    land?: string | null;
    city?: string | null;
    checkIn?: string | null;
    checkOut?: string | null;
    people?: number | null;
    nightPrice?: number | null;
    rate?: number | null;
    stars?: number | null;
    wifi?: boolean | null;
};

export type HotelSearchDTO = {
    land?: string | null;
    city?: string | null;
    checkIn?: string | null;
    checkOut?: string | null;
    people?: number | null;
};

export type UserProfileUpdateDTO = {
    email?: string;
    phone?: string;
    birthday?: string | null;
    ampthill?: string;
    city?: number | null;
    country?: number | null;
    currency?: number | null;
};
