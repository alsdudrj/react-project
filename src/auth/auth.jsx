import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const pureToken = token.startsWith("Bearer ")
      ? token.replace("Bearer ", "")
      : token;

    const decoded = jwtDecode(pureToken);

    return {
      userName: decoded.sub,
      role: decoded.role || decoded.auth
    };
  } catch (e) {
    console.error("토큰 파싱 실패", e);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
}