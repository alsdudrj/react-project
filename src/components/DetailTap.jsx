import { memo, useContext, useEffect, useRef, useState } from "react";
import { Nav } from "react-bootstrap";
import { Context1 } from "../App";

let DetailTap = memo(() => {                    //memo로 렌더링을 한번만 하게 변경
    let [tab, setTab] = useState(0);            //탭 변환값 기록

    let {shoes, qty} = useContext(Context1);    //Context API로 APP에서 불러온 데이터

    const isFirstRender = useRef(true);

    /* ====================================================================== */
    /* ====tab상태에 따라 보여줄 html요소 if문 컴포넌트 (if문 말고 배열로 편법씀)==== */
    function TabContent({tab}){
        let [scale, setScale] = useState(''); //애니메이션 class를 추가하기 위한 state
        
        useEffect(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }

            //애니메이션 줄 class에 end class를 추가
            let a = setTimeout(()=>{ setScale('scaleEnd'); }, 10)    //automatic batching 때문에 간격을 조금 줌
            
            return () => { setScale(''); clearTimeout(a); }          //애니메이션 줄 class에 end class를 먼저 없앰
        }, [tab])

        
        return (
            <div className={isFirstRender.current ? 'scaleEnd' : `scaleStart ${scale}`}>
                {
                    [<div>{qty[0]}</div>, <div>내용2</div>, <div>내용3</div>][tab]
                }
            </div>
        )
    }


    return(
        <>
        <Nav justify variant="tabs" defaultActiveKey="link0">
            <Nav.Item>
                <Nav.Link eventKey="link0" onClick={() => { setTab(0) }}>Tab-1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link1" onClick={() => { setTab(1) }}>Tab-2</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link2" onClick={() => { setTab(2) }}>Tab-3</Nav.Link>
            </Nav.Item>
        </Nav>
        
        {/*if 사용을 위한 컴포넌트 화*/}
        <TabContent tab={tab}/>
        </>
    );
})
export default DetailTap;