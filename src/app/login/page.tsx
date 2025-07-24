"use client";

import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  const handleLogin = () => {
    alert("로그인 시도");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>로그인</h2>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
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
            <button className={styles.easyLoginButton} aria-label="구글 로그인">
              <img src="/login/google.svg" alt="google" />
            </button>
            <button
              className={styles.easyLoginButton}
              aria-label="네이버 로그인"
            >
              <img src="/login/naver.svg" alt="naver" />
            </button>
            <button
              className={styles.easyLoginButton}
              aria-label="카카오 로그인"
            >
              <img src="/login/kakao.svg" alt="kakao" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
