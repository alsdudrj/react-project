import { useEffect, useState } from "react";

export function useKakao () {
    const [userInfo, setUserInfo] = useState(null);
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js";
        script.async = true;

        script.onload = () => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init(kakaoKey);
            }

            if (window.Kakao.Auth.getAccessToken()) {
                getUserInfo();
            }
        };
        document.head.appendChild(script);
    }, []);

    /*카카오 로그인 확인용*/
    const getUserInfo = () => {
        window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res) => {
                console.log("카카오 유저확인 완료");
                console.log("유저 상세 데이터:", res);
                setUserInfo(res);
            },
            fail: (err) => {
                console.error("유저 정보 요청 실패:", err);
            }
        });
    };

    const loginWithKakao = () => {
        if (!window.Kakao || !window.Kakao.isInitialized()) return;

        window.Kakao.Auth.authorize({
            redirectUri: window.location.origin,
        });
    };

    return [userInfo, loginWithKakao];
};