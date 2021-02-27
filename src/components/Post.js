import { Avatar } from "@material-ui/core";
import React from "react";

export const Post = ({ username, caption, imageUrl }) => {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="pikinnnsama"
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
    </div>
  );
};
