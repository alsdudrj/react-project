import { Button, Card, Col, Container, InputGroup, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useFadeAnimation } from "../hooks/FadeAnimation";
import { addCount, deleteItem } from "../store/cart";
import { useKakaoAddress } from "../hooks/KakaoAddress";
import DaumPostcode from 'react-daum-postcode';
import { useEffect, useState } from "react";
import SalesModal from "../components/SalesModal";
import { FooterText } from "../styled/Detail.styles";
import { useFooterAlert } from "../hooks/FooterAlert";

const Cart = ({setFooterFade, setFooterMsg}) => {
    let state = useSelector((state) => {return state});                      //store.js에서 가져온 상품 데이터

    const [fade, setFade] = useFadeAnimation();                              //애니메이션을 주기위한 Custom Hook
    const [handleAddress, address, isOpen, setIsOpen] = useKakaoAddress();   //카카오주소 목록 불러오기를 위한 Custom Hook
    const [detailAddress, setDetailAddress] = useState("");

    const [showSales, setShowSales] = useState(false);                       //구매창 상태관리   

    const [checkItems, setCheckItems] = useState(state.cart.map(item => item.id)); //체크된 품목 ID요소 저장

    const totalPrice = 
        state.cart.filter(item => checkItems.includes(item.id))
        .reduce((price, item) => price + (item.price * item.count), 0);      //상품 총액
    const totalCount = 
        state.cart.filter(item => checkItems.includes(item.id))
        .reduce((count, item) => count + item.count, 0);                     //상품 총 갯수


    const dispatch = useDispatch();                                            //state변경함수 사용을 위해 불러옴


    /* ====================== */
    /* ====체크박스 상태변경==== */
    const handleSingleCheck = (checked, id) => {
        if (checked) {
            setCheckItems(prev => [...prev, id]);               //현재 체크id와 누른 체크id 합침
        } else {
            setCheckItems(checkItems.filter((v) => v !== id));  //체크 해제시 해제한 id 제외
        }
    };

    /* ====================== */
    /* ====체크박스 전체변경==== */
    const handleAllCheck = (checked) => {
        if (checked) {
            const allItemId = state.cart.map(item => item.id);  //모든 id를 불러와서 넣음
            setCheckItems(allItemId);
        } else {
            setCheckItems([]);                                  //체크 해제시 배열을 비움
        }
    };


    /* ================================= */
    /* =============JSX구간============= */
    return(
        <>
            <Container fluid className={`start ${fade} px-5`}>

                {/*제목 및 주소 입력 영역*/}
                <Row className="align-items-center mb-3">
                    <Col>
                        <h1 className="text-start m-0" style={{ fontWeight: '700' }}>🛒장바구니이다</h1>
                    </Col>
                    <Col xs={12} md={8} lg={7}>
                        <div className="address-box p-2 border rounded bg-light">
                            <p className="mb-1" style={{ fontSize: '13px', color: '#666' }}>배송지 위치</p>
                            <div className="d-flex align-items-center flex-nowrap gap-1 mb-2">
                                <Button variant="outline-secondary" size="sm" style={{ whiteSpace: 'nowrap', fontSize: '12px', flexShrink: 0 }}
                                onClick={() => {
                                alert('아직 안만듬')
                                }}
                                >    
                                주소불러오기</Button>
                                <InputGroup size="sm" style={{ flex: '1 1 auto', display: 'flex'}}>
                                <input 
                                    type="text"
                                    className="form-control form-control-sm bg-white"
                                    value={address}
                                    placeholder="주소선택"
                                    readOnly
                                /><Button variant="outline-secondary"
                                    onClick={() => setIsOpen(true)}
                                    style={{ whiteSpace: 'nowrap', fontSize: '12px', flexShrink: 0 }}
                                >주소선택</Button>
                                </InputGroup>
                                <input
                                    type="text"
                                    className="form-control form-control-sm" 
                                    placeholder="상세주소"
                                    onChange={(e) => setDetailAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <hr/>

                {/*체크박스 영역*/}
                <div className="d-flex align-items-center mb-3" style={{ paddingLeft: '10px' }}>
                    <input 
                        type="checkbox" 
                        id="all-check"
                        onChange={(e) => handleAllCheck(e.target.checked)}
                        checked={
                            checkItems.length === state.cart.length && state.cart.length !== 0
                        }
                        style={{ 
                            width: '22px', 
                            height: '22px', 
                            cursor: 'pointer',
                            accentColor: '#61DAFB' 
                        }}
                    />
                    <label 
                        htmlFor="all-check" 
                        className="ms-2 mb-0" 
                        style={{ 
                            fontSize: '16px', 
                            fontWeight: '500', 
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        전체 선택
                    </label>
                    <span className="p-1" style={{ fontSize: '14px', color: '#666' }}>(신발당 구매는 5개까지만 가능하다)</span>
                </div>

                {/*총액 및 구매버튼 영역*/}
                <div className="d-flex align-items-center mb-3" 
                    style={{ 
                        position: 'relative', 
                        width: '100%', 
                        paddingLeft: '10px' 
                        }}
                >
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '14px', color: '#666' }}>총 금액 : </span>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#333'}}>
                            {new Intl.NumberFormat('ko-KR').format(totalPrice)}원
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-3" 
                        style={{ 
                            position: 'absolute', 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            display: 'flex'
                        }}
                    >
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#333'}}>총 {totalCount}개 </span>

                        <Button 
                            variant="outline-danger" 
                            disabled={checkItems.length === 0}
                            onClick={() => setShowSales(true)}
                        >
                            주문하기
                        </Button>
                    </div>
                </div>
                    
                <hr/>

                {/*상품 카드 영역*/}
                <div style={{ width: "80%" }}>
                    <div className="cart-grid">
                        {
                            state.cart.map((item, i) => 
                                <>
                                    <Card style={{ width: '100%', position: 'relative', overflow: 'hidden' }} key={i}>
                                        <input 
                                            type="checkbox" 
                                            id="all-check"
                                            checked={checkItems.includes(item.id)}
                                            onChange={(e) => handleSingleCheck(e.target.checked, item.id)}
                                            style={{ 
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                zIndex: 10,
                                                width: '22px', 
                                                height: '22px', 
                                                cursor: 'pointer',
                                                accentColor: '#61DAFB' 
                                            }}
                                        />
                                        <div className="cart-image-box">
                                            <img src={item.imgUrl}/>
                                        </div>
                                        <Card.Body className="text-center p-2 d-flex flex-column">
                                            <Card.Title>{item.name}</Card.Title>
                                            <Card.Text>{item.content}</Card.Text>
                                            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                                                <Card.Text className="mb-0">{new Intl.NumberFormat('ko-KR').format(item.price * item.count)}원</Card.Text>
                                                <input type="number" min="1" value={item.count} style={{ width: "40px", textAlign: "center" }}
                                                    onChange={(e) => {
                                                        let value = parseInt(e.target.value);

                                                        if (isNaN(value) || value <= 0) value = 1;
                                                        if (value >= 5) value = 5;

                                                        dispatch(addCount({
                                                            id: item.id,
                                                            newCount: value
                                                        }));
                                                    }}
                                                />
                                            </div>
                                            <div className="d-flex justify-content-center gap-2 mt-auto">
                                                <Button variant="outline-danger" onClick={() => dispatch(deleteItem(item.id))}>제거</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </>
                            )
                        }
                    </div>
                </div>
            </Container>

            {/* 주소 검색 모달 */}
            <Modal show={isOpen} onHide={() => setIsOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>주소 검색</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DaumPostcode onComplete={handleAddress} />
                </Modal.Body>
            </Modal>

            {/*주문내역 모달*/}
            {
                showSales ?
                <SalesModal 
                state={state} 
                setShowSales={setShowSales}
                totalPrice={totalPrice}
                setFooterFade={setFooterFade}
                setCheckItems={setCheckItems}
                setFooterMsg={setFooterMsg}
                address={address}
                detailAddress={detailAddress}
                />
                :
                ''
            }
        </>
    );
}
export default Cart;