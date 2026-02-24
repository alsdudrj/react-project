import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyPageForm = ({setShowMyPage, displayName, setFooterFade, setFooterMsg}) => {
    const navigate = useNavigate();
    const [nowPassword, setNowPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    /* ====Alert 창 제어==== */
    const [alertMsg, setAlertMsg] = useState('');
    const [ok, setOk] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const specialCharacters = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
        const space = /\s/

        setOk('');

        if (newPassword.length < 6){
            setAlertMsg('⚠️Password는 특문포함 6글자 이상이다.');
            setOk('password');
            return ;
        }else if(space.test(newPassword)){
            setAlertMsg('⚠️Password에 공백을 포함시키려는 거냐');
            setOk('password');
            return ;
        }else if(!specialCharacters.test(newPassword)){
            setAlertMsg('⚠️특문을 포함시키라고');
            setOk('password');
            return ;
        }
        
        if (newPassword !== confirmPassword) {
            setAlertMsg('⚠️Password가 서로 일치 하지 않는다');
            setOk('passwordOk');
            return;
        }

        if (nowPassword === newPassword) {
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg("⚠️ 현재와 동일한 비밀번호로 변경할 것이냐");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/user/change-password`, 
                { 
                    currentPassword: nowPassword,
                    newPassword: newPassword 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                localStorage.removeItem("token");
                window.dispatchEvent(new Event('login-change'));

                setFooterFade('');
                setTimeout(() => { setFooterFade('footEnd'); }, 10);
                setFooterMsg("✔️ 비밀번호가 변경되었습니다. (새로 로그인 필요)");
                setShowMyPage(false);
            }
        } catch (err) {
            console.error("비밀번호 변경 실패", err);

            let errorMsg = "⚠️ 비밀번호 변경 실패";
        
            if (err.response && err.response.data) {
                errorMsg = err.response.data.message || err.response.data || errorMsg;
            }

            setAlertMsg("⚠️" + errorMsg);
            setOk('nowPassword');
            setNowPassword("");
        }
    };

    return (
        <div className="login-overlay mypage-overlay">
            {/* 상단 프로필 영역 */}
            <div className="d-flex align-items-center justify-content-between mb-4 gap-3">
                <h5 className="text-white m-0">{displayName} 님</h5>
                <Button 
                variant="outline-info"
                size="sm"
                onClick={() => {
                    navigate('/mypage');
                    setShowMyPage(false);
                    alert('아직안만듬');
                }}
                >내 정보 관리</Button>
            </div>

            <div className="social-divider">
                <span>비밀번호 변경</span>
            </div>

            <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3 nowPassword-anchor" controlId="newPassword">
                    <Form.Control 
                        type="password" 
                        placeholder="현재 비밀번호" 
                        value={nowPassword}
                        onChange={(e) => setNowPassword(e.target.value)}
                        required
                    />
                    {
                        ok === 'nowPassword' &&
                            <Alert className="regist-alert-overlay" variant={'danger'}>
                                {alertMsg}
                            </Alert>
                    }
                </Form.Group>
                
                <Form.Group className="mb-3 password-anchor" controlId="newPassword">
                    <Form.Control 
                        type="password" 
                        placeholder="새 비밀번호" 
                        value={newPassword}
                        onChange={(e) => {setNewPassword(e.target.value); setOk('');}}
                        required
                    />
                    {
                        ok === 'password' &&
                            <Alert className="regist-alert-overlay" variant={'danger'}>
                                {alertMsg}
                            </Alert>
                    }
                </Form.Group>

                <Form.Group className="mb-4 passwordOk-anchor" controlId="confirmPassword">
                    <Form.Control 
                        type="password" 
                        placeholder="새 비밀번호 확인" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {
                        ok === 'passwordOk' &&
                            <Alert className="regist-alert-overlay" variant={'danger'}>
                                {alertMsg}
                            </Alert>
                    }
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant="outline-info" type="submit" className="mt-2">
                        비밀번호 변경하기
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default MyPageForm;