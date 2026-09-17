import { Routes, Route } from "react-router-dom";
import HotelsGeneralBackGround from "./RouterComponents/HotelsRouts/HotelsGeneralBackGround";
import HotelsMainPage from "./RouterComponents/HotelsRouts/HotelsMainPage";
import HotelsSecondPage from "./RouterComponents/HotelsRouts/HotelsSecondPage";
import RoomsPage from "./RouterComponents/RoomsPage/RoomsPage";

const Router = () => {
	return (
		<Routes>
			<Route element={<HotelsGeneralBackGround />}>
				<Route path="/" element={<HotelsMainPage />} />
				<Route path="/hotels" element={<HotelsSecondPage />} />
			</Route>
			<Route element={<HotelsGeneralBackGround showSearch={false} />}>
				<Route path="/hotel/:hotel_id" element={<RoomsPage />} />
				<Route path="/hotel/:hotel_id/room/:room_id" element={<RoomsPage />} />
			</Route>
		</Routes>
	);
};

export default Router;
