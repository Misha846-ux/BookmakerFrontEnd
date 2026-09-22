import "../Reviews/style/Reviews.css";
import type { MainPageReviewDTO } from "../../Models/dto";

type ReviewCardProps = {
    review: MainPageReviewDTO;
};

const Review_Card = ({ review }: ReviewCardProps) => {
    return (
        <div className="Review_card">
            <div className="Review_card_top">
                <img
                    className="Review_img"
                    src={review.user.photo ?? ""}
                    alt={review.user.name}
                />

                <div className="Review_user_and_hotel_names">
                    <div className="Review_user_name">
                        <b>{review.user.name}</b>
                    </div>

                    <div className="Review_hotel_name">
                        {review.hotel.name}
                    </div>
                </div>

                <div className="Review_time">
                    {new Date(review.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="Review_text">
                {review.review}
            </div>
        </div>
    );
};

export default Review_Card;