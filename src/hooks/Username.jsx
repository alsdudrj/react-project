import axios from "axios";
import { useEffect, useState } from "react";

export function useUsername(){  //커스텀 훅 처음 적용시켜본거
    let [username, setUsername] = useState('');
    
    useEffect(() => {
        axios.get('/username.json')
        .then((result) => {
            setUsername(result.data);
        })
    }, []);
    
    return username;
}