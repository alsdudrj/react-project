import { useEffect, useState } from "react";

/**
 * 카카오 소셜 로그인 SDK 초기화 및 실행을 위한 커스텀 훅
 * @returns {Array} [loginWithKakao] 카카오 인증 페이지로 리다이렉트시키는 함수를 배열 형태로 반환
 */
export function useKakao (onSocialLogin) {
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;

    useEffect(() => {
        //이미 스크립트가 있으면 중복 생성 방지
        if (window.Kakao && window.Kakao.isInitialized()) return;

        //카카오 SDK 스크립트 엘리먼트 동적 생성
        const script = document.createElement("script");
        script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js";
        script.async = true;

        //스크립트 로드가 완료(onload)된 후 실행될 콜백
        script.onload = () => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
                //카카오 서버와 통신하기 위해 JS 키로 SDK 초기화
                window.Kakao.init(kakaoKey);
                console.log("카카오 SDK 초기화 완료");
            }
        };

        //생성한 스크립트를 문서의 <head>에 추가
        document.head.appendChild(script);
    }, []);


    /**
     * 카카오 인증 서버로 리다이렉트하여 인가 코드(Code)를 요청하는 함수
     */
    const loginWithKakao = () => {
        if (window.Kakao && window.Kakao.Auth) {
            //카카오 로그인 페이지로 이동
            window.Kakao.Auth.authorize({
                //인가 코드를 받을 리다이렉트 경로
                redirectUri: window.location.origin,
            });
        } else {
            console.error("카카오 Auth 모듈을 찾을 수 없습니다. 다시 시도해주세요.");
            //비정상적인 상황에서 SDK가 초기화되지 않았다면 여기서 강제로 다시 초기화 시도
            if(window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(kakaoKey);
        }
    };

    return [loginWithKakao];
};