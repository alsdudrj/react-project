import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarDesign } from "../styled/SidebarDesign.styles";

const Sidebar = (props) => {
    let navigate = useNavigate();

    let [item, setItem] = useState([]); //localStorage에서 뽑은 상품 정보를 저장할 곳
    let location = useLocation(); //현재 주소의 정보를 반환받음

    useEffect(() => {
        let localItemId = JSON.parse(localStorage.getItem('watchItem')) || []; //localStorage에 있는 id값을 가져옴

        //localStorage에 해당 상품 추출
        // const result = props.shoes.filter(item =>   //shoes 데이터 중 localItemId랑 shoes.id가 일치하는것만 result에 저장
        //     localItemId.includes(item.id)
        // );
        
        //검사 기준을 localStorage로 변경
        const result = localItemId.map(id =>            //localStorage값을 id로 뽑음
            props.shoes.find(item => item.id === id)    //뽑은 id중 shoes에 있는 id가 일치하는 값을 저장
        ).filter(Boolean);                              //v => Boolean(v) / undifined의 경우 false로 바꿔줌 / filter(false) >> 제거

        setItem(result);
    }, [props.shoes, location.pathname]); //페이지 접속시 localStorage를 새로 읽기위해 location.pathname 추가

    return(
        <>
        <div className="sidebar-wrapper">
        <SidebarDesign>
            <h5>최근본 상품</h5>
            {
                item.map((e, i) => {
                    return(
                        <div key={e.id}>
                            <img onClick={() => navigate(`/detail/${e.id}`)} 
                            src={`https://codingapple1.github.io/shop/shoes${e.id + 1}.jpg`} 
                            width="100%" style={{cursor: "pointer"}}/>
                            <h6 onClick={() => navigate(`/detail/${e.id}`)} style={{cursor: "pointer", marginTop: "6px"}}>{e.title}</h6>
                        </div>
                    )
                })
            }
        </SidebarDesign>
        </div>
        </>
    );
}
export default Sidebar;