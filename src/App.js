import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { Avatar, Button, Input, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Post } from "./components/Post";
import { ImageUpload } from "./components/ImageUpload";
// import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSingIn, setOpenSingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Backend
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      // cada vez q se agrege un post este codigo se dispara
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          posts: doc.data(),
        }))
      );
    });
  }, []);

  const reset = () => {
    setEmail("");
    setPassword("");
  };

  const singUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));

    setOpen(false);
    reset();
  };

  const singIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenSingIn(false);
    reset();
  };

  return (
    <div className="app">
      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__singUp">
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
                alt="Logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="emali"
              type="text"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={singUp}>
              Sing Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSingIn} onClose={() => setOpenSingIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__singUp">
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
                alt="Logo"
              />
            </center>
            <Input
              placeholder="emali"
              type="text"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={singIn}>
              Sing In
            </Button>
          </form>
        </div>
      </Modal>

      {/* MODAL */}

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/640px-Instagram_logo.svg.png"
          alt="Logo"
        />

        {user ? (
          <div className="app__logoutContainer">
            <Button onClick={() => auth.signOut()}>Logout</Button>
            <Avatar
              className="post__avatar"
              alt={user?.displayName}
              src="/static/images/avatar/1.jpg"
            />
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSingIn(true)}>Sing in</Button>
            <Button onClick={() => setOpen(true)}>Sing up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, posts }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={posts.username}
              caption={posts.caption}
              imageUrl={posts.imageUrl}
            />
          ))}
        </div>
            {/* <div className="app__postsRight">
              <InstagramEmbed
                url="https://www.instagram.com/p/B_uf9dmAGPw/"
                clientAccessToken="123|456"
                maxWidth={320}
                hideCaption={false}
                containerTagName="div"
                protocol=""
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
              />
            </div> */}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
