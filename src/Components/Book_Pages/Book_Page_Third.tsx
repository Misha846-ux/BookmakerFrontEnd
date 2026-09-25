import "./style/Book_Page_Third.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useBooking } from "../../Context/BookingContext";
import { useAuth } from "../../Context/AuthContext";
import { createPaymentMethod, getDebitCards, getMyPaymentMethods } from "../../Endpoints/PaymentMethodsEndpoints";
import { createReservation } from "../../Endpoints/ReservationEndpoints";
import type { CreateReservationDTO, DebitCardDTO, PaymentMethodDTO } from "../../Models/dto";
import { apiErrorMessage } from "../../utils/apiError";
import prev_btn_photo from "./photo/prev_btn_photo.png";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const maskCardNumber = (cardNumber: string) => {
    const digits = digitsOnly(cardNumber);
    const lastFour = digits.slice(-4);
    return `**** **** **** ${lastFour}`;
};

const formatDate = (date: string | null) => {
    if (!date) return "";
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("en-EN", {
        day: "numeric",
        month: "long",
    }).format(parsed);
};

const Book_Page_Third = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hotel_id, room_id } = useParams();
    const { guest, contact, checkIn, checkOut, room, setCreatedReservation, setGuest, setError: clearBookingError } = useBooking();
    const { isAuthenticated, user } = useAuth();

    const [debitCards, setDebitCards] = useState<DebitCardDTO[]>([]);
    const [savedCards, setSavedCards] = useState<PaymentMethodDTO[]>([]);
    const [debitCardNames, setDebitCardNames] = useState<Record<number, string>>({});

    const [typeOfDebitCard, setTypeOfDebitCard] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardDate, setCardDate] = useState("");
    const [agreement, setAgreement] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [showCheckModal, setShowCheckModal] = useState(false);

    const stepsCompleted =
        guest.name.trim() !== "" &&
        guest.surname.trim() !== "" &&
        guest.email.trim() !== "" &&
        contact.phoneNumber.trim() !== "" &&
        contact.countryId !== null &&
        checkIn !== null &&
        checkOut !== null &&
        room !== null;

    useEffect(() => {
        if (!stepsCompleted) {
            navigate(`/hotel/${hotel_id}/room/${room_id}/first${location.search}`, { replace: true });
        }
    }, [stepsCompleted, navigate, hotel_id, room_id, location.search]);

    useEffect(() => {
        clearBookingError(null);
        const loadCards = async () => {
            const [cardsResponse, savedResponse] = await Promise.all([
                getDebitCards().catch(() => []),
                isAuthenticated ? getMyPaymentMethods().catch(() => []) : Promise.resolve([]),
            ]);
            setDebitCards(cardsResponse);
            setSavedCards(savedResponse);
            setDebitCardNames(Object.fromEntries(cardsResponse.map((c) => [c.id, c.name])));
            if (!user?.payMethod) return;
            const defaultCard = savedResponse.find((card) => card.id === user.payMethod);
            if (defaultCard) setSelectedCardId(defaultCard.id);
        };
        void loadCards();
    }, [isAuthenticated, user?.payMethod, clearBookingError]);

    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(`${checkIn}T00:00:00`).getTime();
        const end = new Date(`${checkOut}T00:00:00`).getTime();
        if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
        return Math.round((end - start) / 86_400_000);
    }, [checkIn, checkOut]);

    const totalPrice = room ? Number(room.price) * nights : 0;

    const cardDigits = digitsOnly(cardNumber);
    const cardDigitsValid = cardDigits.length >= 13 && cardDigits.length <= 19;
    const cardDateValid = /^\d{2}\/\d{2}$/.test(cardDate);
    const cardDateMonthValid = cardDateValid
        ? Number(cardDate.split("/")[0]) >= 1 && Number(cardDate.split("/")[0]) <= 12
        : false;

    const cardTypeId = debitCards.find(
        (card) => card.name.toLowerCase() === typeOfDebitCard.trim().toLowerCase(),
    )?.id;

    const manualCardValid =
        typeOfDebitCard.trim() !== "" &&
        cardTypeId !== undefined &&
        cardDigits.trim() !== "" &&
        cardDigitsValid &&
        cardDateValid &&
        cardDateMonthValid;

    const hasSelectedSavedCard = selectedCardId !== null;

    const isFiiled = (manualCardValid || hasSelectedSavedCard) && agreement;

    const handleDateChange = (value: string) => {
        const digits = digitsOnly(value).slice(0, 4);
        if (digits.length <= 2) {
            setCardDate(digits);
        } else {
            setCardDate(`${digits.slice(0, 2)}/${digits.slice(2)}`);
        }
    };

    const toIsoDate = (mmYY: string) => {
        const [month, year] = mmYY.split("/");
        return `20${year}-${month}-01`;
    };

    const handleOnClickBack = () => {
        navigate(`/hotel/${hotel_id}/room/${room_id}/second${location.search}`);
    };

    const handleOnClick = async () => {
        if (!isFiiled || submitting) return;
        if (!room || !checkIn || !checkOut) {
            setSubmitError("Booking data is incomplete. Please start over.");
            return;
        }
        setSubmitting(true);
        setSubmitError("");

        let payMethodId: number | null = selectedCardId;
        if (payMethodId === null) {
            if (cardTypeId === undefined) {
                setSubmitError("Please choose a card type from the list.");
                setSubmitting(false);
                return;
            }
            try {
                const created = await createPaymentMethod({
                    cardType: cardTypeId,
                    cardNumber: digitsOnly(cardNumber),
                    date: toIsoDate(cardDate),
                });
                payMethodId = created.id;
            } catch (error) {
                setSubmitError(apiErrorMessage(error, "Unable to save the payment method."));
                setSubmitting(false);
                return;
            }
        }

        const reservation: CreateReservationDTO = {
            checkIn,
            checkOut,
            name: guest.name,
            sureName: guest.surname,
            email: guest.email,
            phoneNumber: contact.phoneNumber,
            cityGuide: guest.cityGuide,
            allowChangeBooking: guest.allowChangeBooking,
            confirmByCall: contact.confirmByCall,
            confirmByEmail: contact.confirmByEmail,
            room: room.id,
            country: contact.countryId,
            payMethod: payMethodId,
        };
        if (!isAuthenticated && guest.password) {
            reservation.password = guest.password;
        }

        try {
            const created = await createReservation(reservation);
            setCreatedReservation(created);
            setGuest({ password: "" });
            const finaleParams = new URLSearchParams(location.search);
            finaleParams.set("reservation", String(created.id));
            if (created.viewToken) {
                finaleParams.set("token", created.viewToken);
            }
            navigate(`/hotel/${hotel_id}/room/${room_id}/finale?${finaleParams.toString()}`);
        } catch (error) {
            const message = apiErrorMessage(error, "Unable to complete the booking.");
            setSubmitError(
                message.toLowerCase().includes("unavailable")
                    ? "This room is no longer available for the selected dates."
                    : message,
            );
            setSubmitting(false);
        }
    };

    const savedCardLabel = (card: PaymentMethodDTO) => {
        const name = debitCardNames[card.cardType] ?? "Card";
        return `${name} - ${maskCardNumber(card.cardNumber)}`;
    };

    return (
        <div className="Third_Page_body">
            {submitting && <div className="Third_Page_submitting">Booking...</div>}
            <button className="Third_Page_prev_btn" onClick={handleOnClickBack}>
                <img src={prev_btn_photo} alt="back" />
            </button>
            <div className="Third_Page_content">
                <div className="Third_Page_top">
                    <div className="Third_Page_top_text">3/3</div>
                    <div className="Third_Page_top_text">Booking</div>
                </div>
                <div className="Third_Page_inputs">
                    {savedCards.length > 0 && (
                        <div className="Third_Page_saved_cards">
                            {savedCards.map((card) => (
                                <label key={card.id}
                                    className={`Third_Page_saved_card${selectedCardId === card.id ? " active" : ""}`}>
                                    <input type="radio" name="savedCard" checked={selectedCardId === card.id}
                                        onChange={() => setSelectedCardId(card.id)} />
                                    {savedCardLabel(card)}
                                </label>
                            ))}
                        </div>
                    )}
                    <div className="Third_Page_inputs_line">
                        <input
                            className="Third_Page_input"
                            list="debitCards"
                            placeholder="Type of your debit card"
                            value={typeOfDebitCard}
                            onChange={(event) => {
                                setSelectedCardId(null);
                                setTypeOfDebitCard(event.target.value);
                            }}
                            required
                        />
                        <datalist id="debitCards">
                            {debitCards.map((card) => (
                                <option key={card.id} value={card.name} />
                            ))}
                        </datalist>
                        <div className="Third_Page_no_card_box">
                            <a href="#" className="No_card" onClick={(event) => event.preventDefault()}>No card?</a>
                        </div>
                    </div>
                    <div className="Third_Page_inputs_line">
                        <input className="Third_Page_input" placeholder="Credit or debit card number" type="text"
                            name="cardNumber" value={cardNumber}
                            onChange={(event) => {
                                setSelectedCardId(null);
                                setCardNumber(event.target.value);
                            }} required />
                        <div className="Third_Page_input_text">Required to confirm your booking</div>
                    </div>
                    <div className="Third_Page_inputs_line">
                        <input className="Third_Page_input_date" placeholder="MM/YY" type="text"
                            name="cardDate" value={cardDate} onChange={(event) => {
                                setSelectedCardId(null);
                                handleDateChange(event.target.value);
                            }} required />
                    </div>
                </div>
            </div>
            {totalPrice > 0 && (
                <div className="Third_Page_total">
                    {room && (
                        <>
                            <span>{room.price}$ x {nights} night{nights === 1 ? "" : "s"}</span>
                            <span className="Third_Page_total_value">{totalPrice}$</span>
                        </>
                    )}
                </div>
            )}
            {submitError && <div className="Third_Page_error_text">{submitError}</div>}
            <div className="Third_Page_booleans">
                <div className="Third_Page_checkbox_text">
                    <input className="Third_Page_checkbox" type="checkbox" checked={agreement}
                        onChange={(event) => setAgreement(event.target.checked)} id="agreement" />
                    <label htmlFor="agreement">
                        I agree to the <label style={{ color: "#581ADB" }}>general booking</label> conditions and
                        <label style={{ color: "#581ADB" }}>privacy policy</label>
                    </label>
                </div>
            </div>
            <div className="Third_Page_btn_box">
                <button className="Third_Page_continue_btn" type="submit" onClick={handleOnClick}
                    disabled={!isFiiled || submitting || !room || !checkIn || !checkOut}>COMPLETE THE BOOKING</button>
            </div>
            <div className="Third_Page_btn_box">
                <button className="Third_Page_check_btn" onClick={() => setShowCheckModal(true)}>
                    Check the data before submitting
                </button>
            </div>
            <CheckDataModal show={showCheckModal} onClose={() => setShowCheckModal(false)}
                onProceed={() => {
                    setShowCheckModal(false);
                    if (room && checkIn && checkOut) {
                        void handleOnClick();
                    }
                }} />
        </div>
    );
};

