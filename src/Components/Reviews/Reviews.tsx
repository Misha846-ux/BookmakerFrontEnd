import "../Reviews/style/Reviews.css";
import type { MainPageReviewDTO } from "../../Models/dto";
import Review_Card from "./Review_Card";

type ReviewProps = {
    reviews: MainPageReviewDTO[];
};

const Reviews = ({ reviews }: ReviewProps) => {
    return (
        <div className="Reviews_body">
            <div className="Reviews_top">Reviews</div>

            <div className="Reviews_content">
                {reviews.slice(0, 3).map((review) => (
                    <div
                        className="Review_card_container"
                        key={review.id}
                    >
                        <Review_Card review={review} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;