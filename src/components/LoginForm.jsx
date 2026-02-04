import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginForm = ({setShowLogin, showRegister, setShowRegister}) => {
    const navigate = useNavigate();


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <div className="login-overlay">
            <Form>
                <Form.Group className="mb-3" controlId="Id">
                    <Form.Control type="email" placeholder="아이디" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="Password">
                    <Form.Control type="password" placeholder="패스워드" />
                </Form.Group>
                <Form.Group className="d-flex justify-content-between align-items-center" controlId="Checkbox">
                    <Form.Check type="checkbox" label="날 기억해줘" className="login-checkbox"/>
                    <Button variant="outline-dark" type="submit">
                        로그인
                    </Button>
                </Form.Group>
                <div className="d-grid gap-2 mt-1">
                    <Button onClick={() => { setShowRegister(!showRegister); setShowLogin(false) }} variant="outline-danger" size="lg">
                        회원가입
                    </Button>
                 </div>
            </Form>
        </div>
        </>
    );
};
export default LoginForm;