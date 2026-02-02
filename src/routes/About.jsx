import { Outlet } from "react-router-dom";

const About = () => {
    return(
        <>
            <div>어바웃이다</div>
            
            {/*Nested Routes가 표시되는 위치*/}
            <Outlet></Outlet>
        </>
    );
}
export default About;