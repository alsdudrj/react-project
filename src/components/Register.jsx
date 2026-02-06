import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useModalAnimation } from "../hooks/ModalAnimation";
import { useEffect, useState } from "react";

const Register = ({setShowRegister, setFooterFade, setFooterMsg}) => {

    const [showModal, setShowModal] = useModalAnimation();

    /* ====Alert 창 제어==== */
    const [alertMsg, setAlertMsg] = useState('');
    const [ok, setOk] = useState('');

    /* ====input값 제어==== */
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [auth, setAuth] = useState('');

    /* ====회원가입 조건 검사==== */
    const handleRegister = () => {
        const specialCharacters = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
        const numberCharacters = /[1234567890]/
        const space = /\s/
        const koreanCharacters = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
        const koreanOnly = /[ㄱ-ㅎㅏ-ㅣ]/;

        setOk('');

        if(id.length > 8 || id.length < 2){
            setAlertMsg('⚠️ID는 2 ~ 8 글자이다.');
            setOk('id');
            return ;
        }else if(space.test(id)){
            setAlertMsg('⚠️빈칸 쓰지 말라고');
            setOk('id');
            return ;
        }else if(specialCharacters.test(id) || koreanCharacters.test(id)){
            setAlertMsg('⚠️영어랑 숫자만 쓰라고');
            setOk('id');
            return ;
        }

        if (password.length < 6 || password.length > 12){
            setAlertMsg('⚠️Password는 특문포함 6 ~ 12 글자이다.');
            setOk('password');
            return ;
        }else if(space.test(password)){
            setAlertMsg('⚠️Password에 공백을 포함시키려는 거냐');
            setOk('password');
            return ;
        }else if(!specialCharacters.test(password)){
            setAlertMsg('⚠️특문을 포함시키라고');
            setOk('password');
            return ;
        }

        if (!name.trim()){
            setAlertMsg('⚠️이름이 없는것이냐');
            setOk('name');
            return ;
        }else if(space.test(name)){
            setAlertMsg('⚠️빈칸 쓰지 말라고');
            setOk('name');
            return ;
        }else if (koreanOnly.test(name) || specialCharacters.test(name) || numberCharacters.test(name)){
            setAlertMsg('⚠️이게 이름이냐');
            setOk('name');
            return ;
        }

        if (!auth){
            setAlertMsg('⚠️빈칸이 있지 않느냐');
            setOk('auth');
            return ;
        }

            setOk(true);
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg('✔️ 회원가입이 완료되었습니다. (사실 미완성임)');
            setShowRegister(false);
    }
       


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <div className={`black-bg ${showModal}`}>
            <div
                className="modal"
                style={{ display: 'block', position: 'initial' }}
                onMouseDown={(e) => {
                if(e.target === e.currentTarget){
                    setShowRegister(false);
                }
                }}
            >
                <Modal.Dialog 
                className={`white-bg ${showModal}`}
                onClick={(e) => e.stopPropagation()}
                >
                    <Modal.Header>
                        <Modal.Title>초간단 회원가입</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="px-5">
                        <Form.Group className="mb-3 id-anchor" controlId="formBasicId">
                            <Form.Control type="id" placeholder="아이디 (영문 숫자만으로 2~8글자)" 
                            onChange={(e) => { setId(e.target.value); setOk(''); }}
                            />
                        {
                            ok === 'id' &&
                                <Alert className="regist-alert-overlay" variant={'danger'}>
                                    {alertMsg}
                                </Alert>
                        }
                        </Form.Group>

                        <Form.Group className="mb-3 password-anchor" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="패스워드 (특문 포함 6~12글자)"
                            onChange={(e) => {setPassword(e.target.value); setOk('');}}
                            />
                        {
                            ok === 'password' &&
                                <Alert className="regist-alert-overlay" variant={'danger'}>
                                    {alertMsg}
                                </Alert>
                        }
                        </Form.Group>

                        <Form.Group className="mb-3 name-anchor" controlId="formBasicName">
                            <Form.Control type="name" placeholder="이름" 
                            onChange={(e) => {setName(e.target.value); setOk('');}}
                            />
                        {
                            ok === 'name' &&
                                <Alert className="regist-alert-overlay" variant={'danger'}>
                                    {alertMsg}
                                </Alert>
                        }
                        </Form.Group>

                        <Form.Group className="auth-anchor" controlId="formBasicAuth">
                            <Form.Check
                                type="radio"
                                label="일반인"
                                name="role"
                                id="role-user"
                                value="general"
                                className="login-checkbox"
                                onInput={(e) => {setAuth(e.target.value); setOk('');}}
                            />
                            <Form.Check
                                type="radio"
                                label="관리자"
                                name="role"
                                id="role-admin"
                                value="manager"
                                className="login-checkbox"
                                onInput={(e) => {setAuth(e.target.value); setOk('');}}
                            />
                            {
                                ok === 'auth' &&
                                    <Alert className="regist-alert-overlay" variant={'danger'}>
                                        {alertMsg}
                                    </Alert>
                            }
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowRegister(false)}>가입안해</Button>
                        <Button variant="outline-danger register-anchor"
                        onClick={handleRegister}
                        >회원가입</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        </div>
        </>
    );
}
export default Register;