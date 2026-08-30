import "../Places/style/Places.css";
import type { Hotel } from "../../Models/Hotel_Model";
import type { City } from "../../Models/City_Model";
import type { Country } from "../../Models/Country_Model";
import type { Room } from "../../Models/Room_Model";

type PlaceProps = {
    hotels: Hotel[];
    cities: City[];
    countries: Country[];
    rooms: Room[];
};
const Places = ({hotels, cities, countries, rooms}: PlaceProps) =>{
return(
    <div className="Place_body">
        {hotels.slice(0,8).map((hotel)=>{
            const city = cities.find((city)=>city.id === hotel.city);
            const country = countries.find((country) => country.id === city?.country);
            const hotelRooms = rooms.filter((room)=>room.hotel === hotel.id);
            const minPrice = hotelRooms.length > 0 ? Math.min(...hotelRooms.map((room)=> room.price)) : null;
            return(
                <form className="Place_card" key={hotel.id}>
                    <img className="Place_img" src={hotel.photo[0]}/>
                    <div className="Place_top">
                        <div className="Place__hotel_name">{hotel.name} </div>
                        <div>|</div>
                        <div className="Place__city_name">{city?.name} </div>
                        <div>|</div>
                        <div className="Place__country_name">{country?.name}</div>
                    </div>
                    <div className="Place_content">
                        <div className="Place_stars"><b>{"★".repeat(hotel.stars)}</b></div>
                        <div className="Place_city_center">the city center: 116 m</div>
                        <div className="Place_price"> {minPrice !== null ? `$ ${minPrice}` : "No rooms"}</div>
                    </div>
                </form>
            );
        })}
    </div>
);
}
export default Places;