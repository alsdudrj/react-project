import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/**
 * 전역 로그아웃 처리 및 토큰 유효성 실시간 감시 훅
 * @returns {Function} logout - 수동 로그아웃을 실행하는 함수
 */
export function useLogout() {
  const navigate = useNavigate();

  /**
   * 로그아웃 수행 함수
   * useCallback을 사용하여 리렌더링 시 함수가 재생성되는 것을 방지
   */
  const logout = useCallback((msg) => {
    //모든 저장소에서 인증 토큰 삭제
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    if (msg) {
      sessionStorage.setItem("logoutMessage", msg); //로그아웃 메세지 sessionstorage 저장
    }

    window.dispatchEvent(new Event('login-change'));  //상태 변경 알림
    window.location.replace("/");                     //페이지 이동(뒤로가기 금지)
  }, []);


  useEffect(() => {
    /**
     * 현재 저장된 토큰의 유효성(만료 여부)을 검사하는 함수
     */
    const checkToken = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        //jwt-decode를 이용해 토큰의 Payload 추출
        const payload = jwtDecode(token);

        //만료 시간(exp) 체크 로직 (JWT의 exp는 초 단위이므로 밀리초로 변환하여 현재 시간과 비교)
        if (payload.exp && payload.exp < Date.now() / 1000) {
          logout("⚠️ 세션이 만료되었습니다. 다시 로그인해주세요.");
        }
      } catch (e) {
        console.error("Token check error:", e);
        //토큰 자체가 깨져있거나 형식이 안 맞을 때 강제 로그아웃
        logout("⚠️ 유효하지 않은 인증 정보입니다.");
      }
    };


    /**
     * Axios 인터셉터 등에서 발생시킨 auth-error 커스텀 이벤트를 처리
     */
    const handleAuthError = (e) => {
      if (e.detail?.status === 401) {
        logout("⚠️ 인증이 만료되어 로그아웃됩니다.");
      }
    };

    //마운트 시 체크 및 10초마다 체크
    checkToken();
    const interval = setInterval(checkToken, 10000); 

    //인증 에러 이벤트 리스너 등록
    window.addEventListener("auth-error", handleAuthError);

    //언마운트 시 인터벌 및 이벤트 리스너 제거
    return () => {
      window.removeEventListener("auth-error", handleAuthError);
      clearInterval(interval);
    };
  }, [logout]);

  return logout;
}