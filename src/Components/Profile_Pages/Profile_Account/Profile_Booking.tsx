import "./style/Profile_Booking.css"
import { useCallback, useEffect, useState } from "react";
import { cancelReservation, getMyReservations } from "../../../Endpoints/ReservationEndpoints";
import { apiErrorMessage } from "../../../utils/apiError";
import type { MyReservationDTO } from "../../../Models/dto";
import bed_photo from "../../Room_Scroll_Box/photo/bed_photo.png";
import wifi_photo from "../../Room_Scroll_Box/photo/wifi_photo.png";
import bath_photo from "../../Room_Scroll_Box/photo/bath_photo.png";
import pool_photo from "../../Room_Scroll_Box/photo/pool_photo.png";
import airplane_photo from "../../Room_top/photo/airplane_photo.png";
import calendar_photo from "../../Room_top/photo/calendar_photo.png";
import people_photo from "../../Room_top/photo/people_photo.png";
import { useNavigate } from "react-router-dom";

const formatDate = (date: string | null | undefined) => {
    if (!date) return "Not selected";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "Not selected";
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "short",
    }).format(parsed);
};

const Profile_Booking = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState<MyReservationDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);

    const loadReservations = useCallback(async () => {
        try {
            setError(null);
            const response = await getMyReservations();
            setReservations(response.results ?? []);
        } catch (err) {
            setError(apiErrorMessage(err, "Unable to load your bookings."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadReservations();
    }, [loadReservations]);

    const handleHotelPageClick = (reservation: MyReservationDTO) => {
        navigate(`/hotel/${reservation.hotel.id}`);
    };

    const handleBookingInfoClick = (reservation: MyReservationDTO) => {
        navigate(
            `/hotel/${reservation.hotel.id}/room/${reservation.room.id}/finale` +
            `?reservation=${reservation.id}&token=${encodeURIComponent(reservation.viewToken)}`,
        );
    };

    const handleCancelClick = async (reservation: MyReservationDTO) => {
        if (busyId !== null) return;
        const confirmed = window.confirm(
            `Do you really want to cancel the booking of "${reservation.room.description ?? "this room"}" (${formatDate(reservation.checkIn)} - ${formatDate(reservation.checkOut)})?`,
        );
        if (!confirmed) return;

        setBusyId(reservation.id);
        try {
            await cancelReservation(reservation.id);
            await loadReservations();
        } catch (err) {
            setError(apiErrorMessage(err, "Unable to cancel the booking."));
        } finally {
            setBusyId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="Profile_Booking_body">
                <div className="Profile_Booking_top">YOUR BOOKINGS</div>
                <div className="Profile_Booking_empty">Loading...</div>
            </div>
        );
    }

    return (
        <div className="Profile_Booking_body">
            <div className="Profile_Booking_top">YOUR BOOKINGS</div>
            {error && <div className="Profile_Booking_error">{error}</div>}
            {!error && reservations.length === 0 && (
                <div className="Profile_Booking_empty">You have no bookings yet</div>
            )}
            {reservations.map((reservation) => {
                const roomPhoto = reservation.room.photos[0] ?? reservation.hotel.photos[0] ?? "";
                return (
                    <div className="Profile_Booking_content" key={reservation.id}>
                        <div className="Profile_Booking_room">
                            <div className="Profile_Booking_Box_Card">
                                {roomPhoto ? (
                                    <img src={roomPhoto} className="Profile_Booking_Box_img" alt="room" />
                                ) : (
                                    <div className="Profile_Booking_Box_img Profile_Booking_Box_img_empty" />
                                )}
                                <div className="Profile_Booking_Box_info">
                                    <div className="Profile_Booking_Box_description">
                                        {reservation.room.description ?? "Room"}
                                    </div>
                                    <div className="Profile_Booking_Box_bed"><img src={bed_photo} alt="" />Beds:
                                        <div className="Profile_Booking_Box_bed_text">{reservation.room.beds}</div>
                                    </div>
                                    <div className="Profile_Booking_Box_bool_info">
                                        {reservation.room.wifi && (
                                            <div className="Profile_Booking_Box_bool_wifi"><img src={wifi_photo} alt="" />free wi-fi</div>
                                        )}
                                        {reservation.room.Bath && (
                                            <div className="Profile_Booking_Box_bool_bath"><img src={bath_photo} alt="" />bath</div>
                                        )}
                                        {reservation.room.privatePool && (
                                            <div className="Profile_Booking_Box_bool_pool"><img src={pool_photo} alt="" />private pool</div>
                                        )}
                                    </div>
                                    <div className="Profile_Booking_Box_cancellation">✓ FREE cancellation</div>
                                </div>
                            </div>
                        </div>
                        <div className="Profile_Booking_functions">
                            <div className="Profile_Booking_functions_top">
                                <div className="Profile_Booking_info">
                                    <div className="Profile_Booking_info_box">
                                        <img className="Profile_Booking_info_box_top" src={airplane_photo} alt="travel" />
                                        <div className="Profile_Booking_info_box_center">{reservation.city.name}</div>
                                    </div>
                                    <div className="Profile_Booking_info_box">
                                        <img className="Profile_Booking_info_box_top" src={calendar_photo} alt="dates" />
                                        <div className="Profile_Booking_info_box_center_calendar">
                                            {`${formatDate(reservation.checkIn)} - ${formatDate(reservation.checkOut)}`}
                                        </div>
                                    </div>
                                    <div className="Profile_Booking_info_box">
                                        <img className="Profile_Booking_info_box_top" src={people_photo} alt="people" />
                                        <div className="Profile_Booking_info_box_center">{reservation.room.beds} people</div>
                                    </div>
                                </div>
                            </div>
                            <div className="Profile_Booking_functions_center">
                                <button className="Profile_Booking_functions_center_btn" onClick={() => handleHotelPageClick(reservation)}>HOTEL PAGE</button>
                                <button className="Profile_Booking_functions_center_btn" onClick={() => handleBookingInfoClick(reservation)}>BOOKING INFO</button>
                            </div>
                            <div className="Profile_Booking_functions_bottom">
                                <button
                                    className="Profile_Booking_functions_bottom_btn"
                                    onClick={() => void handleCancelClick(reservation)}
                                    disabled={busyId === reservation.id}>
                                    {busyId === reservation.id ? "Cancelling..." : "Want to cancel?"}
                                </button>
                                <div className="Profile_Booking_functions_bottom_text">Time left until: {formatDate(reservation.checkIn)}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
export default Profile_Booking;
