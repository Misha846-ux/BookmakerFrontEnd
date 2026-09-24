import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import LoginModal from "../Components/Auth/LoginModal";
import RegisterModal from "../Components/Auth/RegisterModal";
import AuthenticationModal from "../Components/Auth/AuthenticationModal";
import InformationModal from "../Components/Auth/InformationModal";
import AllDoneModal from "../Components/Auth/AllDoneModal";
import Router from "../Router";
import { useAuth } from "../Context/AuthContext";

type OpenModal = "register" | "login" | "authentication" | "information" | "all-done" | null;

const General = () => {
	const [openModal, setOpenModal] = useState<OpenModal>(null);
	const [authEmail, setAuthEmail] = useState('');
	const [authPassword, setAuthPassword] = useState('');
	const { user, logout, previousPath, setPreviousPath } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const handleOpenRegister = useCallback(() => {
		setPreviousPath(location.pathname);
		setOpenModal("register");
	}, [location.pathname, setPreviousPath]);

	const handleOpenLogin = useCallback(() => {
		setPreviousPath(location.pathname);
		setOpenModal("login");
	}, [location.pathname, setPreviousPath]);

	const handleRegistered = useCallback((email: string, password: string) => {
		setAuthEmail(email);
		setAuthPassword(password);
		setOpenModal("authentication");
	}, []);

	const handleLoginSuccess = useCallback((hasInfo: boolean) => {
		setOpenModal(null);
		if (!hasInfo) {
			setOpenModal("information");
		} else {
			setOpenModal("all-done");
		}
	}, []);

	const handleGoogleSuccess = useCallback(() => {
		setOpenModal("all-done");
	}, []);

	const handleVerified = useCallback((hasInfo: boolean) => {
		if (!hasInfo) {
			setOpenModal("information");
		} else {
			setOpenModal("all-done");
		}
	}, []);

	const handleInformationContinue = useCallback(() => {
		setOpenModal("all-done");
	}, []);

	const handleCheckProfile = useCallback(() => {
		setOpenModal(null);
	}, []);

	const handleContinueBooking = useCallback(() => {
		setOpenModal(null);
		if (previousPath) {
			navigate(previousPath);
		}
	}, [previousPath, navigate]);

	const handleLogout = useCallback(() => {
		logout();
	}, [logout]);

	return (
		<div className="app_wrapper">
			<Header
				onRegister={handleOpenRegister}
				onSignIn={handleOpenLogin}
				user={user}
				onLogout={handleLogout}
			/>
			<RegisterModal
				isOpen={openModal === "register"}
				onClose={() => setOpenModal(null)}
				onSwitchToLogin={() => setOpenModal("login")}
				onRegistered={handleRegistered}
				onGoogleSuccess={handleGoogleSuccess}
			/>
			<LoginModal
				isOpen={openModal === "login"}
				onClose={() => setOpenModal(null)}
				onSwitchToRegister={() => setOpenModal("register")}
				onLoginSuccess={handleLoginSuccess}
				onGoogleSuccess={handleGoogleSuccess}
			/>
			<AuthenticationModal
				isOpen={openModal === "authentication"}
				onClose={() => setOpenModal(null)}
				email={authEmail}
				password={authPassword}
				onVerified={handleVerified}
			/>
			<InformationModal
				isOpen={openModal === "information"}
				onClose={() => setOpenModal(null)}
				onContinue={handleInformationContinue}
			/>
			<AllDoneModal
				isOpen={openModal === "all-done"}
				onClose={() => setOpenModal(null)}
				onCheckProfile={handleCheckProfile}
				onContinueBooking={handleContinueBooking}
			/>
			<main className="main_content">
				<Router />
			</main>
		</div>
	);
};

export default General;
