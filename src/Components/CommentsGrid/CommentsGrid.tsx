import { useState } from "react";
import "./CommentsGrid.css";
import type { User } from "../../Models/User_Model";
import type { Hotel } from "../../Models/Hotel_Model";
import type { Review } from "../../Models/Reviews_Model";
import Review_Card from "../Reviews/Review_Card";

type CommentsGridProps = {
  reviews: Review[];
  users: User[];
  hotels: Hotel[];
  hotelId?: number;
};

const CommentsGrid = ({ reviews, users, hotels, hotelId }:CommentsGridProps)=> {
  const [visibleCount, setVisibleCount] = useState<number>(9);

  const filteredReviews = hotelId
    ? reviews.filter((review) => review.hotel === hotelId)
    : reviews;

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 9);

  return (
    <div className="Reviews_body Comments_body_grid">
      <div className="Reviews_top">COMMENTS</div>

      <div className="Reviews_content Comments_content_grid">
        {visibleReviews.map((review) => {
          const user = users.find((u) => u.id === review.user);
          const hotel = hotels.find((h) => h.id === review.hotel);

          return (
            <div className="Review_card_container" key={review.id}>
              <Review_Card
                review={review}
                userPhoto={user?.photo}
                userName={user?.name}
                hotelName={hotel?.name}
              />
            </div>
          );
        })}
      </div>

      {visibleCount < filteredReviews.length && (
        <div className="Comments_more_container">
          <button className="Comments_more_btn" onClick={handleLoadMore}>
            more
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6 6L11 1" stroke="#8A3FFC" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsGrid;