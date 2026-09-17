import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getCity } from "../../Endpoints/CityEndpoints";
import { getHotelCardData, getHotelRooms } from "../../Endpoints/HotelEndpoints";
import { getRoomPhotos } from "../../Endpoints/RoomEndpoints";
import type { CityDTO, HotelCardDataDTO, RoomDTO, ReviewDTO } from "../../Models/dto";
import { getHotelReviews } from "../../Endpoints/HotelEndpoints";
import Room_top from "../../Components/Room_top/Room_top";
import Room_Book from "../../Components/Room_Book/Room_Book";
import Room_Scroll_Box from "../../Components/Room_Scroll_Box/Room_Scroll_Box";
import CommentsGrid from "../../Components/CommentsGrid/CommentsGrid";
import "../../Components/Hotel_Page/style/Hotel_Page.css";

type RoomPageData = {
	hotelData: HotelCardDataDTO;
	city: CityDTO;
	rooms: RoomDTO[];
	roomPhotos: Record<number, string[]>;
	reviews: ReviewDTO[];
};

const RoomsPage = () => {
	const { hotel_id, room_id } = useParams();
	const [searchParams] = useSearchParams();
	const [pageData, setPageData] = useState<RoomPageData>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		const hotelId = Number(hotel_id);
		let aborted = false;

		if (!Number.isInteger(hotelId)) {
			setError("Hotel not found");
			return () => { aborted = true; };
		}

		const loadPage = async () => {
			try {
				const hotelData = await getHotelCardData(hotelId);
				const [city, roomsResponse, reviewsResponse] = await Promise.all([
					getCity(hotelData.hotel.city),
					getHotelRooms(hotelId, { el: 30, page: 1 }),
					getHotelReviews(hotelId).catch(() => ({ count: 0, results: [] })),
				]);
				const rooms = roomsResponse.results;
				const roomPhotosEntries = await Promise.all(
					rooms.map(async (room) => {
						try {
							const response = await getRoomPhotos(room.id);
							return [room.id, response.photos.map((photo) => photo.photo)] as const;
						} catch {
							return [room.id, []] as const;
						}
					}),
				);

				if (!aborted) {
					setPageData({
						hotelData,
						city,
						rooms,
						roomPhotos: Object.fromEntries(roomPhotosEntries),
						reviews: reviewsResponse.results,
					});
					setError(undefined);
				}
			} catch {
				if (!aborted) setError("Unable to load hotel rooms");
			}
		};

		void loadPage();
		return () => { aborted = true; };
	}, [hotel_id]);

	if (error) return <div className="Hotel_Page_body">{error}</div>;
	if (!pageData) return <div className="Hotel_Page_body">Loading hotel rooms...</div>;
	if (pageData.rooms.length === 0) return <div className="Hotel_Page_body">No rooms found</div>;

	const { hotelData, city, rooms, roomPhotos } = pageData;
	const hotel = hotelData.hotel;
	const firstRoom = rooms.find((room) => room.id === Number(room_id)) ?? rooms[0];

	return (
		<div className="Hotel_Page_body">
			<Room_top
				hotel={hotel}
				city={city}
				room={firstRoom}
				checkIn={searchParams.get("checkIn")}
				checkOut={searchParams.get("checkOut")}
			/>
			<Room_Book
				hotel={hotel}
				city={city}
				room={firstRoom}
				roomPhotos={roomPhotos[firstRoom.id] ?? []}
			/>
			<Room_Scroll_Box rooms={rooms} roomPhotos={roomPhotos} primaryRoomId={firstRoom.id} />
			<CommentsGrid reviews={pageData.reviews} hotel={hotel} />
		</div>
	);
};

export default RoomsPage;
