"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { db } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function BoardPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.boardContainer}>
        <div className={styles.boardHeader}>
          <h2>게시판</h2>
          <Link href="/newboard" className={styles.writeButton}>
            새 글 작성하기
          </Link>
        </div>

        <table className={styles.boardTable}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
              <th>추천</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, idx) => (
              <tr key={post.id}>
                <td>{posts.length - idx}</td>
                <td>
                  <Link href={`/board/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.writer}</td>
                <td>
                  {post.date?.toDate
                    ? post.date.toDate().toLocaleDateString("ko-KR")
                    : ""}
                </td>
                <td>{post.views}</td>
                <td>{post.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
