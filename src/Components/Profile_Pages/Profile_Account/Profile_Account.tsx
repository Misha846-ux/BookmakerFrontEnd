import "./style/Profile_Account.css";
import profile_photo from "./photos/profile_photo.png";
import edit_photo from "./photos/edit_photo.png";
import camera_photo from "./photos/camera_photo.png";
import { useBooking } from "../../../Context/BookingContext";
import { useAuth } from "../../../Context/AuthContext";
import { useEffect, useRef, useState} from "react";
const formatDate = (date: string | null) => {
    if (!date) return "";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "long",
    }).format(parsed);
};

const Profile_Account = () => {
    const { user, isAuthenticated, updateUserProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    // const [country, setCountry] = useState("");
    const [preferedCurrency, setPreferedCurrency] = useState<number>(0);
    const [ampthill, setAmpthill] = useState("");
    const [photo,setPhoto] = useState("");
    const [isEditName, setIsEditName] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!isAuthenticated || !user) return;

        setName(user.name ?? "");
        setPhone(user.phone ?? "");
        setEmail(user.email ?? "");
        setBirthday(user.birthday ?? "");
        // setCountry(user.country ?? "");
        setPreferedCurrency(user.currency ?? 0);
        setAmpthill(user.ampthill ?? "");
        setPhoto(user.photo ?? "");

    }, [isAuthenticated, user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        try{
            setIsSaving(true);
            setError(null);

            await updateUserProfile({
                name,
                phone,
                birthday: birthday || null,
                currency: preferedCurrency || null,
                ampthill,
            });
        }catch(err){
            setError( err instanceof Error ? err.message : "Failed to update profile" );
        }finally{
            setIsSaving(false);
        }
    }
    const handleEditName = async() => {
        if(!isEditName){
            setIsEditName(true);
            return;
        }
        await handleSaveProfile();
        setIsEditName(false);
    };
    const handleCamariClick = () => {
        fileInputRef.current?.click();
    }
    const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if(!file || !user) return;

        const previewUrl = URL.createObjectURL(file);
        setPhoto(previewUrl);

        try{
            setIsSaving(true);
            setError(null);

            const reader = new FileReader();
            reader.onloadend = async() => {
                const base64 = reader.result;

                if( typeof base64 !== "string") return;

                await updateUserProfile({ photo: base64 });

                setIsSaving(false);
            };
            reader.readAsDataURL(file);
        }catch(err){
            setError(
                err instanceof Error
                ? err.message
                : "Failed to update profile photo"
            );
            setIsSaving(false);
        }
        event.target.value = "";
    };

    if(!isAuthenticated || !user){
        alert("Please log in to edit your profile.");
    }
    return(  
            <div className="Profile_Account_box">
                <div className="Profile_Account_top">Your Account</div>
                <div className="Profile_Account_content">
                    <div className="Profile_Account_profile">
                        <div className="Profile_Account_user">
                        <img className="Profile_Account_user_img" src={profile_photo}/>
                        <div className="Profile_Account_user_data">
                            <div className="Profile_Account_user_name_box">
                                {isEditName ? (
                                     <input className="Profile_Account_input" value={name} 
                                     onChange={(e) => setName(e.target.value) } autoFocus /> 
                                     ) : ( <div className="Profile_Account_user_name"> 
                                     {name || "Your Name"} 
                                     </div> 
                                    )}
                                <button className="Profile_Account_edit_btn" onClick={handleEditName} disabled={isSaving}>
                                    <img src={edit_photo}/>
                                </button>
                            </div>
                           
                            <div className="Profile_Account_user_change_img">
                                Change the photo <button className="Profile_Account_camera_btn" onClick={handleCamariClick} disabled={isSaving}>
                                    <img src={camera_photo}/> 
                                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
                                </button>
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
                                name="phone_number" value={phone} onChange={(e) => setPhone(e.target.value) } required/>
                                <label>*Has to be confirmed</label>
                            </div>
                            <div className="Profile_Account_input_line">
                                <input className="Profile_Account_input" placeholder="Email" type="email"
                                name="email" value={email} onChange={(e) => setEmail(e.target.value) } required/>
                                <label>*Has to be confirmed</label>
                            </div>
                            <div className="Profile_Account_input_line">
                                <input className="Profile_Account_input" placeholder="Month | Date | Year" type="text"
                                name="birthday" value={birthday} onChange={(e) => setBirthday(e.target.value) } required/>
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
                                placeholder="Ampthill" value={ampthill} onChange={(e) => setAmpthill(e.target.value) }/>
                                <datalist id="ampthills">
                            
                                </datalist>                              
                            </div>
                            <div className="Profile_Account_input_line">
                                <input
                                className="Profile_Account_input"
                                list="preferedCurrency"
                                placeholder="Prefered Currency" value={preferedCurrency} onChange={(e) => setPreferedCurrency(Number(e.target.value)) }/>
                                <datalist id="preferedCurrency">
                            
                                </datalist> 
                            </div>
                        </div>
                        </div>
                        <div className="Profile_Account_bottom_text">
                            <div style={{ height: "100%", width: "30%" }}>
                                You will not be able to change your birthday date after confirmation
                            </div>
                            {error && ( 
                                <div className="Profile_Account_error"> 
                                {error} 
                                </div> 
                            )} 
                            <button className="Profile_Account_save_button" type="button" onClick={handleSaveProfile} 
                            disabled={isSaving} > {isSaving ? "Saving..." : "Save changes"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
    );
};
export default Profile_Account;