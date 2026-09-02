import "../SafeWithUs/style/SafeWithUs.css";
import photo_1 from "../SafeWithUs/photos/photo_1.png";
import photo_2 from "../SafeWithUs/photos/photo_2.png";
import photo_3 from "../SafeWithUs/photos/photo_3.png";
import photo_4 from "../SafeWithUs/photos/photo_4.png";
import photo_5 from "../SafeWithUs/photos/photo_5.png";
const SafeWithUs = ()=>{
    return(
        <div className="SafeWithUs_body">
            <div className="SafeWithUs_top">Safe With Us</div>
            <div className="SafeWithUs_content">
                <div className="SafeWithUs_box"><img src={photo_1}/></div>
                <div className="SafeWithUs_box"><img src={photo_2}/></div>
                <div className="SafeWithUs_box"><img src={photo_3}/></div>
                <div className="SafeWithUs_box"><img src={photo_4}/></div>
                <div className="SafeWithUs_box"><img src={photo_5}/></div>
            </div>
        </div>
    );
};

export default SafeWithUs;