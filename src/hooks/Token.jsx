import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";    

export function useToken() {
    //토큰을 local과 session에서 모두 읽어옴
    const getTokenFromStorage = () => {
        return localStorage.getItem("token") || sessionStorage.getItem("token");
    };

    const [token, setToken] = useState(getTokenFromStorage);
    const [userRole, setUserRole] = useState(null);

    //토큰 확인
    const updateInfo = (currentToken) => {
        if (currentToken) {
            try {
                const decoded = jwtDecode(currentToken);
                setUserRole(decoded.auth);
            } catch (e) {
                setUserRole(null);
            }
        } else {
            setUserRole(null);
        }
    };

    useEffect(() => {
        //첫 마운트 실행
        updateInfo(token);

        //다른 창이나 현재 창에서 Storage가 변할 때 감지
        const handleStorageChange = () => {
            const newToken = getTokenFromStorage();
            setToken(newToken);
            updateInfo(newToken);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('login-change', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('login-change', handleStorageChange);
        };
    }, []);

    return [token, userRole];
};