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
        <div className={`black-bg ${showModal}`}>
            <div
                className="modal"
                style={{ display: 'block', position: 'initial' }}
                onMouseDown={(e) => {
                if(e.target === e.currentTarget){
                    setShowSales(false);
                }
                }}
            >
                <Modal.Dialog 
                className={`white-bg ${showModal}`}
                onClick={(e) => e.stopPropagation()}
                >
                    <Modal.Header className="d-flex justify-content-between align-items-center">
                        <Modal.Title style={{ fontSize: '18px', fontWeight: '800', flexShrink: 0 }}>
                            🛒 주문 내역
                        </Modal.Title>
       
                        <div className="text-center" style={{ flex: '2' }}>
                            <p className="mb-0" style={{ fontSize: '12px', fontWeight: '700', color: '#888' }}>배송지 정보</p>
                            <div style={{ lineHeight: '1.2' }}>
                                <span style={{ fontSize: '13px', color: '#333', display: 'block' }}>
                                    {address ? address : "배송지가 입력되지 않았다."}
                                </span>
                                <span style={{ fontSize: '13px', color: '#666' }}>
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
                                                        <td>{item.name}({item.size})</td>
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
                                showAlert == true &&
                                    <Alert className="alert-overlay" variant={'danger'}>
                                        ⚠️배송지를 입력해라
                                    </Alert>
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