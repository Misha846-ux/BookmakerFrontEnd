import { useState, useEffect } from "react";
import type { AdvancedSearchDTO, HotelDTO } from "../../../Models/dto";
import { advancedSearchHotels } from "../../../Endpoints/HotelEndpoints";
import HotelCard from "../HotelCard/HotelCard";
import "./ScrollBox.css";

type ScrollBoxProps = {
	filters: AdvancedSearchDTO;
};

const ScrollBox = ({ filters }: ScrollBoxProps) => {
	const [hotels, setHotels] = useState<HotelDTO[]>([]);

	useEffect(() => {
		let aborted = false;
		advancedSearchHotels(filters, { el: 30, page: 1 })
			.then((data) => { if (!aborted) setHotels(data); })
			.catch(() => { if (!aborted) setHotels([]); });
		return () => { aborted = true; };
	}, [JSON.stringify(filters)]);

	return (
		<section className="hotel-scroll-box" aria-label="Hotels">
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
					}} />
				</div>
			))}
		</section>
	);
};

export default ScrollBox;
