import "./style/Hotel_Page.css"
import Room_Book from "../Room_Book/Room_Book";
import Room_Scroll_Box from "../Room_Scroll_Box/Room_Scroll_Box";

const Hotel_Page = () => {
    

    return(
        <div className="Hotel_Page_body">
           <Room_Book/>
           <Room_Scroll_Box/>
        </div>
    );
};

export default Hotel_Page;