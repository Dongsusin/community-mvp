"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function KakaoCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchKakaoUser = async () => {
      const code = searchParams.get("code");

      if (!code) {
        alert("인가 코드가 없습니다.");
        return;
      }

      try {
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: "12c412805b751e07e4a6db43fd5256c0", // 🔑 앱 REST API 키
            redirect_uri: "http://localhost:3000/kakao/callback",
            code: code,
          }),
        });

        const tokenData = await response.json();
        const { access_token } = tokenData;

        // 사용자 정보 요청
        const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userData = await userRes.json();
        const nickname = userData.kakao_account.profile.nickname;

        // localStorage에 저장
        localStorage.setItem("kakao_user", JSON.stringify({ nickname }));

        // 새로고침으로 Header 반영
        window.location.href = "/";
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        alert("카카오 로그인 처리 중 오류가 발생했습니다.");
      }
    };

    fetchKakaoUser();
  }, [searchParams]);

  return <p>카카오 로그인 처리 중입니다...</p>;
}
