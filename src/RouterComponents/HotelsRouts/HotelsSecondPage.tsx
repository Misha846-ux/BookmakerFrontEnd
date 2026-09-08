import AsideSideBar from "../../Components/AsideSideBar/AsideSideBar";
import ScrollBox from "../../Components/SecondPageScrollBox/ScrollBox/ScrollBox";
import "./HotelsSecondPage.css";

const HotelsSecondPage = () => {
	return (
		<div className="hotels-second-page">
			<div className="hotels-second-page__content">
				<AsideSideBar />
				<ScrollBox />
			</div>
		</div>
	);
};

export default HotelsSecondPage;
