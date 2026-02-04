import { useState } from "react";
import data from "../data/data";
import { Button } from "react-bootstrap";

let AddItem = (props) => {

    let [loadingAlert, setLoadingAlert] = useState(false); //로딩시간 동안 alert 출력


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        { loadingAlert == true ? <div>로딩중 ~~</div> : '' }
        {  
            loadingAlert == false ?                         //로딩 중 더보기 버튼을 안보이게 하기 위해 삼항연산자 사용
            props.mainCount * 3 < data.length &&            //urls 배열 수만큼 count버튼을 누를 수 있게 만듬
            <Button variant="outline-primary"
                    onClick={() => {
                        setLoadingAlert(true);              //로딩 alert 출력

                        let alertTime = setTimeout(() => {  //로딩중 볼려고 딜레이준거
                            let nextCount = props.mainCount + 1;
                            let newData = data.slice(0, nextCount * 3);
                            
                            props.setShoes(newData);        //배열을 벗기고 합쳐줌
                            props.setMainCount(nextCount);  //버튼 누른횟수 1 증가
                            setLoadingAlert(false);         //로딩 끝나면 alert 창 숨김
                            
                            clearTimeout(alertTime);
                        }, 1000);
                    }}
                >더보기</Button>
            :
            ''
        }
        </>
    );
}
export default AddItem;