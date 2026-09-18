import "./Header.css"

type User = {
    id: number;
    name: string;
    email: string;
} | null;

interface HeaderProps {
    onRegister: () => void
    onSignIn: () => void
    user: User
    onLogout: () => void
}

const Header = ({ onRegister, onSignIn, user, onLogout }: HeaderProps) =>{
    return(
        <header className="header">
            <div className="header_container">
                <p className="text_hotel">Hotel for <span className="text_purple">you.</span></p>
                <div className="header_actions">
                    <div className="language_select"></div>
                    {user ? (
                        <>
                            <span style={{ color: '#222222', fontSize: '14px', marginRight: '8px' }}>
                                {user.name || user.email}
                            </span>
                            <button className="btn btn_signin" type="button" onClick={onLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn_register" type="button" onClick={onRegister}>Register</button>
                            <button className="btn btn_signin" type="button" onClick={onSignIn}>Sign In <span className="icon_user"><svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.28 0C3.315 0 1.7175 1.5975 1.7175 3.5625C1.7175 5.49 3.225 7.05 5.19 7.1175C5.25 7.11 5.31 7.11 5.355 7.1175H5.4075C6.32952 7.08674 7.20343 6.69861 7.84447 6.03518C8.4855 5.37175 8.8434 4.48503 8.8425 3.5625C8.8425 1.5975 7.245 0 5.28 0ZM9.09 9.11175C6.9975 7.71675 3.585 7.71675 1.4775 9.11175C0.525 9.74925 0 10.6117 0 11.5343C0 12.4567 0.525 13.3118 1.47 13.9418C2.52 14.6468 3.9 14.9993 5.28 14.9993C6.66 14.9993 8.04 14.6468 9.09 13.9418 10.035 13.3043 10.56 12.4492 10.56 11.5192C10.5525 10.5967 10.035 9.74175 9.09 9.11175Z" fill="white"/></svg></span></button>
                        </>
                    )}
                </div> 
            </div>
        </header>
    )

}
export default Header
