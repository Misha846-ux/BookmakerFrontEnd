import "../Reviews/style/Reviews.css";
import { useEffect, useState } from "react";
import { getHotelCardData } from "../../Endpoints/HotelEndpoints";
import { apiRequest } from "../../Endpoints/apiRequest";
import type { ReviewDTO, UserDTO } from "../../Models/dto";

type ReviewCardProps = {
    review: ReviewDTO;
};

const Review_Card = ({ review }: ReviewCardProps) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [hotelName, setHotelName] = useState<string>("");

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            apiRequest<UserDTO>(`/user/${review.user}/profile`, { method: "GET" }),
            getHotelCardData(review.hotel),
        ])
            .then(([userData, hotelData]) => {
                if (cancelled) return;
                setUser(userData);
                setHotelName(hotelData.hotel.name);
            })
            .catch(() => {
                if (!cancelled) setHotelName(`Hotel #${review.hotel}`);
            });

        return () => {
            cancelled = true;
        };
    }, [review.hotel, review.user]);

    const userName = user?.name ?? `Guest #${review.user}`;
    const userPhoto = user?.photo ?? "";
    const displayedHotelName = hotelName || `Hotel #${review.hotel}`;

    return (
        <div className="Review_card">
            <div className="Review_card_top">
                <img
                    className="Review_img"
                    src={userPhoto ?? ""}
                    alt={userName}
                />

                <div className="Review_user_and_hotel_names">
                    <div className="Review_user_name">
                        <b>{userName}</b>
                    </div>

                    <div className="Review_hotel_name">
                        {displayedHotelName}
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