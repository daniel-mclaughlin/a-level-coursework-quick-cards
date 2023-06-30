import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFriends from "./AddFriends";
import YourFriends from "./YourFriends";
import FriendsActivities from "./FriendsActivities";
import { getFriends } from "./serverRequests.js";
import "./css/Friends.css";
import { BackButton } from "./BackButton";
import LoadingMessage from "./LoadingMessage";
import { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";

const Friends = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const [selectedPage, setSelectedPage] = useState("Your Friends");
  const [friends, setFriends] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  //Load user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);
  //Load friends
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      //Will get an error if the currentUser is empty
      const getAndSetFriends = async () => {
        const getFriendsResponse = await getFriends(currentUser._id);
        if (getFriendsResponse[0] === false) {
          setErrors([getFriendsResponse[1]]);
          setPageLoading(false);
        } else {
          setFriends(getFriendsResponse);
          setPageLoading(false);
        }
      };
      getAndSetFriends();
    }
  }, [currentUser]);

  return (
    <>
      <section className="row" id="friendsHeader">
        <BackButton
          onClick={() => {
            navigate("/home");
          }}
        />
        <h1>Friends</h1>
      </section>
      {errors.length > 0 && <ErrorMessage errors={errors}></ErrorMessage>}
      {pageLoading && errors.length === 0 && (
        <LoadingMessage message={"Page is loading"}></LoadingMessage>
      )}
      {!pageLoading && errors.length === 0 && (
        <>
          <section className="row" id="friendPageTabs">
            <h3
              id={selectedPage === "Add Friends" ? "friendPageTabSelected" : ""}
              className="friendPageTab button"
              onClick={() => {
                setSelectedPage("Add Friends");
              }}
            >
              Add Friends
            </h3>
            <h3
              id={
                selectedPage === "Your Friends" ? "friendPageTabSelected" : ""
              }
              className="friendPageTab button"
              onClick={() => {
                setSelectedPage("Your Friends");
              }}
            >
              Your Friends
            </h3>
            <h3
              id={
                selectedPage === "Friends Activities"
                  ? "friendPageTabSelected"
                  : ""
              }
              className="friendPageTab button"
              onClick={() => {
                setSelectedPage("Friends Activities");
              }}
            >
              Friends Activities
            </h3>
          </section>
          {selectedPage === "Add Friends" && (
            <AddFriends
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              friends={friends}
              setFriends={setFriends}
            />
          )}
          {selectedPage === "Your Friends" && (
            <YourFriends
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              friends={friends}
              setFriends={setFriends}
            />
          )}
          {selectedPage === "Friends Activities" && (
            <FriendsActivities
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              friends={friends}
            />
          )}
        </>
      )}
    </>
  );
};

export default Friends;
