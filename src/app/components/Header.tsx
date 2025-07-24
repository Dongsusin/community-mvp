"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 좌측 공간 확보용 div */}
        <div className={styles.side} />

        {/* 중앙 로고 */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoText}>
            <img
              src="/header/logo.png"
              alt="로고"
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* 우측 메뉴 */}
        <div className={styles.menu}>
          {isLoggedIn ? (
            <>
              <button onClick={handleLogout} className={styles.menuItem}>
                로그아웃
              </button>
            </>
          ) : (
            <div className={styles.menulist}>
              <Link href="" className={styles.menuItem}>
                게시판
              </Link>
              <Link href="" className={styles.menuItem}>
                마이페이지
              </Link>
              <Link
                href="/login"
                className={`${styles.menuItem} ${
                  isAuthPage ? styles.active : ""
                }`}
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
