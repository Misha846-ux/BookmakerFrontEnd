import photo_1 from "../MiniHeader/photos/photo_1.png";
import photo_2 from "../MiniHeader/photos/photo_2.png";
import photo_3 from "../MiniHeader/photos/photo_3.png";
import "../MiniHeader/style/MiniHeader.css";
const MiniHeader = () =>{
    return(
        <div className="Header_body">
            <div className="Header_box"><img src={photo_1}/></div>
            <div className="Header_box"><img src={photo_2}/></div>
            <div className="Header_box"><img src={photo_3}/></div>
        </div>
    );
};

export default MiniHeader;