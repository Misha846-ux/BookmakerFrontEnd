import { Routes, Route } from "react-router-dom";
import Hotel_Page from "./Components/Hotel_Page/Hotel_Page";
import HotelsGeneralBackGround from "./RouterComponents/HotelsRouts/HotelsGeneralBackGround";
import HotelsMainPage from "./RouterComponents/HotelsRouts/HotelsMainPage";
import HotelsSecondPage from "./RouterComponents/HotelsRouts/HotelsSecondPage";

const Router = () => {
	return (
		<Routes>
			<Route element={<HotelsGeneralBackGround />}>
				<Route path="/" element={<HotelsMainPage />} />
				<Route path="/hotels" element={<HotelsSecondPage />} />
			</Route>
		</Routes>
	);
};

export default Router;
