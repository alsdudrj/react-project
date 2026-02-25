import { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useFadeAnimation } from "../hooks/FadeAnimation";
import AlertModal from "../components/AlertModal";

function AddProduct({setFooterFade, setFooterMsg}) {
    const navigate = useNavigate();
    const [fade, setFade] = useFadeAnimation();                     //페이지 애니메이션 custom hook
    const [showAlertModal, setShowAlertModal] = useState(false);    //alert 모달 제어

    const [imgPreview, setImgPreview] = useState(null); //미리보기용 URL
    const [imageFile, setImageFile] = useState(null);   //실제 서버에 보낼 파일

    const [sizeStocks, setSizeStocks] = useState([{size: "", stock: ""}]); //사이즈/재고 입력 상태관리

    const sizeArr = [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290]

    /* ============================== */
    /* ====상품정보를 받는 useState==== */    
    const [inputs, setInputs] = useState({
        title: "",
        price: "",
        content: "",
        category: "shoes",
        producer: "",
        origin: "",
        shipping: "가능"
    });


    /* ============================== */
    /* ====사이즈/재고 입력받는 함수==== */ 
    const handleSizeChange = (index, e) => {
        const {name, value} = e.target;
        const newSizeStocks = [...sizeStocks];

        if (name === "stock"){
            if (value !== "" && parseInt(value) < 1){
                newSizeStocks[index][name] = 1;
            }else{
                newSizeStocks[index][name] = value;
            }
        }else{
            newSizeStocks[index][name] = value;
        }

        setSizeStocks(newSizeStocks);
    };
    /* ====사이즈/재고 입력 칸 추가 함수==== */
    const addSizeField = () => {
        setSizeStocks([...sizeStocks, {size : "", stock : ""}]);
    };
    /* ====사이즈/재고 입력 칸 삭제 함수==== */
    const removeSizeField = (index) => {
        const newSizeStocks = sizeStocks.filter((_, i) => i !== index);
        setSizeStocks(newSizeStocks);
    };


    /* =========================== */
    /* ====모든값을 입력받는 함수==== */    
    const onChange = (e) => {
        const {name, value} = e.target;

        //가격일 경우 최소값 지정
        if(name === "price") {
            if (value !== "" && parseInt(value) < 1){
                setInputs({
                    ...inputs,
                    [name]: 1
                });
                return;
            }
        }

        setInputs({
            ...inputs,         //기존값 복사
            [name]: value      //바뀐 값(name)만 새 값(value)으로 덮어쓰기
        });
    };

    /* ==================================== */
    /* ====브라우저에 이미지를 표시하는 함수==== */ 
    const onImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            
            setImgPreview(URL.createObjectURL(file)); //이미지를 브라우저에서 읽을수 있는 URL로 변환
        }
    };


    /* ====Alert 창 제어==== */
    const [alertMsg, setAlertMsg] = useState('');
    const [ok, setOk] = useState('');

    /* ====input값 제어==== */
    const [imgLink, setImgLink] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [origin, setOrigin] = useState('');
    const [producer, setProducer] = useState('');
    const [content, setContent] = useState('');

    /* ====================== */
    /* ====유효성 검사 함수==== */ 
    const handleBeforeSubmit = () => {
        const specialCharacters = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
        const numberCharacters = /[1234567890]/
        const space = /\s/
        const koreanCharacters = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
        const koreanOnly = /[ㄱ-ㅎㅏ-ㅣ]/;

        setOk('');

        if (!imageFile){
            setAlertMsg('⚠️상품이 어떻게 생겼는지는 알아야지.');
            setOk('img');
            return ;
        }

        if (!inputs.title){
            setAlertMsg('⚠️상품 이름이 뭐냐');
            setOk('title');
            return ;
        }else if (koreanOnly.test(inputs.title) || specialCharacters.test(inputs.title)){
            setAlertMsg('⚠️이게 상품 이름이냐');
            setOk('title');
            return ;
        }

        if (!inputs.price){
            setAlertMsg('⚠️얼만데');
            setOk('price');
            return ;
        }else if(space.test(inputs.price)){
            setAlertMsg('⚠️빈칸 쓰지 말라고');
            setOk('price');
            return ;
        }

        if (!inputs.origin){
            setAlertMsg('⚠️어디서 생산했는데');
            setOk('origin');
            return ;
        }else if (koreanOnly.test(inputs.origin) || specialCharacters.test(inputs.origin) || numberCharacters.test(inputs.origin)){
            setAlertMsg('⚠️이게 생산지 이름이냐');
            setOk('origin');
            return ;
        }

        if (!inputs.producer){
            setAlertMsg('⚠️누가 만들었는데');
            setOk('producer');
            return ;
        }else if (koreanOnly.test(inputs.producer) || specialCharacters.test(inputs.producer) || numberCharacters.test(inputs.producer)){
            setAlertMsg('⚠️이게 이름이냐');
            setOk('producer');
            return ;
        }

        if (!inputs.content){
            setAlertMsg('⚠️이게 뭔지 설명은 해야지');
            setOk('content');
            return ;
        }

        for (let i = 0; i < sizeStocks.length; i++) {
            const item = sizeStocks[i];
            
            if (!item.size.trim()) {
                setAlertMsg(`⚠️ ${i + 1}번째 사이즈가 없잖아.`);
                setOk(`size${i}`);
                return;
            }

            if (item.stock === "" || item.stock === null || item.stock < 0) {
                setAlertMsg(`⚠️ ${i + 1}번째 재고는 없냐.`);
                setOk(`sizeQty${i}`);
                return;
            }
        }

        setShowAlertModal(true);
    }


    /* ==================================== */
    /* ====상품정보를 백엔드로 전송하는 함수==== */ 
    const onSubmit = async (e) => {
        if (e) e.preventDefault();

        try {
            let finalImgUrl = "";

            //Supabase 이미지 업로드
            if (imageFile) {
                const ext = imageFile.name.split('.').pop(); //확장자 추출
                const fileName = `${Date.now()}.${ext}`;     //파일명 변경

                const { data, error } = await supabase.storage
                    .from('item') 
                    .upload(fileName, imageFile);

                if (error) throw error;

                const { data: urlData } = supabase.storage
                    .from('item')
                    .getPublicUrl(fileName);

                finalImgUrl = urlData.publicUrl;
            }

            //전송할 데이터
            const itemData = {
                ...inputs,
                imgUrl: finalImgUrl,
                sizeStocks: sizeStocks
            };

            const token = localStorage.getItem("token");

            //서버 전송
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/item/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(itemData), //데이터를 JSON 문자열로 변환
            });
            
            if(res.ok) {
                setFooterFade('');
                setTimeout(() => { setFooterFade('footEnd'); }, 10);
                setFooterMsg("✔️ 상품등록 성공");
                navigate("/");
            } else {
                const errorText = await res.text();
                throw new Error(errorText || "서버 응답 에러");
            }
        } catch (err) {
            console.error("등록 중 발생한 에러:", err);
            setFooterFade('');
            setTimeout(() => { setFooterFade('footEnd'); }, 10);
            setFooterMsg("⚠️ 등록 실패: " + err.message);
        }
    };


    /* ================================= */
    /* =============JSX구간============= */
    return (
        <>
        <Container className={`mt-5 start ${fade}`} style={{ maxWidth: '800px' }}>
            <Form>
                <Row>
                    <Col md={7}>
                        <h3 className="mb-4">상품 등록하기</h3>
                        {/*이미지 미리보기*/}
                        <div className="mb-3 text-center">
                            {imgPreview ? 
                                <img src={imgPreview} alt="preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} /> 
                            : 
                                <div style={{ width: '100%', height: '200px', background: '#eee', lineHeight: '200px' }}>이미지를 올려라</div>
                            }
                        </div>

                        <Form.Group className="mb-3 img-anchor">
                            <Form.Label>상품 이미지</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={onImageChange} />
                            {
                                ok === 'img' &&
                                    <Alert className="product-alert-overlay" variant={'danger'}>
                                        {alertMsg}
                                    </Alert>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3 title-anchor">
                            <Form.Label>상품명</Form.Label>
                            <Form.Control 
                                name="title" 
                                value={inputs.title} 
                                onChange={onChange} 
                                type="text" 
                                placeholder="예: 검은신발" 
                            />
                            {
                                ok === 'title' &&
                                    <Alert className="product-alert-overlay" variant={'danger'}>
                                        {alertMsg}
                                    </Alert>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3 price-anchor">
                            <Form.Label>가격</Form.Label>
                            <Form.Control 
                                name="price" 
                                value={inputs.price}
                                min="1" 
                                onChange={onChange}
                                type="number" 
                                placeholder="숫자만 입력" 
                            />
                            {
                                ok === 'price' &&
                                    <Alert className="product-alert-overlay" variant={'danger'}>
                                        {alertMsg}
                                    </Alert>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3 origin-anchor">
                            <Form.Label>원산지</Form.Label>
                            <Form.Control name="origin" value={inputs.origin} onChange={onChange} type="text" placeholder="예: 한국" />
                            {
                                ok === 'origin' &&
                                    <Alert className="product-alert-overlay" variant={'danger'}>
                                        {alertMsg}
                                    </Alert>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3 producer-anchor">
                            <Form.Label>생산자</Form.Label>
                            <Form.Control name="producer" value={inputs.producer} onChange={onChange} type="text" />
                            {
                                ok === 'producer' &&
                                    <Alert className="product-alert-overlay" variant={'danger'}>
                                        {alertMsg}
                                    </Alert>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>반품/교환 여부</Form.Label>
                            <Form.Select name="shipping" value={inputs.shipping} onChange={onChange} type="text">
                                <option>가능</option>
                                <option>불가능</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 content-anchor">
                            <Form.Label>상품 설명</Form.Label>
                            <Form.Control 
                                name="content" 
                                value={inputs.content} 
                                onChange={onChange} 
                                as="textarea"
                                rows={3}
                                style={{resize: 'none', height: '200px'}}
                            />
                            {
                                ok === 'content' &&
                                    <Alert className="product-alert-overlay" variant={'danger'}>
                                        {alertMsg}
                                    </Alert>
                            }
                        </Form.Group>

                        <Button variant="primary" type="button" className="w-100" onClick={handleBeforeSubmit}>등록하기</Button>
                    </Col>

                    {/*사이즈 설정*/}
                    <Col md={5}>
                        <h5>사이즈별 재고 설정</h5>
                        {sizeStocks.map((item, index) => (
                            <div key={index} className="d-flex gap-2 mb-2 align-items-end">
                                <Form.Group style={{ flex: 1 }} className="size-anchor">
                                    <Form.Label>사이즈</Form.Label>
                                    <Form.Select 
                                        name="size" 
                                        value={item.size} 
                                        onChange={(e) => handleSizeChange(index, e)} 
                                    >
                                        <option>사이즈</option>
                                        {
                                            sizeArr.map((v) => {
                                            //이미 다른 행에서 선택된 사이즈인지 확인
                                            const isSelected = sizeStocks.some((stock, i) => i !== index && String(stock.size) === String(v));
                                            
                                            //선택되지 않았거나, 현재 내가 선택한 값인 경우만 option 렌더링
                                            if (!isSelected) {
                                            return <option key={v} value={v}>{v}</option>;
                                            }
                                            return null;
                                        })
                                        }
                                    </Form.Select>
                                    {
                                        ok === `size${index}` &&
                                        <Alert className="product-alert-overlay" variant={'danger'}>
                                            {alertMsg}
                                        </Alert>
                                    }
                                </Form.Group>
                                <Form.Group style={{ flex: 1 }} className="sizeQty-anchor">
                                    <Form.Label>재고(개)</Form.Label>
                                    <Form.Control 
                                        name="stock" 
                                        type="number"
                                        min="1"
                                        value={item.stock} 
                                        onChange={(e) => handleSizeChange(index, e)} 
                                    />
                                {
                                    ok === `sizeQty${index}` &&
                                    <Alert className="product-alert-overlay" variant={'danger'}>
                                        {alertMsg}
                                    </Alert>
                                }
                                </Form.Group>
                                {sizeStocks.length > 1 && (
                                    <Form.Group className="align-self-stretch"> {/*삭제 버튼 위치 맞추기 위해 label을 줌*/}
                                        <Form.Label style={{ opacity: 0, display: 'block' }}>삭제</Form.Label>
                                            <Button variant="outline-danger" onClick={() => removeSizeField(index)}>삭제</Button>
                                    </Form.Group>
                                )}
                            </div>
                        ))}
                        <Button variant="outline-primary" size="sm" className="mb-4" onClick={addSizeField}>+ 사이즈 추가</Button>
                    </Col>
                </Row>
            </Form>
        </Container>

        {/*Alert모달*/}
        {showAlertModal && 
        <AlertModal setShowAlertModal={setShowAlertModal} onAction={onSubmit} 
        Msg='정말로 등록하시겠습니까?'
        okMsg='등록한다'
        />}
        </>
    );
}
export default AddProduct;