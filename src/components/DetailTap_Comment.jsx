import { Button } from "react-bootstrap";

const DetailTap_Comment = () => {
    return(
        <>
        <p className="mt-3 p-1" style={{ fontSize: '20px', color: '#888' }}>✍️리뷰 창이다</p>
        <div className="input-group mb-5">
                <textarea 
                    className="form-control" 
                    placeholder="욕 달지마라" 
                    rows="3"
                    style={{ resize: 'none' }}
                ></textarea>
                <button className="btn btn-outline-primary" type="button"
                onClick={() => {
                    alert('아직 안만듬');
                }}
                >
                    등록
                </button>
            </div>
            <hr />
        </>
    );
}
export default DetailTap_Comment;