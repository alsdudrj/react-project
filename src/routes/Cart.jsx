import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeName } from "../store/user";
import { addCount, deleteItem } from "../store/cart";
import { useEffect } from "react";

const Cart = () => {

    let state = useSelector((state) => {return state}); //store.js에서 가져온 상품 데이터

    let dispatch = useDispatch(); //state변경함수 사용을 위해 불러옴

    return(
        <>
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
        </>
    );
}
export default Cart;