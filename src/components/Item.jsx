import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

let Item = (props) => {             //메인 품목 카드
    let navigate = useNavigate();
    let e = props.shoes;

    //데이터가 안왔으면 종료
    if (!e) return null;

    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <Col md={4} className="mb-4">
            <img onClick={() => navigate(`/detail/${e.id}`)} 
            src={e.imgUrl || `https://via.placeholder.com/150`}
            style={{
                cursor: "pointer",
                width: "300px",
                height: "200px"
                }}/>
            <h4 onClick={() => navigate(`/detail/${e.id}`)} style={{cursor: "pointer"}}>{e.title || e.content || "제목 없음"}</h4>
            <p>{new Intl.NumberFormat('ko-KR').format(e.price)}원</p>
        </Col>
        </>
    );
}
export default Item;     