"use client";

import styles from "./Board.module.css";
import Link from "next/link";

const testData = [
  {
    id: 1,
    title: "테스트 제목 1",
    writer: "작성자1",
    date: "07.25",
    views: 120,
    likes: 5,
  },
  {
    id: 2,
    title: "테스트 제목 2",
    writer: "작성자2",
    date: "07.24",
    views: 80,
    likes: 3,
  },
  {
    id: 3,
    title: "테스트 제목 3",
    writer: "작성자3",
    date: "07.23",
    views: 150,
    likes: 10,
  },
  {
    id: 4,
    title: "테스트 제목 4",
    writer: "작성자4",
    date: "07.22",
    views: 95,
    likes: 7,
  },
];

export default function BoardPage() {
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
            {testData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.writer}</td>
                <td>{item.date}</td>
                <td>{item.views}</td>
                <td>{item.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
