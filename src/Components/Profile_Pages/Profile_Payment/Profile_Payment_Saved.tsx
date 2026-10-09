import "./style/Profile_Payment_Saved.css";
import no_saved_payments_photo from "./photos/no_saved_payments_photo.png";

const Profile_Payment_Saved = () => {
    return(
        <div className="Profile_Payment_Saved_body">
            <div className="Profile_Payment_Saved_top">SAVED PAYMENT METHODS</div>
            <div className="Profile_Payment_Saved_context">
                <img className="Profile_Payment_Saved_img" src={no_saved_payments_photo}/>
                <div className="Profile_Payment_Saved_text">You have no saved payment methods</div>
            </div>
        </div>
    );
};

export default Profile_Payment_Saved;