import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function useLogin (setShowLogin, setFooterFade, setFooterMsg, onLoginSuccess) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: userName,
                password: password
            })
            });

            if (!res.ok) {
                const errorText = await res.text(); 
                throw new Error(errorText || "로그인 서버 에러");
            }

            const token = await res.text();

            // 토큰 저장
            localStorage.setItem("token", token);
            window.dispatchEvent(new Event('login-change')); //화면 상태변화 감지

            if(onLoginSuccess) onLoginSuccess(jwtDecode(token));

            setShowLogin(false);
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg("🔵 로그인 성공");

        } catch (err) {
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg("❌ " + err.message);
        }
    };

    return [handleLogin, userName, setUserName, password, setPassword];
}