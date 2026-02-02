import { Container, Row } from "react-bootstrap";
import Item from "../components/Item";
import { useEffect, useState } from "react";
import AddItem from "../components/AddItem";

const Home = (props) => {
    return(
        <>
        <div>
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