import "./MainPage.css"
import MiniHeader from "../ExtraMainText/MiniHeader/MiniHeader";
import Places from "../Places/Places";
import Reviews from "../Reviews/Reviews";
import SafeWithUs from "../ExtraMainText/SafeWithUs/SafeWithUs";
import BeOurRegular from "../ExtraMainText/BeOurRegular/BeOurRegular";
import RegisterAccountButton from "../RegisterAccountButton/RegisterAccountButton";
import data from "../Temporary_json_files/data.json";
import Hero from "../Hero/Hero";

const MainPage = ()=>{
    const reviews = data.reviews;
    const users = data.users;
    const hotels = data.hotels;
    const cities = data.cities;
    const countries = data.countries;
    const rooms = data.rooms;
    
    return(
        <div className="main_page">
            <Hero></Hero>
            <MiniHeader></MiniHeader>
            <Places hotels={hotels} cities={cities} countries={countries} rooms={rooms}></Places>
            <Reviews reviews={reviews} users={users} hotels={hotels}></Reviews>
            <SafeWithUs></SafeWithUs>
            <BeOurRegular></BeOurRegular>
            <RegisterAccountButton></RegisterAccountButton>
        </div>
    )
}
export default MainPage;