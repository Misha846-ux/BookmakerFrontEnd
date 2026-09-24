import "../Room_top/style/Room_top.css"
import type { HotelDTO, CityDTO, RoomDTO } from "../../Models/dto";
import btn_photo from "../Room_top/photo/btn_photo.png"
import airplane_photo from "../Room_top/photo/airplane_photo.png"
import calendar_photo from "../Room_top/photo/calendar_photo.png"
import dots_photo from "../Room_top/photo/dots_photo.png"
import people_photo from "../Room_top/photo/people_photo.png"
import arrowdown_photo from "../Room_top/photo/arrowdown_photo.png"
import {useNavigate} from "react-router-dom";

type RoomTopProps = {
    hotel: HotelDTO;
    city: CityDTO;
    room: RoomDTO;
    checkIn?: string | null;
    checkOut?: string | null;
};

const formatDate = (value?: string | null) => {
    if (!value) return "Not selected";

    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "Not selected";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
    }).format(date);
};

const Room_top = ({hotel, city, room, checkIn, checkOut}: RoomTopProps) => {
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
                   <div className="Room_top_left_part_box_center">
                        <span>{formatDate(checkIn)}</span>
                        <span>{formatDate(checkOut)}</span>
                    </div>
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
                <div className="Room_top_central_part_phone">{hotel.phone}</div>
            </div>
            <div className="Room_top_right_part">
                <div className="Room_top_right_part_raiting">-</div>
                <div className="Room_top_right_part_reviews_top">reviews 
                    <div className="Room_top_right_part_reviews_count">0</div>
                </div>
                <div className="Room_top_right_part_check">check <img src={arrowdown_photo}/></div>
            </div>
        </div>
    );
};

export default Room_top;