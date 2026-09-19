import "./style/Book_Page_Finale.css";
import { useParams, useNavigate} from "react-router-dom";
import React, { useState } from "react";
import type { Room } from "../../Models/Room_Model";
import type { User } from "../../Models/User_Model";
import data from "../Temporary_json_files/data.json"
import type { Reservation } from "../../Models/Reservation_Model";
import route_btn_photo from "./photo/route_btn_photo.png";
import photo_back_btn from "./photo/photo_back_btn.png";
import big_like_photo from "./photo/big_like_photo.png";
import PDF_photo from "./photo/PDF_photo.png";
import like_photo from "./photo/like_photo.png";
const Book_Page_Finale = () => {
   const navigate = useNavigate();
    
    const {hotel_id} = useParams();

    const hotel = data.hotels.find(hotel => hotel.id === Number(hotel_id));

    if(!hotel){
        return <div>Hotel not found</div>;
    };

    const hotelRooms = data.rooms.filter(room => room.hotel === hotel.id);

    const room: Room | undefined = hotelRooms[0];

    if (!room) { 
        return <div>No rooms found</div>; 
    };

    const reservation: Reservation | undefined = data.resevations.find(reservation => reservation.room === room.id);
    const user: User | undefined = data.users.find(user => reservation?.user === user.id);
     const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "long",
    }).format(new Date(date));
    };
    const handleOnClickback = () => {
        navigate(`/hotel/${hotel.id}`)
    };
    return(
        <div className="Finale_Page_body">
            <div className="Finale_Page_content">
            <div className="Finale_Page_text_box">
                <div className="Finale_Page_text_box_top">Hotel for <div style={{color: "#585ADB", marginLeft: "1%"}}>you.</div></div>
                <div className="Finale_Page_text_box_second_top">
                    <div className="Finale_Page_text_box_second_top_name">Thank you {user?.name}</div>
                    <div className="Finale_Page_text_box_second_top_success"><img src={big_like_photo}/> Your booking has been successfully confirmed!</div>
                </div>
                <div className="Finale_Page_text_box_content">
                    <div className="Finale_Page_text_box_content_line"> <img src={like_photo}/> <b style={{marginLeft: "1%"}}>{hotel.name}</b> <div className="Finale_Page_content_text">is waiting for you</div> <b>{reservation
                        ? `${formatDate(reservation?.checkIn)}`
                        : "No reservation"
                        }</b></div>
                        <div className="Finale_Page_text_box_content_line"> 
                            <img src={like_photo}/> <div className="Finale_Page_content_text">The payment for the booking is made upon arrival at the hotel.</div>
                        </div>
                        <div className="Finale_Page_text_box_content_line"> 
                            <img src={like_photo}/> <div className="Finale_Page_content_text">You can cancel your booking free of charge until {reservation
                        ? `${formatDate(reservation?.checkIn)}`
                        : "No reservation"
                        } date 00:00 time</div>
                        </div>
                        <div className="Finale_Page_text_box_content_line"> 
                            <img src={like_photo}/>  <span className="Finale_Page_content_text">Get in touch with the manager for{" "}
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
                    <button className="Finale_Page_PDF_btn">Save PDF confirmation <img src={PDF_photo}/></button>
                </div>
            </div>
            <div className="Finale_Page_info">
             <div className="Finale_Page_central_part">
                <div className="Finale_Page_central_part_stars">{"★".repeat(hotel.stars)}</div>
                <div className="Finale_Page_central_part_name">{hotel.name}</div>
                <div className="Finale_Page_central_part_phone">{hotel.phonenumber}</div>
            </div>
            </div>
            <div className="Finale_Page_route">
                <label className="Finale_Page_text"> Show the route</label><img  style={{marginLeft: "1%"}} src={route_btn_photo}/>
            </div>
            </div>
            <button onClick={handleOnClickback} className="Finale_Page_btn_box">
                <img className="Finale_Page_btn" src={photo_back_btn}/>
            </button>
        </div>
    );
};
export default Book_Page_Finale;