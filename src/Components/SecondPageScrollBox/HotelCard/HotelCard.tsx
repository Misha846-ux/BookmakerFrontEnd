import type { Hotel } from "../../../Models/Hotel_Model";
import "./HotelCard.css";

type HotelCardHotel = Hotel & {
	rating?: number;
	reviews?: number;
	amenities?: string[];
	airportDistance?: string;
	railwayDistance?: string;
	priceFrom?: number;
	currency?: string;
};

type HotelCardProps = {
	hotel: HotelCardHotel;
};

const getImageUrl = (photo: string | undefined) => {
	if (!photo) return undefined;
	if (/^(https?:|data:|blob:)/i.test(photo)) return photo;

	const apiUrl = String(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
	return `${apiUrl}/${photo.replace(/^\/+/, "")}`;
};

const HotelCard = ({hotel}: HotelCardProps) => {
	const rating = hotel.rating ?? 0;
	const amenities = hotel.amenities ?? ["popular", "city centre", "comfortable"];
	const image = getImageUrl(hotel.photo[0]);

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
						<span className="hotel-card__rating-value">{rating || "-"}</span>
						<span className="hotel-card__reviews">
							reviews<br />
							{hotel.reviews ?? 0}
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
					<span>airport {hotel.airportDistance ?? "-"}</span>
					<span>railway station {hotel.railwayDistance ?? "-"}</span>
				</div>

				<div className="hotel-card__map-link">see on the map <span aria-hidden="true">→</span></div>

				<p className="hotel-card__description">{hotel.description}</p>
			</div>

			<div className="hotel-card__price">
				<span>prices from</span>
				<strong>{hotel.priceFrom !== undefined ? `${hotel.priceFrom}${hotel.currency ?? "$"}` : "-"}</strong>
				<button className="hotel-card__choose" type="button">CHOOSE</button>
			</div>
		</article>
	);
};

export default HotelCard;
