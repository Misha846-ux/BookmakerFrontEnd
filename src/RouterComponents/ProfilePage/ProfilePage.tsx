import "./style/ProfilePage.css";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import back_photo from "./photos/back_photo.png";
import account_photo from "./photos/account_photo.png";
import payment_photo from "./photos/payment_photo.png";
import { getCurrentUser } from "../../Endpoints/UserEndpoints";
import { useState } from "react";
const ProfilePage = () =>{
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState<"account" | "payment">("account");
    const handleBack = () =>{
        navigate("/");
    }

    const handleAccount = async() =>{
        const user = await getCurrentUser();
        setIsActive("account");
        navigate(`/profile/${user.id}/account`);
    }
    
    const handlePayment = async() =>{
        const user = await getCurrentUser();
        setIsActive("payment");
        navigate(`/profile/${user.id}/payment`);
    }
    return(
        <div className="ProfilePage_body">
            <div className="ProfilePage_top">
                <button className="ProfilePage_btn" onClick={handleBack}><img src={back_photo}/>Main page</button>
                <div className="ProfilePage_btn_box">
                <button className={`ProfilePage_account_btn ${
                            isActive === "account" ? "active" : ""}`} 
                            onClick={handleAccount}><div>Account</div><img src={account_photo}/></button>
                <button className={`ProfilePage_payment_btn ${
                    isActive === "payment" ? "active" : ""}`} 
                    onClick={handlePayment}><div>Payment method</div><img src={payment_photo}/></button>
                </div>
            </div>
            <div className="ProfilePage_content">
                <Outlet/>
            </div>
        </div>
    );
};

export default ProfilePage;