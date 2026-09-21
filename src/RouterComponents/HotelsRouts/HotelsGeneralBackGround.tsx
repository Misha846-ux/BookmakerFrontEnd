import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import Hero from "../../Components/Hero/Hero";
import MiniHeader from "../../Components/ExtraMainText/MiniHeader/MiniHeader";

type HotelsGeneralBackGroundProps = {
	showSearch?: boolean;
};

const HotelsGeneralBackGround = ({showSearch = true}: HotelsGeneralBackGroundProps) => {
	return (
		<>
			{showSearch && <Hero />}
			{showSearch && <MiniHeader />}
			<Outlet />
			<Footer />
		</>
	);
};

export default HotelsGeneralBackGround;
