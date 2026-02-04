import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DetailTap from "../components/DetailTap";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/cart";
import { useLike } from "../hooks/Like";
import { useFadeAnimation } from "../hooks/FadeAnimation";
import { Button } from "react-bootstrap";
import data from "../data/data";
import { FooterText } from "../styled/Detail.styles";


const Detail = (props) => {
    let {id} = useParams();                             //주소로 접속시 url 파라미터를 받아옴
    let item = data.find((v) => v.id == id);            //서버에서 받은 data중 id요소를 이용하여 파라미터 번호에 맞는 array를 찾아옴

    let [alert, setAlert] = useState(true);             //일정시간 후 없어질 html의 display boolean요소
    let [numAlert, setNumAlert] = useState(false);      //인풋창에 문자 넣으면 Alert 띄우기
    let [inputValue, setInputValue] = useState("");     //인풋창에 들어간 값 저장

    let [like, addLike] = useLike();                    //custom hook을 불러옴
    let dispatch = useDispatch();                       //redux state변경함수를 사용하기 위해 불러옴

    const [fade, setFade] = useFadeAnimation();         //애니메이션을 주기위한 Custom Hook
    const [footerFade, setFooterFade] = useState('');   //footer 애니메이션 상태관리
    const [footerMsg, setFooterMsg] = useState('');     //footer 메시지 상태관리

    const cartData = useSelector((state) => state.cart);     //store.js에 cart 데이터를 불러옴


    /* ================================ */
    /* ====html렌더링 이후 타이머 작동==== */
    useEffect(() => {
            window.scrollTo(0, 0); //화면 제일위로 이동

            let alertTimer = 
            setTimeout(() => {
                setAlert(false);

                //재 렌더링시 기존타이머 제거
                return (() => {
                    clearTimeout(alertTimer);
                });
            }, 2000);
        }, []);

    /* ========================================== */
    /* ====인풋박스에 숫자말고 다른거 띄우면 욕하기==== */
    useEffect(() => {
        // if (inputValue === "") return;       //text 출력 후 input Value가 없어도 text 유지

        if (Number.isNaN(Number(inputValue))){  //inputValue를 숫자로 변환하고 숫자가 아니면 NaN 반환 
                                                //(Number.isNaN은 형변환을 하지않고 undefined도 false를 반환해서 정확한 체크 가능)
            setNumAlert(true);
        }else setNumAlert(false);
    }, [inputValue]);

    /* =========================================================== */
    /* ====url파라미터가 data에 없는 상품으로 들어왔을때 보여줄 내용 ==== */
    if (!item) {
        return <div>상품을 찾을 수 없습니다.</div>;
    }

    /* ================================================================ */
    /* ====detail페이지 접속시 해당페이지의 상품 id를 sessionStorage에 넣음==== */
    useEffect(() => {
        let localItem = JSON.parse(sessionStorage.getItem('watchItem')) || [];
        localItem.unshift(item.id)

        let set = [...new Set(localItem)];  //배열 중복 제거
        set = set.slice(0, 5);              //배열을 5개까지만 저장

        sessionStorage.setItem('watchItem', JSON.stringify(set));
    }, [item.id])

    /* ============================================ */
    /* ====장바구니 담기시 footer에 안내메세지 출력==== */    
    useEffect(() => {
        if (footerFade === 'footEnd'){
            let timer = setTimeout(() => {
                setFooterFade('');
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [footerFade]);


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
            <div className={`container start ${fade}`}> {/*애니메이션 추가*/}
                
                {/*일정 시간 후 없어지는 요소*/}
                {alert == true ? 
                    <div className="alert alert-warning" id="sale">
                        2초이내 결제시 할인
                    </div>
                    :
                    ''
                }
                
                {/*detail 페이지 카드 요소*/}
                <div className="row">
                    <div className="col-md-6">
                        <img src={`https://codingapple1.github.io/shop/shoes${item.id + 1}.jpg`} width="100%" />
                    </div>
                    <div className="col-md-6">
                        { numAlert == true ? <p style={{color: "red"}}>글자를 못읽는것이냐? 문자말고 숫자써라</p> : ''}
                        <input type="text" id="numInput" placeholder="실험용(숫자만써라)" value={inputValue} onChange={(e) => { setInputValue(e.target.value) }}/>
                        <h4 className="pt-5">{item.title}</h4>
                        <p>제조사: {item.content}</p>
                        <p>{new Intl.NumberFormat('ko-KR').format(item.price)}원</p>
                        <Button variant="outline-success" onClick={() => {
                            let isExist = cartData.find((v) => v.id === item.id);

                            if(isExist) {
                                setFooterMsg('⚠️ 이미 장바구니에 있는 상품입니다.');
                            }else{
                                dispatch(addItem({
                                    id: item.id,
                                    name: item.title,
                                    count: 1
                                }));
                                setFooterMsg('✔️ 장바구니에 담았습니다.');
                            }
                            setFooterFade('');

                            setTimeout(() => { setFooterFade('footEnd'); }, 10)
                        }}>
                            장바구니 담기
                        </Button>
                        <br />
                    {like}<span onClick={() => {addLike()}}>♥</span>
                    </div>
                </div>

                {/*Tap*/}
                <DetailTap/>
            </div>
            <FooterText className={`footer-animation ${footerFade ? 'footEnd' : 'footStart'}`}>
                {footerMsg}
            </FooterText>
        </>
    );
}
export default Detail;