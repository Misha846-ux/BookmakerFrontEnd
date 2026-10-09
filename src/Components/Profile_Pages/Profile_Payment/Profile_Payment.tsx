import "./style/Profile_Payment.css";
import { useAuth } from "../../../Context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import {
    createPaymentMethod,
    deletePaymentMethod,
    getDebitCards,
    getMyPaymentMethods,
    setDefaultPaymentMethod,
    updatePaymentMethod,
} from "../../../Endpoints/PaymentMethodsEndpoints";
import { apiErrorMessage } from "../../../utils/apiError";
import type {
    CreatePaymentMethodDTO,
    DebitCardDTO,
    PaymentMethodDTO,
} from "../../../Models/dto";
import Profile_Payment_Saved from "./Profile_Payment_Saved";
import Profile_Payment_Text from "./Profile_Payment_Text";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const toIsoDate = (mmYY: string) => {
    const [month, year] = mmYY.split("/");
    return `20${year}-${month}-01`;
};

const formatCardDate = (date: string | null | undefined) => {
    if (!date || date.length < 7) return "";
    return `${date.slice(5, 7)}/${date.slice(2, 4)}`;
};

const formatDateInput = (value: string) => {
    const digits = digitsOnly(value).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const Profile_Payment = () => {
    const { user, isAuthenticated, isLoading, refreshUser } = useAuth();

    const [debitCards, setDebitCards] = useState<DebitCardDTO[]>([]);
    const [cards, setCards] = useState<PaymentMethodDTO[]>([]);
    const [listsLoaded, setListsLoaded] = useState(false);
    const [activeCardId, setActiveCardId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formCardType, setFormCardType] = useState("");
    const [formCardNumber, setFormCardNumber] = useState("");
    const [formCardDate, setFormCardDate] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCards = useCallback(async () => {
        try {
            const [cardList, savedList] = await Promise.all([
                getDebitCards().catch(() => [] as DebitCardDTO[]),
                getMyPaymentMethods(),
            ]);
            setDebitCards(cardList);
            setCards(savedList);
        } catch (err) {
            setError(apiErrorMessage(err, "Unable to load your payment methods."));
        } finally {
            setListsLoaded(true);
        }
    }, []);

    useEffect(() => {
        void loadCards();
    }, [loadCards]);

    const typeName = (cardTypeId: number | null | undefined): string => {
        if (cardTypeId === null || cardTypeId === undefined) return "Card";
        const debitCard = debitCards.find((card) => card.id === cardTypeId);
        return debitCard?.name ?? debitCard?.type ?? "Card";
    };

    const defaultCard =
        cards.find((card) => card.id === user?.payMethod) ?? cards[0] ?? null;
    const activeCard = activeCardId !== null
        ? cards.find((card) => card.id === activeCardId)
        : undefined;
    const viewCard = activeCard ?? defaultCard;

    const beginEdit = (card: PaymentMethodDTO | null) => {
        setError(null);
        if (card) {
            setActiveCardId(card.id);
            setFormCardType(typeName(card.cardType));
            setFormCardNumber(card.cardNumber);
            setFormCardDate(formatCardDate(card.date));
        } else {
            setActiveCardId(null);
            setFormCardType("");
            setFormCardNumber("");
            setFormCardDate("");
        }
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setError(null);
    };

    const handleSave = async () => {
        if (isSaving) return;
        setError(null);

        const trimmedType = formCardType.trim().toLowerCase();
        const cardTypeId = debitCards.find(
            (card) => (card.name ?? card.type ?? "").trim().toLowerCase() === trimmedType,
        )?.id;
        if (cardTypeId === undefined) {
            setError("Please choose a card type from the list.");
            return;
        }

        const isMaskedNumber = formCardNumber.includes("*");
        const digits = digitsOnly(formCardNumber);
        if (!isMaskedNumber && (digits.length < 13 || digits.length > 19)) {
            setError("Card number must contain 13 to 19 digits.");
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(formCardDate)) {
            setError("Please enter the card expiry date as MM/YY.");
            return;
        }
        const month = Number(formCardDate.split("/")[0]);
        if (month < 1 || month > 12) {
            setError("Please enter the expiry month between 01 and 12.");
            return;
        }

        setIsSaving(true);
        try {
            if (activeCardId === null) {
                const created = await createPaymentMethod({
                    cardType: cardTypeId,
                    cardNumber: digits,
                    date: toIsoDate(formCardDate),
                });
                await loadCards();
                await refreshUser();
                setActiveCardId(created.id);
                setIsEditing(false);
            } else {
                const card = cards.find((item) => item.id === activeCardId);
                const payload: Partial<CreatePaymentMethodDTO> = {};
                if (cardTypeId !== card?.cardType) payload.cardType = cardTypeId;
                const isoDate = toIsoDate(formCardDate);
                if (isoDate !== card?.date) payload.date = isoDate;
                if (!isMaskedNumber) payload.cardNumber = digits;

                if (Object.keys(payload).length > 0) {
                    await updatePaymentMethod(activeCardId, payload);
                    await loadCards();
                }
                setIsEditing(false);
            }
        } catch (err) {
            setError(apiErrorMessage(err, "Unable to save the payment method."));
        } finally {
            setIsSaving(false);
        }
    };

    const handleMakeDefault = async (card: PaymentMethodDTO) => {
        if (isSaving) return;
        setError(null);
        setIsSaving(true);
        try {
            await setDefaultPaymentMethod(card.id);
            setActiveCardId(card.id);
            await loadCards();
            await refreshUser();
        } catch (err) {
            setError(apiErrorMessage(err, "Unable to set the default payment method."));
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async (card: PaymentMethodDTO) => {
        if (isSaving) return;
        const confirmed = window.confirm(
            `Do you really want to remove the payment method ending with ${card.cardNumber.slice(-4)}?`,
        );
        if (!confirmed) return;

        setError(null);
        setIsSaving(true);
        try {
            await deletePaymentMethod(card.id);
            if (activeCardId === card.id) {
                setActiveCardId(null);
                setIsEditing(false);
            }
            await loadCards();
            await refreshUser();
        } catch (err) {
            setError(apiErrorMessage(err, "Unable to remove the payment method."));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="Profile_Payment_text">Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <div className="Profile_Payment_text">Please log in to edit your profile.</div>;
    }

    return (
        <div className="Profile_Payment_body">
            <div className="Profile_Payment_box">
                <div className="Profile_Payment_top">Payment method</div>
                <div className="Profile_Payment_content">
                    <div className="Profile_Payment_profile">
                        <div className="Profile_Payment_user">
                            <div className="Profile_Payment_user_data">
                                <div className="Profile_Payment_inputs_content">
                                    <div className="Profile_Payment_input_box">
                                        <div className="Profile_Payment_input_line">
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        className="Profile_Payment_input"
                                                        list="debit_cards"
                                                        value={formCardType}
                                                        placeholder="Type of your debit card"
                                                        onChange={(event) => setFormCardType(event.target.value)}
                                                    />
                                                    <datalist id="debit_cards">
                                                        {debitCards.map((card) => (
                                                            <option key={card.id} value={card.name ?? card.type ?? ""} />
                                                        ))}
                                                    </datalist>
                                                </>
                                            ) : (
                                                <div className="Profile_Payment_input_text">
                                                    {viewCard ? typeName(viewCard.cardType) : "Type of your debit card"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="Profile_Payment_input_box">
                                        <div className="Profile_Payment_input_line">
                                            {isEditing ? (
                                                <input className="Profile_Payment_input" placeholder="Credit or debit card number" type="text"
                                                    name="cardNumber" value={formCardNumber}
                                                    onChange={(event) => setFormCardNumber(event.target.value)} required />
                                            ) : (
                                                <div className="Profile_Payment_input_text">
                                                    {viewCard?.cardNumber || "Credit or debit card number"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="Profile_Payment_input_box">
                                        <div className="Profile_Payment_input_line">
                                            {isEditing ? (
                                                <input className="Profile_Payment_date" placeholder="MM | YY" type="text"
                                                    name="card_date" value={formCardDate}
                                                    onChange={(event) => setFormCardDate(formatDateInput(event.target.value))} required />
                                            ) : (
                                                <div className="Profile_Payment_input_text">
                                                    {formatCardDate(viewCard?.date) || "Month | Date"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="Profile_Payment_bottom_text">
                                        {error && (
                                            <div className="Profile_Payment_error">
                                                {error}
                                            </div>
                                        )}
                                        {isEditing ? (
                                            <button className="Profile_Payment_save_button"
                                                type="button"
                                                onClick={handleCancelEdit}
                                                disabled={isSaving}>
                                                Cancel
                                            </button>
                                        ) : (
                                            <button className="Profile_Payment_save_button"
                                                type="button"
                                                onClick={() => beginEdit(viewCard)}
                                                disabled={!listsLoaded}>
                                                Edit
                                            </button>
                                        )}
                                        <button className="Profile_Payment_save_button" type="button"
                                            onClick={() => void handleSave()}
                                            disabled={isSaving || !isEditing}>
                                            {isSaving ? "Saving..." : "Save changes"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="Profile_Payment_text_for_user">
                            This information will be kept private and confidential.
                            <br />
                            <br />
                            Once your booking is confirmed, the payment details will be automatically filled in for your convenience.
                        </div>
                    </div>
                </div>
            </div>
            <Profile_Payment_Saved
                cards={cards}
                isLoading={!listsLoaded}
                typeName={typeName}
                defaultCardId={user.payMethod ?? null}
                activeCardId={isEditing ? activeCardId : null}
                disabled={isSaving}
                onEdit={beginEdit}
                onAddNew={() => beginEdit(null)}
                onMakeDefault={handleMakeDefault}
                onRemove={handleRemove}
            />
            <Profile_Payment_Text />
        </div>
    );
};
export default Profile_Payment;
