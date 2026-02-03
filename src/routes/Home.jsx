import { Container, Row } from "react-bootstrap";
import Item from "../components/Item";
import { useEffect, useState } from "react";
import AddItem from "../components/AddItem";

const Home = (props) => {
    let [fade, setFade] = useState(''); //애니메이션을 주기위한 className state

    /* ====애니메이션 추가==== */
    useEffect(() => {
        window.scrollTo(0, 0); //화면 제일위로 이동


        let a = setTimeout(() => { setFade('end') }, 10); //detail페이지 접속시 detail페이지를 감싼 div에 애니메이션 class 추가

        return () => { clearTimeout(a); setFade(''); } //페이지 로드전 타이머 초기화 className 초기화
    }, [location.pathname]);  //URL 주소가 변경될 때마다 실행

    
    return(
        <>
        <div className={`start ${fade}`}> {/*애니메이션 추가*/}
            <div className="main-bg"></div>

            {/*카드 생성 컴포넌트*/}
            <Container>
                <Row>
                    {/*map을 이용하여 props로 받아온 data 갯수 만큼 카드생성을 반복*/}
                    {props.shoes.map((e, i) => (
                        <Item shoes={e} key={i} />
                    ))}
                </Row>
            </Container>
            {/*더보기 버튼*/}
            <AddItem 
            shoes={props.shoes} setShoes={props.setShoes}
            mainCount={props.mainCount} setMainCount={props.setMainCount}
            />
        </div>
        </>
    );
}
export default Home;