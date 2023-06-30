import React from "react";
import "./css/ResponseRating.css";
import { postActivity, updateCardStats, updateUser } from "./serverRequests";
import { Card, User } from "./classes";

const ResponseRating = ({
  label,
  setAnswerShown,
  currentCard,
  waitingQueue,
  addToWaitingQueue,
  setWaitingQueue,
  readyQueue,
  setReadyQueue,
  currentUser,
  setCurrentUser,
  qualityOfResponse,
  icon,
}) => {
  const handleClick = async (e) => {
    //Instantiating card and user class
    const cardObject = new Card(currentCard);
    const userObject = new User(currentUser);

    //Updating user
    const activities = userObject.cardStudied(
      cardObject.getEasinessFactor(),
      qualityOfResponse
    );
    await updateUser(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));
    setCurrentUser(userObject);

    //Add new activities to the database
    activities.forEach(async (activity) => {
      await postActivity(activity);
    });

    //Spaced repetition algorithm to get new when show card
    cardObject.updateSpacedRepetitionAttributes(qualityOfResponse);

    //Remove from readyQueue
    setReadyQueue(
      readyQueue.filter((card, cardIndex) => {
        return !(cardIndex === 0);
      })
    );

    //Update waiting queue
    let newWaitingQueue = JSON.parse(JSON.stringify(waitingQueue));
    newWaitingQueue = newWaitingQueue.map((card) => {
      return new Card(card);
    });
    addToWaitingQueue(cardObject, newWaitingQueue);
    setWaitingQueue(newWaitingQueue);

    //Update card in the database
    await updateCardStats(cardObject);

    //Hide Answer
    setAnswerShown(false);
  };

  //ResponseRating.js
  return (
    <section
      id="responseRating"
      className="column button"
      onClick={(e) => handleClick(e)}
    >
      <section id={"responseIcon"}>{icon}</section>
      <p id="responseLabel">{label}</p>
    </section>
  );
};

export { ResponseRating };
