import "./style/Profile_Account.css";
import profile_photo from "./photos/profile_photo.png";
import edit_photo from "./photos/edit_photo.png";
import camera_photo from "./photos/camera_photo.png";
import { useAuth } from "../../../Context/AuthContext";
import { useEffect, useRef, useState } from "react";
import Profile_Booking from "./Profile_Booking";
import Profile_Review from "./Profile_Reviews";
import { getCities, getCountries, getCurrencies } from "../../../Endpoints/CityEndpoints";
import { deleteUserPhoto, uploadUserPhoto } from "../../../Endpoints/UserEndpoints";
import { apiErrorMessage } from "../../../utils/apiError";
import type { CityDTO, CountryDTO, CurrencyDTO, UserProfileUpdateDTO } from "../../../Models/dto";

const formatDate = (date: string | null) => {
    if (!date) return "";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(parsed);
};

const Profile_Account = () => {
    const { user, isAuthenticated, isLoading, updateUserProfile, refreshUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [cities, setCities] = useState<CityDTO[]>([]);
    const [currencies, setCurrencies] = useState<CurrencyDTO[]>([]);
    const [listsLoaded, setListsLoaded] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [countryText, setCountryText] = useState("");
    const [countryId, setCountryId] = useState<number | null>(null);
    const [cityText, setCityText] = useState("");
    const [cityId, setCityId] = useState<number | null>(null);
    const [currencyText, setCurrencyText] = useState("");
    const [currencyId, setCurrencyId] = useState<number | null>(null);
    const [photo, setPhoto] = useState("");
    const [hydratedUserId, setHydratedUserId] = useState<number | null>(null);
    const [isEditName, setIsEditName] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            getCountries().catch(() => [] as CountryDTO[]),
            getCities().catch(() => [] as CityDTO[]),
            getCurrencies().catch(() => [] as CurrencyDTO[]),
        ])
            .then(([countryList, cityList, currencyList]) => {
                if (cancelled) return;
                setCountries(countryList);
                setCities(cityList);
                setCurrencies(currencyList);
            })
            .finally(() => {
                if (!cancelled) setListsLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!user || !listsLoaded || hydratedUserId === user.id) return;

        const userCity = cities.find((city) => city.id === user.city) ?? null;
        const userCountry = countries.find((country) => country.id === user.country) ?? null;
        const userCurrency = currencies.find((currency) => currency.id === user.currency) ?? null;

        setName(user.name ?? "");
        setPhone(user.phone ?? "");
        setEmail(user.email ?? "");
        setBirthday(user.birthday ?? "");
        setPhoto(user.photo ?? "");
        setCountryId(userCountry?.id ?? null);
        setCountryText(userCountry?.name ?? "");
        setCityId(user.city ?? null);
        setCityText(userCity?.name ?? user.ampthill ?? "");
        setCurrencyId(userCurrency?.id ?? null);
        setCurrencyText(userCurrency?.currency ?? "");
        setHydratedUserId(user.id);
    }, [user, listsLoaded, hydratedUserId, countries, cities, currencies]);

    const clearCity = () => {
        setCityId(null);
        setCityText("");
    };

    const handleCountryChange = (value: string) => {
        setCountryText(value);
        const trimmed = value.trim().toLowerCase();
        if (trimmed === "") {
            setCountryId(null);
            clearCity();
            return;
        }
        const match = countries.find((country) => country.name.toLowerCase() === trimmed);
        if (!match || match.id === countryId) return;
        setCountryId(match.id);
        clearCity();
    };

    const handleCityChange = (value: string) => {
        setCityText(value);
        const trimmed = value.trim().toLowerCase();
        if (trimmed === "") {
            clearCity();
            return;
        }
        const match = cities.find(
            (city) =>
                city.name.toLowerCase() === trimmed &&
                (countryId === null || city.country === countryId),
        );
        if (!match) {
            setCityId(null);
            return;
        }
        setCityId(match.id);
        const matchCountry = countries.find((country) => country.id === match.country) ?? null;
        setCountryId(matchCountry?.id ?? null);
        setCountryText(matchCountry?.name ?? "");
    };

    const handleCurrencyChange = (value: string) => {
        setCurrencyText(value);
        const trimmed = value.trim().toLowerCase();
        if (trimmed === "") {
            setCurrencyId(null);
            return;
        }
        const match = currencies.find(
            (currency) => currency.currency.toLowerCase() === trimmed,
        );
        setCurrencyId(match?.id ?? null);
    };

    const handleSaveProfile = async (): Promise<boolean> => {
        if (!user) return false;
        if (!email.trim()) {
            setError("Email is required.");
            return false;
        }
        if (cityId === null && countryId !== null && countryId !== (user.country ?? null)) {
            setError("Please select a city for the chosen country.");
            return false;
        }
        try {
            setIsSaving(true);
            setError(null);

            const profile: UserProfileUpdateDTO = {
                name,
                email: email.trim(),
                phone,
                birthday: birthday || null,
                ampthill: cityText.trim(),
                currency: currencyId ?? null,
                city: cityId,
            };

            await updateUserProfile(profile);
            setHydratedUserId(null);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditName = async () => {
        if (!isEditName) {
            setIsEditName(true);
            return;
        }
        const saved = await handleSaveProfile();
        if (saved) setIsEditName(false);
    };

    const handleCamariClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file || !user) return;

        try {
            setIsSaving(true);
            setError(null);

            const response = await uploadUserPhoto(user.id, file);
            setPhoto(response.photo_url ?? "");
            await refreshUser();
        } catch (err) {
            setError(apiErrorMessage(err, "Failed to upload photo"));
        } finally {
            setIsSaving(false);
        }
        event.target.value = "";
    };

    const handleRemovePhoto = async () => {
        if (!user || !photo) return;

        try {
            setIsSaving(true);
            setError(null);

            await deleteUserPhoto(user.id);
            setPhoto("");
            await refreshUser();
        } catch (err) {
            setError(apiErrorMessage(err, "Failed to remove photo"));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="Profile_Account_text">Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <div className="Profile_Account_text">Please log in to edit your profile.</div>;
    }

    const visibleCities = cities.filter(
        (city) => countryId === null || city.country === countryId,
    );

    return (
        <div className="Profile_Account_body">
            <div className="Profile_Account_box">
                <div className="Profile_Account_top">Your Account</div>
                <div className="Profile_Account_content">
                    <div className="Profile_Account_profile">
                        <div className="Profile_Account_user">
                            <img className="Profile_Account_user_img" src={photo || profile_photo} alt="avatar" />
                            <div className="Profile_Account_user_data">
                                <div className="Profile_Account_user_name_box">
                                    {isEditName ? (
                                        <input className="Profile_Account_input" type="text" value={name}
                                            onChange={(e) => setName(e.target.value)} />
                                    ) : (
                                        <div className="Profile_Account_user_name">
                                            {name || "Your Name"}
                                        </div>
                                    )}
                                    <button className="Profile_Account_edit_btn" onClick={handleEditName} disabled={isSaving}>
                                        <img src={edit_photo} alt="edit" />
                                    </button>
                                </div>

                                <div className="Profile_Account_user_change_img">
                                    Change the photo <button className="Profile_Account_camera_btn" onClick={handleCamariClick} disabled={isSaving}>
                                        <img src={camera_photo} alt="change" />
                                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
                                    </button>
                                    {photo && (
                                        <button
                                            className="Profile_Account_remove_photo_btn"
                                            type="button"
                                            onClick={handleRemovePhoto}
                                            disabled={isSaving}>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="Profile_Account_text_for_user">
                            Your name will be the only visible information to other users.
                            <br />
                            <br />
                            All other details will remain private and will be utilized to suggest the best offers for you and simplify the booking process.
                        </div>
                    </div>
                    <div className="Profile_Account_inputs">
                        <div className="Profile_Account_inputs_content">
                            <div className="Profile_Account_input_box">
                                <div className="Profile_Account_input_line">
                                    {isEditing ? (
                                        <input
                                            className="Profile_Account_input"
                                            placeholder="Your phone number"
                                            type="text"
                                            name="phone_number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    ) : (
                                        <div className="Profile_Account_input_text">
                                            {phone || "Your phone number"}
                                        </div>
                                    )}
                                    <label>*Has to be confirmed</label>
                                </div>
                                <div className="Profile_Account_input_line">
                                    {isEditing ? (
                                        <input className="Profile_Account_input" placeholder="Email" type="email"
                                            name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    ) : (
                                        <div className="Profile_Account_input_text">
                                            {email || "Your email"}
                                        </div>
                                    )}
                                    <label>*Has to be confirmed</label>
                                </div>
                                <div className="Profile_Account_input_line">
                                    {isEditing ? (
                                        <input className="Profile_Account_input" placeholder="Month | Date | Year" type="date"
                                            name="birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)}
                                            disabled={Boolean(user.birthday)} required />
                                    ) : (
                                        <div className="Profile_Account_input_text">
                                            {formatDate(birthday) || "Month | Date | Year"}
                                        </div>
                                    )}
                                    <label>Enter your date of birth</label>
                                </div>
                            </div>
                            <div className="Profile_Account_input_box">
                                <div className="Profile_Account_input_line">
                                    {isEditing ? (
                                        <input
                                            className="Profile_Account_input"
                                            list="countries"
                                            placeholder="Country"
                                            value={countryText}
                                            onChange={(e) => handleCountryChange(e.target.value)} />
                                    ) : (
                                        <div className="Profile_Account_input_text">
                                            {countryText || "Country"}
                                        </div>
                                    )}
                                    <datalist id="countries">
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="Profile_Account_input_line">
                                    {isEditing ? (
                                        <input
                                            className="Profile_Account_input"
                                            list="ampthills"
                                            placeholder="Ampthill"
                                            value={cityText}
                                            onChange={(e) => handleCityChange(e.target.value)} />
                                    ) : (
                                        <div className="Profile_Account_input_text">
                                            {cityText || "Ampthill"}
                                        </div>
                                    )}
                                    <datalist id="ampthills">
                                        {visibleCities.map((city) => (
                                            <option key={city.id} value={city.name} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="Profile_Account_input_line">
                                    {isEditing ? (
                                        <input
                                            className="Profile_Account_input"
                                            list="preferedCurrency"
                                            type="text"
                                            placeholder="Prefered Currency"
                                            value={currencyText}
                                            onChange={(e) => handleCurrencyChange(e.target.value)} />
                                    ) : (
                                        <div className="Profile_Account_input_text">
                                            {currencyText || "Prefered Currency"}
                                        </div>
                                    )}
                                    <datalist id="preferedCurrency">
                                        {currencies.map((currency) => (
                                            <option key={currency.id} value={currency.currency} />
                                        ))}
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
                            <button className="Profile_Account_save_button"
                                type="button"
                                onClick={() => setIsEditing(true)}
                                disabled={isEditing}>
                                Edit
                            </button>
                            <button className="Profile_Account_save_button" type="button" onClick={async () => {
                                const saved = await handleSaveProfile();
                                if (saved) {
                                    setIsEditing(false);
                                    setIsEditName(false);
                                }
                            }}
                                disabled={isSaving || (!isEditing && !isEditName)}> {isSaving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Profile_Booking />
            <Profile_Review />
        </div>
    );
};
export default Profile_Account;
