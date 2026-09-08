import type { Hotel } from "../../../Models/Hotel_Model";
import data from "../../Temporary_json_files/data.json";
import HotelCard from "../HotelCard/HotelCard";
import "./ScrollBox.css";

const ScrollBox = () => {
	const hotels: Hotel[] = data.hotels;

	return (
		<section className="hotel-scroll-box" aria-label="Hotels">
			{hotels.map((hotel) => (
				<div className="hotel-card-wrapper" key={hotel.id}>
					<HotelCard hotel={hotel} />
				</div>
			))}
		</section>
	);
};

export default ScrollBox;
