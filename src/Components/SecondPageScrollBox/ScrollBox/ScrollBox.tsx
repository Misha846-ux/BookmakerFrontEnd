import { useState, useEffect } from "react";
import type { AdvancedSearchDTO, HotelDTO, HotelCardDataDTO } from "../../../Models/dto";
import { advancedSearchHotels, getHotelCardDataBatch } from "../../../Endpoints/HotelEndpoints";
import HotelCard from "../HotelCard/HotelCard";
import "./ScrollBox.css";

type ScrollBoxProps = {
	filters: AdvancedSearchDTO;
};

const ScrollBox = ({ filters }: ScrollBoxProps) => {
	const [hotels, setHotels] = useState<HotelDTO[]>([]);
	const [cardData, setCardData] = useState<Record<number, HotelCardDataDTO>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		let aborted = false;
		setIsLoading(true);
		setHasError(false);
		setCardData({});

		const loadHotels = async () => {
			try {
				const response = await advancedSearchHotels(filters, { el: 30, page: 1 });
				if (aborted) return;

				setHotels(response.results);
				setIsLoading(false);

				if (response.results.length > 0) {
					const ids = response.results.map((h) => h.id);
					try {
						const batch = await getHotelCardDataBatch(ids);
						if (!aborted) setCardData(batch);
					} catch {
						// card data failed, cards will show loading fallback
					}
				}
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
					<HotelCard data={cardData[hotel.id] ?? null} />
				</div>
			))}
		</section>
	);
};

export default ScrollBox;
