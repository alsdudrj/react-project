import { useEffect, useRef, useState } from "react";

const Umm = () => {
    let [count, setCount] = useState(0);
    let [age, setAge] = useState(20);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if ( count < 3 ) {
            setAge(age + 1);
        }
    }, [count])

    return(
        <>
        <p>나는 {age}살</p>
        <button onClick={()=>{
            setCount(count+1);
        }}>누르면한살먹기</button>
        </>
    );
}
export default Umm;