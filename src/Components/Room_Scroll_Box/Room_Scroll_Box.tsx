import "../Room_Scroll_Box/style/Room_Scroll_Box.css";
import type { RoomDTO } from "../../Models/dto";
import bed_photo from "./photo/bed_photo.png";
import bath_photo from "./photo/bath_photo.png";
import wifi_photo from "./photo/wifi_photo.png";
import pool_photo from "./photo/pool_photo.png";
import Room_Scroll_Box_Card from "./Room_Scroll_Box_Card";

type RoomScrollBoxProps = {
    rooms: RoomDTO[];
    roomPhotos: Record<number, string[]>;
    primaryRoomId: number;
};

const Room_Scroll_Box = ({rooms, roomPhotos, primaryRoomId}: RoomScrollBoxProps) => {
    const otherRooms = rooms.filter((room) => room.id !== primaryRoomId);

    if (otherRooms.length === 0) return null;

    return (
        <div className="Room_Scroll_Box_body">
            <div className="Room_Scroll_Box_top">Book</div>
            <div className="Room_Scroll_Box_context">
                {otherRooms.map((room) => (
                        <div className="Room_Scroll_Box_context_card">
            <Room_Scroll_Box_Card
                        key={room.id}
                        room={room}
                        roomPhoto={roomPhotos[room.id]?.[0] ?? "/room-placeholder.svg"}
                        roomDescription={room.description ?? ""}
                        bedPhoto={bed_photo}
                        roomBeds={room.beds}
                        roomWifi={room.wifi}
                        roomWifiPhoto={wifi_photo}
                        roomBath={room.Bath}
                        roomBathPhoto={bath_photo}
                        roomPrivatePool={room.privatePool}
                        roomPrivatePoolPhoto={pool_photo}
                        roomPrice={Number(room.price)}
                    />
        </div>
            ))}
            </div>
        </div>
    );
};

export default Room_Scroll_Box;
