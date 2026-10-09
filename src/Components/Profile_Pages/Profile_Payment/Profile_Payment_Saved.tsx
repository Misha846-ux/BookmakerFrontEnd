import "./style/Profile_Payment_Saved.css";
import no_saved_payments_photo from "./photos/no_saved_payments_photo.png";
import Profile_Payment_Saved_Item from "./Profile_Payment_Saved_Item";
import type { PaymentMethodDTO } from "../../../Models/dto";

type Profile_Payment_Saved_Props = {
    cards: PaymentMethodDTO[];
    isLoading: boolean;
    typeName: (cardTypeId: number) => string;
    defaultCardId: number | null;
    activeCardId: number | null;
    disabled: boolean;
    onEdit: (card: PaymentMethodDTO) => void;
    onAddNew: () => void;
    onMakeDefault: (card: PaymentMethodDTO) => void;
    onRemove: (card: PaymentMethodDTO) => void;
};

const Profile_Payment_Saved = ({
    cards,
    isLoading,
    typeName,
    defaultCardId,
    activeCardId,
    disabled,
    onEdit,
    onAddNew,
    onMakeDefault,
    onRemove,
}: Profile_Payment_Saved_Props) => {
    return (
        <div className="Profile_Payment_Saved_body">
            <div className="Profile_Payment_Saved_top_row">
                <div className="Profile_Payment_Saved_top">SAVED PAYMENT METHODS</div>
                <button
                    className="Profile_Payment_Saved_add_btn"
                    type="button"
                    onClick={onAddNew}
                    disabled={disabled || isLoading}>
                    + Add new card
                </button>
            </div>
            {isLoading ? (
                <div className="Profile_Payment_Saved_context">
                    <div className="Profile_Payment_Saved_text">Loading...</div>
                </div>
            ) : cards.length === 0 ? (
                <div className="Profile_Payment_Saved_context">
                    <img className="Profile_Payment_Saved_img" src={no_saved_payments_photo} alt="" />
                    <div className="Profile_Payment_Saved_text">You have no saved payment methods</div>
                </div>
            ) : (
                <div className="Profile_Payment_Saved_list">
                    {cards.map((card) => (
                        <Profile_Payment_Saved_Item
                            key={card.id}
                            card={card}
                            typeName={typeName(card.cardType)}
                            isDefault={card.id === defaultCardId}
                            isActive={card.id === activeCardId}
                            disabled={disabled}
                            onEdit={() => onEdit(card)}
                            onMakeDefault={() => onMakeDefault(card)}
                            onRemove={() => onRemove(card)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile_Payment_Saved;
