import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";

const HotelsGeneralBackGround = () => {
	return (
		<>
			<Outlet />
			<Footer />
		</>
	);
};

export default HotelsGeneralBackGround;
