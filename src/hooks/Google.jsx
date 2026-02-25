import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';

export function useGoogle(onSocialLogin) {
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {       
            try{
                const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const data = res.data;
                
                const socialUser = {
                    userName: data.email, //ID 대용
                    email: data.email,
                    displayName: data.name,
                    socialType: "GOOGLE"
                };

                onSocialLogin(socialUser);
            }catch (error) {
                console.error("구글 정보 획득 실패:", error);
            }
        },
        onError: (error) => console.error("구글 로그인 실패:", error),
    });

    return [loginWithGoogle];
};