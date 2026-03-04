import { useEffect, useState } from "react";

export function useFooterAlert() {
    const [footerFade, setFooterFade] = useState('');   //footer 애니메이션 상태관리
    const [footerMsg, setFooterMsg] = useState('');     //footer 메시지 상태관리

    /* ============================= */
    /* ====footer에 안내메세지 출력==== */
    useEffect(() => {
        if (footerFade === 'footEnd'){
            let timer = setTimeout(() => {
                setFooterFade('');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [footerFade]);

    return [footerFade, setFooterFade, footerMsg, setFooterMsg];
}