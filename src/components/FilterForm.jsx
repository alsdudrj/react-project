import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * 상품 사이즈 필터링 폼 컴포넌트
 */
const FilterForm = ({setShowLogin, showRegister, setShowRegister}) => {
    const navigate = useNavigate();

    const sizeArr = [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290]

    /* ====필터에서 선택된 사이즈 관리==== */
    const [minSize, setMinSize] = useState('');
    const [maxSize, setMaxSize] = useState('');


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <div className="filter-overlay">
            <Form>
                <Form.Group className="mb-3 d-flex align-items-center gap-2" controlId="select">
                    {/* 최소사이즈 */}
                    <Form.Select 
                    value={minSize}
                    onChange={(e) => {
                        setMinSize(e.target.value);
                        if (Number(e.target.value) > Number(maxSize)) setMaxSize(""); //max사이즈보다 min사이즈가 커지면 max 초기화
                    }}
                    >
                        <option>사이즈</option>
                        {
                            sizeArr.map((v, i) => {
                                return(
                                    <>
                                        <option key={i} value={v}>{v}</option>
                                    </>
                                )
                            })
                        }
                    </Form.Select>

                    <span className="px-1" style={{color: "white"}}> ~ </span>
                    {/*최대 사이즈*/}
                    <Form.Select
                    value={maxSize}
                    onChange={(e) => setMaxSize(e.target.value)}
                    disabled={!minSize} //minSize 먼저 선택 후 활성화
                    >
                        <option>사이즈</option>
                        {
                            //선택한 최소 사이즈(minSize) 이상의 값들만 옵션으로 노출
                            sizeArr.filter((v) => Number(v) >= Number(minSize))
                            .map((v, i) => {
                                return(
                                    <>
                                        <option key={i} value={v}
                                        >{v}</option>
                                    </>
                                )
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <Button variant="outline-info"
                onClick={() => {
                    alert('아직 안만듬');
                }}
                >
                    적용
                </Button>
            </Form>
        </div>
        </>
    );
};
export default FilterForm;