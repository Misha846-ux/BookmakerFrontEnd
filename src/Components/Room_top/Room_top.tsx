import "../Room_top/style/Room_top.css"
import {useParams} from "react-router-dom";
import {useState } from "react";
import type {Hotel} from "../../Models/Hotel_Model";
import type {City} from "../../Models/City_Model";
import type { User } from "../../Models/User_Model";
import type { Review } from "../../Models/Reviews_Model";
import type { Room } from "../../Models/Room_Model";
import type { Reservation } from "../../Models/Reservation_Model";
import data from "../Temporary_json_files/data.json"
import btn_photo from "../Room_top/photo/btn_photo.png"
import airplane_photo from "../Room_top/photo/airplane_photo.png"
import calendar_photo from "../Room_top/photo/calendar_photo.png"
import dots_photo from "../Room_top/photo/dots_photo.png"
import people_photo from "../Room_top/photo/people_photo.png"
import arrowdown_photo from "../Room_top/photo/arrowdown_photo.png"
import {useNavigate} from "react-router-dom";
const Room_top = () => {
    const {hotel_id} = useParams();

    const hotel = data.hotels.find(hotel => hotel.id === Number(hotel_id));

    if(!hotel){
        return <div>Hotel not found</div>;
    };

    const hotelRooms = data.rooms.filter(room => room.hotel === hotel.id);

    const hotelReviews: Review[] = data.reviews.filter(review => review.hotel === hotel.id);

    const room: Room | undefined = hotelRooms[0];

    const city: City | undefined = data.cities.find(city => city.id === hotel.city);


    if (!room) { 
        return <div>No rooms found</div>; 
    };
    
    const reservation: Reservation | undefined = data.resevations.find(reservation => reservation.room === room.id);

    const averageRating = hotelReviews.length > 0 
    ? (hotelReviews.reduce((sum, review) => sum + review.rating, 0) /hotelReviews.length).toFixed(1)
    : "0.0";

    const reviewsCount = hotelReviews.length;
    const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "short",
    }).format(new Date(date));
    };
    const navigator = useNavigate();

    const handleOnClick = () => {
        navigator("/")
    };
    return(
        <div className="Room_top_body">
            <button className="Room_top_btn" onClick={handleOnClick}><img src={btn_photo}/></button>
            <div className="Room_top_left_part">
                <div className="Room_top_left_part_box">
                    <img className="Room_top_left_part_box_top" src={airplane_photo}/>
                    <div className="Room_top_left_part_box_center">{city?.name}</div>
                    <img className="Room_top_left_part_box_bottom" src={dots_photo}/>
                </div>
                <div className="Room_top_left_part_box">
                    <img className="Room_top_left_part_box_top" src={calendar_photo}/>
                   <div className="Room_top_left_part_box_center">{reservation
                                    ? `${formatDate(reservation.checkIn)} - ${formatDate(reservation.checkOut)}`
                                    : "No reservation"
                    }</div>
                    <img className="Room_top_left_part_box_bottom" src={dots_photo}/>
                </div> 
                <div className="Room_top_left_part_box">
                    <img className="Room_top_left_part_box_top" src={people_photo}/>
                   <div className="Room_top_left_part_box_center">{room.beds} people</div>
                    <img className="Room_top_left_part_box_bottom" src={dots_photo}/>
                </div> 
            </div>
            <div className="Room_top_central_part">
                <div className="Room_top_central_part_stars">{"★".repeat(hotel.stars)}</div>
                <div className="Room_top_central_part_name">{hotel.name}</div>
                <div className="Room_top_central_part_phone">{hotel.phonenumber}</div>
            </div>
            <div className="Room_top_right_part">
                <div className="Room_top_right_part_raiting">{averageRating}</div>
                <div className="Room_top_right_part_reviews_top">reviews 
                    <div className="Room_top_right_part_reviews_count">{reviewsCount}</div>
                </div>
                <div className="Room_top_right_part_check">check <img src={arrowdown_photo}/></div>
            </div>
        </div>
    );
};

export default Room_top;