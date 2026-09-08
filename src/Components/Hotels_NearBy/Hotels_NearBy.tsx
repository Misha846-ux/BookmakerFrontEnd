import { useState } from "react";
import "../Hotels_NearBy/style/Hotels_NearBy.css";
import Place_Card from "../Places/Place_Card";
import type { PlaceProps } from "../Places/Places";

const Hotels_NearBy =({hotels, cities, countries, rooms}: PlaceProps) =>{
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    return(
        <div className="Hotels_NearBy_body">
            <div className="Hotels_NearBy_top">Hotels NearBy</div>
            <div className="Hotels_NearBy_context">
            {hotels.filter((hotel) => hotel.id !== selectedHotelId)
            .map((hotel)=>{
            const city = cities.find((city)=>city.id === hotel.city);
            const country = countries.find((country) => country.id === city?.country);
            const hotelRooms = rooms.filter((room)=>room.hotel === hotel.id);
            const minPrice = hotelRooms.length > 0 ? Math.min(...hotelRooms.map((room)=> room.price)) : null;
            return(
                <Place_Card key={hotel.id} hotel={hotel} 
                cityName={city?.name} countryName={country?.name} 
                minPrice={minPrice} onSelect={()=> setSelectedHotelId(hotel.id)}></Place_Card>
            );
            })
            }
            </div>
        </div>
    );
};

export default Hotels_NearBy;