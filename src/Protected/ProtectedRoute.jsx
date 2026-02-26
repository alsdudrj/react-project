import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const location = useLocation(); //현재 주소를 저장

    if (!token || token === "null") {
        alert("로그인이 필요한 서비스입니다.");
        //로그인 성공 후 원래 페이지로 전달
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 로그인 되어있으면 하위 페이지 렌더링
    return <Outlet />;
};

export default ProtectedRoute;