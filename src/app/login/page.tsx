"use client";

import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import Script from "next/script";

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function Login() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // SDK 초기화
  const initializeKakao = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("12c412805b751e07e4a6db43fd5256c0");
      console.log("Kakao SDK Initialized");
      setKakaoLoaded(true);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const email = `${loginId}@yourdomain.com`;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        loginPw
      );
      localStorage.removeItem("kakao_user");
      alert(`${userCredential.user.displayName || loginId}님 환영합니다!`);
      window.location.href = "/";
    } catch (error: any) {
      console.error("로그인 실패:", error.message);
      alert("아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.removeItem("kakao_user");
      const user = result.user;
      alert(`${user.displayName || "사용자"}님 환영합니다!`);
      window.location.href = "/";
    } catch (error: any) {
      console.error("구글 로그인 실패:", error.message);
      alert("구글 로그인 실패");
    }
  };

  const handleKakaoLogin = () => {
    if (!kakaoLoaded || !window.Kakao) {
      alert("카카오 SDK가 아직 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: "http://localhost:3000/kakao/callback",
      scope: "profile_nickname,account_email",
    });
  };

  return (
    <>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="lazyOnload"
        onLoad={initializeKakao}
      />

      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h2 className={styles.title}>로그인</h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailLogin();
            }}
          >
            <input
              className={styles.input}
              type="text"
              placeholder="아이디를 입력해주세요"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
            />
            <div className={styles.options}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                로그인 상태 유지
              </label>
              <a className={styles.findLink} href="#">
                ID/PW 찾기
              </a>
            </div>
            <button type="submit" className={styles.loginButton}>
              로그인
            </button>
            <button
              type="button"
              className={styles.signupButton}
              onClick={() => router.push("/signup")}
            >
              회원가입
            </button>
          </form>

          <div className={styles.easyLogin}>
            <h3>간편 로그인</h3>
            <div className={styles.easyLoginButtons}>
              <button
                className={styles.easyLoginButton}
                aria-label="구글 로그인"
                onClick={handleGoogleLogin}
              >
                <img src="/login/google.svg" alt="google" />
              </button>
              <button
                className={styles.easyLoginButton}
                aria-label="카카오 로그인"
                onClick={handleKakaoLogin}
              >
                <img src="/login/kakao.svg" alt="kakao" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
