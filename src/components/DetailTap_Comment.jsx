import { useToken } from "../hooks/Token";

const DetailTap_Comment = () => {
    const [token, userRole] = useToken();       //유저정보 확인을 위한 Custom Hook

    return(
        <>
        <p className="mt-3 p-1" style={{ fontSize: '20px', color: '#888' }}>✍️리뷰 창이다</p>
        {token ?
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
        :
            <p>리뷰를 달고싶다면 로그인을 해라</p>
        }
            <hr />
        </>
    );
}
export default DetailTap_Comment;