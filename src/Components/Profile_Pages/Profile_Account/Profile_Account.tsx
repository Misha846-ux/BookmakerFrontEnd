import "./style/Profile_Account.css";
import profile_photo from "./photos/profile_photo.png";
import edit_photo from "./photos/edit_photo.png";
import camera_photo from "./photos/camera_photo.png";
const Profile_Account = () => {
    return( 
            <div className="Profile_Account_box">
                <div className="Profile_Account_top">Your Account</div>
                <div className="Profile_Account_content">
                    <div className="Profile_Account_profile">
                        <div className="Profile_Account_user">
                        <img className="Profile_Account_user_img" src={profile_photo}/>
                        <div className="Profile_Account_user_data">
                            <div className="Profile_Account_user_name_box">
                                <div className="Profile_Account_user_name">Your Name</div>
                                <button className="Profile_Account_edit_btn"><img src={edit_photo}/></button>
                            </div>
                            <div className="Profile_Account_user_change_img">
                                Change the photo <button className="Profile_Account_camera_btn"><img src={camera_photo}/> </button>
                            </div>
                        </div>
                        </div>
                        <div className="Profile_Account_text_for_user">
                            Your name will be the only visible information to other users. 
                            <br/>
                            <br/>
                            All other details will remain private and will be utilized to suggest the best offers for you and simplify the booking process.
                        </div>
                    </div>
                    <div className="Profile_Account_inputs">
                        <div className="Profile_Account_inputs_content">
                        <div className="Profile_Account_input_box">
                            <div className="Profile_Account_input_line">
                                <input className="Profile_Account_input" placeholder="Your phone number" type="text"
                                name="phone_number" required/>
                                <label>*Has to be confirmed</label>
                            </div>
                            <div className="Profile_Account_input_line">
                                <input className="Profile_Account_input" placeholder="Email" type="email"
                                name="email" required/>
                                <label>*Has to be confirmed</label>
                            </div>
                            <div className="Profile_Account_input_line">
                                <input className="Profile_Account_input" placeholder="Month | Date | Year" type="text"
                                name="birthday" />
                                <label>Enter your date of birth</label>
                            </div>
                        </div>
                        <div className="Profile_Account_input_box">
                            <div className="Profile_Account_input_line">
                            <input
                            className="Profile_Account_input"
                            list="countries"
                            placeholder="Country"/>
                            <datalist id="countries">
                            
                            </datalist>
                            </div>
                            <div className="Profile_Account_input_line">
                                <input
                                className="Profile_Account_input"
                                list="ampthills"
                                placeholder="Ampthill"/>
                                <datalist id="ampthills">
                            
                                </datalist>                              
                            </div>
                            <div className="Profile_Account_input_line">
                                <input
                                className="Profile_Account_input"
                                list="preferedCurrency"
                                placeholder="Prefered Currency"/>
                                <datalist id="preferedCurrency">
                            
                                </datalist> 
                            </div>
                        </div>
                        </div>
                        <div className="Profile_Account_bottom_text">
                            You will not be able to change your birthday date after confirmation
                        </div>
                    </div>
                </div>
            </div>
    );
};
export default Profile_Account;