const CheckDataModal = ({ show, onClose, onProceed }: {
    show: boolean;
    onClose: () => void;
    onProceed: () => void;
}) => {
    const { guest, contact, checkIn, checkOut, room } = useBooking();
    if (!show) return null;
    return (
        <div className="Third_Page_modal_overlay" onClick={onClose}>
            <div className="Third_Page_modal" onClick={(event) => event.stopPropagation()}>
                <div className="Third_Page_modal_title">Your booking data</div>
                <div className="Third_Page_modal_row">
                    <span>Dates</span>
                    <span>{formatDate(checkIn)} - {formatDate(checkOut)}</span>
                </div>
                <div className="Third_Page_modal_row">
                    <span>Guest</span>
                    <span>{`${guest.name} ${guest.surname}`}</span>
                </div>
                <div className="Third_Page_modal_row">
                    <span>Email</span>
                    <span>{guest.email}</span>
                </div>
                <div className="Third_Page_modal_row">
                    <span>Phone</span>
                    <span>{contact.phoneNumber}</span>
                </div>
                {room && (
                    <div className="Third_Page_modal_row">
                        <span>Room</span>
                        <span>{`${room.description} (${room.price}$/night)`}</span>
                    </div>
                )}
                <div className="Third_Page_modal_btns">
                    <button className="Third_Page_modal_cancel" onClick={onClose}>Back</button>
                    <button className="Third_Page_modal_confirm" onClick={onProceed}>Confirm and complete</button>
                </div>
            </div>
        </div>
    );
};

export default Book_Page_Third;

