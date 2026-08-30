import "../Reviews/style/Reviews.css";
import type { User } from "../../Models/User_Model";
import type { Hotel } from "../../Models/Hotel_Model";
import type { Review } from "../../Models/Reviews_Model";

type ReviewProps = {
    reviews: Review[];
    users: User[];
    hotels: Hotel[];
};
const Reviews = ({reviews, users, hotels}: ReviewProps) =>{
    return(
        <div className="Reviews_body">
            <div className="Reviews_top">Reviews</div>
            <div className="Reviews_content">
                {reviews.slice(0, 3).map((review) => { 
                    const user = users.find((user) => user.id === review.user); 
                    const hotel = hotels.find((hotel) => hotel.id === review.hotel); 
                    return ( 
                    <div className="Review_card" key={review.id}> 
                    <div className="Review_card_top">
                        <img className="Review_img" src={user?.photo}/>
                        <div className="Review_user_and_hotel_names">
                            <div className="Review_user_name"><b>{user?.name}</b></div>
                            <div className="Review_hotel_name">{hotel?.name}</div>
                        </div>
                        <div className="Review_time">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="Review_text">{review.review}</div>
                </div> ); })}
            </div>
        </div>
    );
};

export default Reviews;