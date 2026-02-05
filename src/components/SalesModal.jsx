import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import { useModalAnimation } from "../hooks/ModalAnimation";
import { useDispatch } from "react-redux";
import { deleteAllItem } from "../store/cart";
import { useEffect, useState } from "react";

const SalesModal = ({
    state, totalPrice, setFooterFade, setFooterMsg, setShowSales, setCheckItems, address, detailAddress
}) => {

    const [showModal, setShowModal] = useModalAnimation();  //Modal 애니메이션
    const [showAlert, setShowAlert] = useState(false);

    let dispatch = useDispatch();                       //state변경함수 사용을 위해 불러옴

    useEffect(() => {
        let timer = setTimeout(() => {
            setShowAlert(false);
        }, 1000);

        return (() => clearTimeout(timer));
    },[showAlert])


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <div className={`black-bg ${showModal}`} onClick={() => setShowSales(false)}>
            <div
                className="modal"
                style={{ display: 'block', position: 'initial' }}
                >
                <Modal.Dialog 
                className={`white-bg ${showModal}`}
                onClick={(e) => e.stopPropagation()}
                >
                    <Modal.Header className="d-flex justify-content-between align-items-center">
                        <Modal.Title>주문 내역이다</Modal.Title>
       
                        <div className="me-2 d-flex flex-column align-items-center">
                            <p style={{ fontSize: '16px', fontWeight: '700', color: '#333'}}>배송지 주소</p>
                            <div className="d-flex flex-column align-items-center">
                                <span className="" style={{ fontSize: '14px', color: '#666' }}>
                                    {address ? address : "배송주소가 입력되지 않았다."}
                                </span>
                                <span className="" style={{ fontSize: '14px', color: '#666' }}>
                                    {address ? detailAddress : ""}
                                </span>
                            </div>
                        </div>
                    </Modal.Header>

                    <Modal.Body>
                        <>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>상품명</th>
                                        <th>수량</th>
                                        <th>가격</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        state.cart.map((item, i) => {
                                            let itemPrice = item.price * item.count;
                                            return(
                                                <>
                                                    <tr key={i}>
                                                        <td>{item.name}</td>
                                                        <td>{item.count}</td>
                                                        <td>{new Intl.NumberFormat('ko-KR').format(itemPrice)}원</td>
                                                    </tr>
                                                </>
                                                );
                                            }
                                        )
                                    }
                                </tbody>
                            </Table>
                        </>
                    </Modal.Body>

                    <Modal.Footer>
                        <div className="d-flex align-items-center me-auto gap-2">
                            <span style={{ fontSize: '14px', color: '#666' }}>총 금액 : </span>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#333'}}>
                                {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
                            </span>
                        </div>
                        <Button variant="outline-secondary" onClick={() => setShowSales(false)}>안사</Button>
                        <div className="alert-anchor">
                        <Button variant="outline-danger" 
                        onClick={() => {
                            if(!address){
                                setShowAlert(true);

                                return;
                            }else{
                                setFooterFade('');
                                setTimeout(() => { setFooterFade('footEnd'); }, 10);
                                setShowSales(false);
                                setCheckItems([]);
                                setFooterMsg('✔️ 주문이 완료되었습니다.');
                                dispatch(deleteAllItem());
                            }
                        }}>
                        주문하기</Button>

                        {
                            showAlert ? 
                                <Alert className="alert-overlay" variant={'danger'}>
                                배송지를 입력해라
                                </Alert>
                            :
                            ''
                        }
                    </div>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        </div>
        </>
    );
}
export default SalesModal;