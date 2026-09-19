import "./style/Book_Page_Second.css"
import { useParams, useNavigate} from "react-router-dom";
import React, { useState } from "react";
import type { Room } from "../../Models/Room_Model";
import type { Country } from "../../Models/Country_Model";
import data from "../Temporary_json_files/data.json"
import type { City } from "../../Models/City_Model";
import prev_btn_photo from "./photo/prev_btn_photo.png";
const Book_Page_Second = () => {
   const navigate = useNavigate();
    
    const {hotel_id} = useParams();

    const hotel = data.hotels.find(hotel => hotel.id === Number(hotel_id));

    if(!hotel){
        return <div>Hotel not found</div>;
    };

    const hotelRooms = data.rooms.filter(room => room.hotel === hotel.id);

    const room: Room | undefined = hotelRooms[0];

    if (!room) { 
        return <div>No rooms found</div>; 
    };
    const city: City | undefined = data.cities.find(city => city.id === hotel.city);

    const chooseCountry: Country | undefined = data.countries.find(country => city?.country === country.id);

    const [country, setCountry] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [callMe, setCallMe] = useState<boolean>(false);
    const [sendMe, setSendMe] = useState<boolean>(false);

    const handleOnClickCallMe = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setCallMe(e.target.checked);
    };

    const handleOnClickSendMe = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setSendMe(e.target.checked);
    };
    const isFiiled = 
        country.trim() !== "" &&
        phoneNumber.trim() !== "";

    const handleOnClick = () => {
        if(!isFiiled) return;
        navigate(`/hotel/${hotel.id}/room/${room.id}/third`)
    };
    const handleOnClickback = () => {
        navigate(`/hotel/${hotel.id}/room/${room.id}/first`)
    };
    return(
         <div className="Second_Page_body">
            <button className="Second_Page_prev_btn" onClick={handleOnClickback}><img src={prev_btn_photo}/></button>
            <div className="Second_Page_content">
                <div className="Second_Page_top">
                    <div className="Second_Page_top_text">2/3</div>
                    <div className="Second_Page_top_text">Booking</div>
                </div>
                <div className="Second_Page_inputs">
                    <div className="Second_Page_inputs_first_line">
                        <input
                        className="Second_Page_input"
                        list="countries"
                        placeholder="Country"
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        required
                        />
                        <datalist id="countries">
                        <option defaultValue={chooseCountry?.name}>
                        {chooseCountry?.name}
                        </option>
                        </datalist>
                    </div>
                    <div className="Second_Page_inputs_second_line">
                         <input className="Second_Page_input" placeholder="Phone number" type="tel" 
                        name="phonenumber" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required/>
                        <div className="Second_Page_input_text">In order for the administration to be able 
                            to contact you</div>
                    </div>                   
                </div>
            </div>
            <div className="Second_Page_booleans">
                <div className="Second_Page_checkbox_text">
                    <input className="Second_Page_checkbox" type="checkbox" checked={callMe} 
                    onChange={handleOnClickCallMe} id="callMe"/>
                    <label htmlFor="callMe">
                        Call me to confirm  booking!
                    </label>
                </div>
                <div className="Second_Page_checkbox_text">
                    <input className="Second_Page_checkbox" type="checkbox" checked={sendMe} 
                    onChange={handleOnClickSendMe} id="sendMe"/>
                    <label htmlFor="sendMe">
                        Send me an email to confirm  booking!
                    </label>
                </div>
            </div>
            <div className="Second_Page_continue_btn_box">
                <button className="Second_Page_continue_btn" type="submit" onClick={handleOnClick} 
                disabled={!isFiiled}>Continue</button>
            </div>
        </div>
    );
};

export default Book_Page_Second;