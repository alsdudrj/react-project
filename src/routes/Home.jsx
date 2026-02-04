import { Button, Container, Form, InputGroup, Row } from "react-bootstrap";
import Item from "../components/Item";
import AddItem from "../components/AddItem";
import { useFadeAnimation } from "../hooks/FadeAnimation";
import { useEffect, useState } from "react";

const Home = (props) => {
    const [fade, setFade] = useFadeAnimation();                         //애니메이션을 주기위한 Custom Hook
    const [pictureValue, setPictureValue] = useState(0);                //슬라이드 vw값을 주기위한 카운팅

    const images = ["/img/bg-1.png", "/img/bg-2.png", "/img/bg-3.png"]; //슬라이드 이미지 갯수
    const imgCount = images.length;

    /* ============================== */
    /* ====메인페이지 슬라이드 이미지==== */
    useEffect(() => {
        const timer = setInterval(() => {
            setPictureValue((prev) => (prev + 1) % imgCount);
        }, 5000);

        {return () => {
            clearInterval(timer);
        }};
    },[imgCount]);
    /* ============================== */


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <div className={`start ${fade}`}> {/*애니메이션 추가*/}
            <div className="main-bg">
                <div className="slide-container" 
                style={{ 
                        width: `${imgCount * 100}vw`,
                        transform: `translateX(-${pictureValue * 100}vw)`
                    }}>
                    {images.map((src, i) => (
                        <div className="slide-box" key={i}>
                            <img src={src}/>
                        </div>
                    ))}
                </div>
            </div>

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