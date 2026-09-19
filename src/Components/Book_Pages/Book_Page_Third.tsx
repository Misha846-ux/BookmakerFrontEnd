import "./style/Book_Page_Third.css";
import { useParams, useNavigate} from "react-router-dom";
import React, { useState } from "react";
import type { Room } from "../../Models/Room_Model";
import data from "../Temporary_json_files/data.json"
import type { Reservation } from "../../Models/Reservation_Model";
import prev_btn_photo from "./photo/prev_btn_photo.png";
import type { DebitCard } from "../../Models/DebitCard_Model";
import type { Payment_Method } from "../../Models/Payment_Method_Model";

const Book_Page_Third = () => {
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
    const reservetionPayMethod: Payment_Method | undefined = data.payment_methods.find(paymethod => reservation?.paymethod === paymethod.id);
    const chooseCard: DebitCard | undefined = data.debitCards.find(card => reservetionPayMethod?.cardType === card.id);

    const [typeOfDebitCard, setTypeOfDebitCard] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardDate, setCardDate] = useState("");
    const [agreement, setAgreement] = useState<boolean>(false);

    const handleOnClickAgreement = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setAgreement(e.target.checked);
    };

    const isFiiled = 
        typeOfDebitCard.trim() !== "" &&
        cardNumber.trim() !== "" &&
        cardDate.trim() !== "" &&
        agreement !== false;

    const handleOnClick = () => {
        if(!isFiiled) return;
        navigate(`/hotel/${hotel.id}/room/${room.id}/finale`)
    };
    const handleOnClickback = () => {
        navigate(`/hotel/${hotel.id}/room/${room.id}/second`)
    };
    return(
        <div className="Third_Page_body">
            <button className="Third_Page_prev_btn" onClick={handleOnClickback}><img src={prev_btn_photo}/></button>
            <div className="Third_Page_content">
                <div className="Third_Page_top">
                    <div className="Third_Page_top_text">3/3</div>
                    <div className="Third_Page_top_text">Booking</div>
                </div>
                <div className="Third_Page_inputs">
                    <div className="Third_Page_inputs_line">
                        <input
                        className="Third_Page_input"
                        list="debitCards"
                        placeholder="Type of your debit card"
                        value={typeOfDebitCard}
                        onChange={(event) => setTypeOfDebitCard(event.target.value)}
                        required
                        />
                        <datalist id="debitCards">
                        <option defaultValue={chooseCard?.type}>
                        {chooseCard?.type}
                        </option>
                        </datalist>
                        <div className="Third_Page_no_card_box">
                           <a href="#" className="No_card">No card?</a>
                        </div>
                    </div>
                    <div className="Third_Page_inputs_line">
                         <input className="Third_Page_input" placeholder="Сredit or debit card number" type="text" 
                        name="cardNumber" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} required/>
                        <div className="Third_Page_input_text">
                            Required to confirm your booking
                        </div>
                    </div> 
                     <div className="Third_Page_inputs_line">
                         <input className="Third_Page_input_date" placeholder="Month | Date" type="text" 
                        name="cardDate" value={cardDate} onChange={(event) => setCardDate(event.target.value)} required/>
                    </div>                   
                </div>
            </div>
            <div className="Third_Page_booleans">
                <div className="Third_Page_checkbox_text">
                    <input className="Third_Page_checkbox" type="checkbox" checked={agreement} 
                    onChange={handleOnClickAgreement} id="agreement"/>
                    <label htmlFor="agreement">
                        I agree to the <label style={{color: "#581ADB"}}>general booking</label> conditions and 
                        <label style={{color: "#581ADB"}}>privacy policy</label>
                    </label>
                </div>
            </div>
            <div className="Third_Page_btn_box">
                <button className="Third_Page_continue_btn" type="submit" onClick={handleOnClick} 
                disabled={!isFiiled}>COMPLETE THE BOOKING</button>
            </div>
            <div className="Third_Page_btn_box">
                <button className="Third_Page_check_btn">Check the data before submitting</button>
            </div>
        </div>
    );
};

export default Book_Page_Third;