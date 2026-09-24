import { Routes, Route, Navigate } from "react-router-dom";
import HotelsGeneralBackGround from "./RouterComponents/HotelsRouts/HotelsGeneralBackGround";
import HotelsMainPage from "./RouterComponents/HotelsRouts/HotelsMainPage";
import HotelsSecondPage from "./RouterComponents/HotelsRouts/HotelsSecondPage";
import HotelsThirdPage from "./Components/HotelsThirdPage/HotelsThirdPage";
import Book_Pages from "./Components/Book_Pages/Book_Pages";
import Book_Page_First from "./Components/Book_Pages/Book_Page_First";
import Book_Page_Second from "./Components/Book_Pages/Book_Page_Second";
import Book_Page_Third from "./Components/Book_Pages/Book_Page_Third";
import Book_Page_Finale from "./Components/Book_Pages/Book_Page_Finale";

const Router = () => {
	return (
		<Routes>
			<Route element={<HotelsGeneralBackGround />}>
				<Route path="/" element={<HotelsMainPage />} />
				<Route path="/hotels" element={<HotelsSecondPage />} />
				<Route path="/hotel/:hotel_id" element={<HotelsThirdPage/>}></Route>
				<Route path="/hotel/:hotel_id/room/:room_id" element={<Book_Pages/>}>
					<Route index element={<Navigate to="first" replace />}></Route>
					<Route path="first" element={<Book_Page_First/>}></Route>
					<Route path="second" element={<Book_Page_Second/>}></Route>
					<Route path="third" element={<Book_Page_Third/>}></Route>
				</Route>
				<Route path="/hotel/:hotel_id/room/:room_id/finale" element={<Book_Page_Finale/>}></Route>
			</Route>
		</Routes>
	);
};

export default Router;
