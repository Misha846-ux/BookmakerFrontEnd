import type { HotelCardDataDTO } from "../../../Models/dto";
import "./HotelCard.css";

type HotelCardProps = {
	data: HotelCardDataDTO | null;
};

const HotelCard = ({ data }: HotelCardProps) => {
	if (!data) {
		return <article className="hotel-card hotel-card--loading"><p>Loading...</p></article>;
	}

	const { hotel, photos, nearest_airport_distance, nearest_train_distance, review_count, average_rating, cheapest_room_price, cheapest_room_beds, cheapest_room_wifi } = data;
	const imageUrl = photos[0]?.photo;

	const formatDistance = (meters: number | null) => {
		if (meters === null) return "-";
		return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
	};

	const amenities: string[] = [];
	if (hotel.stars >= 4) amenities.push("popular");
	amenities.push("city centre");
	if (cheapest_room_wifi) amenities.push("Wi-Fi");
	if (cheapest_room_beds && cheapest_room_beds >= 2) amenities.push("comfortable");

	return (
		<article className="hotel-card">
			<div className="hotel-card__image-wrapper">
				{imageUrl && (
					<img
						className="hotel-card__image"
						src={imageUrl}
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
						<span className="hotel-card__rating-value">{average_rating ?? "-"}</span>
						<span className="hotel-card__reviews">
							reviews<br />
							{review_count}
						</span>
					</div>
				</div>

				<div className="hotel-card__amenities">
					{amenities.map((amenity) => (
						<span className="hotel-card__amenity" key={amenity}>
							<span className="hotel-card__amenity-icon" aria-hidden="true">◇</span>
							{amenity}
						</span>
					))}
				</div>

				<div className="hotel-card__distances">
					<span>airport {formatDistance(nearest_airport_distance)}</span>
					<span>railway station {formatDistance(nearest_train_distance)}</span>
				</div>

				<div className="hotel-card__map-link">see on the map <span aria-hidden="true">→</span></div>

				<p className="hotel-card__description">{hotel.description}</p>
			</div>

			<div className="hotel-card__price">
				<span>prices from</span>
				<strong>{cheapest_room_price !== null ? `${cheapest_room_price}$` : "-"}</strong>
				<button className="hotel-card__choose" type="button">CHOOSE</button>
			</div>
		</article>
	);
};

export default HotelCard;
