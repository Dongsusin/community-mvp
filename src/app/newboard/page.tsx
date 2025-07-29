"use client";

import styles from "./Write.module.css";
import { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // 로그인 사용자 확인
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const uploadedMediaUrls: string[] = [];

    // 파일 업로드
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const fileRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        uploadedMediaUrls.push(downloadURL);
      }
    }

    const writer =
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "익명";

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        writer,
        date: serverTimestamp(),
        views: 0,
        likes: 0,
        mediaUrls: uploadedMediaUrls,
      });
      alert("작성 완료!");
      router.push("/");
    } catch (error) {
      console.error("문서 추가 실패:", error);
      alert("오류 발생");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>글쓰기</h2>
        </div>

        <input
          className={styles.titleInput}
          type="text"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setFiles(e.target.files)}
          className={styles.fileInput}
        />

        <textarea
          className={styles.textarea}
          placeholder="내용을 입력해주세요"
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
