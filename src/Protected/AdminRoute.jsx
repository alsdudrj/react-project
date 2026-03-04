import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/**
 * 관리자 전용 라우트 보호 컴포넌트
 * 로그인 여부와 유저 권한(ROLE_ADMIN)을 검사하여 접근을 제어
 */
const AdminRoute = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    //토큰 자체가 없는 경우
    if (!token) {
        alert("로그인이 필요한 서비스입니다.");
        return <Navigate to="/" replace />;
    }

    try {
        //토큰 해석
        const decoded = jwtDecode(token);
        const userRole = decoded.auth;

        //권한 확인
        if (userRole !== "ROLE_ADMIN") {
            alert("관리자만 접근 가능한 페이지입니다.");
            return <Navigate to="/" replace />;
        }

        //권한이 맞으면 하위 컴포넌트(등록/수정 페이지)를 보여줌
        return <Outlet />;
        
    } catch (error) {
        //토큰이 변조되었거나 만료된 경우
        console.error("Token decoding failed:", error);
        
        //잘못된 토큰을 삭제하여 세션을 초기화
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }
};
export default AdminRoute;