import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeName } from "../store/user";
import { addCount, deleteItem } from "../store/cart";
import { useEffect, useState } from "react";

const Cart = () => {
    let state = useSelector((state) => {return state}); //store.js에서 가져온 상품 데이터

    let [fade, setFade] = useState(''); //애니메이션을 주기위한 className state

    let dispatch = useDispatch(); //state변경함수 사용을 위해 불러옴


    /* ====애니메이션 추가==== */
    useEffect(() => {
        window.scrollTo(0, 0); //화면 제일위로 이동


        let a = setTimeout(() => { setFade('end') }, 10); //detail페이지 접속시 detail페이지를 감싼 div에 애니메이션 class 추가

        return () => { clearTimeout(a); setFade(''); } //페이지 로드전 타이머 초기화 className 초기화
    }, [location.pathname]);  //URL 주소가 변경될 때마다 실행
    

    return(
        <div className={`start ${fade}`}> {/*애니메이션 추가*/}
        {/* {state.user.name}, {state.user.age}살의 장바구니
        <button onClick={() => { dispatch(changeName(100))}}>변경</button> */}
        <Table>
            <thead>
                <tr>
                <th>#</th>
                <th>상품명</th>
                <th>수량</th>
                <th>수량추가</th>
                <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                {
                    state.cart.map((item, i) => 
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.count}</td>
                                <td><button onClick={() => {
                                        dispatch(addCount(item.id))
                                    }}>+</button></td>
                                <td><button onClick={() => {
                                        dispatch(deleteItem(item.id))
                                    }}>삭제띠</button></td>
                            </tr>
                        )
                }
            </tbody>
        </Table>
        </div>
    );
}
export default Cart;