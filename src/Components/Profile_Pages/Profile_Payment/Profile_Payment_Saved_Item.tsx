import "./style/Profile_Payment_Saved.css";
import type { PaymentMethodDTO } from "../../../Models/dto";

type Profile_Payment_Saved_Item_Props = {
    card: PaymentMethodDTO;
    typeName: string;
    isDefault: boolean;
    isActive: boolean;
    disabled: boolean;
    onEdit: () => void;
    onMakeDefault: () => void;
    onRemove: () => void;
};

const formatCardDate = (date: string) => {
    if (!date || date.length < 7) return date;
    return `${date.slice(5, 7)}/${date.slice(2, 4)}`;
};

const Profile_Payment_Saved_Item = ({
    card,
    typeName,
    isDefault,
    isActive,
    disabled,
    onEdit,
    onMakeDefault,
    onRemove,
}: Profile_Payment_Saved_Item_Props) => {
    return (
        <div className={`Profile_Payment_Saved_Item${isActive ? " active" : ""}`}>
            <div className="Profile_Payment_Saved_Item_info">
                <div className="Profile_Payment_Saved_Item_type">
                    {typeName}
                    {isDefault && (
                        <span className="Profile_Payment_Saved_Item_badge">Default</span>
                    )}
                </div>
                <div className="Profile_Payment_Saved_Item_number">{card.cardNumber}</div>
                <div className="Profile_Payment_Saved_Item_date">{formatCardDate(card.date)}</div>
            </div>
            <div className="Profile_Payment_Saved_Item_actions">
                <button
                    className="Profile_Payment_Saved_Item_action"
                    type="button"
                    onClick={onEdit}
                    disabled={disabled}>
                    Edit
                </button>
                {!isDefault && (
                    <button
                        className="Profile_Payment_Saved_Item_action"
                        type="button"
                        onClick={onMakeDefault}
                        disabled={disabled}>
                        Make default
                    </button>
                )}
                <button
                    className="Profile_Payment_Saved_Item_action"
                    type="button"
                    onClick={onRemove}
                    disabled={disabled}>
                    Remove
                </button>
            </div>
        </div>
    );
};

export default Profile_Payment_Saved_Item;
