import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

/**
 * 구글 소셜 로그인 처리를 위한 커스텀 훅
 * @param {Function} onSocialLogin 구글에서 가져온 유저 정보를 백엔드로 전달할 콜백 함수
 * @returns {Array} [loginWithGoogle] 구글 로그인 실행 함수를 배열 형태로 반환
 */
export function useGoogle(onSocialLogin) {

    //google-oauth 라이브러리에서 제공하는 로그인 함수 정의
    const loginWithGoogle = useGoogleLogin({
        //구글 인증 성공 시 액세스 토큰을 받아오고 실행
        onSuccess: async (tokenResponse) => {       
            try{
                //받은 액세스 토큰을 사용하여 구글 유저 정보 API 호출
                const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }, //Bearer 토큰 방식으로 헤더에 실어서 보냄
                });
                const data = res.data;  //구글로부터 받은 원본 데이터
                
                //백엔드의 SocialLoginRequest 규격에 맞게 데이터 가공
                const socialUser = {
                    userName: data.email,    //Id로 사용할 이메일
                    email: data.email,       //이메일
                    displayName: data.name,  //사용자 이름/닉네임
                    socialType: "GOOGLE"     //로그인 타입 구분
                };

                //가공된 정보를 부모 컴포넌트나 API 호출 함수로 전달
                //전달된 socialUser가 백엔드의 /user/social-login API로 전송
                onSocialLogin(socialUser);
            }catch (error) {
                console.error("구글 정보 획득 실패:", error);
            }
        },
        onError: (error) => console.error("구글 로그인 실패:", error),
    });

    return [loginWithGoogle];
};