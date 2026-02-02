import { Outlet } from "react-router-dom";

const Event = () => {
    return(
        <>
            <h2>오늘의 이벤트</h2>

            {/*Nested Routes가 표시되는 위치*/}
            <Outlet/>
        </>
    );
}
export default Event;