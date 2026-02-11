import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export function useGoogle() {
    const [googleUser, setGoogleUser] = useState(null);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(" 구글 로그인 성공:", tokenResponse);
            
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const data = await res.json();
            
            console.log("구글 유저 정보:", data);
            setGoogleUser(data);
        },
        onError: (error) => console.error("구글 로그인 실패:", error),
    });

    return [ googleUser, loginWithGoogle ];
};