import "./style/Profile_Payment.css";
import { useAuth } from "../../../Context/AuthContext";
import { useEffect, useState} from "react";
import type { Payment_Method } from "../../../Models/Payment_Method_Model";
import type { DebitCard } from "../../../Models/DebitCard_Model";
import data from "../../Temporary_json_files/data.json";
import Profile_Payment_Saved from "./Profile_Payment_Saved";
import Profile_Payment_Text from "./Profile_Payment_Text";
const Profile_Payment = () => {
    const { user, isAuthenticated, isLoading, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    // const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const payment_method: Payment_Method | undefined = data.payment_methods.find(payment_method => user?.payMethod === payment_method.id);
    const debit_card: DebitCard | undefined = data.debitCards.find(debit_card => payment_method?.cardType === debit_card.id);

    if (isLoading) {
    return <div className="Profile_Payment_text">Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <div className="Profile_Payment_text">Please log in to edit your profile.</div>;
    }
    return( 
         <div className="Profile_Payment_body">
            <div className="Profile_Payment_box">
                <div className="Profile_Payment_top">Payment method</div>
                <div className="Profile_Payment_content">
                    <div className="Profile_Payment_profile">
                        <div className="Profile_Payment_user">
                        <div className="Profile_Payment_user_data">
                        <div className="Profile_Payment_inputs_content">
                            <div className="Profile_Payment_input_box">
                            <div className="Profile_Payment_input_line">
                        {isEditing ? (
                        <>
                        <input
                        className="Profile_Payment_input"
                        list="debit_cards"
                        value={payment_method?.cardType || ""}
                        placeholder="Type of your debit card"
                        />

                        <datalist id="debit_cards">
                        {data.debitCards.map((card) => (
                        <option key={card.id} value={card.type} />
                            ))}
                        </datalist>
                         </>
                        ) : (
                        <div className="Profile_Payment_input_text">
                            {payment_method?.cardType || "Type of your debit card"}
                        </div>
                        )}
                            </div>
                        </div>
                        <div className="Profile_Payment_input_box">
                            <div className="Profile_Payment_input_line">
                                {isEditing ? (
                                <input className="Profile_Payment_input" placeholder="Сredit or debit card number" type="text"
                                name="cardNumber" value={payment_method?.cardNumber} required/>
)                                : (
                                <div className="Profile_Payment_input_text">
                                    { payment_method?.cardNumber || "Сredit or debit card number"}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="Profile_Payment_input_box">
                            <div className="Profile_Payment_input_line">
                                {isEditing ? (
                                <input className="Profile_Payment_date" placeholder="Month | Date" type="text"
                                name="card_date" value={payment_method?.date} required/>
)                                : (
                                <div className="Profile_Payment_input_text">
                                    { payment_method?.date || "Month | Date"}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="Profile_Payment_bottom_text">
                            {error && ( 
                                <div className="Profile_Payment_error"> 
                                {error} 
                                </div> 
                            )} 
                            <button className="Profile_Payment_save_button"
                                type="button"
                                onClick={() => setIsEditing(true)}
                                disabled={isEditing}>
                                Edit
                            </button>
                            <button className="Profile_Payment_save_button" type="button" //</div>onClick={async () => {
                                    //await handleSaveProfile();
                                    //setIsEditing(false);
                                    //setIsEditName(false);
                                //}}
                            //</div>disabled={isSaving} > {isSaving ? "Saving..." : "Save changes"}
                            >
                                Save changes
                            </button>
                        </div>
                        </div>
                    </div>
                        </div>
                        <div className="Profile_Payment_text_for_user">
                            This information will be kept private and confidential.  
                            <br/>
                            <br/>
                            Once your booking is confirmed, the payment details will be automatically filled in for your convenience.
                        </div>
                    </div>
                </div>
            </div>
            <Profile_Payment_Saved/>
            <Profile_Payment_Text/>
        </div>
    );
};
export default Profile_Payment;