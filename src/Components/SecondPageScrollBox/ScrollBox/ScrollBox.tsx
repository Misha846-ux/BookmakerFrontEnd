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
			} catch {
				if (!aborted) {
					setIsLoading(false);
					setHasError(true);
				}
			}
		};

		void loadHotels();
		return () => { aborted = true; };
	}, [filters]);

	return (
		<section className="hotel-scroll-box" aria-label="Hotels">
			{isLoading && <p className="hotel-scroll-box__status">Loading hotels...</p>}
			{hasError && !isLoading && (
				<p className="hotel-scroll-box__status">Unable to load hotels.</p>
			)}
			{hotels.map((hotel) => (
				<div className="hotel-card-wrapper" key={hotel.id}>
					<HotelCard hotel={hotel} />
				</div>
			))}
		</section>
	);
};

export default ScrollBox;
