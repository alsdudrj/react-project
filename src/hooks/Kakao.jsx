import { useEffect, useState } from "react";

export function useKakao (onSocialLogin) {
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;

    useEffect(() => {
        //이미 스크립트가 있으면 중복 생성 방지
        if (window.Kakao && window.Kakao.isInitialized()) return;

        const script = document.createElement("script");
        script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js";
        script.async = true;
        script.onload = () => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init(kakaoKey);
                console.log("카카오 SDK 초기화 완료");
            }
        };
        document.head.appendChild(script);
    }, []);


    const loginWithKakao = () => {
        if (window.Kakao && window.Kakao.Auth) {
            window.Kakao.Auth.authorize({
                redirectUri: window.location.origin,
            });
        } else {
            console.error("카카오 Auth 모듈을 찾을 수 없습니다. 다시 시도해주세요.");
            //초기화가 안됐다면 여기서 강제로 다시 초기화 시도
            if(window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(kakaoKey);
        }
    };

    return [loginWithKakao];
};