import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export function useLogin (setShowLogin, setFooterFade, setFooterMsg, onLoginSuccess, rememberMe) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); //로딩상태
    const navigate = useNavigate();

    //로그인 공통 함수
    const saveTokenAndNotify = (token) => {
        const storage = rememberMe ? localStorage : sessionStorage;

        //기존 토큰 초기화
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        //토큰 저장
        storage.setItem("token", token);
        window.dispatchEvent(new Event('login-change'));

        if (onLoginSuccess) onLoginSuccess(jwtDecode(token));

        setShowLogin(false);
        setFooterFade('');
        setTimeout(() => { setFooterFade('footEnd'); }, 10);
        setFooterMsg("🔵 로그인 성공");
    };

    //일반 로그인 함수
    const handleLogin = async (e) => {
        e.preventDefault();

        setIsLoading(true); //로딩
        try {
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

    //소셜 로그인 함수
    const handleSocialLogin = async (socialData) => {
        setIsLoading(true) //로딩시작

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/social-login`, socialData);
            
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