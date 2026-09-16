import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { AdvancedSearchDTO } from "../../Models/dto";
import AsideSideBar from "../../Components/AsideSideBar/AsideSideBar";
import ScrollBox from "../../Components/SecondPageScrollBox/ScrollBox/ScrollBox";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookies";
import "./HotelsSecondPage.css";

const FILTER_COOKIE = "hotel_search_filters";

function readFiltersFromCookie(): AdvancedSearchDTO {
	const raw = getCookie(FILTER_COOKIE);
	if (!raw) return {};
	try {
		return JSON.parse(raw) as AdvancedSearchDTO;
	} catch {
		return {};
	}
}

function readFiltersFromSearchParams(params: URLSearchParams): AdvancedSearchDTO {
	const filters: AdvancedSearchDTO = {};
	const land = params.get("land");
	const city = params.get("city");
	const checkIn = params.get("checkIn");
	const checkOut = params.get("checkOut");
	const people = params.get("people");
	const nightPrice = params.get("nightPrice");
	const rate = params.get("rate");
	const stars = params.get("stars");
	const wifi = params.get("wifi");

	if (land) filters.land = land;
	if (city) filters.city = city;
	if (checkIn) filters.checkIn = checkIn;
	if (checkOut) filters.checkOut = checkOut;
	if (people) filters.people = Number(people);
	if (nightPrice) filters.nightPrice = Number(nightPrice);
	if (rate) filters.rate = Number(rate);
	if (stars) filters.stars = Number(stars);
	if (wifi === "true") filters.wifi = true;

	return filters;
}

const HotelsSecondPage = () => {
	const [searchParams] = useSearchParams();

	const [filters, setFilters] = useState<AdvancedSearchDTO>(() => {
		const fromUrl = readFiltersFromSearchParams(searchParams);
		const fromCookie = readFiltersFromCookie();
		return { ...fromCookie, ...fromUrl };
	});

	useEffect(() => {
		const hasValues = Object.keys(filters).length > 0;
		if (hasValues) {
			setCookie(FILTER_COOKIE, JSON.stringify(filters));
		} else {
			deleteCookie(FILTER_COOKIE);
		}
	}, [filters]);

	const handleFilterChange = useCallback((next: AdvancedSearchDTO) => {
		setFilters(next);
	}, []);

	return (
		<div className="hotels-second-page">
			<div className="hotels-second-page__content">
				<AsideSideBar filters={filters} onFilterChange={handleFilterChange} />
				<ScrollBox filters={filters} />
			</div>
		</div>
	);
};

export default HotelsSecondPage;
