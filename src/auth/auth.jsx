import { jwtDecode } from "jwt-decode";

/**
 * 로컬 스토리지의 토큰을 읽어 유저 정보를 반환하는 함수
 */
export function getUserFromToken() {
  //브라우저 저장소에서 토큰 추출
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    /**
     * 토큰 전처리 (Bearer 접두사 제거)
     * HTTP 헤더 규격에 따라 'Bearer eyJ...' 형태로 저장된 경우
     * 순수 JWT 문자열만 추출하기 위해 접두사를 제거
     */
    const pureToken = token.startsWith("Bearer ")
      ? token.replace("Bearer ", "")
      : token;

    //jwt-decode를 이용한 payload 추출
    const decoded = jwtDecode(pureToken);

    //데이터 매핑
    return {
      userName: decoded.sub,
      role: decoded.role || decoded.auth
    };
  } catch (e) {
    //토큰이 손상되었거나 형식이 맞지 않는 경우 에러 로그 출력 후 null 반환
    console.error("토큰 파싱 실패", e);
    return null;
  }
}

/**
 * 로그아웃 처리 함수
 */
export function logout() {
  localStorage.removeItem("token");
}