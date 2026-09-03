import {useParams} from "react-router-dom";
import {useState} from "react";
import data from "../Temporary_json_files/data.json";
import "./style/Hotel_Page.css"
import type {Room} from "../../Models/Room_Model";
import type {Hotel} from "../../Models/Hotel_Model";
import type {City} from "../../Models/City_Model";
import type { User } from "../../Models/User_Model";
import type { Review } from "../../Models/Reviews_Model";
import btn_photo_1 from "../../Components/Hotel_Page/photo/btn_photo_1.png"
import btn_photo_2 from "../../Components/Hotel_Page/photo/btn_photo_2.png"
import photo_map from "../../Components/Hotel_Page/photo/photo_map.png"
import photo_next_btn from "../../Components/Hotel_Page/photo/photo_next_btn.png"
import photo_description_1 from "../../Components/Hotel_Page/photo/photo_description_1.png"
import photo_description_2 from "../../Components/Hotel_Page/photo/photo_description_2.png"
import photo_description_3 from "../../Components/Hotel_Page/photo/photo_description_3.png"
import Review_Card from "../Reviews/Review_Card";


const Hotel_Page = () => {
    const {hotel_id} = useParams();

    const hotel = data.hotels.find(hotel => hotel.id === Number(hotel_id));

    const [currentPhoto, setCurrentPhoto] = useState(0);

    const [currentReview, setCurrentReview] = useState(0);
    
    if(!hotel){
        return <div>Hotel not found</div>;
    };

    const hotelRooms = data.rooms.filter(room => room.hotel === hotel.id);

    const hotelReviews = data.reviews.filter(review => review.hotel === hotel.id);

    const room: Room | undefined = hotelRooms[0];

    const city: City | undefined = data.cities.find(city => city.id === hotel.city);

    if (!room) { 
        return <div>No rooms found</div>; 
    };

    const nextPhoto = () => {
        setCurrentPhoto(prev => prev === room.photo.length - 1 ? 0 : prev + 1);
    };

    const previousPhoto = () => {
        setCurrentPhoto(prev => prev === 0 ? room.photo.length - 1 : prev - 1);
    };

    const nextReview = () => {
            setCurrentReview(prev => prev === hotelReviews.length - 1 ? 0 : prev + 1);
    };

    const bottomPhotos = [1,2,3].map(offset => room.photo[
        (currentPhoto + offset) % room.photo.length
    ]);

    const review: Review | undefined = hotelReviews[currentReview];

    const reviewUser: User | undefined = review ? data.users.find(
        user => user.id ===review.user) : undefined;

    return(
        <div className="Hotel_Page_body">
            <div className="Room_photos">
                <div className="Room_main_photo">
                    <button className="Room_previous_photo_btn" onClick={previousPhoto}><img src={btn_photo_1}/></button>
                    <img src={room.photo[currentPhoto]}></img>
                    <button className="Room_next_photo_btn" onClick={nextPhoto}><img src={btn_photo_2}/></button>
                </div>
                <div className="Room_bottom_photos">
                    {bottomPhotos.map((photo, index) => (
                        <img key={index} src={photo} onClick={ () =>
                            setCurrentPhoto((currentPhoto + index + 1) % 
                        room.photo.length)
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
                                <button className="Room_book_btn">Book</button>
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
                    <div className="Room_line"></div>
                    <div className="Hotel_reviews"> 
                        {review && ( 
                            <div className="Room_review"> 
                            <Review_Card review={review} userPhoto={reviewUser?.photo}
                             userName={reviewUser?.name} hotelName={hotel.name} />
                            <button className="Next_review_btn" onClick={nextReview} >
                                <img src={photo_next_btn}/>
                                </button> 
                            </div> 
                            )} 
                    </div>
            </div>
        </div>
    );
};

export default Hotel_Page;