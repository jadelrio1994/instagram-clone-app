import { Avatar, Input } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import firebase from 'firebase'

export const Post = ({ postId, user, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snaptshot) => {
          setComments(snaptshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      {/* header -> avatar + username */}
      <img className="post__image" src={imageUrl} alt="" />
      {/* images */}

      <h4 className="post__text">
        <strong>{username}: </strong>
        {caption}
      </h4>
      {/* username + caption */}

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      <form className="post__commentPost">
        <Input
          type="text"
          disabled={!user}
          className="post__input"
          placeholder="Add a comment..."
          autoComplete="off"
          value={(!user) ? "You need to log in to comment" : comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={!comment}
          className="post__button"
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
};
