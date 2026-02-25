import { Alert, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useModalAnimation } from "../hooks/ModalAnimation";
import { useEffect, useState } from "react";
import { useKakaoAddress } from "../hooks/KakaoAddress";
import DaumPostcode from 'react-daum-postcode';

const Register = ({setShowRegister, setFooterFade, setFooterMsg}) => {

    const [showModal, setShowModal] = useModalAnimation();
    const [handleAddress, address, isOpen, setIsOpen] = useKakaoAddress();   //카카오주소 목록 불러오기를 위한 Custom Hook

    /* ====Alert 창 제어==== */
    const [alertMsg, setAlertMsg] = useState('');
    const [ok, setOk] = useState('');

    /* ====input값 제어==== */
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [auth, setAuth] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userDetailAddress, setUserDetailAddress] = useState('');

    //KakaoAddress 훅에서 받은 주소 값을 useState에 저장
    useEffect(() => {
    if (address) {
            setUserAddress(address);
        }
    }, [address]);

    /* ====회원가입 조건 검사==== */
    const handleRegister = () => {
        const specialCharacters = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
        const numberCharacters = /[1234567890]/
        const space = /\s/
        const koreanCharacters = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
        const koreanOnly = /[ㄱ-ㅎㅏ-ㅣ]/;
        const emailCharacters = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        setOk('');

        if(id.length > 12 || id.length < 2){
            setAlertMsg('⚠️ID는 2 ~ 12 글자이다.');
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

        if (password.length < 6){
            setAlertMsg('⚠️Password는 특문포함 6글자 이상이다.');
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

        if (!email) {
            setAlertMsg('⚠️이메일을 입력하라고');
            setOk('email');
            return;
        } else if (space.test(email)) {
            setAlertMsg('⚠️이메일에 공백이 왜있냐');
            setOk('email');
            return;
        } else if (!emailCharacters.test(email)) {
            setAlertMsg('⚠️이게 이메일 이냐');
            setOk('email');
            return;
        }

        if (!userAddress){
            setAlertMsg('⚠️노숙자 인것이냐');
            setOk('address');
            return ;
        }

        if (!auth){
            setAlertMsg('⚠️빈칸이 있지 않느냐');
            setOk('auth');
            return ;
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: id,
                password: password,
                displayName: name,
                email: email,
                auth: auth,
                address: userAddress,
                detailAddress: userDetailAddress
            })
        })
        .then(async res => {
            const msg = await res.text(); // 서버 메시지 읽기

            if (!res.ok) {
                if (res.status === 409) {
                    throw new Error("이미 존재하는 아이디이다.");
                } else {
                    throw new Error(msg || "회원가입 실패");
                }
            }

            return msg;
        })
        .then(data => {
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg('✔️ 회원가입 완료!');
            setShowRegister(false);
        })
        .catch(err => {
            setAlertMsg('⚠️ ' + err.message);
            setOk('id');
        });
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
                            <Form.Control type="text" placeholder="아이디 (영문 숫자만으로 2 ~ 12글자)" 
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
                            <Form.Control type="password" placeholder="패스워드 (특문 포함 6글자 이상)"
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
                            <Form.Control type="text" placeholder="이름" 
                            onChange={(e) => {setName(e.target.value); setOk('');}}
                            />
                        {
                            ok === 'name' &&
                                <Alert className="regist-alert-overlay" variant={'danger'}>
                                    {alertMsg}
                                </Alert>
                        }
                        </Form.Group>

                        <Form.Group className="mb-3 email-anchor" controlId="formBasicEmail">
                            <Form.Control type="text" placeholder="이메일" 
                            onChange={(e) => {setEmail(e.target.value); setOk('');}}
                            />
                        {
                            ok === 'email' &&
                                <Alert className="regist-alert-overlay" variant={'danger'}>
                                    {alertMsg}
                                </Alert>
                        }
                        </Form.Group>

                        <Form.Group className="mb-3 address-anchor" controlId="formBasicAddress">
                            <InputGroup size="sm" style={{ flex: '1 1 auto', display: 'flex'}}>
                                <input 
                                    type="text"
                                    className="form-control form-control-sm bg-white"
                                    value={userAddress}
                                    onChange={(e) => {setUserAddress(e.target.value); setOk('');}}
                                    placeholder="주소선택"
                                    readOnly
                                /><Button variant="outline-secondary"
                                    onClick={() => setIsOpen(true)}
                                    style={{ whiteSpace: 'nowrap', fontSize: '12px', flexShrink: 0 }}
                                >주소선택</Button>
                            </InputGroup>
                                <input
                                    type="text"
                                    className="form-control form-control-sm" 
                                    placeholder="상세주소"
                                    onChange={(e) => setUserDetailAddress(e.target.value)}
                                />
                            {
                            ok === 'address' &&
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
                                value="USER"
                                className="register-checkbox"
                                onInput={(e) => {setAuth(e.target.value); setOk('');}}
                            />
                            <Form.Check
                                type="radio"
                                label="관리자"
                                name="role"
                                id="role-admin"
                                value="ADMIN"
                                className="register-checkbox"
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

        {/* 주소 검색 모달 */}
            <Modal 
                show={isOpen} 
                onHide={() => setIsOpen(false)}
                style={{zIndex: 99999}}
                backdropStyle={{zIndex: 99998}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>주소 검색</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DaumPostcode onComplete={handleAddress} />
                </Modal.Body>
            </Modal>
        </>
    );
}
export default Register;