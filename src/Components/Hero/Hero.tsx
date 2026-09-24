import "./Hero.css";
import heroBg from "../../assets/image.png";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { AdvancedSearchDTO, CountryDTO, CityDTO } from "../../Models/dto";
import { getCookie, setCookie } from "../../utils/cookies";
import { getCountries, getCities } from "../../Endpoints/CityEndpoints";

const FILTER_COOKIE = "hotel_search_filters";

function readFiltersFromCookie(): AdvancedSearchDTO {
    const raw = getCookie(FILTER_COOKIE);
    if (!raw) return {};
    try {
        return JSON.parse(raw) as AdvancedSearchDTO;
    } catch {
        return {};
    }
}

const Hero = () => {
    const navigate = useNavigate();
    const initialFilters = readFiltersFromCookie();

    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [cities, setCities] = useState<CityDTO[]>([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const [locationsError, setLocationsError] = useState<string | null>(null);

    const [selectedCountry, setSelectedCountry] = useState<CountryDTO | null>(null);
    const [selectedCity, setSelectedCity] = useState<CityDTO | null>(null);

    const [checkIn, setCheckIn] = useState(initialFilters.checkIn ?? "");
    const [checkOut, setCheckOut] = useState(initialFilters.checkOut ?? "");
    const [people, setPeople] = useState(initialFilters.people ?? 2);

    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isGuestsOpen, setIsGuestsOpen] = useState(false);

    const countryRef = useRef<HTMLDivElement>(null);
    const cityRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);
    const guestsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadLocations() {
            setIsLoadingLocations(true);
            setLocationsError(null);
            try {
                const [countriesData, citiesData] = await Promise.all([
                    getCountries(),
                    getCities(),
                ]);

                if (cancelled) return;

                setCountries(countriesData);
                setCities(citiesData);

                if (initialFilters.land) {
                    const foundCountry = countriesData.find((c) => c.name === initialFilters.land);
                    if (foundCountry) setSelectedCountry(foundCountry);
                }
                if (initialFilters.city) {
                    const foundCity = citiesData.find((c) => c.name === initialFilters.city);
                    if (foundCity) setSelectedCity(foundCity);
                }
            } catch (err) {
                if (!cancelled) {
                    setLocationsError(err instanceof Error ? err.message : "Failed to load locations");
                }
            } finally {
                if (!cancelled) setIsLoadingLocations(false);
            }
        }

        loadLocations();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (countryRef.current && !countryRef.current.contains(target)) setIsCountryOpen(false);
            if (cityRef.current && !cityRef.current.contains(target)) setIsCityOpen(false);
            if (dateRef.current && !dateRef.current.contains(target)) setIsDateOpen(false);
            if (guestsRef.current && !guestsRef.current.contains(target)) setIsGuestsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const citiesForCountry = selectedCountry
        ? cities.filter((city) => city.country === selectedCountry.id)
        : [];

    const handleSelectCountry = (country: CountryDTO) => {
        setSelectedCountry(country);
        setSelectedCity(null);
        setIsCountryOpen(false);
        setIsCityOpen(true);
    };

    const handleSelectCity = (city: CityDTO) => {
        setSelectedCity(city);
        setIsCityOpen(false);
    };

    const clampPeople = (value: number) => Math.max(1, Math.min(20, value));

    const dateLabel = checkIn && checkOut ? `${checkIn} - ${checkOut}` : "Check-in - Check-out";
    const guestsLabel = `${people} guest${people > 1 ? "s" : ""}`;

    const handleSearch = () => {
        const existing = readFiltersFromCookie();

        const nextFilters: AdvancedSearchDTO = {
            ...existing,
            ...(selectedCountry ? { land: selectedCountry.name } : {}),
            ...(selectedCity ? { city: selectedCity.name } : {}),
            ...(checkIn ? { checkIn } : {}),
            ...(checkOut ? { checkOut } : {}),
            people,
        };

        setCookie(FILTER_COOKIE, JSON.stringify(nextFilters));

        navigate("/hotels");
    };

    return (
        <section className="hero">
            <img src={heroBg} alt="Hotel background" className="hero_bg" />
            <div className="search_bar">
                <div className="search_input_group" ref={countryRef}>
                    <div
                        className={`search_input_group_clickable ${isLoadingLocations ? "disabled" : ""}`}
                        onClick={() => {
                            if (isLoadingLocations) return;
                            setIsCountryOpen((prev) => !prev);
                            setIsCityOpen(false);
                        }}
                    >
                        <span className="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.03023 21.6898L11.3602 19.7298C11.7102 19.4298 12.2902 19.4298 12.6402 19.7298L14.9702 21.6898C15.5102 21.9598 16.1702 21.6898 16.3702 21.1098L16.8102 19.7798C16.9202 19.4598 16.8102 18.9898 16.5702 18.7498L14.3002 16.4698C14.1302 16.3098 14.0002 15.9898 14.0002 15.7598V12.9098C14.0002 12.4898 14.3102 12.2898 14.7002 12.4498L19.6102 14.5698C20.3802 14.8998 21.0102 14.4898 21.0102 13.6498V12.3598C21.0102 11.6898 20.5102 10.9198 19.8902 10.6598L14.3002 8.24977C14.2146 8.20578 14.1418 8.14022 14.0892 8.05956C14.0366 7.97889 14.0059 7.8859 14.0002 7.78977V4.78977C14.0002 3.84977 13.3102 2.73977 12.4702 2.30977C12.1702 2.15977 11.8202 2.15977 11.5202 2.30977C10.6802 2.73977 9.99023 3.85977 9.99023 4.79977V7.79977C9.99023 7.97977 9.85023 8.18977 9.69023 8.25977L4.11023 10.6698C3.49023 10.9198 2.99023 11.6898 2.99023 12.3598V13.6498C2.99023 14.4898 3.62023 14.8998 4.39023 14.5698L9.30023 12.4498C9.68023 12.2798 10.0002 12.4898 10.0002 12.9098V15.7598C10.0002 15.9898 9.87023 16.3098 9.71023 16.4698L7.44023 18.7498C7.20023 18.9898 7.09023 19.4498 7.20023 19.7798L7.64023 21.1098C7.82023 21.6898 8.48023 21.9698 9.03023 21.6898Z"
                                    stroke="#222222"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span className={selectedCountry ? "" : "search_placeholder"}>
                            {isLoadingLocations ? "Loading..." : selectedCountry ? selectedCountry.name : "Country"}
                        </span>
                    </div>

                    {isCountryOpen && (
                        <div className="search_popover search_dropdown_list">
                            {locationsError && <div className="search_dropdown_empty">Failed to load countries</div>}
                            {!locationsError && countries.length === 0 && (
                                <div className="search_dropdown_empty">No countries</div>
                            )}
                            {countries.map((country) => (
                                <div
                                    key={country.id}
                                    className={`search_dropdown_item ${selectedCountry?.id === country.id ? "active" : ""}`}
                                    onClick={() => handleSelectCountry(country)}
                                >
                                    {country.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="search_divider"></div>

                <div className="search_input_group" ref={cityRef}>
                    <div
                        className={`search_input_group_clickable ${!selectedCountry || isLoadingLocations ? "disabled" : ""}`}
                        onClick={() => {
                            if (!selectedCountry || isLoadingLocations) return;
                            setIsCityOpen((prev) => !prev);
                            setIsCountryOpen(false);
                        }}
                    >
                        <span className="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                                    stroke="#222222"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15.6959 13.6992H15.7049M15.6959 16.6992H15.7049M11.9959 13.6992H12.0059M11.9959 16.6992H12.0059M8.29492 13.6992H8.30492M8.29492 16.6992H8.30492"
                                    stroke="#222222"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span className={selectedCity ? "" : "search_placeholder"}>
                            {selectedCity ? selectedCity.name : "City"}
                        </span>
                    </div>

                    {isCityOpen && selectedCountry && (
                        <div className="search_popover search_dropdown_list">
                            {citiesForCountry.length === 0 && <div className="search_dropdown_empty">No cities</div>}
                            {citiesForCountry.map((city) => (
                                <div
                                    key={city.id}
                                    className={`search_dropdown_item ${selectedCity?.id === city.id ? "active" : ""}`}
                                    onClick={() => handleSelectCity(city)}
                                >
                                    {city.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="search_divider"></div>

                <div className="search_input_group" ref={dateRef}>
                    <div className="search_input_group_clickable" onClick={() => setIsDateOpen((prev) => !prev)}>
                        <span className="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                                    stroke="#222222"
                                    strokeWidth="1.5"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15.6959 13.6992H15.7049M15.6959 16.6992H15.7049M11.9959 13.6992H12.0059M11.9959 16.6992H12.0059M8.29492 13.6992H8.30492M8.29492 16.6992H8.30492"
                                    stroke="#222222"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span>{dateLabel}</span>
                    </div>

                    {isDateOpen && (
                        <div className="search_popover search_dates_popover">
                            <div className="search_popover_field">
                                <label>Check-in</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />
                            </div>
                            <div className="search_popover_field">
                                <label>Check-out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    min={checkIn || new Date().toISOString().split("T")[0]}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="search_divider"></div>

                <div className="search_input_group" ref={guestsRef}>
                    <div className="search_input_group_clickable" onClick={() => setIsGuestsOpen((prev) => !prev)}>
                        <span className="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.4107 4.00072C18.3507 4.00072 19.9107 5.57072 19.9107 7.50072C19.9107 9.39072 18.4107 10.9307 16.5407 11.0007C16.4543 10.9907 16.3671 10.9907 16.2807 11.0007M18.3407 20.0007C19.0607 19.8507 19.7407 19.5607 20.3007 19.1307C21.8607 17.9607 21.8607 16.0307 20.3007 14.8607C19.7507 14.4407 19.0807 14.1607 18.3707 14.0007M9.1607 10.8707C9.0607 10.8607 8.9407 10.8607 8.8307 10.8707C7.68291 10.8318 6.59535 10.3476 5.79833 9.52068C5.00132 8.6938 4.55744 7.58918 4.5607 6.44072C4.5607 3.99072 6.5407 2.00072 9.0007 2.00072C10.1769 1.97951 11.3134 2.42641 12.1602 3.24314C13.0069 4.05986 13.4945 5.17949 13.5157 6.35572C13.5369 7.53196 13.09 8.66845 12.2733 9.51517C11.4566 10.3619 10.3369 10.8495 9.1607 10.8707ZM4.1607 14.5607C1.7407 16.1807 1.7407 18.8207 4.1607 20.4307C6.9107 22.2707 11.4207 22.2707 14.1707 20.4307C16.5907 18.8107 16.5907 16.1707 14.1707 14.5607C11.4307 12.7307 6.9207 12.7307 4.1607 14.5607Z"
                                    stroke="#222222"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span>{guestsLabel}</span>
                        <span className="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3.00977 6.72L6.72977 3L10.4498 6.72M6.72977 3V21M20.9898 17.28L17.2698 21L13.5498 17.28M17.2698 21V3"
                                    stroke="#222222"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </div>

                    {isGuestsOpen && (
                        <div className="search_popover search_guests_popover">
                            <div className="search_guests_row">
                                <span>Guests</span>
                                <div className="search_guests_counter">
                                    <button type="button" onClick={() => setPeople((p) => clampPeople(p - 1))}>
                                        −
                                    </button>
                                    <span>{people}</span>
                                    <button type="button" onClick={() => setPeople((p) => clampPeople(p + 1))}>
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button className="search_btn" onClick={handleSearch}>
                    <span>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="#581ADB" />
                            <path
                                d="M23.002 31.998C25.3889 31.998 27.6781 31.0498 29.3659 29.362C31.0537 27.6742 32.002 25.385 32.002 22.998C32.002 20.6111 31.0537 18.3219 29.3659 16.6341C27.6781 14.9463 25.3889 13.998 23.002 13.998C20.615 13.998 18.3258 14.9463 16.638 16.6341C14.9502 18.3219 14.002 20.6111 14.002 22.998C14.002 25.385 14.9502 27.6742 16.638 29.362C18.3258 31.0498 20.615 31.998 23.002 31.998ZM30.932 32.688C31.462 34.288 32.672 34.448 33.602 33.048C34.452 31.768 33.892 30.718 32.352 30.718C31.212 30.708 30.572 31.598 30.932 32.688Z"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </button>
            </div>
        </section>
    );
};

export default Hero;