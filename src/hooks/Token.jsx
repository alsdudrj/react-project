import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";    


/**
 * 전역 인증 토큰 및 유저 권한 상태 관리 훅
 * 로컬/세션 스토리지의 토큰 변화를 감지하여 최신 유저 정보를 제공
 * @returns {Array} [token, userRole] - 현재 토큰 문자열과 해독된 유저 권한
 */
export function useToken() {
    //토큰을 local과 session에서 모두 읽어옴
    const getTokenFromStorage = () => {
        return localStorage.getItem("token") || sessionStorage.getItem("token");
    };

    //저장소에 토큰이 있는지 확인하여 상태값 초기화
    const [token, setToken] = useState(getTokenFromStorage);
    const [userRole, setUserRole] = useState(null);

    /**
     * 토큰을 해독하여 유저 권한 추출
     */
    const updateInfo = (currentToken) => {
        if (currentToken) {
            try {
                const decoded = jwtDecode(currentToken);    //jwt-decode를 사용하여 페이로드 추출
                setUserRole(decoded.auth);                  //백엔드 JwtUtil에서 넣었던 auth 클레임 값을 추출
            } catch (e) {
                setUserRole(null);  //토큰 형식이 잘못된 경우 상태 초기화
            }
        } else {
            setUserRole(null);      //토큰이 없는 경우 권한 제거
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

        //브라우저 이벤트 리스너 등록
        window.addEventListener('storage', handleStorageChange);        //다른 탭에서 로그아웃/로그인했을 때 동기화
        window.addEventListener('login-change', handleStorageChange);   //현재 앱 내(useLogin, useLogout)에서 발생시킨 커스텀 이벤트 감지

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('login-change', handleStorageChange);
        };
    }, []);

    return [token, userRole];
};