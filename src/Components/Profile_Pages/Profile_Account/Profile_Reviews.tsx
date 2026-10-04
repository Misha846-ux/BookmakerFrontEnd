import "./style/Profile_Review.css";
import no_reviews_photo from "./photos/no_reviews_photo.png";

const Profile_Review = () => {
    return(
        <div className="Profile_Review_body">
            <div className="Profile_Review_top">YOUR REVIEWS</div>
            <div className="Profile_Review_context">
                <img className="Profile_Review_img" src={no_reviews_photo}/>
                <div className="Profile_Review_text">You have no reviews</div>
            </div>
        </div>
    );
};

export default Profile_Review;