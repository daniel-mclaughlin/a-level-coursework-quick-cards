import { React, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { postFriend } from "./serverRequests";
import "./css/SearchResult.css";

const SearchResult = ({
  result,
  currentUser,
  setCurrentUser,
  setErrors,
  friends,
  setFriends,
  friendAdded,
  setFriendAdded,
  isFriend,
}) => {
  const handleAddFriend = async (user_id, friend_id) => {
    const postFriendResult = await postFriend(user_id, friend_id);

    if (!(postFriendResult === true)) {
      //error in request
      setErrors(postFriendResult);
    } else {
      //Set state
      if (friends.length === 0) {
        //The user has no friends
        setFriends([result]);
        setFriendAdded(!friendAdded);
      } else {
        setFriends([...friends, result]);

        setFriendAdded(!friendAdded);
      }
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  //SearchResult.js
  return (
    <section className="row" key={result._id + "section"} id="searchResult">
      <h3 id="username">{result.username}</h3>
      {!isFriend && (
        <button
          id="addFriend"
          className="button"
          onClick={() => {
            handleAddFriend(currentUser._id, result._id);
          }}
        >
          Add as friend
        </button>
      )}
      {isFriend && (
        <section id="addFriend">
          <TiTick size={50}></TiTick>
        </section>
      )}
    </section>
  );
};

export default SearchResult;
