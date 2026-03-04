import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 * 메인 페이지 상품 목록에 들어가는 개별 상품 카드 컴포넌트
 */
let Item = (props) => {
    let navigate = useNavigate();
    let e = props.shoes;    //전달받은 상품 데이터 객체

    //데이터가 안왔으면 종료
    if (!e) return null;

    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        {/* Bootstrap의 12컬럼 시스템 중 4컬럼 (사용 한 줄에 상품 3개 노출) */}
        <Col md={4} className="mb-4">
            {/* 상품 이미지 영역 */}
            <img onClick={() => navigate(`/detail/${e.id}`)} 
            src={e.imgUrl || `https://via.placeholder.com/150`}
            style={{
                cursor: "pointer",
                width: "300px",
                height: "200px"
                }}/>
            
            {/* 상품 제목 영역 */}
            <h4 onClick={() => navigate(`/detail/${e.id}`)} style={{cursor: "pointer"}}>{e.title || e.content || "제목 없음"}</h4>

            {/* 가격 정보 영역 */}
            <p>{new Intl.NumberFormat('ko-KR').format(e.price)}원</p>
        </Col>
        </>
    );
}
export default Item;     