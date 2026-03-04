import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * 일반 회원 전용 라우트 보호 컴포넌트
 * 로그인이 필요한 페이지(장바구니, 마이페이지 등)에 접근할 때 인증 여부를 체크
 */
const ProtectedRoute = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const location = useLocation(); //현재 사용자가 머물고 있는(또는 접속하려 했던) URL 경로 정보 추출

    if (!token || token === "null") {
        alert("로그인이 필요한 서비스입니다.");
        //로그인 페이지(또는 메인)로 이동시키되, 'state'에 현재 위치를 저장
        //로그인 성공 후 원래 보려던 페이지로 자동으로 돌려보내기 위한 용도
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    //로그인 되어있으면 하위 페이지 렌더링
    return <Outlet />;
};

export default ProtectedRoute;