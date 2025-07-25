"use client";

import styles from "./signup.module.css";
import Script from "next/script";
import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    daum: any;
  }
}

export default function Signup() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [addr, setAddr] = useState("");
  const [detailAddr, setDetailAddr] = useState("");

  const isIdValid = id.length >= 5;
  const isPwValid = password.length >= 8 && password.length <= 16;
  const isPwMatch = password === confirmPw && confirmPw.length > 0;

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        setZipcode(data.zonecode);
        setAddr(data.address);
      },
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isIdValid || !isPwValid || !isPwMatch || !nickname.trim()) {
      alert("입력값을 확인해주세요.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        `${id}@yourdomain.com`,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: nickname });

      // firestore 저장
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        id,
        nickname,
        phone,
        zipcode,
        addr,
        detailAddr,
        createdAt: new Date(),
      });

      alert("회원가입 완료!");
      window.location.href = "/";
    } catch (error: any) {
      console.error("회원가입 에러:", error);
      alert("회원가입 실패: " + error.message);
    }
  };

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />
      <div className={styles.container}>
        <h2 className={styles.title}>회원가입</h2>
        <form className={styles.signup} onSubmit={handleSubmit}>
          <label className={styles.label}>아이디 (5자 이상)</label>
          <input
            className={styles.input}
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="로그인 시 사용"
          />
          {id.length > 0 && (
            <p className={`${styles.message} ${isIdValid ? "" : styles.error}`}>
              {isIdValid ? "사용 가능" : "5자 이상 입력해주세요"}
            </p>
          )}
          <label className={styles.label}>닉네임</label>
          <input
            className={styles.input}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
          />
          <label className={styles.label}>휴대폰 번호</label>
          <input
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-1234-5678"
          />
          <label className={styles.label}>비밀번호 (8~16자)</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password.length > 0 && (
            <p className={`${styles.message} ${isPwValid ? "" : styles.error}`}>
              {isPwValid
                ? "사용 가능한 비밀번호입니다"
                : "8~16자 사이로 입력해주세요"}
            </p>
          )}
          <label className={styles.label}>비밀번호 확인</label>
          <input
            type="password"
            className={styles.input}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
          {confirmPw.length > 0 && (
            <p className={`${styles.message} ${isPwMatch ? "" : styles.error}`}>
              {isPwMatch
                ? "비밀번호가 일치합니다"
                : "비밀번호가 일치하지 않아요"}
            </p>
          )}
          <div className={styles.address}>
            <label className={styles.label}>주소 정보</label>
            <div className={styles.postcodeWrap}>
              <input
                className={styles.input}
                value={zipcode}
                placeholder="12345"
                readOnly
              />
              <button
                type="button"
                onClick={handlePostcode}
                className={styles.postcodeBtn}
              >
                우편번호 검색
              </button>
            </div>
            <input
              className={styles.input}
              value={addr}
              placeholder="도로명 주소"
              readOnly
            />
            <input
              className={styles.input}
              value={detailAddr}
              placeholder="상세주소"
              onChange={(e) => setDetailAddr(e.target.value)}
            />
          </div>
          <button className={styles.submitBtn} type="submit">
            가입하기
          </button>
        </form>
      </div>
    </>
  );
}
