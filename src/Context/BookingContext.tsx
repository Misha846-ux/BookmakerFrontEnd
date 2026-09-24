import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ReservationDTO, RoomDTO } from "../Models/dto";

const STORAGE_KEY = "bookingDraft";

export type GuestInfo = {
    name: string;
    surname: string;
    email: string;
    confirmEmail: string;
    password: string;
    cityGuide: boolean;
    allowChangeBooking: boolean;
};

export type ContactInfo = {
    countryName: string;
    countryId: number | null;
    phoneNumber: string;
    confirmByCall: boolean;
    confirmByEmail: boolean;
};

type BookingDraft = {
    hotelId: number | null;
    roomId: number | null;
    checkIn: string | null;
    checkOut: string | null;
    room: RoomDTO | null;
    guest: GuestInfo;
    contact: ContactInfo;
    createdReservation: ReservationDTO | null;
};

type BookingContextType = BookingDraft & {
    error: string | null;
    setBookingTarget: (hotelId: number | null, roomId: number | null) => void;
    applyBookingTarget: (
        hotelId: number | null,
        roomId: number | null,
        checkIn: string | null,
        checkOut: string | null,
    ) => void;
    setDates: (checkIn: string | null, checkOut: string | null) => void;
    setRoom: (room: RoomDTO | null) => void;
    setGuest: (patch: Partial<GuestInfo>) => void;
    setContact: (patch: Partial<ContactInfo>) => void;
    setCreatedReservation: (reservation: ReservationDTO | null) => void;
    setError: (message: string | null) => void;
    resetBooking: () => void;
};

const emptyGuest: GuestInfo = {
    name: "",
    surname: "",
    email: "",
    confirmEmail: "",
    password: "",
    cityGuide: false,
    allowChangeBooking: false,
};

const emptyContact: ContactInfo = {
    countryName: "",
    countryId: null,
    phoneNumber: "",
    confirmByCall: false,
    confirmByEmail: false,
};

const defaultDraft: BookingDraft = {
    hotelId: null,
    roomId: null,
    checkIn: null,
    checkOut: null,
    room: null,
    guest: emptyGuest,
    contact: emptyContact,
    createdReservation: null,
};

function readDraft(): BookingDraft {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultDraft;
        const parsed = JSON.parse(raw) as Partial<BookingDraft>;
        return {
            hotelId: parsed.hotelId ?? null,
            roomId: parsed.roomId ?? null,
            checkIn: parsed.checkIn ?? null,
            checkOut: parsed.checkOut ?? null,
            room: parsed.room ?? null,
            guest: { ...emptyGuest, ...(parsed.guest ?? {}) },
            contact: { ...emptyContact, ...(parsed.contact ?? {}) },
            createdReservation: parsed.createdReservation ?? null,
        };
    } catch {
        return defaultDraft;
    }
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [draft, setDraft] = useState<BookingDraft>(readDraft);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const toStore = {
            ...draft,
            guest: { ...draft.guest, password: "" },
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }, [draft]);

    const setBookingTarget = useCallback((hotelId: number | null, roomId: number | null) => {
        setDraft((prev) => ({ ...prev, hotelId, roomId }));
    }, []);

    const applyBookingTarget = useCallback((
        hotelId: number | null,
        roomId: number | null,
        checkIn: string | null,
        checkOut: string | null,
    ) => {
        setDraft((prev) => {
            const unchanged =
                prev.hotelId === hotelId &&
                prev.roomId === roomId &&
                prev.checkIn === checkIn &&
                prev.checkOut === checkOut;
            if (unchanged) return prev;
            return {
                ...defaultDraft,
                hotelId,
                roomId,
                checkIn,
                checkOut,
            };
        });
    }, []);

    const setDates = useCallback((checkIn: string | null, checkOut: string | null) => {
        setDraft((prev) => ({ ...prev, checkIn, checkOut }));
    }, []);

    const setRoom = useCallback((room: RoomDTO | null) => {
        setDraft((prev) => ({ ...prev, room }));
    }, []);

    const setGuest = useCallback((patch: Partial<GuestInfo>) => {
        setDraft((prev) => ({ ...prev, guest: { ...prev.guest, ...patch } }));
    }, []);

    const setContact = useCallback((patch: Partial<ContactInfo>) => {
        setDraft((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }));
    }, []);

    const setCreatedReservation = useCallback((createdReservation: ReservationDTO | null) => {
        setDraft((prev) => ({ ...prev, createdReservation }));
    }, []);

    const resetBooking = useCallback(() => {
        setDraft(defaultDraft);
    }, []);

    const value = useMemo<BookingContextType>(() => ({
        ...draft,
        error,
        setBookingTarget,
        applyBookingTarget,
        setDates,
        setRoom,
        setGuest,
        setContact,
        setCreatedReservation,
        setError,
        resetBooking,
    }), [draft, error, setBookingTarget, applyBookingTarget, setDates, setRoom, setGuest, setContact, setCreatedReservation, resetBooking]);

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBooking = () => {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error("useBooking must be used within BookingProvider");
    return ctx;
};