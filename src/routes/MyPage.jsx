import { useState, useEffect, useCallback } from "react";
import { Form, Button, Container, Alert, Row, Col, InputGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFadeAnimation } from "../hooks/FadeAnimation";
import AlertModal from "../components/AlertModal";
import { jwtDecode } from "jwt-decode";
import { useToken } from "../hooks/Token";
import { useKakaoAddress } from "../hooks/KakaoAddress";
import DaumPostcode from 'react-daum-postcode';

function MyPage({ setFooterFade, setFooterMsg }) {
    const navigate = useNavigate();

    const [fade] = useFadeAnimation();                                  //애니메이션 커스텀 훅
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);  //회원탈퇴 모달
    const [token, userRole] = useToken();                               //유저정보 확인을 위한 Custom Hook
    const [handleAddress, address, isOpen, setIsOpen] = useKakaoAddress();   //카카오주소 목록 불러오기를 위한 Custom Hook

    const [alertMsg, setAlertMsg] = useState('');
    const [ok, setOk] = useState('');

    const decoded = token ? jwtDecode(token) : null;             //jwtToken decoded
    const currentAuth = decoded?.auth;
    const currentUserName = decoded?.sub || "아이디 확인 안됨";    //jwt에서
    const currentEmail = decoded?.email || "등록된 이메일 없음";   //jwt에서 이메일 정보 추출


    //회원탈퇴시 footerMsg SessionStorage 저장
    const draw = useCallback((msg) => {
        localStorage.removeItem("token");
        if (msg) {
          sessionStorage.setItem("logoutMessage", msg); //로그아웃 메세지 sessionstorage 저장
        }
        localStorage.removeItem("token");
        window.dispatchEvent(new Event('login-change'));
        window.location.replace("/");
      }, []);

    
    //KakaoAddress 훅에서 받은 주소 값을 useState에 저장
    useEffect(() => {
    if (address) {
            setMemberInfo(prev => ({
                ...prev,
                address: address //카카오 훅에서 받은 새 주소로 교체
            }));

            setOk('');
        }
    }, [address]);


    //axios 요청으로 받은 유저 정보
    const [memberInfo, setMemberInfo] = useState({
        userName: '',
        email: '',
        address: '',
        detailAddress: ''
    });

    /* ============================================= */
    /* =============첫 유저데이터를 불러옴============= */ 
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data) {
                    setMemberInfo(prev => ({
                        ...prev,
                        userName: res.data.userName || '',
                        email: res.data.email || '',
                        address: res.data.address || '',
                        detailAddress: res.data.detailAddress || ''
                    }));
                }
            } catch (err) {
                console.error("회원 정보 로드 실패", err);
            }
        };
        fetchUserData();
    }, [token]);

    
    /* ============================================== */
    /* =============유저데이터 변경값을 저장============= */ 
    const onChange = (e) => {
        const {name, value} = e.target;
        setMemberInfo({ ...memberInfo, [name]: value });
    };


    /* ============================================ */
    /* =============유저 정보 수정 정규식============= */ 
    const handleBeforeUpdate = () => {
        const specialCharacters = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
        const numberCharacters = /[1234567890]/;
        const space = /\s/;
        const koreanOnly = /[ㄱ-ㅎㅏ-ㅣ]/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        setOk('');

        if (memberInfo.email && !emailRegex.test(memberInfo.email)) {
            setAlertMsg('⚠️ 이게 이메일 형식이냐');
            setOk('email');
            return;
        }

        if (!memberInfo.address) {
            setAlertMsg('⚠️ 노숙자인 것이냐');
            setOk('address');
            return;
        }

        handleUpdate();
    };


    /* ====================================== */
    /* =============유저 정보 수정============= */ 
    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/user/me`, memberInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg("✔️ 정보가 수정되었습니다.");
        } catch (err) {
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg("⚠️ 수정 실패: " + err.message);
        }
    };

    /* ================================= */
    /* =============회원탈퇴============= */ 
    const onWithdraw = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            draw('👋 탈퇴가 완료되었습니다.')
        } catch (err) {
            console.error(err);
        }
    };


    /* ================================= */
    /* =============JSX구간============= */ 
    return (
        <>
            <Container className={`mt-5 start ${fade}`} style={{ maxWidth: '900px' }}>
                <h3 className="mb-4 text-dark fw-bold">내 정보 관리</h3>
                <Form>
                    <Row>
                        <Col md={7}>
                            <div className="p-4 mb-4" style={{ background: '#f8f9fa', borderRadius: '15px', border: '1px solid #dee2e6' }}>
                                {/* 아이디 표시 */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-primary fw-bold">아이디: {currentUserName}
                                        {currentAuth === "ROLE_ADMIN" ? <p style={{color: "red"}}>(관리자)</p> : <p style={{color: "black"}}>(일반인)</p>}
                                    </Form.Label>
                                </Form.Group>

                                {/* 이메일 표시 및 수정 */}
                                <Form.Group className="mb-4 position-relative">
                                    <Form.Label className="text-dark fw-bold d-flex justify-content-between align-items-center">
                                        이메일
                                        <span className="text-muted fw-normal small">현재: {currentEmail}</span>
                                    </Form.Label>
                                    <Form.Control 
                                        name="email" 
                                        value={memberInfo.email || ''} 
                                        onChange={onChange} 
                                        type="email" 
                                        placeholder="새로운 이메일 입력" 
                                    />
                                    {ok === 'email' && <Alert className="product-alert-overlay" variant='danger'>{alertMsg}</Alert>}
                                </Form.Group>

                                {/* 주소 표시 및 수정 */}
                                <Form.Group className="mb-4 position-relative address-anchor">
                                    <Form.Label className="text-dark fw-bold d-flex justify-content-between align-items-center">
                                        기본 주소
                                        <span className="text-muted fw-normal small text-truncate" style={{maxWidth: '200px'}}>
                                        </span>
                                    </Form.Label>
                                     <InputGroup style={{ flex: '1 1 auto', display: 'flex'}}>
                                        <input 
                                            type="text"
                                            className="form-control form-control-sm bg-white"
                                            value={memberInfo.address} 
                                            onChange={() => {onChange(); setOk('');}}
                                            placeholder="주소선택"
                                            readOnly
                                        /><Button variant="outline-secondary"
                                            onClick={() => setIsOpen(true)}
                                            style={{ whiteSpace: 'nowrap', fontSize: '12px', flexShrink: 0 }}
                                        >주소선택</Button>
                                    </InputGroup>
                                    {
                                    ok === 'address' && 
                                        <Alert className="product-alert-overlay" variant='danger'>
                                            {alertMsg}
                                        </Alert>
                                    }
                                </Form.Group>

                                {/* 상세 주소 수정 */}
                                <Form.Group className="mb-5">
                                    <Form.Label className="text-dark fw-bold d-flex justify-content-between align-items-center">상세 주소</Form.Label>
                                    <Form.Control 
                                        name="detailAddress" 
                                        value={memberInfo.detailAddress} 
                                        onChange={onChange} 
                                        type="text" 
                                        placeholder="상세 주소 입력"
                                    />
                                </Form.Group>

                                <Button variant="primary" className="w-100 fw-bold" onClick={handleBeforeUpdate}>수정 내용 저장하기</Button>
                            </div>
                        </Col>

                        <Col md={5}>
                            <div className="p-4" style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '15px' }}>
                                <h5 className="text-dark mb-4 fw-bold">계정 설정</h5>
                                <p className="text-secondary small">더 이상 서비스를 이용하지 않으시나요?</p>
                                <Button variant="outline-danger" size="sm" onClick={() => setShowWithdrawModal(true)}>회원 탈퇴하기</Button>
                                
                                <hr style={{ margin: "30px 0", borderColor: "#dee2e6" }} />
                                
                                <h5 className="text-dark mb-3 fw-bold">바로가기</h5>
                                <p className="text-secondary small">메인 화면으로 돌아가 쇼핑을 계속하세요.</p>
                                <Button variant="outline-secondary" size="sm" onClick={() => navigate('/')}>메인으로 돌아가기</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Container>

            {/*회원탈퇴 모달*/}
            {showWithdrawModal && 
                <AlertModal 
                    setShowAlertModal={setShowWithdrawModal} 
                    onAction={onWithdraw} 
                    Msg='진짜 탈퇴할꺼임?'
                    okMsg='탈퇴한다'
                />
            }

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

export default MyPage;