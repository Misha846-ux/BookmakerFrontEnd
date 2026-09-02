import photo_1 from "../RegisterAccountButton/photos/photo_1.png";
import photo_2 from "../RegisterAccountButton/photos/photo_2.png";
import "../RegisterAccountButton/style/RegisterAccountButton.css";
const RegisterAccountButton = () => {
    return(
        <div className="RegisterAccountButton_body">
            <img className="RegisterAccountButton_img" src={photo_1}/>
            <button className="RegisterAccountButton_btn">Register an account</button>
            <img className="RegisterAccountButton_img" src={photo_2}/>
        </div>
    );
}

export default RegisterAccountButton;