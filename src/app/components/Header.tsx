"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setNickname(user.displayName || user.email || "");
      } else {
        const kakaoUser = localStorage.getItem("kakao_user");
        if (kakaoUser) {
          const { nickname } = JSON.parse(kakaoUser);
          setIsLoggedIn(true);
          setNickname(nickname);
        } else {
          setIsLoggedIn(false);
          setNickname("");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const kakaoUser = localStorage.getItem("kakao_user");

    if (kakaoUser) {
      if (window.Kakao && window.Kakao.Auth) {
        window.Kakao.Auth.logout(() => {
          console.log("카카오 로그아웃 완료");
        });
      }
      localStorage.removeItem("kakao_user");
    } else {
      await signOut(auth);
    }

    alert("로그아웃 되었습니다.");
    setIsLoggedIn(false);
    setNickname("");
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.side} />
        <div className={styles.logo}>
          <Link href="/" className={styles.logoText}>
            <img
              src="/header/logo.png"
              alt="로고"
              className={styles.logoImage}
            />
          </Link>
        </div>
        <div className={styles.menu}>
          <div className={styles.menulist}>
            <Link href="/board" className={styles.menuItem}>
              게시판
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/mypage" className={styles.menuItem}>
                  마이페이지
                </Link>
                <button onClick={handleLogout} className={styles.menuItem}>
                  로그아웃 ({nickname})
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`${styles.menuItem} ${
                    pathname === "/login" ? styles.active : ""
                  }`}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className={`${styles.menuItem} ${
                    pathname === "/signup" ? styles.active : ""
                  }`}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
