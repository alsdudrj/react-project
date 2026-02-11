import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useLogin () {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8765/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: userName,
                password: password
            })
            });

            if (!res.ok) throw new Error("로그인 실패");

            const token = await res.text();

            // 토큰 저장
            localStorage.setItem("token", token);

            setShowLogin(false);
            navigate("/");

        } catch (err) {
            alert("아이디 또는 비밀번호 틀림");
        }
    };

    return [handleLogin, userName, setUserName, password, setPassword];
}