import { useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export function useKakaoHandler(setFooterFade, setFooterMsg) {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            handleKakaoLogin(code);
        }
    }, []);

    const handleKakaoLogin = async (code) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/social-login/kakao`, {
                code: code,
                redirectUri: window.location.origin
            });

            const token = res.data;
            //로컬 스토리지에 저장
            localStorage.setItem("token", token);
            
            //로그인 성공 이벤트 발생
            window.dispatchEvent(new Event('login-change'));

            //성공 메시지 알림
            setFooterFade('');
            setTimeout(() => { 
                setFooterFade('footEnd'); 
                setFooterMsg("🔵 카카오 로그인 완료");
            }, 10);

            //URL에서 code 파라미터 제거
            window.history.replaceState({}, null, window.location.origin);
            
        } catch (err) {
            console.error("카카오 로그인 실패:", err);
            setFooterMsg("❌ 카카오 로그인 처리 중 오류 발생");
        }
    };
}