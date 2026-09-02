import "../Reviews/style/Reviews.css";
import type { User } from "../../Models/User_Model";
import type { Hotel } from "../../Models/Hotel_Model";
import type { Review } from "../../Models/Reviews_Model";
import Review_Card from "./Review_Card";

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
                        <Review_Card key={review.id} review={review} userPhoto={user?.photo} 
                        userName={user?.name} hotelName={hotel?.name} ></Review_Card>
                     ); })}
            </div>
        </div>
    );
};

export default Reviews;