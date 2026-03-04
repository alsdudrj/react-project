import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

/**
 * 일반 및 소셜 로그인 통합 처리 커스텀 훅
 * @param {Function} setShowLogin 로그인 모달 닫기 함수
 * @param {Function} setFooterFade 하단 알림창 애니메이션 제어
 * @param {Function} setFooterMsg 알림 메시지 설정
 * @param {Function} onLoginSuccess 로그인 성공 시 부모 컴포넌트로 유저 정보 전달 콜백
 * @param {boolean} rememberMe 로그인 유지 여부 Local / Session Storage 결정
 */
export function useLogin (setShowLogin, setFooterFade, setFooterMsg, onLoginSuccess, rememberMe) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); //로딩상태
    const navigate = useNavigate();

    /**
     * 로그인 공통 함수
     */
    const saveTokenAndNotify = (token) => {
        //로그인 유지 체크 여부에 따라 저장소 결정
        const storage = rememberMe ? localStorage : sessionStorage;

        //기존 토큰 초기화
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        //토큰 저장
        storage.setItem("token", token);

        //커스텀 이벤트(login-change) 발생 -> 다른 컴포넌트(Header 등)에서 감지하여 UI 업데이트
        window.dispatchEvent(new Event('login-change'));

        //토큰을 해독(Decode)하여 유저 정보를 콜백 함수로 전달
        if (onLoginSuccess) onLoginSuccess(jwtDecode(token));

        setShowLogin(false);
        setFooterFade('');
        setTimeout(() => { setFooterFade('footEnd'); }, 10);
        setFooterMsg("🔵 로그인 성공");
    };

    /**
     * 일반 로그인 함수
     */
    const handleLogin = async (e) => {
        e.preventDefault();

        setIsLoading(true); //로딩
        try {
            //백엔드 일반 로그인 엔드포인트 호출
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/login`, {
                userName: userName,
                password: password
            });

            //완료 된 요청을 통한 공통함수 실행
            saveTokenAndNotify(res.data);

        } catch (err) {
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg("❌ " + err.message);
        }finally {
            setIsLoading(false); //로딩 종료
        }
    };

    /**
     * 소셜 로그인 함수
     */
    const handleSocialLogin = async (socialData) => {
        setIsLoading(true) //로딩시작

        try {
            //백엔드 소셜 로그인 전용 엔드포인트 호출
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/social-login`, socialData);
            
            //완료 된 요청을 통한 공통함수 실행
            saveTokenAndNotify(res.data);
        } catch (err) {
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg("❌ 소셜 로그인 실패");
        }finally {
            setIsLoading(false); //로딩 종료
        }
    };

    return [handleLogin, userName, setUserName, password, setPassword, handleSocialLogin, isLoading];
}