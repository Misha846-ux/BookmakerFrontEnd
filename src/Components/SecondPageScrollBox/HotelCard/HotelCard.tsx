import { useEffect, useState } from "react";
import type { HotelDTO } from "../../../Models/dto";
import {
	getHotelNearestAirport,
	getHotelNearestTrainStation,
	getHotelPhotos,
	getHotelReviews,
	getHotelRooms,
} from "../../../Endpoints/HotelEndpoints";
import "./HotelCard.css";

type HotelCardProps = {
	hotel: HotelDTO;
};

const HotelCard = ({hotel}: HotelCardProps) => {
	const [image, setImage] = useState<string>();
	const [airportDistance, setAirportDistance] = useState<string>();
	const [railwayDistance, setRailwayDistance] = useState<string>();
	const [priceFrom, setPriceFrom] = useState<number>();
	const [rating, setRating] = useState<number>();
	const [reviewCount, setReviewCount] = useState(0);

	useEffect(() => {
		let active = true;
		setImage(undefined);
		setAirportDistance(undefined);
		setRailwayDistance(undefined);
		setPriceFrom(undefined);
		setRating(undefined);
		setReviewCount(0);

		getHotelPhotos(hotel.id)
			.then((data) => {
				if (active) setImage(data.photos[0]?.photo);
			})
			.catch(() => undefined);

		getHotelNearestAirport(hotel.id)
			.then((data) => {
				if (active) setAirportDistance(String(data.distance));
			})
			.catch(() => undefined);

		getHotelNearestTrainStation(hotel.id)
			.then((data) => {
				if (active) setRailwayDistance(String(data.distance));
			})
			.catch(() => undefined);

		getHotelReviews(hotel.id)
			.then((data) => {
				if (!active) return;
				setReviewCount(data.count);
				if (data.count > 0) {
					const average = data.results.reduce(
						(total, review) => total + review.rating,
						0,
					) / data.count;
					setRating(Number(average.toFixed(1)));
				}
			})
			.catch(() => undefined);

		getHotelRooms(hotel.id, { el: 1, page: 1 })
			.then((data) => {
				if (!active || data.results.length === 0) return;
				setPriceFrom(Number(data.results[0].price));
			})
			.catch(() => undefined);

		return () => {
			active = false;
		};
	}, [hotel.id]);

	return (
		<article className="hotel-card">
			<div className="hotel-card__image-wrapper">
				{image && (
					<img
						className="hotel-card__image"
						src={image}
						alt={hotel.name}
						loading="lazy"
						decoding="async"
						onError={(event) => { event.currentTarget.style.display = "none"; }}
					/>
				)}
			</div>

			<div className="hotel-card__content">
				<div className="hotel-card__header">
					<div>
						<h2 className="hotel-card__name">{hotel.name}</h2>
						<div className="hotel-card__stars" aria-label={`${hotel.stars} stars`}>
							{"★".repeat(hotel.stars)}
						</div>
					</div>
					<div className="hotel-card__rating">
						<span className="hotel-card__rating-value">{rating ?? "-"}</span>
						<span className="hotel-card__reviews">
							reviews<br />
							{reviewCount}
						</span>
					</div>
				</div>

				<div className="hotel-card__amenities">
					{["popular", "city centre", "comfortable"].map((amenity) => (
						<span className="hotel-card__amenity" key={amenity}>
							<span className="hotel-card__amenity-icon" aria-hidden="true">◇</span>
							{amenity}
						</span>
					))}
				</div>

				<div className="hotel-card__distances">
					<span>airport {airportDistance ?? "-"}</span>
					<span>railway station {railwayDistance ?? "-"}</span>
				</div>

				<div className="hotel-card__map-link">see on the map <span aria-hidden="true">→</span></div>

				<p className="hotel-card__description">{hotel.description}</p>
			</div>

			<div className="hotel-card__price">
				<span>prices from</span>
				<strong>{priceFrom !== undefined ? `${priceFrom}$` : "-"}</strong>
				<button className="hotel-card__choose" type="button">CHOOSE</button>
			</div>
		</article>
	);
};

export default HotelCard;
