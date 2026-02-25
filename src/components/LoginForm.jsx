import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useKakao } from "../hooks/Kakao";
import { useGoogle } from "../hooks/Google";
import { useState } from "react";
import { useLogin } from "../hooks/Login";


const LoginForm = ({setShowLogin, showRegister, setShowRegister, setFooterFade, setFooterMsg, onLoginSuccess}) => {
    const navigate = useNavigate();

    const [rememberMe, setRememberMe] = useState(false);    //로그인 유지에 관한 체크박스 상태
    const [userInfo, loginWithKakao] = useKakao();
    const [googleUser, loginWithGoogle] = useGoogle();

    const [handleLogin, userName, setUserName, password, setPassword] = 
        useLogin(
            setShowLogin, setFooterFade, setFooterMsg, onLoginSuccess, rememberMe
        );

    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <div className="login-overlay">
            <Form>
                <Form.Group className="mb-3" controlId="Id">
                    <Form.Control type="id" placeholder="아이디" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="Password">
                    <Form.Control type="password" placeholder="패스워드"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="d-flex justify-content-between align-items-center" controlId="Checkbox">
                    <Form.Check 
                    type="checkbox" 
                    label="날 기억해줘" 
                    className="login-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <Button variant="outline-light" type="submit"
                    onClick={handleLogin}
                    >
                        로그인
                    </Button>
                </Form.Group>

                <div className="social-divider">
                    <span>또는</span>
                </div>

                <div className="d-grid gap-2 mt-1">
                    <Button variant="outline-danger" size="lg"
                    onClick={() => { 
                        setShowRegister(!showRegister); 
                        setShowLogin(false);
                    }} >
                        회원가입
                    </Button>
                </div>
                
                {/*소셜로그인 버튼*/}
                <div className="social-divider">
                    <span>또는</span>
                </div>

                <div className="d-grid gap-2">
                    <Button variant="light" className="btn-social btn-google"
                    onClick={(e) => {
                        e.preventDefault();
                        loginWithGoogle();
                    }}
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="google" />
                        Google로 시작하기
                    </Button>
                    
                    <Button className="btn-social btn-kakao"
                    onClick={(e) => {
                        e.preventDefault();
                        loginWithKakao();
                    }}
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="kakao" />
                        카카오로 시작하기
                    </Button>
                </div>
            </Form>
        </div>
        </>
    );
};
export default LoginForm;