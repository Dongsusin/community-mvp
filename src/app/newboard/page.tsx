"use client";

import styles from "./Write.module.css";
import { useState } from "react";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    alert("작성 완료! (기능은 추후 구현)");
    console.log("제목:", title);
    console.log("내용:", content);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>글쓰기</h2>
        </div>

        <select className={styles.select}>
          <option>게시판을 선택하세요</option>
          <option value="general">자유 게시판</option>
          <option value="tip">팁 공유</option>
        </select>

        <input
          className={styles.titleInput}
          type="text"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className={styles.textarea}
          placeholder="함께 나누고 싶은 얘기를 남겨주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className={styles.actions}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
