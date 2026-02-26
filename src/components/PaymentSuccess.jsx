import axios from "axios";
import { useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAllItem } from "../store/cart";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isProcessed = useRef(false);

    const pgToken = new URLSearchParams(window.location.search).get("pg_token");
    const tid = localStorage.getItem("tid");
    const orderId = localStorage.getItem("partner_order_id");

    useEffect(() => {
        if (isProcessed.current || !pgToken) return; //이미 요청중이거나 pgtoken 없으면 실행 안함
        isProcessed.current = true;

        if (pgToken) {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/approve`, {
            pgToken: pgToken,
            tid: tid,
            partnerOrderId: orderId
        })
        .then(res => {
            console.log("승인 성공 응답:", res.data);
            localStorage.removeItem("tid");
            localStorage.removeItem("partner_order_id");

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