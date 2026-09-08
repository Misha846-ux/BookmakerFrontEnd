import { useState } from "react";
import Header from "../Components/Header/Header";
import LoginModal from "../Components/Auth/LoginModal";
import RegisterModal from "../Components/Auth/RegisterModal";
import AuthenticationModal from "../Components/Auth/AuthenticationModal";
import InformationModal from "../Components/Auth/InformationModal";
import AllDoneModal from "../Components/Auth/AllDoneModal";
import Router from "../Router";

type OpenModal = "register" | "login" | "authentication" | "information" | "all-done" | null;

const General = () => {
	const [openModal, setOpenModal] = useState<OpenModal>(null);

	return (
		<div className="app_wrapper">
			<Header
				onRegister={() => setOpenModal("register")}
				onSignIn={() => setOpenModal("login")}
			/>
			<RegisterModal
				isOpen={openModal === "register"}
				onClose={() => setOpenModal(null)}
				onSwitchToLogin={() => setOpenModal("login")}
				onContinue={() => setOpenModal("authentication")}
			/>
			<LoginModal
				isOpen={openModal === "login"}
				onClose={() => setOpenModal(null)}
				onSwitchToRegister={() => setOpenModal("register")}
				onContinue={() => setOpenModal("authentication")}
			/>
			<AuthenticationModal
				isOpen={openModal === "authentication"}
				onClose={() => setOpenModal(null)}
				onContinue={() => setOpenModal("information")}
			/>
			<InformationModal
				isOpen={openModal === "information"}
				onClose={() => setOpenModal(null)}
				onContinue={() => setOpenModal("all-done")}
			/>
			<AllDoneModal
				isOpen={openModal === "all-done"}
				onClose={() => setOpenModal(null)}
				onCheckProfile={() => setOpenModal(null)}
				onContinueBooking={() => setOpenModal(null)}
			/>
			<main className="main_content">
				<Router />
			</main>
		</div>
	);
};

export default General;
