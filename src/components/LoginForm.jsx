import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginForm = ({setShowLogin}) => {
    const navigate = useNavigate();

    return(
        <>
        <div className="login-overlay">
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="아이디" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="패스워드" />
                </Form.Group>
                <Form.Group className="d-flex justify-content-between align-items-center" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="날 기억해줘" className="login-checkbox"/>
                    <Button variant="outline-dark" type="submit">
                        로그인
                    </Button>
                </Form.Group>
                <div className="d-grid gap-2 mt-1">
                    <Button onClick={() => { navigate('/register'); setShowLogin(false) }} variant="outline-success" size="lg">
                        회원가입
                    </Button>
                 </div>
            </Form>
        </div>
        </>
    );
};
export default LoginForm;