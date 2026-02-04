import { Button, Card } from "react-bootstrap";
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
        <div className={`start ${fade}`}> {/*애니메이션 추가*/}
            {
                state.cart.map((item, i) =>
                    <Card style={{ width: '18rem' }} key={i}>
                        <Card.Img variant="top" src={`https://codingapple1.github.io/shop/shoes${item.id + 1}.jpg`}/>
                        <Card.Body>
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
                                <Button variant="outline-danger" onClick={dispatch(deleteItem(item.id))}>제거</Button>
                                <Button variant="outline-primary">구매</Button>
                            </div>
                        </Card.Body>
                    </Card>
                )
            }
        </div>
    );
}
export default Cart;