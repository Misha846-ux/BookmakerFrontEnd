import "./style/Hotel_Page.css"
import Room_Book from "../Room_Book/Room_Book";
import Room_Scroll_Box from "../Room_Scroll_Box/Room_Scroll_Box";
import Hotels_NearBy from "../Hotels_NearBy/Hotels_NearBy";
import data from "../Temporary_json_files/data.json";
const Hotel_Page = () => {
    const reviews = data.reviews;
    const users = data.users;
    const hotels = data.hotels;
    const cities = data.cities;
    const countries = data.countries;
    const rooms = data.rooms;
    return(
        <div className="Hotel_Page_body">
           <Room_Book/>
           <Room_Scroll_Box/>
           <Hotels_NearBy hotels={hotels} cities={cities} countries={countries} rooms={rooms}/>
        </div>
    );
};

export default Hotel_Page;