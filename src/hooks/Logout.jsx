import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  const logout = useCallback((msg) => {
    localStorage.removeItem("token");
    if (msg) {
      sessionStorage.setItem("logoutMessage", msg); //로그아웃 메세지 sessionstorage 저장
    }
    window.location.replace("/");
  }, []);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // JWT 디코딩
        const base64Url = token.split('.')[1];
        if (!base64Url) return;
        
        // 유니코드 대응 디코딩
        const payload = JSON.parse(decodeURIComponent(atob(base64Url).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));

        if (payload.exp < Date.now() / 1000) {
          logout("⚠️ 세션이 만료되었습니다. 다시 로그인해주세요.");
        }
      } catch (e) {
        console.error("Token check error:", e);
        // 토큰 형식이 잘못된 경우에도 로그아웃 처리
        logout("⚠️ 유효하지 않은 인증 정보입니다.");
      }
    };

    const handleAuthError = (e) => {
      if (e.detail?.status === 401) {
        logout("⚠️ 인증이 만료되어 로그아웃됩니다.");
      }
    };

    // 마운트 시 체크 및 10초마다 체크
    checkToken();
    const interval = setInterval(checkToken, 10000); 

    window.addEventListener("auth-error", handleAuthError);
    return () => {
      window.removeEventListener("auth-error", handleAuthError);
      clearInterval(interval);
    };
  }, [logout]);

  return logout;
}