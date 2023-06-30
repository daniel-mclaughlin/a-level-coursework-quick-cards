import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDecks,
  getActivities,
  getFriends,
  updateUser,
} from "./serverRequests.js";
import { BsCardText, BsFillLightningFill } from "react-icons/bs";
import { FaFire } from "react-icons/fa";
import { User } from "./classes";
import "./css/Home.css";
import Deck from "./Deck";
import Activity from "./Activity";
import { BackButton } from "./BackButton";
import LoadingMessage from "./LoadingMessage";

const Home = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const [decks, setDecks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [sortedActivities, setSortedActivities] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  //get user
  useEffect(() => {
    const getSetAndUpdateUser = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      //instance of user class so that methods stay
      const userObject = new User(user);
      userObject.makeAttributesUpToDate(
        Math.floor(new Date().getTime() / 8.64e7)
      );
      await updateUser(userObject);
      setCurrentUser(userObject);
    };
    getSetAndUpdateUser();
  }, []);
  //get deck and friends
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      //Get decks
      const getAndSetDecks = async () => {
        const getDecksResponse = await getDecks(currentUser._id);
        if (getDecksResponse[0] === false) {
          //Error
          setError(getDecksResponse[1]); //Display custom error message
        } else {
          setDecks(getDecksResponse[1]);
        }
      };
      getAndSetDecks();

      //Get friends
      const getAndSetFriends = async () => {
        const getFriendsResponse = await getFriends(currentUser._id);
        if (getFriendsResponse[0] === false) {
          setError([getFriendsResponse[1]]);
        } else {
          setFriends(getFriendsResponse);
          setIsLoading(false);
        }
      };
      getAndSetFriends();
    }
  }, [currentUser]);

  useEffect(() => {
    if (friends.length > 0) {
      setIsLoadingActivities(true);
      const getAndSetActivities = async () => {
        let newActivities = [];
        //get the activities of each friend
        for (const friend of friends) {
          const getActivitiesResponse = await getActivities(friend._id);

          if (getActivitiesResponse[0] === false) {
            //error
            setError(getActivitiesResponse[1]);
          } else {
            //add to array of all activities
            newActivities = await newActivities.concat(getActivitiesResponse);
          }
        }
        //set state
        setActivities(newActivities);
      };
      getAndSetActivities();
    }
  }, [friends]);
  useEffect(() => {
    if (
      !(activities.length === 0) &&
      sortedActivities.length < activities.length
    ) {
      let newSortedActivities = JSON.parse(JSON.stringify(sortedActivities));
      activities.forEach((activity) => {
        //Add each activity
        addToSortedActivities(activity, newSortedActivities);
      });
      setSortedActivities(newSortedActivities);
      setIsLoadingActivities(false);
    } else if (activities.length === 0) {
      setIsLoadingActivities(false);
    }
  }, [activities]);

  const addToSortedActivities = (activity, sortedActivities) => {
    const timeOfActivity = activity.timeOfActivity;
    let added = false;
    let currentIndex = 0;
    while (added === false) {
      if (currentIndex === sortedActivities.length) {
        //At the end of the sorted activities array
        //Activity must be oldest
        sortedActivities.push(activity);
        added = true;
      } else {
        const timeOfCurrentActivity =
          sortedActivities[currentIndex].timeOfActivity; // What I am comparing to
        if (timeOfActivity > timeOfCurrentActivity) {
          //The activity is more recent
          if (currentIndex === 0) {
            //current activity is first in the array
            sortedActivities.unshift(activity);
            added = true;
          } else {
            sortedActivities.splice(currentIndex - 1, 0, activity);
            added = true;
          }
        } else {
          //Go to next activity
          currentIndex += 1;
        }
      }
    }
  };

  //Home.js
  return (
    <section className="column main">
      <section className="row">
        <BackButton
          onClick={() => {
            navigate("/");
          }}
        ></BackButton>
        <h1>Hello {currentUser.username}!</h1>
      </section>
      {isLoading && (
        <LoadingMessage message={"Details are being loaded"}></LoadingMessage>
      )}
      {!isLoading && (
        <>
          <section className="row panel upperSection">
            <section className="row" id="userStats">
              <section className="cardStatIcon">
                <FaFire size={60}></FaFire>
              </section>
              <h1 className="upperSectionLabels">
                {currentUser.dailyStreak} days
              </h1>

              <section className="cardStatIcon">
                <BsFillLightningFill size={60}></BsFillLightningFill>
              </section>
              <h1 className="upperSectionLabels">
                {currentUser.daysExperiencePoints}xp
              </h1>
              <section className="cardStatIcon">
                <BsCardText size={60}></BsCardText>
              </section>
              <h1 className="upperSectionLabels">
                {currentUser.daysCardsStudied} cards
              </h1>
            </section>
            <section className="column upperPageLinks">
              <NavLink to={"/screen/testing"} className="pageLinkUpper button">
                Study Cards
              </NavLink>
              <NavLink
                to={`/screen/dailyGoal`}
                className="pageLinkUpper button"
              >
                Change Daily Goal
              </NavLink>
            </section>
          </section>
          <section className="row" id="lowerSection">
            <section className="column panel lowerSection" id="decks">
              <NavLink to="/decks" className="pageLinkLower button">
                View all decks
              </NavLink>
              {decks.length > 0 && (
                <>
                  <Deck name={decks[0].deckName} deck_id={decks[0]._id} />
                  {decks.length > 1 && (
                    <>
                      <Deck name={decks[1].deckName} deck_id={decks[1]._id} />
                      {decks.length > 2 && (
                        <Deck name={decks[2].deckName} deck_id={decks[2]._id} />
                      )}
                    </>
                  )}
                </>
              )}
            </section>
            <section className="column panel lowerSection" id="activities">
              <NavLink to="/friends" className="pageLinkLower button">
                Friends
              </NavLink>
              {isLoadingActivities && (
                <LoadingMessage message={"Loading activities"}></LoadingMessage>
              )}
              {!isLoadingActivities && (
                <>
                  {sortedActivities.length > 0 && (
                    <>
                      <Activity activity={sortedActivities[0]} isHome={true} />
                      {sortedActivities.length > 1 && (
                        <>
                          <Activity
                            activity={sortedActivities[1]}
                            isHome={true}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </section>
          </section>
        </>
      )}
    </section>
  );
};

export default Home;
