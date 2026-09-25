import "./style/Book_Page_First.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useBooking } from "../../../Context/BookingContext";
import { useAuth } from "../../../Context/AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDate = (date: string | null) => {
    if (!date) return "";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "long",
    }).format(parsed);
};

const Book_Page_First = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hotel_id, room_id } = useParams();
    const { guest, setGuest, setError } = useBooking();
    const { user, isAuthenticated } = useAuth();
    const prefillRef = useRef<number | null>(null);
    const checkIn = new URLSearchParams(location.search).get("checkIn");

    useEffect(() => {
        setError(null);
    }, [setError]);

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        const userId = user.id;
        if (prefillRef.current === userId) return;
        prefillRef.current = userId;
        const parts = (user.name ?? "").trim().split(/\s+/);
        const firstName = parts[0] ?? "";
        const lastName = parts.slice(1).join(" ");
        setGuest({
            name: firstName,
            surname: lastName,
            email: user.email ?? "",
            confirmEmail: user.email ?? "",
            password: "",
        });
    }, [isAuthenticated, user, setGuest]);

    const name = guest.name;
    const surname = guest.surname;
    const email = guest.email;
    const confirmEmail = guest.confirmEmail;
    const password = guest.password;

    const emailValid = EMAIL_RE.test(email.trim());
    const emailsMatch = confirmEmail !== "" && email === confirmEmail;
    const invalidPassword = password.trim() !== "" && password.length < 6;
    const isFiiled =
        name.trim() !== "" &&
        surname.trim() !== "" &&
        email.trim() !== "" &&
        emailValid &&
        confirmEmail.trim() !== "" &&
        emailsMatch &&
        !invalidPassword;

    const handleOnClick = () => {
        if (!isFiiled) return;
        setGuest({
            name: name.trim(),
            surname: surname.trim(),
            email: email.trim(),
            confirmEmail: confirmEmail.trim(),
        });
        navigate(`/hotel/${hotel_id}/room/${room_id}/second${location.search}`);
    };

    const handleChangeBooking = (checked: boolean) => {
        setGuest({ allowChangeBooking: checked });
    };

    return (
        <div className="First_Page_body">
            <div className="First_Page_content">
                <div className="First_Page_top">
                    <div className="First_Page_top_text">1/3</div>
                    <div className="First_Page_top_text">Booking</div>
                </div>
                <div className="First_Page_inputs">
                    <div className="First_Page_inputs_first_line">
                        <input className="First_Page_input" placeholder="Name" type="text"
                            name="name" value={name} onChange={(event) => setGuest({ name: event.target.value })} required />
                        <input className="First_Page_input" placeholder="Surname" type="text"
                            name="surname" value={surname} onChange={(event) => setGuest({ surname: event.target.value })} required />
                    </div>
                    <div className="First_Page_inputs_second_line">
                        <input className="First_Page_input" placeholder="Email" type="email"
                            name="email" value={email} onChange={(event) => setGuest({ email: event.target.value })} required />
                        <div className="First_Page_input_text">To this address, we will send a confirmation
                            and a guide to the city!</div>
                    </div>
                    <div className="First_Page_inputs_third_line">
                        <input className="First_Page_input" placeholder="Confirm email" type="email"
                            name="confirmEmail" value={confirmEmail}
                            onChange={(event) => setGuest({ confirmEmail: event.target.value })} required />
                        {confirmEmail !== "" && (
                            <div className="First_Page_input_text">
                                {emailsMatch ? "Email matches" : "Emails do not match"}
                            </div>
                        )}
                    </div>
                    {!isAuthenticated ? (
                        <div className="First_Page_inputs_forth_line">
                            <input className="First_Page_input"
                                placeholder="choose a password for your booking (optional)" type="password"
                                name="password" value={password}
                                onChange={(event) => setGuest({ password: event.target.value })} />
                            {invalidPassword && (
                                <div className="First_Page_input_text">
                                    ItÔÇÖs optional, but itÔÇÖs safer! (minimum 6 characters)
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="First_Page_inputs_forth_line">
                            <div className="First_Page_signed_in_text">You are signed in as {email}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="First_Page_booleans">
                <div className="First_Page_checkbox_text">
                    <input className="First_Page_checkbox" type="checkbox" checked={guest.cityGuide}
                        onChange={(event) => setGuest({ cityGuide: event.target.checked })} id="cityGuide" />
                    <label htmlFor="cityGuide">
                        I want to get a city guide!
                    </label>
                </div>
                <div className="First_Page_checkbox_text">
                    <input className="First_Page_checkbox" type="checkbox" checked={guest.allowChangeBooking}
                        onChange={(event) => handleChangeBooking(event.target.checked)} id="changeBooking" />
                    <label htmlFor="changeBooking">
                        the ability to change the booking{" "}
                        {checkIn && (
                            <label className="First_Page_checkbox_label">until ({formatDate(checkIn)})</label>
                        )}
                    </label>
                </div>
            </div>
            <div className="First_Page_continue_btn_box">
                <button className="First_Page_continue_btn" type="submit" onClick={handleOnClick} disabled={!isFiiled}>Continue</button>
            </div>
        </div>
    );
};

export default Book_Page_First;

