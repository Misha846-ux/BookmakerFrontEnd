import { useEffect, useState } from "react";
import "../Book_Pages/style/Book_Pages.css";
import "../Room_Scroll_Box/style/Room_Scroll_Box.css";
import { Outlet, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getCity } from "../../Endpoints/CityEndpoints";
import { getHotelCardData } from "../../Endpoints/HotelEndpoints";
import { getRoomPhotos, getRoomAvailability } from "../../Endpoints/RoomEndpoints";
import { useBooking } from "../../Context/BookingContext";
import type { CityDTO, HotelCardDataDTO, RoomDTO } from "../../Models/dto";
import photo_back_btn from "./photo/photo_back_btn.png";
import airplane_photo from "./photo/airplane_photo.png";
import calendar_photo from "./photo/calendar_photo.png";
import dots_photo from "./photo/dots_photo.png";
import people_photo from "./photo/people_photo.png";
import bed_photo from "./photo/bed_photo.png";
import wifi_photo from "./photo/wifi_photo.png";
import bath_photo from "./photo/bath_photo.png";
import pool_photo from "./photo/pool_photo.png";

type BookingLayoutData = {
    hotelData: HotelCardDataDTO;
    city: CityDTO;
    room: RoomDTO;
    photos: string[];
};

const formatDate = (date: string | null) => {
    if (!date) return "Not selected";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "Not selected";
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "short",
    }).format(parsed);
};

const today = new Date().toISOString().slice(0, 10);

