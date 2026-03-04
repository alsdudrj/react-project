import { Button, Container, Form, InputGroup, Row } from "react-bootstrap";
import Item from "../components/Item";
import AddItem from "../components/AddItem";
import { useFadeAnimation } from "../hooks/FadeAnimation";
import { useEffect, useState } from "react";
import axios from "axios";
import SkeletonImg from "../components/SkeletonImg";

const Home = (props) => {
    const [fade, setFade] = useFadeAnimation();                         //애니메이션을 주기위한 Custom Hook
    const [pictureValue, setPictureValue] = useState(0);                //슬라이드 vw값을 주기위한 카운팅
    const [isLoading, setIsLoading] = useState(true);                   //로딩중 상태 관리

    const images = ["/img/bg-1.png", "/img/bg-2.png", "/img/bg-3.png"]; //슬라이드 이미지 갯수
    const imgCount = images.length;


    /* ============================== */
    /* ====상품데이터를 받아오는 함수==== */
    useEffect(() => {
        const getItems = async () => {
            try {
                setIsLoading(true);

                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/item/all`);
                
                let data = res.data;

                //서버에서 온 데이터가 문자열(string)이라면 JSON으로 변환
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        console.error("JSON 파싱 에러:", e);
                    }
                }

                if (data) {
                    props.setShoes(data);   //데이터를 App에 있는 shoes에 저장
                }

            }catch(err) {
                console.error("상품목록 불러오기 실패", err);
            }finally{
                setIsLoading(false);
            }
        };

        getItems();
    }, []);


    /* ============================== */
    /* ====메인페이지 슬라이드 이미지==== */
    useEffect(() => {
        const timer = setInterval(() => {
            //(현재번호 + 1)을 이미지 개수로 나눈 나머지값으로 순환
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
        <div className={`start ${fade}`}> {/* 애니메이션 추가 */}
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
                    {
                        isLoading ? 
                        (
                            <SkeletonImg />
                        ) 
                        :   
                        (
                            Array.isArray(props.shoes) && props.shoes.length > 0 ? (
                                    props.shoes.map((e, i) => (
                                    <Item shoes={e} key={e.id || i} />
                                ))
                                ) :
                                (
                                    <p className="text-center mt-5">등록된 상품이 없다.</p>
                                )
                        )
                    }
                </Row>
            </Container>
            {/*더보기 버튼*/}
            {/* <AddItem 
            shoes={props.shoes} setShoes={props.setShoes}
            mainCount={props.mainCount} setMainCount={props.setMainCount}
            /> */}
        </div>
        </>
    );
}
export default Home;