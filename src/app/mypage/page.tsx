"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "./mypage.module.css";

interface UserData {
  id: string;
  nickname: string;
  phone: string;
  zipcode: string;
  addr: string;
  detailAddr: string;
}

export default function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loginType, setLoginType] = useState<
    "email" | "kakao" | "google" | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      const kakaoUser = localStorage.getItem("kakao_user");
      const currentUser = auth.currentUser;

      if (kakaoUser) {
        const { nickname, email } = JSON.parse(kakaoUser);
        setLoginType("kakao");
        setUserData({
          id: email || "카카오 계정입니다.",
          nickname: nickname,
          phone: "카카오 계정입니다.",
          zipcode: "카카오 계정입니다.",
          addr: "",
          detailAddr: "",
        });
      } else if (currentUser) {
        const providerId = currentUser.providerData[0]?.providerId;

        if (providerId === "google.com") {
          setLoginType("google");
          setUserData({
            id: currentUser.email || "구글 계정입니다.",
            nickname: currentUser.displayName || "구글 사용자",
            phone: "구글 계정입니다.",
            zipcode: "구글 계정입니다.",
            addr: "",
            detailAddr: "",
          });
        } else {
          setLoginType("email");
          const q = query(
            collection(db, "users"),
            where("uid", "==", currentUser.uid)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const doc = snapshot.docs[0].data() as UserData;
            setUserData(doc);
          }
        }
      }
    };

    fetchData();
  }, []);

  if (!userData) return <p>로딩 중...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>마이페이지</h2>
      <div className={styles.form}>
        <div className={styles.row}>
          <label>아이디</label>
          <div>{userData.id}</div>
        </div>
        <div className={styles.row}>
          <label>닉네임</label>
          <div>{userData.nickname}</div>
        </div>
        <div className={styles.row}>
          <label>연락처</label>
          <div>{userData.phone}</div>
        </div>

        <div className={styles.row}>
          <label>비밀번호 변경</label>
          {loginType === "email" ? (
            <input type="password" placeholder="변경할 비밀번호 입력" />
          ) : (
            <div>
              {loginType === "kakao"
                ? "카카오 계정은 비밀번호가 없습니다."
                : "구글 계정은 비밀번호가 없습니다."}
            </div>
          )}
        </div>

        <div className={styles.row}>
          <label>주소</label>
          <div>
            {userData.zipcode} {userData.addr} {userData.detailAddr}
          </div>
        </div>
      </div>
    </div>
  );
}
