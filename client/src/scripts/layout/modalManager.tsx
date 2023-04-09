import ReactDOM from 'react-dom/client'
import Modal from '../../component/popups/Modal';
import { ModalDetails } from '../../types/layout';

let root: ReactDOM.Root | null = null;
let currentModal: ModalDetails | null;
export const createModal = (modalDetails: ModalDetails) => {
    // If there is already a modal, don't show another
    if (modalAlive()) return;

    currentModal = modalDetails;
    updateModal();
}

// Checks if there is a modal
export const modalAlive = (): boolean => {
    if (currentModal == null) {
        return false;
    }

    return true;
}

// Literally just unrenders the modal, nothing special
export const destroyModal = () => {
    currentModal = null;

    updateModal();
}

// Renders the modal
export const updateModal = () => {
    const modalHolder = document.getElementById("modal-holder");

    // Not possible
    if (!modalHolder) {
        return;
    }

    if (!root) {
        root = ReactDOM.createRoot(modalHolder);
    }

    if (!currentModal) {
        modalHolder.style.display = "none";
        root.render(<></>);
        return;
    }

    modalHolder.style.display = "flex";

    root.render(<Modal modalDetails={currentModal} destroyModal={destroyModal} />);
}
