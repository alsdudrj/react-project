import { useState } from "react";
import { useModalAnimation } from "../hooks/ModalAnimation";
import { Button, Modal } from "react-bootstrap";

const AlertModal = ({setShowAlertModal, onAction, Msg, okMsg}) => {
    const [showModal, setShowModal] = useModalAnimation();  //Modal 애니메이션

    return(
        <>
        <div className={`black-bg ${showModal}`}>
            <div
                className="modal"
                style={{ display: 'block', position: 'initial' }}
                onMouseDown={(e) => {
                    if(e.target === e.currentTarget){
                        setShowAlertModal(false);
                    }
                }}
            >
                <Modal.Dialog 
                className={`white-bg ${showModal}`}
                onClick={(e) => e.stopPropagation()}
                >
                    <Modal.Header className="text-center">
                        <Modal.Title className="w-100">{Msg}</Modal.Title>
                    </Modal.Header> 

                    <Modal.Footer className="justify-content-center">
                        <Button variant="outline-secondary" onClick={() => setShowAlertModal(false)}>아니오</Button>
                            <Button variant="outline-danger" 
                            onClick={() => {
                                    setShowAlertModal(false);
                                    onAction();
                                }
                            }>
                            {okMsg}</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        </div>
        </>
    );
}
export default AlertModal;