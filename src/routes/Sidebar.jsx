import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarDesign, SidebarH6, SidebarImg } from "../styled/SidebarDesign.styles";
import data from "../data/data";

const Sidebar = (props) => {
    let navigate = useNavigate();

    const [showItem, setShowItem] = useState(true); //최근본 상품 가리거나 띄우거나 할려고 만듬

    let [item, setItem] = useState([]); //sessionStorage에서 뽑은 상품 정보를 저장할 곳
    let location = useLocation();       //현재 주소의 정보를 반환받음

    let e = props.shoes;

    useEffect(() => {
        let localItemId = JSON.parse(sessionStorage.getItem('watchItem')) || []; //sessionStorage에 있는 id값을 가져옴
        
        //검사 기준을 sessionStorage로 변경
        const result = localItemId.map(id =>             //sessionStorage값을 id로 뽑음
            props.shoes.find(item => item.id === id)            //뽑은 id중 shoes에 있는 id가 일치하는 값을 저장
        ).filter(Boolean);                               //v => Boolean(v) / undifined의 경우 false로 바꿔줌 / filter(false) >> 제거

        setItem(result);
    }, [props.shoes, location.pathname]); //페이지 접속시 sessionStorage를 새로 읽기위해 location.pathname 추가


    /* ================================= */
    /* =============JSX구간============= */ 
    return(
        <>
        <div className="sidebar-wrapper">
        <SidebarDesign>
            <div className="d-flex justify-content-center">
            { showItem == true ? 
                <h5 style={{ cursor: "pointer" }} onClick={() => setShowItem(false)}>최근본 상품</h5> 
                : 
                <h5 style={{ cursor: "pointer" }} onClick={() => setShowItem(true)}>최근본 상품</h5> 
            }
            { showItem == true ? 
                <p style={{ cursor: "pointer" }} onClick={() => setShowItem(false)}>🔼</p> 
                : 
                <p style={{ cursor: "pointer" }} onClick={() => setShowItem(true)}>🔽</p> 
            }
            </div>
            {
                showItem == true ?
                item.map((e, i) => {
                    return(
                        <div key={e.id}>
                            <SidebarImg onClick={() => navigate(`/detail/${e.id}`)} 
                            src={e.imgUrl || `https://via.placeholder.com/150`}
                            />
                            <SidebarH6 onClick={() => navigate(`/detail/${e.id}`)}>{e.title}</SidebarH6>
                        </div>
                    )
                })
                :
                ''
            }
        </SidebarDesign>
        </div>
        </>
    );
}
export default Sidebar;