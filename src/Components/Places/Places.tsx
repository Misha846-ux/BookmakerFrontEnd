import "../Places/style/Places.css";
import type { Hotel } from "../../Models/Hotel_Model";
import type { City } from "../../Models/City_Model";
import type { Country } from "../../Models/Country_Model";
import type { Room } from "../../Models/Room_Model";
import Place_Card from "./Place_Card";

 export type PlaceProps = {
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
                <Place_Card key={hotel.id} hotel={hotel} 
                cityName={city?.name} countryName={country?.name} 
                minPrice={minPrice}></Place_Card>
            );
        })}
    </div>
);
}
export default Places;