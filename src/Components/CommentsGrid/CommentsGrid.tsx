import { useState } from "react";
import "./CommentsGrid.css";
import type { HotelDTO, ReviewDTO } from "../../Models/dto";
import Review_Card from "../Reviews/Review_Card";

type CommentsGridProps = {
  reviews: ReviewDTO[];
  hotel: HotelDTO;
};

const CommentsGrid = ({ reviews, hotel }: CommentsGridProps) => {
  const [visibleCount, setVisibleCount] = useState<number>(9);

  const visibleReviews = reviews.slice(0, visibleCount);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 9);

  return (
    <div className="Reviews_body Comments_body_grid">
      <div className="Reviews_top">COMMENTS</div>

      <div className="Reviews_content Comments_content_grid">
        {visibleReviews.map((review) => {
          return (
            <div className="Review_card_container" key={review.id}>
              <Review_Card
                review={review}
                userName={`Guest #${review.user}`}
                hotelName={hotel.name}
              />
            </div>
          );
        })}
      </div>

      {visibleCount < reviews.length && (
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