import "../Book_Pages/style/Book_Pages.css";
import "../Room_Scroll_Box/style/Room_Scroll_Box.css";
import { Outlet } from "react-router-dom";
import {useParams, useNavigate } from "react-router-dom";
import type {Hotel} from "../../Models/Hotel_Model";
import type {City} from "../../Models/City_Model";
import type { User } from "../../Models/User_Model";
import type { Review } from "../../Models/Reviews_Model";
import type { Room } from "../../Models/Room_Model";
import type { Reservation } from "../../Models/Reservation_Model";
import data from "../Temporary_json_files/data.json";
import photo_back_btn from "./photo/photo_back_btn.png";
import airplane_photo from "./photo/airplane_photo.png"
import calendar_photo from "./photo/calendar_photo.png"
import dots_photo from "./photo/dots_photo.png"
import people_photo from "./photo/people_photo.png"
import bed_photo from "./photo/bed_photo.png"
import wifi_photo from "./photo/wifi_photo.png"
import bath_photo from "./photo/bath_photo.png"
import pool_photo from "./photo/pool_photo.png"
import Room_Scroll_Box_Card from "../Room_Scroll_Box/Room_Scroll_Box_Card";
const Book_Pages = () => {
    const navigate = useNavigate();
    const {hotel_id} = useParams();
    const hotel = data.hotels.find(hotel => hotel.id === Number(hotel_id));

    if (!hotel) {
    return <div className="Hotel_Page_body">Отель не найден</div>;
    }
     const hotelRooms = data.rooms.filter(room => room.hotel === hotel.id);

    const room: Room | undefined = hotelRooms[0];

    const city: City | undefined = data.cities.find(city => city.id === hotel.city);


    if (!room) { 
        return <div>No rooms found</div>; 
    };

    const reservation: Reservation | undefined = data.resevations.find(reservation => reservation.room === room.id);

    const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "short",
    }).format(new Date(date));
    };

    const handleOnClick = () => {
        navigate(`/hotel/${hotel.id}`)
    };

    return(
        <div className="Book_Page_body">
            <div className="Book_Page_info">
                 <div className="Book_Page_info_box">
                    <img className="Book_Page_info_box_top" src={airplane_photo}/>
                    <div className="Book_Page_info_box_center">{city?.name}</div>
                    <img className="Book_Page_info_box_bottom" src={dots_photo}/>
                </div>
                <div className="Book_Page_info_box">
                    <img className="Book_Page_info_box_top" src={calendar_photo}/>
                   <div className="Book_Page_info_box_center">{reservation
                                    ? `${formatDate(reservation.checkIn)} - ${formatDate(reservation.checkOut)}`
                                    : "No reservation"
                    }</div>
                    <img className="Book_Page_info_box_bottom" src={dots_photo}/>
                </div> 
                <div className="Book_Page_info_box">
                    <img className="Book_Page_info_box_top" src={people_photo}/>
                   <div className="Book_Page_info_box_center">{room.beds} people</div>
                    <img className="Book_Page_info_box_bottom" src={dots_photo}/>
                </div> 
            </div>
            <div className="Book_Page_content">
                <div className="Book_Page_room">
                    <div className="Room_Scroll_Box_Card">
                <img src={room.photo[0]} className="Room_Scroll_Box_img"/>
                <div className="Room_Scroll_Box_info">
                    <div className="Room_Scroll_Box_description">{room.description}</div>
                    <div className="Room_Scroll_Box_bed"><img src={bed_photo}/>Beds: 
                    <div className="Room_Scroll_Box_bed_text">{room.beds}</div>
                    </div>
                    <div className="Room_Scroll_Box_bool_info">
                        {room.wifi && (
                            <div className="Room_Scroll_Box_bool_wifi"><img src={wifi_photo}/>free wi-fi</div>
                        )}
                        {room.bath && (
                            <div className="Room_Scroll_Box_bool_bath"><img src={bath_photo}/>bath</div>
                        )}
                        {room.privatepool && (
                            <div className="Room_Scroll_Box_bool_pool"><img src={pool_photo}/>private pool</div>
                        )}
                    </div>
                    <div className="Room_Scroll_Box_cancellation">✓ FREE cancellation</div>
                </div>
            </div>
                </div>
                <Outlet/>
            </div>
            <div className="Book_Page_btn_box">
                <button className="Book_Page_btn" onClick={handleOnClick}><img src={photo_back_btn}/></button>
            </div>
        </div>
    );
};

export default Book_Pages;