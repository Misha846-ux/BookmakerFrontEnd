import "../Room_Scroll_Box/style/Room_Scroll_Box.css"
import type { Room } from "../../Models/Room_Model";
import bed_photo from "./photo/bed_photo.png";
import bath_photo from "./photo/bath_photo.png";
import wifi_photo from "./photo/wifi_photo.png";
import pool_photo from "./photo/pool_photo.png";
import Room_Scroll_Box_Card from "./Room_Scroll_Box_Card";
import {useParams} from "react-router-dom";
import data from "../Temporary_json_files/data.json";

type RoomScrollBoxProps = {
    rooms: Room[];
    selectedRoomId: number;
    onChooseRoom: (room: Room) => void;
};

const Room_Scroll_Box = ({rooms, selectedRoomId, onChooseRoom}: RoomScrollBoxProps) => {
    const {hotel_id} = useParams();

    const hotel = data.hotels.find(hotel => hotel.id === Number(hotel_id));

    if(!hotel){
        return <div>Hotel not found</div>;
    };

    const hotelRooms = data.rooms.filter(room => room.hotel === hotel.id);

    const otherRooms = hotelRooms.slice(1);

    if (otherRooms.length === 0) { 
        return null; 
    }
return(
    <div className="Room_Scroll_Box_body">
        <div className="Room_Scroll_Box_top">Book</div>
        <div className="Room_Scroll_Box_context">
            {rooms
            .filter(room => room.id !== selectedRoomId)
            .map(room=>(
                <div className="Room_Scroll_Box_context_card">
            <Room_Scroll_Box_Card key={room.id} room={room} roomPhoto={room.photo[0]} 
            roomDescription ={room.description} bedPhoto ={bed_photo} roomBeds = {room.beds}
    roomWifi = {room.wifi} roomWifiPhoto ={wifi_photo} roomBath ={room.bath}
    roomBathPhoto = {bath_photo} roomPrivatePool = {room.privatepool}
    roomPrivatePoolPhoto = {pool_photo} roomPrice = {room.price} onChoose={() => onChooseRoom(room)}/>
    </div>
            ))}
        </div>
    </div>
);
};

export default Room_Scroll_Box;