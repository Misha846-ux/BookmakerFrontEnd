import "../Places/style/Places.css";

import type { HotelDTO } from "../../Models/dto";
import type { CityDTO } from "../../Models/dto";
import type { CountryDTO } from "../../Models/dto";
import type { HotelCardDataDTO } from "../../Models/dto";

import Place_Card from "./Place_Card";

export type PlaceProps = {
    hotels: HotelDTO[];
    cities: CityDTO[];
    countries: CountryDTO[];
    hotelCards: Record<number, HotelCardDataDTO>;
};

const Places = ({
    hotels,
    cities,
    countries,
    hotelCards,
}: PlaceProps) => {
    return (
        <div className="Place_body">
            {hotels.slice(0, 8).map((hotel) => {
                const city = cities.find(
                    (city) => city.id === hotel.city,
                );

                const country = countries.find(
                    (country) => country.id === city?.country,
                );

                const cardData = hotelCards[hotel.id];

                return (
                    <Place_Card
                        key={hotel.id}
                        hotel={hotel}
                        cityName={city?.name}
                        countryName={country?.name}
                        cardData={cardData}
                    />
                );
            })}
        </div>
    );
};

export default Places;