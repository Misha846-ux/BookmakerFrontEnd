import "./style/Book_Page_Data.css";

type BookingData = { 
    name?: string; 
    surname?: string; 
    email?: string; 
    confirmEmail?: string; 
    password?: string; 
    country?: string; 
    phoneNumber?: string; 
    callMe?: boolean; 
    sendMe?: boolean; 
    typeOfDebitCard?: string; 
    cardNumber?: string; 
    cardDate?: string; 
    agreement?: boolean; 
}; 
type Props = { 
    data: BookingData; 
    onClose: () => void; 
};

const Book_Page_Data = ({data, onClose}: Props) => {
    return(
        <div className="Book_Page_Data_body">
            <div className="Book_Page_Data_booking_modal"> 
                <button className="Book_Page_Data_modal_close" onClick={onClose} > 
                    × 
                </button> 
                <h2>Check your booking data</h2> 
                <div className="Book_Page_Data_modal_section"> 
                    <h3>Personal information</h3> 
                    <p> <strong>Name:</strong> {data.name} </p> 
                    <p> <strong>Surname:</strong> {data.surname} </p> 
                    <p> <strong>Email:</strong> {data.email} </p> 
                </div> 
                <div className="Book_Page_Data_modal_section"> 
                    <h3>Contact information</h3> 
                    <p> <strong>Country:</strong> {data.country} </p> 
                    <p> <strong>Phone:</strong> {data.phoneNumber} </p> 
                    <p> <strong>Call me:</strong>{" "} {data.callMe ? "Yes" : "No"} </p> 
                    <p> <strong>Email confirmation:</strong>{" "} {data.sendMe ? "Yes" : "No"} </p> 
                </div> 
                <div className="Book_Page_Data_modal_section"> 
                    <h3>Payment information</h3> 
                    <p> <strong>Card type:</strong>{" "} {data.typeOfDebitCard} </p> 
                    <p> <strong>Card number:</strong>{" "} {data.cardNumber} </p> 
                    <p> <strong>Expiration:</strong>{" "} {data.cardDate} </p> 
                    <p> <strong>Agreement:</strong>{" "} {data.agreement ? "Accepted" : "Not accepted"} </p> 
                </div> 
                </div>
        </div>
    );
};
export default Book_Page_Data;