import { useState, useEffect, useRef, useCallback } from "react";
import type { AdvancedSearchDTO, HotelDTO, HotelCardDataDTO } from "../../../Models/dto";
import { advancedSearchHotels, getHotelCardDataBatch } from "../../../Endpoints/HotelEndpoints";
import { useInfiniteScroll } from "../../../utils/useInfiniteScroll";
import HotelCard from "../HotelCard/HotelCard";
import "./ScrollBox.css";

type ScrollBoxProps = {
	filters: AdvancedSearchDTO;
};

const PAGE_SIZE = 10;

const ScrollBox = ({ filters }: ScrollBoxProps) => {
	const [hotels, setHotels] = useState<HotelDTO[]>([]);
	const [cardData, setCardData] = useState<Record<number, HotelCardDataDTO>>({});
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [hasError, setHasError] = useState(false);

	const requestIdRef = useRef(0);
	const containerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const requestId = ++requestIdRef.current;
		setIsLoading(true);
		setHasError(false);
		setHotels([]);
		setCardData({});
		setPage(1);
		setTotalCount(0);

		const loadFirstPage = async () => {
			try {
				const response = await advancedSearchHotels(filters, { el: PAGE_SIZE, page: 1 });
				if (requestIdRef.current !== requestId) return;

				setHotels(response.results);
				setTotalCount(response.count);
				setIsLoading(false);

				if (response.results.length > 0) {
					const ids = response.results.map((h) => h.id);
					try {
						const batch = await getHotelCardDataBatch(ids);
						if (requestIdRef.current !== requestId) return;
						setCardData(batch);
					} catch {
						// card data failed, cards will show loading fallback
					}
				}
			} catch {
				if (requestIdRef.current === requestId) {
					setIsLoading(false);
					setHasError(true);
				}
			}
		};

		void loadFirstPage();
	}, [filters]);

	const hasMore = hotels.length < totalCount;

	const loadNextPage = useCallback(() => {
		if (isLoadingMore || isLoading || hasError) return;

		const requestId = requestIdRef.current;
		const nextPage = page + 1;
		setIsLoadingMore(true);

		(async () => {
			try {
				const response = await advancedSearchHotels(filters, { el: PAGE_SIZE, page: nextPage });
				if (requestIdRef.current !== requestId) return;

				setHotels((prev) => [...prev, ...response.results]);
				setTotalCount(response.count);
				setPage(nextPage);

				if (response.results.length > 0) {
					const ids = response.results.map((h) => h.id);
					try {
						const batch = await getHotelCardDataBatch(ids);
						if (requestIdRef.current !== requestId) return;
						setCardData((prev) => ({ ...prev, ...batch }));
					} catch {
						// card data failed, cards will show loading fallback
					}
				}
			} catch {
				// network error: hasMore stays true, sentinel stays visible, user can retry by scrolling
			} finally {
				if (requestIdRef.current === requestId) {
					setIsLoadingMore(false);
				}
			}
		})();
	}, [filters, isLoadingMore, isLoading, hasError, page]);

	const sentinelRef = useInfiniteScroll({
		onLoadMore: loadNextPage,
		hasMore,
		isLoading: isLoading || isLoadingMore,
		rootRef: containerRef,
	});

	return (
		<section className="hotel-scroll-box" aria-label="Hotels" ref={containerRef}>
			{isLoading && <p className="hotel-scroll-box__status">Loading hotels...</p>}
			{hasError && !isLoading && (
				<p className="hotel-scroll-box__status">Unable to load hotels.</p>
			)}
			{hotels.map((hotel) => (
				<div className="hotel-card-wrapper" key={hotel.id}>
					<HotelCard data={cardData[hotel.id] ?? null} />
				</div>
			))}
			{!isLoading && !hasError && hasMore && (
				<div ref={sentinelRef} className="hotel-scroll-box__sentinel">
					{isLoadingMore && <p className="hotel-scroll-box__status">Loading more...</p>}
				</div>
			)}
		</section>
	);
};

export default ScrollBox;