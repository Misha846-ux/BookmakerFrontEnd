import "../Reviews/style/Reviews.css";
import type { Review } from "../../Models/Reviews_Model";

type ReviewCardProps = {
    review: Review;
    userPhoto?: string;
    userName?: string;
    hotelName?: string;
};

const Review_Card = ({review, userPhoto, userName, hotelName}: ReviewCardProps) =>{
    return(
        <div className="Review_card"> 
                    <div className="Review_card_top">
                        <img className="Review_img" src={userPhoto}/>
                        <div className="Review_user_and_hotel_names">
                            <div className="Review_user_name"><b>{userName}</b></div>
                            <div className="Review_hotel_name">{hotelName}</div>
                        </div>
                        <div className="Review_time">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="Review_text">{review.review}</div>
                </div>
    );
};

export default Review_Card;