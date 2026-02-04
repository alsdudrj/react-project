import { Button, Form, Modal } from "react-bootstrap";
import { useModalAnimation } from "../hooks/ModalAnimation";

const Register = ({showRegister, setShowRegister}) => {

    const [showModal, setShowModal] = useModalAnimation();

    return(
        <>
        <div className={`black-bg ${showModal}`} onClick={() => setShowRegister(false)}>
            <div
                className="modal"
                style={{ display: 'block', position: 'initial' }}
                >
                <Modal.Dialog 
                className={`white-bg ${showModal}`}
                onClick={(e) => e.stopPropagation()}
                >
                    <Modal.Header>
                    <Modal.Title>초간단 회원가입</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="아이디" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="패스워드" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Control type="password" placeholder="이름" />
                        </Form.Group>

                        <Form.Check
                            type="radio"
                            label="일반인"
                            name="role"
                            id="role-user"
                            className="login-checkbox"
                        />
                        <Form.Check
                            type="radio"
                            label="관리자"
                            name="role"
                            id="role-admin"
                            className="login-checkbox"
                        />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowRegister(false)}>가입안해</Button>
                        <Button variant="outline-danger">회원가입</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        </div>
        </>
    );
}
export default Register;