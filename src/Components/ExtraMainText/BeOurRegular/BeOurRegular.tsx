import photo_1 from "../BeOurRegular/photos/photo_1.png";
import "../BeOurRegular/style/BeOurRegular.css";

const BeOurRegular = () =>{
    return(
        <div className="BeOurRegular_body">
            <div className="BeOurRegular_top">Be Our Regular</div>
            <div className="BeOurRegular_content">
                <div className="BeOurRegular_imgbox"><img className="BeOurRegular_img" src={photo_1}/></div>
                <div className="BeOurRegular_textbox">
                    <div className="BeOurRegular_text">
                    We believe that every customer deserves the best, and we're committed to providing top-class 
                    services to all of our clients. When you book with us, you can 
                    enjoy not only great deals on your travel arrangements, but also 
                    exclusive discounts and special offers. We value your loyalty and
                     want to show our appreciation by giving back. 
                    <br/>
                    <br/>
                    <br/>
                     So start your search today and discover the amazing 
                     rewards waiting for you on our website!
                     </div>
                     </div>
            </div>
        </div>
    );
};

export default BeOurRegular;