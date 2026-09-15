import { useEffect, useState } from "react";
import type { HotelDTO, PhotosResponse } from "../../../Models/dto";
import {
	getHotelNearestAirport,
	getHotelNearestTrainStation,
	getHotelPhotos,
	getHotelRooms,
} from "../../../Endpoints/HotelEndpoints";
import "./HotelCard.css";

type HotelCardProps = {
	hotel: HotelDTO;
};

const HotelCard = ({hotel}: HotelCardProps) => {
	const [image, setImage] = useState<File>();
	const [airportDistance, setAirportDistance] = useState<string>();
	const [railwayDistance, setRailwayDistance] = useState<string>();
	const [priceFrom, setPriceFrom] = useState<number>();

	return (
		<article className="hotel-card">
			<div className="hotel-card__image-wrapper">
				{image && (
					<img
						className="hotel-card__image"
						src={image}
						alt={hotel.name}
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
						<span className="hotel-card__rating-value">-</span>
						<span className="hotel-card__reviews">
							reviews<br />
							0
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
