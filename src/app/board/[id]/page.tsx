"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./PostDetail.module.css";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 로그인한 사용자 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 게시글 불러오기 + 조회수 증가
  useEffect(() => {
    const fetchPost = async () => {
      const ref = doc(db, "posts", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setPost(snap.data());
        await updateDoc(ref, {
          views: (snap.data().views || 0) + 1,
        });
      }
    };

    fetchPost();
  }, [id]);

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      const q = query(
        collection(db, "posts", id as string, "comments"),
        orderBy("createdAt", "asc")
      );
      const snapshot = await getDocs(q);
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    };

    fetchComments();
  }, [id]);

  // 댓글 저장
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return alert("댓글을 입력해주세요.");

    const writerName =
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "익명";

    const commentRef = collection(db, "posts", id as string, "comments");
    await addDoc(commentRef, {
      content: comment,
      createdAt: serverTimestamp(),
      writer: writerName,
    });

    setComment("");
    // 댓글 다시 불러오기
    const snapshot = await getDocs(query(commentRef, orderBy("createdAt")));
    const updated = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(updated);
  };

  if (!post) return <p>로딩 중...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{post.title}</div>
      <div className={styles.meta}>
        작성자: {post.writer} |{" "}
        {post.date?.toDate().toLocaleDateString("ko-KR")} | 조회수: {post.views}
      </div>

      {/* 첨부된 이미지/영상 표시 */}
      {post.mediaUrls?.map((url: string, index: number) => {
        if (url.match(/\.(mp4|webm|ogg)$/)) {
          return (
            <video
              key={index}
              src={url}
              controls
              style={{ maxWidth: "100%", marginTop: "16px" }}
            />
          );
        } else {
          return (
            <img
              key={index}
              src={url}
              alt={`media-${index}`}
              style={{ maxWidth: "100%", marginTop: "16px" }}
            />
          );
        }
      })}

      <div className={styles.content}>{post.content}</div>

      <div className={styles.commentBox}>
        <div className={styles.commentTitle}>💬 댓글</div>

        {/* 댓글 리스트 */}
        {comments.map((c) => (
          <div key={c.id} style={{ marginBottom: "12px" }}>
            <div style={{ fontWeight: "bold" }}>{c.writer}</div>
            <div>{c.content}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              {c.createdAt?.toDate
                ? c.createdAt.toDate().toLocaleString("ko-KR")
                : ""}
            </div>
          </div>
        ))}

        {/* 댓글 입력 */}
        <textarea
          className={styles.commentInput}
          placeholder={
            currentUser
              ? "댓글을 입력해주세요"
              : "로그인 후 댓글을 작성할 수 있습니다"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!currentUser}
        />
        <button
          className={styles.commentButton}
          onClick={handleCommentSubmit}
          disabled={!currentUser}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
