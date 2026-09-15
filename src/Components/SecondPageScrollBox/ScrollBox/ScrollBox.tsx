import { useState, useEffect } from "react";
import type { AdvancedSearchDTO, HotelDTO } from "../../../Models/dto";
import {
	advancedSearchHotels,
	getHotelNearestAirport,
	getHotelNearestTrainStation,
	getHotelRooms,
} from "../../../Endpoints/HotelEndpoints";
import HotelCard from "../HotelCard/HotelCard";
import "./ScrollBox.css";

type ScrollBoxProps = {
	filters: AdvancedSearchDTO;
};

type HotelCardData = HotelDTO & {
	priceFrom?: number;
	airportDistance?: string;
	railwayDistance?: string;
};

const getMinimumRoomPrice = async (hotelId: number) => {
	try {
		const rooms = await getHotelRooms(hotelId, { el: 30, page: 1 });
		const prices = rooms.results
			.map((room) => Number(room.price))
			.filter((price) => Number.isFinite(price));

		return prices.length > 0 ? Math.min(...prices) : undefined;
	} catch {
		return undefined;
	}
};

const getDistance = async (
	request: (hotelId: number) => Promise<{ distance: number }>,
	hotelId: number,
) => {
	try {
		const place = await request(hotelId);
		return `${place.distance} km`;
	} catch {
		return undefined;
	}
};

const ScrollBox = ({ filters }: ScrollBoxProps) => {
	const [hotels, setHotels] = useState<HotelCardData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		let aborted = false;
		setIsLoading(true);
		setHasError(false);

		const loadHotels = async () => {
			try {
				const result = await advancedSearchHotels(filters, { el: 30, page: 1 });
				if (aborted) return;

				setHotels(result);
				setIsLoading(false);

				const enrichedHotels = await Promise.all(
					result.map(async (hotel) => {
						const [priceFrom, airportDistance, railwayDistance] = await Promise.all([
							getMinimumRoomPrice(hotel.id),
							getDistance(getHotelNearestAirport, hotel.id),
							getDistance(getHotelNearestTrainStation, hotel.id),
						]);

						return { ...hotel, priceFrom, airportDistance, railwayDistance };
					}),
				);

				if (!aborted) setHotels(enrichedHotels);
			} catch {
				if (!aborted) {
					setIsLoading(false);
					setHasError(true);
				}
			}
		};

		void loadHotels();
		return () => { aborted = true; };
	}, [JSON.stringify(filters)]);

	return (
		<section className="hotel-scroll-box" aria-label="Hotels">
			{isLoading && <p className="hotel-scroll-box__status">Loading hotels...</p>}
			{hasError && !isLoading && (
				<p className="hotel-scroll-box__status">Unable to load hotels.</p>
			)}
			{hotels.map((hotel) => (
				<div className="hotel-card-wrapper" key={hotel.id}>
					<HotelCard hotel={{
						id: hotel.id,
						name: hotel.name,
						address: hotel.address,
						phonenumber: hotel.phone,
						email: hotel.email,
						stars: hotel.stars,
						city: hotel.city,
						photo: hotel.photo ? [hotel.photo] : [],
						description: hotel.description ?? "",
						priceFrom: hotel.priceFrom,
						airportDistance: hotel.airportDistance,
						railwayDistance: hotel.railwayDistance,
					}} />
				</div>
			))}
		</section>
	);
};

export default ScrollBox;
