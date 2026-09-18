import "./style/Book_Page_First.css";
import { useParams, useNavigate} from "react-router-dom";
import React, { useState } from "react";
import type { Room } from "../../Models/Room_Model";
import data from "../Temporary_json_files/data.json"
import type { Reservation } from "../../Models/Reservation_Model";
const Book_Page_First = () => {
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
    const reservation: Reservation | undefined = data.resevations.find(reservation => reservation.room === room.id);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cityGuide, setCityGuide] = useState<boolean>(false);
    const [changeBooking, setChangeBooking] = useState<boolean>(false);

    const handleOnClickCityGuide = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setCityGuide(e.target.checked);
    };

    const handleOnClickChangeBooking = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setChangeBooking(e.target.checked);
    };
    const emailsMatch = email !== "" && 
        confirmEmail !== "" &&
        email === confirmEmail; 
    const shortPassword = password
        ? password.length < 6
        : false;
    const isFiiled = 
        name.trim() !== "" &&
        surname.trim() !== "" &&
        email.trim() !== "" &&
        confirmEmail.trim() !== "" &&
        password.trim() !== "" &&
        emailsMatch;

    const handleOnClick = () => {
        if(!isFiiled) return;
        navigate(`/hotel/${hotel.id}/room/${room.id}/second`)
    };
    return(
        <div className="First_Page_body">
            <div className="First_Page_content">
                <div className="First_Page_top">
                    <div className="First_Page_top_text">1/3</div>
                    <div className="First_Page_top_text">Booking</div>
                </div>
                <div className="First_Page_inputs">
                    <div className="First_Page_inputs_first_line">
                        <input className="First_Page_input" placeholder="Name" type="text" 
                        name="name" value={name} onChange={(event) => setName(event.target.value)} required/>
                        <input className="First_Page_input" placeholder="Surname"  type="text" 
                         name="surname" value={surname} onChange={(event) => setSurname(event.target.value)} required/>
                    </div>
                    <div className="First_Page_inputs_second_line">
                         <input className="First_Page_input" placeholder="Email" type="email" 
                        name="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                        <div className="First_Page_input_text">To this address, we will send a confirmation 
                            and a guide to the city!</div>
                    </div>
                    <div className="First_Page_inputs_third_line">
                        <input className="First_Page_input" placeholder=" Confirm email" type="email" 
                        name="confirmEmail" value={confirmEmail} onChange={(event)=> setConfirmEmail(event.target.value)} required/>
                        {confirmEmail !=="" && (
                            <div className="First_Page_input_text">
                                {emailsMatch
                                    ? "Email matches"
                                    : "Emails do not match"
                                }
                            </div>
                        )}
                    </div>
                    <div className="First_Page_inputs_forth_line">
                        <input className="First_Page_input" placeholder="choose a password for your booking" type="password" 
                        name="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
                        {shortPassword && (
                            <div className="First_Page_input_text">
                                It’s optional, but it’s safer!
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="First_Page_booleans">
                <div className="First_Page_checkbox_text">
                    <input className="First_Page_checkbox" type="checkbox" checked={cityGuide} 
                    onChange={handleOnClickCityGuide} id="cityGuide"/>
                    <label htmlFor="cityGuide">
                        I want to get a city guide!
                    </label>
                </div>
                <div className="First_Page_checkbox_text">
                    <input className="First_Page_checkbox" type="checkbox" checked={changeBooking} 
                    onChange={handleOnClickChangeBooking} id="changeBooking"/>
                    <label htmlFor="changeBooking">
                        the ability to change the booking <label className="First_Page_checkbox_label">until ({reservation?.checkIn})</label>
                    </label>
                </div>
            </div>
            <div className="First_Page_continue_btn_box">
                <button className="First_Page_continue_btn" type="submit" onClick={handleOnClick} disabled={!isFiiled}>Continue</button>
            </div>
        </div>
    );
};

export default Book_Page_First;