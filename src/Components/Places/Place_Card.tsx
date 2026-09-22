import type { HotelDTO, HotelCardDataDTO } from "../../Models/dto";
import "../Places/style/Places.css";
import { useNavigate } from "react-router-dom";

type PlaceCardProps = {
    hotel: HotelDTO;
    cityName?: string;
    countryName?: string;
    cardData?: HotelCardDataDTO;
    onSelect?: () => void;
};

const Place_Card = ({
    hotel,
    cityName,
    countryName,
    cardData,
    onSelect,
}: PlaceCardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onSelect?.();
        navigate(`/hotel/${hotel.id}`);
    };

    const minPrice =
        cardData?.cheapest_room_price !== null &&
        cardData?.cheapest_room_price !== undefined
            ? Number(cardData.cheapest_room_price)
            : null;

    return (
        <div className="Place_card" onClick={handleClick}>

            <img
                className="Place_img"
                src={cardData?.photos?.[0]?.photo ?? ""}
                alt={hotel.name}
            />

            <div className="Place_top">
                <div className="Place__hotel_name">
                    {hotel.name}
                </div>

                <div className="Place__location">
                    <span className="Place__city_name">
                        {cityName}
                    </span>

                    <span className="Place_separator">,</span>

                    <span className="Place__country_name">
                        {countryName}
                    </span>
                </div>
            </div>
                        
            <div className="Place_content">

                <div className="Place_stars">
                    <b>
                        {"★".repeat(hotel.stars)}
                    </b>
                </div>

                <div className="Place_city_center">
                    the city center: 116 m
                </div>

                <div className="Place_price">
                    {minPrice !== null
                        ? `$ ${minPrice}`
                        : "No rooms"}
                </div>

            </div>

        </div>
    );
};

export default Place_Card;