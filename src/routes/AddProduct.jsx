import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
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

    /* =========================== */
    /* ====모든값을 입력받는 함수==== */    
    const onChange = (e) => {
        const { name, value } = e.target;
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
        }else if(space.test(inputs.title)){
            setAlertMsg('⚠️빈칸 쓰지 말라고');
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
        }else if(space.test(inputs.title)){
            setAlertMsg('⚠️빈칸 쓰지 말라고');
            setOk('title');
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
        }else if(space.test(inputs.title)){
            setAlertMsg('⚠️빈칸 쓰지 말라고');
            setOk('title');
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
        }else if(space.test(inputs.title)){
            setAlertMsg('⚠️빈칸 쓰지 말라고');
            setOk('title');
            return ;
        }

        if (!inputs.content){
            setAlertMsg('⚠️이게 뭔지 설명은 해야지');
            setOk('content');
            return ;
        }else if(space.test(inputs.title)){
            setAlertMsg('⚠️빈칸 쓰지 말라고');
            setOk('title');
            return ;
        }

        setShowAlertModal(true);
    }


    /* ==================================== */
    /* ====상품정보를 백엔드로 전송하는 함수==== */ 
    const onSubmit = async (e) => {
        if (e) e.preventDefault();

        try {
            let finalImgUrl = "";

            // 1. Supabase 업로드 로직 (기존과 동일)
            if (imageFile) {
                const fileName = `${Date.now()}_${imageFile.name}`;
                const { data, error } = await supabase.storage
                    .from('item') 
                    .upload(fileName, imageFile);

                if (error) throw error;

                const { data: urlData } = supabase.storage
                    .from('item')
                    .getPublicUrl(fileName);
                
                finalImgUrl = urlData.publicUrl;
            }

            // 2. 전송할 데이터 준비 (이미지 URL 포함)
            const itemData = {
                ...inputs,
                imgUrl: finalImgUrl 
            };

            const token = localStorage.getItem("token");

            // 3. 서버 전송 (FormData 대신 JSON.stringify 사용)
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/item/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // 서버에 JSON이라고 알려줌
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(itemData), // ⭐️ 데이터를 JSON 문자열로 변환
            });
            
            if(res.ok) {
                setFooterFade('');
                setTimeout(() => { setFooterFade('footEnd'); }, 10);
                setFooterMsg("✔️ 상품등록 성공");
                navigate("/");
            } else {
                // 403, 500 등 에러 발생 시 처리
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
        <Container className={`mt-5 start ${fade}`} style={{ maxWidth: '600px' }}>
            <h3>상품 등록하기</h3>
            <Form>
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
                    />
                    {
                        ok === 'content' &&
                            <Alert className="product-alert-overlay" variant={'danger'}>
                                {alertMsg}
                            </Alert>
                    }
                </Form.Group>

                <Button variant="primary" type="button" className="w-100" onClick={handleBeforeSubmit}>등록하기</Button>
            </Form>
        </Container>

        {/*Alert모달*/}
        {showAlertModal && <AlertModal setShowAlertModal={setShowAlertModal} onSubmit={onSubmit}/>}
        </>
    );
}
export default AddProduct;