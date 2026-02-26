import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailTap from "../components/DetailTap";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/cart";
import { useLike } from "../hooks/Like";
import { useFadeAnimation } from "../hooks/FadeAnimation";
import { Button } from "react-bootstrap";
import data from "../data/data";
import { useToken } from "../hooks/Token";
import AlertModal from "../components/AlertModal";
import axios from "axios";
import DetailSkeletonImg from "../components/DetailSkeletonImg";

const Detail = ({shoes, setFooterFade, setFooterMsg}) => {
    let {id} = useParams();                             //주소로 접속시 url 파라미터를 받아옴
    const navigate = useNavigate();

    let [alertDiv, setAlertDiv] = useState(true);       //일정시간 후 없어질 html의 display boolean요소
    let [selectedSize, setSelectedSize] = useState("");     //사이즈를 저장할 state
    const [showAlertModal, setShowAlertModal] = useState(false);

    let [like, addLike] = useLike();                    //custom hook을 불러옴
    const [fade, setFade] = useFadeAnimation();         //애니메이션을 주기위한 Custom Hook
    const [token, userRole] = useToken();               //유저정보 확인을 위한 Custom Hook

    const cartData = useSelector((state) => state.cart);     //store.js에 cart 데이터를 불러옴
    let dispatch = useDispatch();                       //redux state변경함수를 사용하기 위해 불러옴

    const [item, setItem] = useState(null);             //상품정보 상태 관리
    const [loading, setLoading] = useState(true);       //로딩중 상태 관리


    //상품정보를 불러오는 useEffect
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/item/${id}`)
            .then(res => {
                setItem(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);


    //스켈레톤 이미지 이후 애니메이션 재 작동
    useEffect(() => {
        if (item) {
            setFade('');
            let timer = setTimeout(() => { setFade('end') }, 10);
            return () => clearTimeout(timer);
        }
    }, [item, setFade]);


    /* ================================ */
    /* ====html렌더링 이후 타이머 작동==== */
    useEffect(() => {
            window.scrollTo(0, 0); //화면 제일위로 이동

            let alertTimer = 
            setTimeout(() => {
                setAlertDiv(false);

                //재 렌더링시 기존타이머 제거
                return (() => {
                    clearTimeout(alertTimer);
                });
            }, 2000);
        }, []);


    /* ================================================================== */
    /* ====detail페이지 접속시 해당페이지의 상품 id를 sessionStorage에 넣음==== */
    useEffect(() => {
        if(item){
        let localItem = JSON.parse(sessionStorage.getItem('watchItem')) || [];
        localItem.unshift(item.id)

        let set = [...new Set(localItem)];  //배열 중복 제거
        set = set.slice(0, 5);              //배열을 5개까지만 저장

        sessionStorage.setItem('watchItem', JSON.stringify(set));
        }
    }, [item])


    /* ============================================ */
    /* ====서버 로딩 중 및 상품이 없을때 보여줄 화면==== */
    if (loading) {
        return <DetailSkeletonImg />;
    }
    if (!item) {
        return (
            <div className="text-center mt-5" style={{ minHeight: '100vh' }}>
                <h4>존재하지 않는 상품입니다.</h4>
                <Button onClick={() => navigate('/')}>메인으로 돌아가기</Button>
            </div>
        );
    }


    /* ===================== */
    /* ==== 상품삭제 함수 ==== */
    const onDeleteProduct = async () => {
        try {
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

            const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/item/${id}`, {
                headers: {
                    Authorization: authToken
                }
            });
            
            if (res.status === 200 || res.status === 204) {
                setFooterFade('');
                setTimeout(() => { setFooterFade('footEnd'); }, 10);
                setFooterMsg('✔️ 상품이 성공적으로 삭제되었습니다.');
                navigate("/"); 
            }
        } catch (err) {
            console.error("상품 삭제 실패", err);
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg('⚠️ 상품 삭제 실패: ' + err);
        } finally {
            setShowAlertModal(false);
        }
    };


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
            <div className={`container start ${fade}`} style={{ minHeight: '1000px', marginBottom: '300px'}}> {/*애니메이션 추가*/}
                {/*detail 페이지 카드 요소*/}
                <div className="row">
                    <div className="col-md-6">
                        <img src={item.imgUrl} width="100%" height="500px"/>
                    </div>
                    <div className="col-md-6">
                        <h4 className="pt-5">{item.title}</h4>
                        <p>제조: {item.origin}</p>
                        <p>{new Intl.NumberFormat('ko-KR').format(item.price)}원</p>

                        {/*사이즈 선택*/}
                        {item.sizeStocks && (
                            <div className="mb-3">
                                <label htmlFor="sizeSelect" className="form-label">사이즈 선택</label>
                                <select 
                                    id="sizeSelect" 
                                    className="form-select" 
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    <option value="">사이즈를 선택하세요</option>
                                    {item.sizeStocks.map((s) => (
                                        <option key={s.id} value={s.size} disabled={s.stock === 0}>
                                            {s.size} {s.stock === 0 ? '(품절)' : `(재고: ${s.stock}개)`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/*장바구니 추가*/}
                        {token &&
                            <Button variant="outline-success" onClick={() => {
                                if (!selectedSize) {
                                    setFooterFade('');
                                    setTimeout(() => { setFooterFade('footEnd'); }, 10);
                                    setFooterMsg('⚠️ 상품 사이즈 선택 필요');
                                    return;
                                }

                                //장바구니 사이즈 및 상품 중복 검사
                                let isExist = cartData.find((v) => v.id === item.id && v.size === selectedSize);

                                if(isExist) {
                                    setFooterMsg('⚠️ 이미 장바구니에 있는 상품입니다.');
                                }else{
                                    dispatch(addItem({
                                        id: item.id,
                                        name: item.title,
                                        origin: item.origin,
                                        price: item.price,
                                        imgUrl: item.imgUrl,
                                        count: 1,
                                        size: selectedSize
                                    }));
                                    setFooterMsg('✔️ 장바구니에 담았습니다.');
                                }
                                setFooterFade('');

                                setTimeout(() => { setFooterFade('footEnd'); }, 10)
                            }}>
                                장바구니 담기
                            </Button>
                        }

                        {/*관리자용 삭제버튼*/}
                        {userRole === 'ROLE_ADMIN' && (
                            <div className="mt-3 mb-3" style={{ border: '1px dotted red', padding: '10px' }}>
                                <p style={{color : 'red', fontSize : '13px'}}>관리자 메뉴</p>
                                <div className="d-flex justify-content-center gap-2">
                                    <Button variant="danger" onClick={() => setShowAlertModal(true)}>
                                        상품 삭제하기
                                    </Button>
                                    <Button variant="primary" onClick={() => navigate(`/add-product/${item.id}`)}>
                                        상품 수정하기
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/*일정 시간 후 없어지는 요소*/}
                {alertDiv == true ? 
                    <div className="alert alert-warning" id="sale">
                        2초이내 결제시 할인
                    </div>
                    :
                    <div className="alert alert-danger" id="sale">
                        이벤트 끝 ~
                    </div>
                }

                {/*Tap*/}
                <DetailTap item={item}/>
            </div>

            {/*Alert Modal*/}
            {showAlertModal && 
            <AlertModal setShowAlertModal={setShowAlertModal} onAction={onDeleteProduct} 
                Msg='정말로 삭제하시겠습니까?' 
                okMsg='삭제'
            />}
        </>
    );
}
export default Detail;