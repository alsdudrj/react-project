import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useFadeAnimation } from "../hooks/FadeAnimation";
import { addCount, deleteItem } from "../store/cart";

const Cart = () => {
    let state = useSelector((state) => {return state}); //store.js에서 가져온 상품 데이터

    const [fade, setFade] = useFadeAnimation();         //애니메이션을 주기위한 Custom Hook

    let dispatch = useDispatch();                       //state변경함수 사용을 위해 불러옴


    /* ================================= */
    /* =============JSX구간============= */
    return(
        <>
            <Container fluid className={`start ${fade} px-5`}> {/* px-5로 양옆 여백 추가 */}
                <h1 >장바구니 이다</h1>
                <hr/>
                    <div style={{ width: "80%" }}>
                        <div className="cart-grid">
                        {
                            state.cart.map((item, i) =>
                                <Card style={{ width: '100%' }} key={i}>
                                    <div className="cart-image-box">
                                        <img src={`https://codingapple1.github.io/shop/shoes${item.id + 1}.jpg`}/>
                                    </div>
                                    <Card.Body className="text-center p-2">
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>{item.content}</Card.Text>
                                        <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                                            <Card.Text className="mb-0">{new Intl.NumberFormat('ko-KR').format(item.price * item.count)}원</Card.Text>
                                            <input type="number" min="1" value={item.count} style={{ width: "40px", textAlign: "center" }}
                                                onChange={(e) => {
                                                    dispatch(addCount({
                                                        id: item.id,
                                                        newCount: parseInt(e.target.value)
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button variant="outline-danger" onClick={() => dispatch(deleteItem(item.id))}>제거</Button>
                                            <Button variant="outline-primary">구매</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        }
                    </div>
                </div>
            </Container>
        </>
    );
}
export default Cart;