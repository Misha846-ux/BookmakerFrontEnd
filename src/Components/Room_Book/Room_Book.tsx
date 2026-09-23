import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";
import type { CityDTO, HotelDTO, RoomDTO } from "../../Models/dto";
import btn_photo_1 from "../../Components/Room_Book/photo/btn_photo_1.png"
import btn_photo_2 from "../../Components/Room_Book/photo/btn_photo_2.png"
import photo_map from "../../Components/Room_Book/photo/photo_map.png"
import photo_description_1 from "../../Components/Room_Book/photo/photo_description_1.png"
import photo_description_2 from "../../Components/Room_Book/photo/photo_description_2.png"
import photo_description_3 from "../../Components/Room_Book/photo/photo_description_3.png"
import "../HotelsThirdPage/style//HotelsThirdPage.css"
type RoomBookProps = {
    hotel: HotelDTO;
    city: CityDTO;
    room: RoomDTO;
    roomPhotos: string[];
};

const Room_Book = ({hotel, city, room, roomPhotos}: RoomBookProps) => {
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    const photos = roomPhotos.length > 0 ? roomPhotos : ["/room-placeholder.svg"];

    const nextPhoto = () => {
        setCurrentPhoto(prev => prev === photos.length - 1 ? 0 : prev + 1);
    };

    const previousPhoto = () => {
        setCurrentPhoto(prev => prev === 0 ? photos.length - 1 : prev - 1);
    };

    const bottomPhotos = [1,2,3].map(offset => photos[
        (currentPhoto + offset) % photos.length
    ]);

    const handleOnClick = () =>{
        const dates = checkIn && checkOut
            ? `?checkIn=${checkIn}&checkOut=${checkOut}`
            : "";
        navigate(`/hotel/${hotel.id}/room/${room.id}/first${dates}`)
    }
    return(
        <div className="Room_Book">
        <div className="Room_photos">
                <div className="Room_main_photo">
                    <button className="Room_previous_photo_btn" onClick={previousPhoto}><img src={btn_photo_1}/></button>
                    <img src={photos[currentPhoto]} alt={room.description ?? "Room"}></img>
                    <button className="Room_next_photo_btn" onClick={nextPhoto}><img src={btn_photo_2}/></button>
                </div>
                <div className="Room_bottom_photos">
                    {bottomPhotos.map((photo, index) => (
                        <img key={index} src={photo} onClick={ () =>
                            setCurrentPhoto((currentPhoto + index + 1) % 
                        photos.length)
                        }/>
                    ))}
                </div>
            </div>
            <div className="Room_details">
                    <div className="Room_info">
                        <div className="Room_top">
                            <div className="Room_price_and_address">
                                 <div className="Room_price">
                                    <div className="Room_price_value">{`${room.price}$`}</div>
                                    <div className="Room_price_text">per night</div>
                                 </div>
                                 <div className="Room_address">
                                    <img className="Room_address_img" src={photo_map}/>
                                    <div className="Room_address_text">{hotel.address}</div>
                                    <div>|</div>
                                    <div className="Room_address_city">{city?.name}</div>
                                 </div>
                            </div>
                            <div className="Room_book_btn_box">
                                <button className="Room_book_btn" onClick={handleOnClick}>Book</button>
                            </div>
                        </div>
                        <div className="Room_content">
                            <div className="Room_description">{room.description}</div>
                            <div className="Room_description_photos">
                                <img src={photo_description_1}></img>
                                <img src={photo_description_2}></img>
                                <img src={photo_description_3}></img>
                            </div>
                        </div>
                    </div>
            </div>
            </div>
    );
};

export default Room_Book;