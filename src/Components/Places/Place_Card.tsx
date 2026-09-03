import type { Hotel } from "../../Models/Hotel_Model";
import "../Places/style/Places.css";
import {useNavigate} from "react-router-dom";

type PlaceCardProps = {
    hotel: Hotel;
    cityName?: string; 
    countryName?: string; 
    minPrice: number | null;
};
const Place_Card = ({hotel, cityName, countryName, minPrice}: PlaceCardProps)=> {
    const navigate = useNavigate();

    const handleClick = () =>{
        navigate(`/hotel/${hotel.id}`);
    };
    return(
        <div className="Place_card" onClick={handleClick}>
                    <img className="Place_img" src={hotel.photo[0]}/>
                    <div className="Place_top">
                        <div className="Place__hotel_name">{hotel.name} </div>
                        <div>|</div>
                        <div className="Place__city_name">{cityName} </div>
                        <div>|</div>
                        <div className="Place__country_name">{countryName}</div>
                    </div>
                    <div className="Place_content">
                        <div className="Place_stars"><b>{"★".repeat(hotel.stars)}</b></div>
                        <div className="Place_city_center">the city center: 116 m</div>
                        <div className="Place_price"> {minPrice !== null ? `$ ${minPrice}` : "No rooms"}</div>
                    </div>
                </div>
    );
};

export default Place_Card;