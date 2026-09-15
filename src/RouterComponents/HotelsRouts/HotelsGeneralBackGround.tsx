import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import Hero from "../../Components/Hero/Hero";
import MiniHeader from "../../Components/ExtraMainText/MiniHeader/MiniHeader";

const HotelsGeneralBackGround = () => {
	return (
		<>
			<Hero />
			<MiniHeader />
			<Outlet />
			<Footer />
		</>
	);
};

export default HotelsGeneralBackGround;
