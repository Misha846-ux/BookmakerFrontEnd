import "../Room_Scroll_Box/style/Room_Scroll_Box.css"
import type { RoomDTO } from "../../Models/dto";
import { useNavigate, useSearchParams } from "react-router-dom";


type RoomCardProps = {
    room: RoomDTO;
    roomPhoto: string;
    roomDescription: string;
    bedPhoto: string;
    roomBeds: number;
    roomWifi: boolean;
    roomWifiPhoto: string;
    roomBath: boolean;
    roomBathPhoto: string;
    roomPrivatePool: boolean;
    roomPrivatePoolPhoto: string;
    roomPrice: number;
};
const Room_Scroll_Box_Card = ({room,roomPhoto,roomDescription,bedPhoto,roomBeds,
    roomWifi,roomWifiPhoto,roomBath,roomBathPhoto,roomPrivatePool,
    roomPrivatePoolPhoto,roomPrice}: RoomCardProps) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleRoomClick = () => {
        const dates = searchParams.get("checkIn") && searchParams.get("checkOut")
            ? `?checkIn=${searchParams.get("checkIn")}&checkOut=${searchParams.get("checkOut")}`
            : "";
        navigate(`/hotel/${room.hotel}/room/${room.id}${dates}`);
    };
    
    return(
        <div className="Room_Scroll_Box_Card" onClick={handleRoomClick} role="button" tabIndex={0}>
                <img src={roomPhoto} className="Room_Scroll_Box_img"/>
                <div className="Room_Scroll_Box_info">
                    <div className="Room_Scroll_Box_description">{roomDescription}</div>
                    <div className="Room_Scroll_Box_bed"><img src={bedPhoto}/>Beds: 
                    <div className="Room_Scroll_Box_bed_text">{roomBeds}</div>
                    </div>
                    <div className="Room_Scroll_Box_bool_info">
                        {roomWifi && (
                            <div className="Room_Scroll_Box_bool_wifi"><img src={roomWifiPhoto}/>free wi-fi</div>
                        )}
                        {roomBath && (
                            <div className="Room_Scroll_Box_bool_bath"><img src={roomBathPhoto}/>bath</div>
                        )}
                        {roomPrivatePool && (
                            <div className="Room_Scroll_Box_bool_pool"><img src={roomPrivatePoolPhoto}/>private pool</div>
                        )}
                    </div>
                    <div className="Room_Scroll_Box_cancellation">Ô£ô FREE cancellation</div>
                </div>
                <div className="Room_Scroll_Box_price_and_btns">
                    <div className="Room_Scroll_Box_price">{roomPrice}$</div>
                    <button className="Room_Scroll_Box_choose_btn">CHOOSE</button>
                    <button className="Room_Scroll_Box_info_btn">+INFO</button>
                </div>
            </div>
    );
};

export default Room_Scroll_Box_Card;

