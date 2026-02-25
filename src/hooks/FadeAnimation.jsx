import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useFadeAnimation() {
    const [fade, setFade] = useState('');             //애니메이션을 주기위한 className state
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);                              //화면 제일위로 이동

        let a = setTimeout(() => { setFade('end') }, 10);   //div에 애니메이션 class 추가

        return () => { clearTimeout(a); setFade(''); }      //페이지 로드전 타이머 초기화 className 초기화
    }, [location.pathname]);                                //URL 주소가 변경될 때마다 실행

    return [fade, setFade];
} 