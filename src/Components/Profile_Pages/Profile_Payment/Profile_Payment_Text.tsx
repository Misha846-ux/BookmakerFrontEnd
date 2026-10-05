import "./style/Profile_Payment_Text.css";
import arrow_photo from "./photos/arrow_photo.png";

const Profile_Payment_Text = () => {
    return(
        <div className="Profile_Payment_Text_body">
            <div className="Profile_Payment_Text_context">
                <div className="Profile_Payment_Text_text">Rest assured that the payment information you enter on our site is meticulously protected to ensure your utmost security. We prioritize the safety of your transactions, employing robust encryption protocols and industry-standard security measures. With our steadfast commitment to providing a completely safe payment process, you can confidently book with us knowing that your financial information is in trusted hands.</div>
                <button className="Profile_Payment_Text_btn">See privacy policy<img src={arrow_photo}/></button>
            </div>
        </div>
    );
};

export default Profile_Payment_Text;