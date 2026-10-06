import "../RegisterAccountButton/style/RegisterAccountButton.css";

const vector_1 = <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.457 0.75V20.75M14.457 2.75H3.25703C0.55703 2.75 -0.0429691 4.25 1.85703 6.15L3.05703 7.35C3.85703 8.15 3.85703 9.45 3.05703 10.15L1.85703 11.35C-0.0429691 13.25 0.657031 14.75 3.25703 14.75H14.457" stroke="#581ADB" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
const vector_2 = <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 0.75V20.75M0.75 2.75H11.95C14.65 2.75 15.25 4.25 13.35 6.15L12.15 7.35C11.35 8.15 11.35 9.45 12.15 10.15L13.35 11.35C15.25 13.25 14.55 14.75 11.95 14.75H0.75" stroke="#581ADB" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


const RegisterAccountButton = () => {
    return(
        <div className="RegisterAccountButton_body">
            <div className="vector">{vector_1}</div>
            <button className="RegisterAccountButton_btn">Register an account</button>
            <div className="vector">{vector_2}</div>
        </div>
    );
}

export default RegisterAccountButton;