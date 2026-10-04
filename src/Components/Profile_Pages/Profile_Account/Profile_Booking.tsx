import "./style/Profile_Booking.css"
import data from "../../Temporary_json_files/data.json";
import type {City} from "../../../Models/City_Model";
import type {Country} from "../../../Models/Country_Model";
import type {Hotel} from "../../../Models/Hotel_Model";
import type {Room} from "../../../Models/Room_Model";
import type {Reservation} from "../../../Models/Reservation_Model";
import type {User} from "../../../Models/User_Model";
import bed_photo from "../../Room_Scroll_Box/photo/bed_photo.png";
import wifi_photo from "../../Room_Scroll_Box/photo/wifi_photo.png";
import bath_photo from "../../Room_Scroll_Box/photo/bath_photo.png";
import pool_photo from "../../Room_Scroll_Box/photo/pool_photo.png";
import { useParams } from "react-router-dom";
import airplane_photo from "../../Room_top/photo/airplane_photo.png";
import calendar_photo from "../../Room_top/photo/calendar_photo.png";
import people_photo from "../../Room_top/photo/people_photo.png";
import dots_photo from "../../Room_top/photo/dots_photo.png";
import { useNavigate } from "react-router-dom";
export const rooms: Room[] = data.rooms.map((room) => ({
    id: room.id,
    roomNumber: room.roomnumber,
    description: room.description,
    photo: room.photo,
    hotel: room.hotel,
    wifi: room.wifi,
    privatePool: room.privatepool,
    bath: room.bath,
    price: room.price,
    beds: room.beds,
}));

export const reservations: Reservation[] = data.resevations;

export const users: User[] = data.users;

export const cities: City[] = data.cities;

export const countries: Country[] = data.countries;
const formatDate = (date: string | null) => {
    if (!date) return "Not selected";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "Not selected";
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "short",
    }).format(parsed);
};
const Profile_Booking = () => {
    const { user_id} = useParams();
    const navigate = useNavigate();
    const user = users.find((user) => user.id === Number(user_id));
    const photos = rooms.find((room) => room.id === reservations.find((reservation) => reservation.user === user?.id)?.room)?.photo; 
    const reservation = reservations.find(
    (reservation) => reservation.user === user?.id
);

const room = rooms.find(
    (room) => room.id === reservation?.room
);
    const city = cities.find(
        (city) => city.id === room?.hotel
    );
    const hotel = data.hotels.find(
        (hotel) => hotel.id === room?.hotel
    );
    const handleHotelPageClick = () => {
        navigate("/hotels")
    }

    const handleBookingInfoClick = () => {
        navigate(`/hotel/${hotel?.id}/${room?.id}?`)
    }
    return(
        <div className="Profile_Booking_body">
            <div className="Profile_Booking_top">YOUR BOOKINGS</div>
            <div className="Profile_Booking_content">
                <div className="Profile_Booking_room">
                    <div className="Profile_Booking_Box_Card">
                        <img src={photos?.[0] ?? "/room-placeholder.svg"} className="Profile_Booking_Box_img" alt="room" />
                        <div className="Profile_Booking_Box_info">
                            <div className="Profile_Booking_Box_description">{room?.description}</div>
                            <div className="Profile_Booking_Box_bed"><img src={bed_photo} alt="" />Beds:
                                <div className="Profile_Booking_Box_bed_text">{room?.beds}</div>
                            </div>
                            <div className="Profile_Booking_Box_bool_info">
                                {room?.wifi && (
                                    <div className="Profile_Booking_Box_bool_wifi"><img src={wifi_photo} alt="" />free wi-fi</div>
                                )}
                                {room?.bath && (
                                    <div className="Profile_Booking_Box_bool_bath"><img src={bath_photo} alt="" />bath</div>
                                )}
                                {room?.privatePool && (
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
                                <div className="Profile_Booking_info_box_center">{city?.name}</div>
                            </div>
                            <div className="Profile_Booking_info_box">
                                <img className="Profile_Booking_info_box_top" src={calendar_photo} alt="dates" />
                                <div className="Profile_Booking_info_box_center_calendar">
                                {`${formatDate(reservation?.checkIn)} - ${formatDate(reservation?.checkOut)}`}
                                </div>
                            </div>
                            <div className="Profile_Booking_info_box">
                                <img className="Profile_Booking_info_box_top" src={people_photo} alt="people" />
                                <div className="Profile_Booking_info_box_center">{room?.beds} people</div>
                            </div>
                        </div>
                    </div> 
                    <div className="Profile_Booking_functions_center">
                            <button className="Profile_Booking_functions_center_btn" onClick={handleHotelPageClick}>HOTEL PAGE</button>
                            <button className="Profile_Booking_functions_center_btn" onClick={handleBookingInfoClick}>BOOKING INFO</button>
                    </div>
                    <div className="Profile_Booking_functions_bottom">
                        <button className="Profile_Booking_functions_bottom_btn">Want to cancel?</button>
                        <div className="Profile_Booking_functions_bottom_text">Time left until: {formatDate(reservation?.checkIn)}</div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default Profile_Booking;