import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsCardText, BsFillLightningFill } from "react-icons/bs";
import { updateUser } from "./serverRequests";
import { User } from "./classes";
import "./css/DailyGoal.css";
import { ScreenBackButton } from "./ScreenBackButton";
import ErrorMessage from "./ErrorMessage";

const DailyGoal = ({ currentUser, setCurrentUser }) => {
  const experienceGoals = {
    easy: 1000,
    medium: 3000,
    hard: 7500,
  };
  const cardGoals = {
    easy: 15,
    medium: 30,
    hard: 60,
  };

  const navigate = useNavigate();

  const [isExperience, setIsExperience] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [errors, setErrors] = useState([]);

  const handleExit = async (currentUser) => {
    if (selectedChoice === "") {
      //A choice must be selected before leaving
      setErrors(["Must select a difficulty."]);
    } else {
      const response = await updateUser(currentUser);
      if (response != true) {
        //there was an error in the database
        setErrors([response[1]]);
      } else {
        //save in local storage
        localStorage.setItem("user", JSON.stringify(currentUser));
        //go to home
        navigate("/home");
      }
    }
  };
  const setAndSaveGoalType = (isExperience) => {
    const user = new User(currentUser);
    user.setDailyGoalType(isExperience ? "Experience" : "Card");
    setCurrentUser(user);
    setIsExperience(isExperience);
    setSelectedChoice("");
  };
  const setAndSaveGoalDifficulty = (newDifficulty) => {
    const user = new User(currentUser);
    let goals;
    //Checking goal type
    if (currentUser.dailyGoalType === "Experience") {
      setIsExperience(true);
      goals = experienceGoals;
    } else {
      setIsExperience(false);
      goals = cardGoals;
    }
    //setting daily goal
    switch (newDifficulty) {
      case "easy":
        user.setDailyGoal(goals.easy);
        break;
      case "medium":
        user.setDailyGoal(goals.medium);
        break;
      case "hard":
        user.setDailyGoal(goals.hard);
        break;
    }
    setCurrentUser(user);
    setSelectedChoice(newDifficulty);
  };

  //Get user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);
  //Get selected values
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      let goals;
      //Checking goal type
      if (currentUser.dailyGoalType === "Experience") {
        setIsExperience(true);
        goals = experienceGoals;
      } else {
        setIsExperience(false);
        goals = cardGoals;
      }
      //Checking
      switch (currentUser.dailyGoal) {
        case goals.easy:
          setSelectedChoice("easy");
          break;
        case goals.medium:
          setSelectedChoice("medium");
          break;
        case goals.hard:
          setSelectedChoice("hard");
          break;
      }
    }
  }, [currentUser]);

  return (
    <section className="column">
      <section className="row" id="dailyGoalHeader">
        <ScreenBackButton
          onClick={() => {
            handleExit(currentUser);
          }}
        />
        <h1>Daily Goal</h1>
      </section>
      {errors.length > 0 && <ErrorMessage errors={errors}></ErrorMessage>}
      <section className="row" id="sectionHeaders">
        <input
          value={"Experience Goal"}
          type={"button"}
          className="sectionHeader button"
          id={
            isExperience ? "selectedSectionHeader" : "notSelectedSectionHeader"
          }
          onClick={(e) => {
            setAndSaveGoalType(true);
          }}
        ></input>
        <input
          value={"Card Goal"}
          type={"button"}
          className={"sectionHeader button"}
          id={
            !isExperience ? "selectedSectionHeader" : "notSelectedSectionHeader"
          }
          onClick={() => {
            setAndSaveGoalType(false);
          }}
        ></input>
      </section>
      <section className="row dailyGoalContent">
        <section className="imageSection">
          {isExperience && (
            <BsFillLightningFill size={150}></BsFillLightningFill>
          )}
          {!isExperience && <BsCardText size={150}></BsCardText>}
        </section>
        <section className="choiceSection">
          <h3
            className={"choice easy"}
            id={selectedChoice === "easy" ? "selectedChoice" : ""}
            onClick={() => {
              setAndSaveGoalDifficulty("easy");
            }}
          >{`Easy : ${
            isExperience
              ? `${experienceGoals.easy}xp`
              : `${cardGoals.easy} cards`
          }`}</h3>
          <h3
            id={selectedChoice === "medium" ? "selectedChoice" : ""}
            className={"choice medium"}
            onClick={() => {
              setAndSaveGoalDifficulty("medium");
            }}
          >{`Medium : ${
            isExperience
              ? `${experienceGoals.medium}xp`
              : `${cardGoals.medium} cards`
          }`}</h3>
          <h3
            id={selectedChoice === "hard" ? "selectedChoice" : ""}
            className={"choice hard"}
            onClick={() => {
              setAndSaveGoalDifficulty("hard");
            }}
          >{`Hard : ${
            isExperience
              ? `${experienceGoals.hard}xp`
              : `${cardGoals.hard} cards`
          }`}</h3>
        </section>
      </section>
    </section>
  );
};

export default DailyGoal;
