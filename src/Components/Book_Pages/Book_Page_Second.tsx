// import "./style/Book_Page_Second.css"
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";
// import { getCountries, getCity } from "../../Endpoints/CityEndpoints";
// import { useBooking } from "../../Context/BookingContext";
// import { useAuth } from "../../Context/AuthContext";
// import type { CountryDTO } from "../../Models/dto";
// import prev_btn_photo from "./photo/prev_btn_photo.png";

// const Book_Page_Second = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { hotel_id, room_id } = useParams();
//     const { contact, setContact, setError } = useBooking();
//     const { user, isAuthenticated } = useAuth();
//     const prefillRef = useRef<number | null>(null);

//     const [countries, setCountries] = useState<CountryDTO[]>([]);
//     const [countryError, setCountryError] = useState("");
//     const [countriesLoadError, setCountriesLoadError] = useState(false);

//     useEffect(() => {
//         setError(null);
//         setCountriesLoadError(false);
//         getCountries()
//             .then((list) => setCountries(list))
//             .catch(() => {
//                 setCountries([]);
//                 setCountriesLoadError(true);
//             });
//     }, [setError]);

//     useEffect(() => {
//         if (!isAuthenticated || !user) return;
//         if (prefillRef.current === user.id) return;

//         if (user.phone) {
//             setContact({ phoneNumber: user.phone });
//         }

//         if (!user.city) {
//             prefillRef.current = user.id;
//             return;
//         }

//         if (countries.length === 0) return;

//         let cancelled = false;
//         getCity(user.city)
//             .then((city) => {
//                 if (cancelled) return;
//                 const matched = countries.find((c) => c.id === city.country);
//                 if (matched) {
//                     setContact({ countryName: matched.name, countryId: matched.id });
//                 }
//             })
//             .catch(() => undefined)
//             .finally(() => {
//                 if (!cancelled) prefillRef.current = user.id;
//             });
//         return () => { cancelled = true; };
//     }, [isAuthenticated, user, countries, setContact]);

//     const country = contact.countryName;
//     const phoneNumber = contact.phoneNumber;

//     const isFiiled = country.trim() !== "" && phoneNumber.trim() !== "";

//     const handleOnClick = () => {
//         if(!isFiiled) return;

//         const oldData = JSON.parse(localStorage.getItem("bookingData") || "{}");
        
//         const bookingData = {
//         ...oldData,
//         country,
//         phoneNumber,
//         callMe,
//         sendMe,
//         };
        
//         localStorage.setItem("bookingData", JSON.stringify(bookingData));

//         navigate(`/hotel/${hotel.id}/room/${room.id}/third`)
//         if (!isFiiled) return;
//         const matched = countries.find(
//             (c) => c.name.toLowerCase() === country.trim().toLowerCase(),
//         );
//         if (!matched) {
//             setCountryError("Please choose a country from the list.");
//             return;
//         }
//         setCountryError("");
//         setContact({ countryId: matched.id });
//         navigate(`/hotel/${hotel_id}/room/${room_id}/third${location.search}`);
//     };

//     const handleOnClickBack = () => {
//         navigate(`/hotel/${hotel_id}/room/${room_id}/first${location.search}`);
//     };

//     return (
//         <div className="Second_Page_body">
//             <button className="Second_Page_prev_btn" onClick={handleOnClickBack}><img src={prev_btn_photo} alt="back" /></button>
//             <div className="Second_Page_content">
//                 <div className="Second_Page_top">
//                     <div className="Second_Page_top_text">2/3</div>
//                     <div className="Second_Page_top_text">Booking</div>
//                 </div>
//                 <div className="Second_Page_inputs">
//                     <div className="Second_Page_inputs_first_line">
//                        <select
//                         className="Second_Page_input"
//                         value={country}
//                         onChange={(event) => setCountry(event.target.value)} required>
//                         <option value="">Country</option>

//                         <option value={chooseCountry?.name}>
//                             {chooseCountry?.name}
//                         </option>
//                         </select>
//                         <input
//                             className="Second_Page_input"
//                             list="countries"
//                             placeholder="Country"
//                             value={country}
//                             onChange={(event) => {
//                                 setCountryError("");
//                                 setContact({ countryName: event.target.value });
//                             }}
//                             required
//                         />
//                         <datalist id="countries">
//                             {countries.map((c) => (
//                                 <option key={c.id} value={c.name} />
//                             ))}
//                         </datalist>
//                     </div>
//                     <div className="Second_Page_inputs_second_line">
//                         <input className="Second_Page_input" placeholder="Phone number" type="tel"
//                             name="phonenumber" value={phoneNumber}
//                             onChange={(event) => setContact({ phoneNumber: event.target.value })} required />
//                         <div className="Second_Page_input_text">In order for the administration to be able
//                             to contact you</div>
//                     </div>
//                     {countriesLoadError && (
//                         <div className="Second_Page_error_text">
//                             Failed to load countries. Please try again later.
//                         </div>
//                     )}
//                     {countryError && <div className="Second_Page_error_text">{countryError}</div>}
//                 </div>
//             </div>
//             <div className="Second_Page_booleans">
//                 <div className="Second_Page_checkbox_text">
//                     <input className="Second_Page_checkbox" type="checkbox" checked={contact.confirmByCall}
//                         onChange={(event) => setContact({ confirmByCall: event.target.checked })} id="callMe" />
//                     <label htmlFor="callMe">
//                         Call me to confirm booking!
//                     </label>
//                 </div>
//                 <div className="Second_Page_checkbox_text">
//                     <input className="Second_Page_checkbox" type="checkbox" checked={contact.confirmByEmail}
//                         onChange={(event) => setContact({ confirmByEmail: event.target.checked })} id="sendMe" />
//                     <label htmlFor="sendMe">
//                         Send me an email to confirm booking!
//                     </label>
//                 </div>
//             </div>
//             <div className="Second_Page_continue_btn_box">
//                 <button className="Second_Page_continue_btn" type="submit" onClick={handleOnClick}
//                     disabled={!isFiiled}>Continue</button>
//             </div>
//         </div>
//     );
// };

// export default Book_Page_Second;