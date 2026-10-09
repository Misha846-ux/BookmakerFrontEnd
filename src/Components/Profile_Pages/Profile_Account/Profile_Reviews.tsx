import "./style/Profile_Review.css";
import no_reviews_photo from "./photos/no_reviews_photo.png";
import { useCallback, useEffect, useState } from "react";
import { getMyReviews } from "../../../Endpoints/ReviewEndpoints";
import { apiErrorMessage } from "../../../utils/apiError";
import type { MyReviewDTO } from "../../../Models/dto";

const formatReviewDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString();
};

const Profile_Review = () => {
    const [reviews, setReviews] = useState<MyReviewDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadReviews = useCallback(async () => {
        try {
            setError(null);
            const response = await getMyReviews();
            setReviews(response.results ?? []);
        } catch (err) {
            setError(apiErrorMessage(err, "Unable to load your reviews."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadReviews();
    }, [loadReviews]);

    return (
        <div className="Profile_Review_body">
            <div className="Profile_Review_top">YOUR REVIEWS</div>
            {isLoading ? (
                <div className="Profile_Review_context">
                    <div className="Profile_Review_text">Loading...</div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="Profile_Review_context">
                    {error ? (
                        <div className="Profile_Review_error">{error}</div>
                    ) : (
                        <>
                            <img className="Profile_Review_img" src={no_reviews_photo} alt="" />
                            <div className="Profile_Review_text">You have no reviews</div>
                        </>
                    )}
                </div>
            ) : (
                <div className="Profile_Review_list">
                    {error && <div className="Profile_Review_error">{error}</div>}
                    {reviews.map((review) => (
                        <div className="Profile_Review_card" key={review.id}>
                            <div className="Profile_Review_card_top">
                                <div className="Profile_Review_card_hotel">
                                    {review.hotel.name}
                                    <span className="Profile_Review_card_stars">
                                        {"★".repeat(Math.max(0, Math.min(5, review.hotel.stars)))}
                                    </span>
                                </div>
                                <div className="Profile_Review_card_rating">
                                    {"★".repeat(Math.max(0, Math.min(5, review.rating)))}
                                    {"☆".repeat(Math.max(0, 5 - Math.min(5, review.rating)))}
                                </div>
                                <div className="Profile_Review_card_date">
                                    {formatReviewDate(review.createdAt)}
                                </div>
                            </div>
                            <div className="Profile_Review_card_text">{review.review}</div>
                            <div className="Profile_Review_card_place">
                                {[review.hotel.city, review.hotel.country].filter(Boolean).join(", ")}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile_Review;
