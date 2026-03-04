import axios from "axios";
import { useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAllItem } from "../store/cart";

/**
 * 결제 인증 완료 후 리다이렉트되는 승인 처리 페이지
 */
const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isProcessed = useRef(false);  //중복 요청 방지
    //React 18의 StrictMode나 사용자의 새로고침으로 인해 승인 API가 두 번 호출되어 발생하는 오류(이미 처리된 결제 등)를 원천 차단

    //URL 쿼리 파라미터 및 로컬 스토리지에서 결제 식별 정보 추출
    const pgToken = new URLSearchParams(window.location.search).get("pg_token");
    const tid = localStorage.getItem("tid");                    //결제 고유 번호
    const orderId = localStorage.getItem("partner_order_id");   //가맹점 주문 번호

    useEffect(() => {
        if (isProcessed.current || !pgToken) return; //이미 요청중이거나 pgtoken 없으면 실행 안함
        isProcessed.current = true;

        if (pgToken) {
            //서버에 최종 결제 승인 요청
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/approve`, {
            pgToken: pgToken,
            tid: tid,
            partnerOrderId: orderId
        })
        .then(res => {
            console.log("승인 성공 응답:", res.data);

            //사용이 끝난 임시 식별값 삭제
            localStorage.removeItem("tid");
            localStorage.removeItem("partner_order_id");

            // 장바구니 비우기 및 알림 메시지 설정
            dispatch(deleteAllItem());
            sessionStorage.setItem("paymentSuccessMsg", "✔️ 결제가 완료되었습니다");
            window.dispatchEvent(new Event('login-change'));
            window.location.replace("/");
        })
        .catch(err => {
            console.error("승인 실패 상세:", err.response?.data || err.message);

            sessionStorage.setItem("paymentSuccessMsg", "❌ 결제 실패 : " + err.response?.data || err.message);
            window.location.replace("/");
            }
        );
        }
    }, [pgToken]);

    return <div>결제 승인 중입니다... 잠시만 기다려주세요.</div>;
};
export default PaymentSuccess;