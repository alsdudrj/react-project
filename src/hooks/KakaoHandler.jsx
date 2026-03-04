import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

/**
 * 카카오 리다이렉트 이후 인가 코드를 처리하는 핸들러 훅
 * @param {Function} setFooterFade 하단 알림창 애니메이션 제어 함수
 * @param {Function} setFooterMsg 하단 알림 메시지 설정 함수
 * @returns {Object} { isLoading } 로딩 상태 반환
 */
export function useKakaoHandler(setFooterFade, setFooterMsg) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        //URL 쿼리 스트링에서 code 파라미터 추출
        //카카오 로그인 성공 시 URL은 '도메인/?code=인증코드' 형태가 됨
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");    

        //인가 코드가 존재하면 백엔드에 로그인 승인 요청
        if (code) {
            handleKakaoLogin(code);
        }
    }, []);

    /**
     * 서버에 인가 코드를 전달하고 JWT를 발급받는 함수
     * @param {string} code 카카오 인가 코드
     */
    const handleKakaoLogin = async (code) => {
        setIsLoading(true);

        try {
            //백엔드 카카오 로그인 API 호출
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
        }finally {
            setIsLoading(false);
        }
    };

    return { isLoading };
}