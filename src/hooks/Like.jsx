import { useState } from "react";

export function useLike(){
    let [like, setLike] = useState(0); //좋아요 표시갯수

    function addLike(){ //좋아요 더해주는 함수
        setLike(a => a + 1);
    }

    return [like, addLike];
}