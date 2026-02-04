import { useEffect, useState } from "react";

export function useModalAnimation() {
    const [showModal, setShowModal] = useState('');             //애니메이션을 주기위한 className state

    useEffect(() => {
        let a = setTimeout(() => { setShowModal('show-modal') }, 10);   //detail페이지 접속시 detail페이지를 감싼 div에 애니메이션 class 추가

        return () => { clearTimeout(a); setShowModal(''); }      //페이지 로드전 타이머 초기화 className 초기화
    }, []);                                //URL 주소가 변경될 때마다 실행

    return [showModal, setShowModal];
} 