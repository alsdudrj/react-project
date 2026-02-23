import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AddProduct({setFooterFade, setFooterMsg}) {
    const navigate = useNavigate();

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
        shipping: ""
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

    /* ==================================== */
    /* ====상품정보를 백엔드로 전송하는 함수==== */ 
    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(); 
        
        //JSON으로 변환하여 Text 데이터 저장
        formData.append("item", new Blob([JSON.stringify(inputs)], { type: "application/json" })); 

        //이미지 파일 저장
        if (imageFile) {
            formData.append("image", imageFile);
        }

        //서버 전송
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/items/add`, {
                method: "POST",
                body: formData,
            });
            
            if(res.ok) {
                setFooterFade('');
                setTimeout(() => { setFooterFade('footEnd'); }, 10);
                setFooterMsg("✔️ 상품등록 성공");
            }
        } catch (err) {
            console.error(err);
        }
    };


    /* ================================= */
    /* =============JSX구간============= */
    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
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

                <Form.Group className="mb-3">
                    <Form.Label>상품 이미지</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={onImageChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>상품명</Form.Label>
                    <Form.Control 
                        name="title" 
                        value={inputs.title} 
                        onChange={onChange} 
                        type="text" 
                        placeholder="예: 검은신발" 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가격</Form.Label>
                    <Form.Control 
                        name="price" 
                        value={inputs.price} 
                        onChange={onChange} 
                        type="number" 
                        placeholder="숫자만 입력" 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>원산지</Form.Label>
                    <Form.Control name="origin" value={inputs.origin} onChange={onChange} type="text" placeholder="예: 한국" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>생산자</Form.Label>
                    <Form.Control name="producer" value={inputs.producer} onChange={onChange} type="text" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>상품 설명</Form.Label>
                    <Form.Control 
                        name="content" 
                        value={inputs.content} 
                        onChange={onChange} 
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">등록하기</Button>
            </Form>
        </Container>
    );
}
export default AddProduct;