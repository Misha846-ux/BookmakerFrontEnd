import { useState } from "react";
import type { AdvancedSearchDTO } from "../../Models/dto";
import AsideSideBar from "../../Components/AsideSideBar/AsideSideBar";
import ScrollBox from "../../Components/SecondPageScrollBox/ScrollBox/ScrollBox";
import "./HotelsSecondPage.css";

const HotelsSecondPage = () => {
	const [filters, setFilters] = useState<AdvancedSearchDTO>({});

	return (
		<div className="hotels-second-page">
			<div className="hotels-second-page__content">
				<AsideSideBar filters={filters} onFilterChange={setFilters} />
				<ScrollBox filters={filters} />
			</div>
		</div>
	);
};

export default HotelsSecondPage;
