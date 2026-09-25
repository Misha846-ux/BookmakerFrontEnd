// import "./style/HotelsThirdPage.css"
// import Room_Book from "../Room_Book/Room_Book";
// import Room_Scroll_Box from "../Room_Scroll_Box/Room_Scroll_Box";
// import Hotels_NearBy from "../Hotels_NearBy/Hotels_NearBy";
// import Room_top from "../Room_top/Room_top";
// import data from "../Temporary_json_files/data.json";
// import CommentsGrid from "../CommentsGrid/CommentsGrid";
// import { useParams } from "react-router-dom";
// import { useState } from "react";
// const HotelsThirdPage = () => {
//     const { hotel_id } = useParams();
//     const hotelId = Number(hotel_id);
//     const reviews = data.reviews;
//     const users = data.users;
//     const hotels = data.hotels;
//     const cities = data.cities;
//     const countries = data.countries;
//     const rooms = data.rooms;
    
//     const hotelRooms = data.rooms.filter(
//         room => room.hotel === hotelId
//     );
//     const [selectedRoom, setSelectedRoom] = useState(hotelRooms[0]);

//      if (!selectedRoom) {
//         return <div>No rooms found</div>;
//     }


//     const hotel = hotels.find((h) => h.id === hotelId);
//     if (!hotel) {
//     return <div className="Hotel_Page_body">Отель не найден</div>;

//   }
//     return(
//         <div className="Hotel_Page_body">
//            <Room_top/>
//            <Room_Book room={selectedRoom}/>
//            <Room_Scroll_Box 
//                 rooms={hotelRooms}
//                 selectedRoomId={selectedRoom.id}
//                 onChooseRoom={setSelectedRoom}/>
//            <CommentsGrid reviews={reviews} users={users} hotels={hotels} hotelId={hotelId} />
//            <Hotels_NearBy hotels={hotels} cities={cities} countries={countries} rooms={rooms}/>

//         </div>
//     );
// };

// export default HotelsThirdPage;

// export { default } from "../../RouterComponents/RoomsPage/RoomsPage";

