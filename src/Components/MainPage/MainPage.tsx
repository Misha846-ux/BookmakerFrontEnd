import "./MainPage.css";
import { useEffect, useState } from "react";

import Places from "../Places/Places";
import Reviews from "../Reviews/Reviews";
import SafeWithUs from "../ExtraMainText/SafeWithUs/SafeWithUs";
import BeOurRegular from "../ExtraMainText/BeOurRegular/BeOurRegular";
import RegisterAccountButton from "../RegisterAccountButton/RegisterAccountButton";
import type { CityDTO, CountryDTO, HotelCardDataDTO, HotelDTO, MainPageReviewDTO } from "../../Models/dto";
import { getHotelCardDataBatch, getHotels } from "../../Endpoints/HotelEndpoints";
import { getCities } from "../../Endpoints/CityEndpoints";
import { getCountries } from "../../Endpoints/CountryEndpoints";
import { getLatestReviews } from "../../Endpoints/ReviewEndpoints";

const MainPage = () => {
    const [hotels, setHotels] = useState<HotelDTO[]>([]);
    const [cities, setCities] = useState<CityDTO[]>([]);
    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [hotelCards, setHotelCards] = useState<Record<number, HotelCardDataDTO>>({});
    const [reviews, setReviews] = useState<MainPageReviewDTO[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMainPage = async () => {
            try {
                setLoading(true);
                setError(null);

                const [
                    hotelsResponse,
                    citiesResponse,
                    countriesResponse,
                    reviewsResponse,
                ] = await Promise.all([
                    getHotels(
                        {},
                        {
                            el: 8,
                            page: 1,
                        },
                    ),
                    getCities(),
                    getCountries(),
                    getLatestReviews(), 
                ]);

                const loadedHotels = hotelsResponse.results;

                setHotels(loadedHotels);
                setCities(citiesResponse);
                setCountries(countriesResponse);
                setReviews(reviewsResponse.results);

                if (loadedHotels.length > 0) {
                    const hotelIds = loadedHotels.map(
                        (hotel) => hotel.id,
                    );

                    const cardData = await getHotelCardDataBatch(
                        hotelIds,
                    );

                    setHotelCards(cardData);
                }
            } catch (error) {
                console.error("Failed to load MainPage:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load data",
                );
            } finally {
                setLoading(false);
            }
        };

        loadMainPage();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Failed to load data: {error}</div>;
    }

    return (
        <div className="main_page">
            <Places
                hotels={hotels}
                cities={cities}
                countries={countries}
                hotelCards={hotelCards}
            />

            <Reviews reviews={reviews}/>

            <SafeWithUs />
            <BeOurRegular />
            <RegisterAccountButton />
        </div>
    );
};

export default MainPage;