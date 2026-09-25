import "./style/Book_Page_Finale.css";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHotelCardData } from "../../../Endpoints/HotelEndpoints";
import { getReservation } from "../../../Endpoints/ReservationEndpoints";
import { useBooking } from "../../../Context/BookingContext";
import { useAuth } from "../../../Context/AuthContext";
import type { HotelDTO } from "../../../Models/dto";
import route_btn_photo from "./photo/route_btn_photo.png";
import photo_back_btn from "./photo/photo_back_btn.png";
import big_like_photo from "./photo/big_like_photo.png";
import PDF_photo from "./photo/PDF_photo.png";
import like_photo from "./photo/like_photo.png";

const formatDate = (date: string | null | undefined) => {
    if (!date) return "";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "long",
    }).format(parsed);
};

const Book_Page_Finale = () => {
    const navigate = useNavigate();
    const { hotel_id } = useParams();
    const [searchParams] = useSearchParams();
    const { createdReservation, setCreatedReservation } = useBooking();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const [hotel, setHotel] = useState<HotelDTO>();
    const [loadError, setLoadError] = useState<string>();

    const reservationParam = searchParams.get("reservation");
    const reservationToken = searchParams.get("token");

    useEffect(() => {
        if (isAuthLoading) return;

        const parsedId = Number(reservationParam);
        const hasReservationId = reservationParam !== null
            && Number.isInteger(parsedId)
            && parsedId > 0;

        if (createdReservation && (!hasReservationId || createdReservation.id === parsedId)) {
            return;
        }

        if (hasReservationId && (isAuthenticated || reservationToken)) {
            let aborted = false;
            getReservation(parsedId, reservationToken)
                .then((reservation) => {
                    if (!aborted) setCreatedReservation(reservation);
                })
                .catch(() => {
                    if (!aborted) navigate(`/hotel/${hotel_id}`, { replace: true });
                });
            return () => { aborted = true; };
        }

        if (!createdReservation) {
            navigate(`/hotel/${hotel_id}`, { replace: true });
        }
    }, [createdReservation, isAuthLoading, reservationParam, reservationToken, isAuthenticated, setCreatedReservation, navigate, hotel_id]);

    useEffect(() => {
        const hotelId = Number(hotel_id);
        if (!Number.isInteger(hotelId)) {
            setLoadError("Hotel not found");
            return;
        }
        let aborted = false;
        getHotelCardData(hotelId)
            .then((data) => {
                if (!aborted) setHotel(data.hotel);
            })
            .catch(() => {
                if (!aborted) setLoadError("Unable to load hotel data");
            });
        return () => { aborted = true; };
    }, [hotel_id]);

    if (loadError) {
        return <div className="Finale_Page_body">{loadError}</div>;
    }
    if (!createdReservation) {
        return null;
    }
    if (!hotel) {
        return <div className="Finale_Page_body">Loading...</div>;
    }

    const reservation = createdReservation;

    const handleOnClickBack = () => {
        navigate(`/hotel/${hotel_id}`);
    };
    return (
        <div className="Finale_Page_body">
            <div className="Finale_Page_content">
                <div className="Finale_Page_text_box">
                    <div className="Finale_Page_text_box_top">Hotel for <div style={{ color: "#585ADB", marginLeft: "1%" }}>you.</div></div>
                    <div className="Finale_Page_text_box_second_top">
                        <div className="Finale_Page_text_box_second_top_name">Thank you {`${reservation?.name ?? "guest"}`}</div>
                        <div className="Finale_Page_text_box_second_top_success"><img src={big_like_photo} alt="" /> Your booking has been successfully confirmed!</div>
                    </div>
                    <div className="Finale_Page_text_box_content">
                        <div className="Finale_Page_text_box_content_line"> <img src={like_photo} alt="" /> <b style={{ marginLeft: "1%" }}>{hotel.name}</b> <div className="Finale_Page_content_text">is waiting for you</div> <b>
                            {reservation
                                ? `${formatDate(reservation.checkIn)}`
                                : "on your dates"
                            }</b></div>
                        <div className="Finale_Page_text_box_content_line">
                            <img src={like_photo} alt="" /> <div className="Finale_Page_content_text">The payment for the booking is made upon arrival at the hotel.</div>
                        </div>
                        <div className="Finale_Page_text_box_content_line">
                            <img src={like_photo} alt="" /> <div className="Finale_Page_content_text">You can cancel your booking free of charge until {reservation
                                ? `${formatDate(reservation.checkIn)}`
                                : "your check-in"
                            } date 00:00 time</div>
                        </div>
                        <div className="Finale_Page_text_box_content_line">
                            <img src={like_photo} alt="" />  <span className="Finale_Page_content_text">Get in touch with the manager for{" "}
                                <span className="Finale_Page_link">
                                    canceling the booking
                                </span>{" "}
                                or for{" "}
                                <span className="Finale_Page_link">
                                    any queries
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="Finale_Page_text_box_btn">
                        <button className="Finale_Page_PDF_btn">Save PDF confirmation <img src={PDF_photo} alt="" /></button>
                    </div>
                </div>
                <div className="Finale_Page_info">
                    <div className="Finale_Page_central_part">
                        <div className="Finale_Page_central_part_stars">{"Ôÿà".repeat(hotel.stars ?? 0)}</div>
                        <div className="Finale_Page_central_part_name">{hotel.name}</div>
                        <div className="Finale_Page_central_part_phone">{hotel.phone}</div>
                    </div>
                </div>
                <div className="Finale_Page_route">
                    <label className="Finale_Page_text"> Show the route</label><img style={{ marginLeft: "1%" }} src={route_btn_photo} alt="" />
                </div>
            </div>
            <button onClick={handleOnClickBack} className="Finale_Page_btn_box">
                <img className="Finale_Page_btn" src={photo_back_btn} alt="" />
            </button>
        </div>
    );
};
export default Book_Page_Finale;