const Book_Pages = () => {
    const navigate = useNavigate();
    const { hotel_id, room_id } = useParams();
    const { applyBookingTarget, setRoom } = useBooking();

    const [searchParams] = useSearchParams();
    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");
    const datesValid = Boolean(
        checkInParam && checkOutParam && checkOutParam > checkInParam,
    );
    const hasDates = datesValid;

    const [data, setData] = useState<BookingLayoutData>();
    const [error, setError] = useState<string>();
    const [fallbackCheckIn, setFallbackCheckIn] = useState("");
    const [fallbackCheckOut, setFallbackCheckOut] = useState("");
    const [fallbackError, setFallbackError] = useState("");
    const [loading, setLoading] = useState(hasDates);

    useEffect(() => {
        const hotelId = Number(hotel_id);
        const roomId = Number(room_id);

        if (!Number.isInteger(hotelId) || !Number.isInteger(roomId)) {
            setError("Room not found");
            setLoading(false);
            return () => undefined;
        }

        if (!datesValid || !checkInParam || !checkOutParam) {
            setLoading(false);
            return () => undefined;
        }

        setData(undefined);
        setError(undefined);
        setLoading(true);

        let aborted = false;
        const load = async () => {
            try {
                applyBookingTarget(hotelId, roomId, checkInParam, checkOutParam);
                const hotelData = await getHotelCardData(hotelId);
                const city = await getCity(hotelData.hotel.city);
                const availability = await getRoomAvailability(roomId, checkInParam, checkOutParam);
                if (aborted) return;
                if (!availability.available) {
                    setError("This room is already booked for the selected dates.");
                    setLoading(false);
                    return;
                }
                const room = availability.room;
                if (room.hotel !== hotelId) {
                    setError("Room not found");
                    setLoading(false);
                    return;
                }
                const photoResponse = await getRoomPhotos(roomId).catch(() => null);
                if (!aborted) {
                    setRoom(room);
                    setData({
                        hotelData,
                        city,
                        room,
                        photos: photoResponse ? photoResponse.photos.map((p) => p.photo) : [],
                    });
                    setLoading(false);
                }
            } catch {
                if (!aborted) {
                    setError("Unable to load booking data.");
                    setLoading(false);
                }
            }
        };

        void load();
        return () => { aborted = true; };
    }, [hotel_id, room_id, checkInParam, checkOutParam, datesValid, applyBookingTarget, setRoom]);

    const handleBack = () => {
        navigate(`/hotel/${hotel_id}`);
    };

    const applyFallbackDates = () => {
        if (!fallbackCheckIn || !fallbackCheckOut) {
            setFallbackError("Please select both dates.");
            return;
        }
        if (fallbackCheckOut <= fallbackCheckIn) {
            setFallbackError("Check-out date must be later than check-in date.");
            return;
        }
        setFallbackError("");
        applyBookingTarget(Number(hotel_id), Number(room_id), fallbackCheckIn, fallbackCheckOut);
        navigate(`/hotel/${hotel_id}/room/${room_id}/first?checkIn=${fallbackCheckIn}&checkOut=${fallbackCheckOut}`);
    };

    if (loading) {
        return (
            <div className="Book_Page_body">
                <div className="Book_Page_info" />
                <div className="Book_Page_content">Loading booking data...</div>
            </div>
        );
    }

    if (!hasDates) {
        return (
            <div className="Book_Page_dates_body">
                <div className="Book_Page_dates_box">
                    <div className="Book_Page_dates_title">Select your dates</div>
                    <div className="Book_Page_dates_inputs">
                        <input type="date" min={today} value={fallbackCheckIn}
                            onChange={(e) => setFallbackCheckIn(e.target.value)} />
                        <input type="date" min={fallbackCheckIn || today} value={fallbackCheckOut}
                            onChange={(e) => setFallbackCheckOut(e.target.value)} />
                    </div>
                    {fallbackError && <div className="Book_Page_dates_error">{fallbackError}</div>}
                    <button className="Book_Page_dates_btn" onClick={applyFallbackDates}>Continue</button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="Book_Page_body">
                <div className="Book_Page_info" />
                <div className="Book_Page_content">
                    <div className="Book_Page_error_text">{error}</div>
                    <button className="Book_Page_error_btn" onClick={handleBack}>Back to hotel</button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { city, room, photos } = data;

    return (
        <div className="Book_Page_body">
            <div className="Book_Page_info">
                <div className="Book_Page_info_box">
                    <img className="Book_Page_info_box_top" src={airplane_photo} alt="travel" />
                    <div className="Book_Page_info_box_center">{city?.name}</div>
                    <img className="Book_Page_info_box_bottom" src={dots_photo} alt="" />
                </div>
                <div className="Book_Page_info_box">
                    <img className="Book_Page_info_box_top" src={calendar_photo} alt="dates" />
                    <div className="Book_Page_info_box_center">
                        {`${formatDate(checkInParam)} - ${formatDate(checkOutParam)}`}
                    </div>
                    <img className="Book_Page_info_box_bottom" src={dots_photo} alt="" />
                </div>
                <div className="Book_Page_info_box">
                    <img className="Book_Page_info_box_top" src={people_photo} alt="people" />
                    <div className="Book_Page_info_box_center">{room.beds} people</div>
                    <img className="Book_Page_info_box_bottom" src={dots_photo} alt="" />
                </div>
            </div>
            <div className="Book_Page_content">
                <div className="Book_Page_room">
                    <div className="Room_Scroll_Box_Card">
                        <img src={photos[0] ?? "/room-placeholder.svg"} className="Room_Scroll_Box_img" alt="room" />
                        <div className="Room_Scroll_Box_info">
                            <div className="Room_Scroll_Box_description">{room.description}</div>
                            <div className="Room_Scroll_Box_bed"><img src={bed_photo} alt="" />Beds:
                                <div className="Room_Scroll_Box_bed_text">{room.beds}</div>
                            </div>
                            <div className="Room_Scroll_Box_bool_info">
                                {room.wifi && (
                                    <div className="Room_Scroll_Box_bool_wifi"><img src={wifi_photo} alt="" />free wi-fi</div>
                                )}
                                {room.Bath && (
                                    <div className="Room_Scroll_Box_bool_bath"><img src={bath_photo} alt="" />bath</div>
                                )}
                                {room.privatePool && (
                                    <div className="Room_Scroll_Box_bool_pool"><img src={pool_photo} alt="" />private pool</div>
                                )}
                            </div>
                            <div className="Room_Scroll_Box_cancellation">✓ FREE cancellation</div>
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
            <div className="Book_Page_btn_box">
                <button className="Book_Page_btn" onClick={handleBack}><img src={photo_back_btn} alt="back" /></button>
            </div>
        </div>
    );
};

export default Book_Pages;