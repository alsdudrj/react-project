import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
        // 직접 구현한 복잡한 로직 대신 jwtDecode 사용
        const payload = jwtDecode(token);

        // 만료 시간 체크 (exp가 있는지 확인 후 비교)
        if (payload.exp && payload.exp < Date.now() / 1000) {
          logout("⚠️ 세션이 만료되었습니다. 다시 로그인해주세요.");
        }
      } catch (e) {
        console.error("Token check error:", e);
        // 토큰 자체가 깨져있거나 형식이 안 맞을 때만 로그아웃
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