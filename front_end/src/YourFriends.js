import { React, useState, useEffect } from "react";
import "./css/YourFriends.css";
import { deleteFriend } from "./serverRequests";

const YourFriends = ({ currentUser, setCurrentUser, friends, setFriends }) => {
  const [errors, setErrors] = useState([]);

  const handleRemoveFriend = async (friend_id) => {
    const deleteFriendResponse = await deleteFriend(currentUser._id, friend_id);
    if (!(deleteFriendResponse === true)) {
      //there was an error
      setErrors(deleteFriendResponse[1]);
    } else {
      const copyOfFriends = JSON.parse(JSON.stringify(friends));
      const updatedFriends = copyOfFriends.filter((friend) => {
        return !(friend._id === friend_id);
      });
      setFriends(updatedFriends);
    }
  };

  return (
    <>
      {friends.length === 0 && (
        <p>
          It looks like you don't have any friends, go the the add friends tab
          to start seeing what your friends are up to.
        </p>
      )}
      {friends.length > 0 && (
        <>
          {friends.map((friend) => {
            return (
              <section className="row" id="friend" key={friend._id}>
                <h3 id="username">{friend.username}</h3>
                <button
                  className="button"
                  id="removeFriendButton"
                  onClick={() => {
                    handleRemoveFriend(friend._id);
                  }}
                >
                  Remove friend
                </button>
              </section>
            );
          })}
        </>
      )}
    </>
  );
};

export default YourFriends;
