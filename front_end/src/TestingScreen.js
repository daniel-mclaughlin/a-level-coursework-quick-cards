import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/TestingScreen.css";
import { getCards, getDecks } from "./serverRequests";
import { User, Card, Deck } from "./classes";
import { ScreenBackButton } from "./ScreenBackButton";
import { ResponseRating } from "./ResponseRating";
import ErrorMessage from "./ErrorMessage";
import { ImCross } from "react-icons/im";
import { FaGrimace, FaSmile, FaGrinSquint, FaCrown } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import LoadingMessage from "./LoadingMessage";
import DailyStreakProgressBar from "./DailyStreakProgressBar";

const TestingScreen = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  //States for visuals
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [answerShown, setAnswerShown] = useState(false);
  const [errors, setErrors] = useState([]);
  const [allCardsStudied, setAllCardsStudied] = useState(false);

  const [currentDeck, setCurrentDeck] = useState("All Cards");
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [readyQueue, setReadyQueue] = useState([]);
  const [currentCard, setCurrentCard] = useState({});

  //Get user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    //Instantiating User class
    const userObject = new User(user);
    //Setting this cause the jump to the next useEffect
    setCurrentUser(userObject);
  }, []);
  //Get decks
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      const getAndSetDecks = async () => {
        const getDecksResponse = await getDecks(currentUser._id);
        if (getDecksResponse[0] === false) {
          //Error
          setErrors(getDecksResponse[1]); //Display custom error message
        } else {
          setDecks(getDecksResponse[1]);
        }
      };
      getAndSetDecks();
    }
  }, [currentUser]);
  //Get cards
  useEffect(() => {
    if (decks.length > 0) {
      let query;
      if (currentDeck === "All Cards") {
        //Query by user id
        //Creating instance of User
        const user = new User(currentUser);

        //All cards related to the user
        query = { user_id: user.get_id() };
      } else {
        //Query by deck id
        //creating instance of Deck
        const parsedCurrentDeck = JSON.parse(currentDeck);
        const deck = new Deck(parsedCurrentDeck);

        //All cards related to the deck
        query = { deck_id: deck.get_id() };
      }

      //Instance of User
      const workingUser = new User(currentUser);

      //Async request for cards
      const asyncGetCards = async (query) => {
        const resultOfGetCards = await getCards(query);
        if (resultOfGetCards[0] === false) {
          //error in getting cards
          setErrors(resultOfGetCards[1]);
        } else {
          //Mapping through each card document to instantiate a new card object
          const newCards = resultOfGetCards[1].map((card) => {
            const cardObject = new Card(card);
            return cardObject;
          });

          //Setting this causes the jump to the next useEffect
          setCards(newCards);
        }
      };
      //Calling the function
      asyncGetCards(query);
    }
  }, [currentDeck, decks]);
  //Load waiting queue
  useEffect(() => {
    if (cards.length > 0) {
      let newWaitingQueue = JSON.parse(JSON.stringify(waitingQueue));
      cards.forEach((card) => {
        //Add each card to the waiting queue
        //Instantiate card class
        const cardObject = new Card(card);
        addToWaitingQueue(cardObject, newWaitingQueue);
      });
      setWaitingQueue(newWaitingQueue);
      setReadyQueue([]); //Ready queue must be emptied of the user chooses a new deck
    }
  }, [cards]);
  //Load waiting queue into ready queue
  useEffect(() => {
    if (waitingQueue.length > 0 && readyQueue.length < cards.length) {
      let newReadyQueue = JSON.parse(JSON.stringify(readyQueue));
      let newWaitingQueue = JSON.parse(JSON.stringify(waitingQueue));

      const oldWaitingQueueLength = newWaitingQueue.length;

      updateReadyQueue(newReadyQueue, newWaitingQueue); //Update the ready queue
      setReadyQueue(newReadyQueue);

      const newWaitingQueueLength = newWaitingQueue.length;
      if (!(oldWaitingQueueLength === newWaitingQueueLength)) {
        //Only set state if there was a change
        setWaitingQueue(newWaitingQueue);
      }
    }
  }, [waitingQueue]);
  //Set current card
  useEffect(() => {
    if (readyQueue.length > 0) {
      //Make the current card the first one in the queue
      setCurrentCard(readyQueue[0]);
      setAllCardsStudied(false);

      //All loading is complete now
      setIsPageLoading(false);
    } else {
      setAllCardsStudied(true);
      setIsPageLoading(false);
    }
  }, [readyQueue]);

  const addToWaitingQueue = (cardObject, waitingQueue) => {
    const whenShowCard = cardObject.getWhenShowCard(); //saved as a number of milliseconds
    let added = false;
    let currentIndex = 0;
    while (added === false) {
      if (currentIndex === waitingQueue.length) {
        //We are at the end of the waiting queue
        //Card must have furthest show date, so should be last
        waitingQueue.push(cardObject);
        added = true;
      } else {
        const currentCard = new Card(waitingQueue[currentIndex]);
        const whenShowInQueueCard = currentCard.getWhenShowCard(); //What I am comparing the card to
        if (whenShowCard < whenShowInQueueCard) {
          //If the card comes before the current card looking at
          if (currentIndex === 0) {
            //current card is first in the array
            waitingQueue.unshift(cardObject);
            added = true;
          } else {
            waitingQueue.splice(currentIndex - 1, 0, cardObject);
            added = true;
          }
        } else {
          //Go to next card
          currentIndex += 1;
        }
      }
    }
  };
  const updateReadyQueue = (readyQueue, waitingQueue) => {
    //Creating copy so that no changes affect the origonal ready queue too early
    let upToDate = false;
    while (upToDate === false) {
      if (0 === waitingQueue.length) {
        //No cards in the waiting queue
        upToDate = true;
      } else {
        const whenToAdd = waitingQueue[0].whenShowCard; //Only need to check first card as all ordered
        const timeNow = new Date().getTime();
        if (timeNow > whenToAdd) {
          //Time to show card has passed
          //Add to ready queue
          readyQueue.push(waitingQueue[0]);
          waitingQueue.shift();
        } else {
          upToDate = true;
        }
      }
    }
  };

  return (
    <>
      <section className="column" id="testingHeader">
        <section className="row">
          <ScreenBackButton
            onClick={() => {
              navigate("/home");
            }}
          />
          <h1>Card Testing</h1>
        </section>
        <section className="row" id="deckDropDownSection">
          <label htmlFor="Decks">Currently studying cards from:</label>
          <select
            name="Decks"
            value={currentDeck}
            onChange={(e) => setCurrentDeck(e.target.value)}
            id="deckDropDownMenu"
          >
            <option value={"All Cards"}>{"All Cards"}</option>
            {decks.map((deck) => {
              return (
                <option value={JSON.stringify(deck)} key={deck._id}>
                  {deck.deckName}
                </option>
              );
            })}
          </select>
        </section>
        {/* TestingScreen.js */}
        <DailyStreakProgressBar
          completed={
            currentUser.dailyGoalType === "Experience"
              ? currentUser.dailyGoal < currentUser.daysExperiencePoints
                ? 100
                : Math.ceil(
                    (currentUser.daysExperiencePoints / currentUser.dailyGoal) *
                      100
                  )
              : currentUser.dailyGoal < currentUser.daysCardsStudied
              ? 100
              : Math.ceil(
                  (currentUser.daysCardsStudied / currentUser.dailyGoal) * 100
                )
          }
        ></DailyStreakProgressBar>
      </section>
      {isPageLoading && <LoadingMessage message={"Cards are being loaded"} />}
      {!isPageLoading && errors.length > 0 && <ErrorMessage errors={errors} />}
      {!isPageLoading && errors.length === 0 && !allCardsStudied && (
        <>
          <section className="column">
            <h3 id="question">{currentCard.front}</h3>
            {answerShown && <h3 id="answer">{currentCard.back}</h3>}
          </section>
        </>
      )}
      {allCardsStudied && !isPageLoading && (
        <section className="column" id="studiedAllCardsSection">
          <GiPartyPopper size={50}></GiPartyPopper>
          <h3>You've studied all your cards!</h3>
          <h4>Come again later to study more.</h4>
        </section>
      )}
      {!answerShown && !isPageLoading && !allCardsStudied && (
        <footer>
          <button
            className="footerButton button"
            type="button"
            onClick={() => setAnswerShown(true)}
          >
            Show answer
          </button>
        </footer>
      )}
      {answerShown && !isPageLoading && !allCardsStudied && (
        <footer>
          <ResponseRating
            icon={<ImCross size={40} />}
            label={"Forgot completely"}
            qualityOfResponse={0}
            waitingQueue={waitingQueue}
            addToWaitingQueue={addToWaitingQueue}
            setWaitingQueue={setWaitingQueue}
            readyQueue={readyQueue}
            setReadyQueue={setReadyQueue}
            setAnswerShown={setAnswerShown}
            currentCard={currentCard}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
          <ResponseRating
            icon={<FaGrimace size={40} />}
            qualityOfResponse={1.5}
            label={"Partially forgot"}
            currentCard={currentCard}
            waitingQueue={waitingQueue}
            addToWaitingQueue={addToWaitingQueue}
            setWaitingQueue={setWaitingQueue}
            readyQueue={readyQueue}
            setReadyQueue={setReadyQueue}
            setAnswerShown={setAnswerShown}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
          <ResponseRating
            icon={<FaSmile size={40} />}
            label={"Correct but took a while"}
            qualityOfResponse={3}
            currentCard={currentCard}
            waitingQueue={waitingQueue}
            addToWaitingQueue={addToWaitingQueue}
            setWaitingQueue={setWaitingQueue}
            readyQueue={readyQueue}
            setReadyQueue={setReadyQueue}
            setAnswerShown={setAnswerShown}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
          <ResponseRating
            icon={<FaGrinSquint size={40} />}
            label={"Correct but hesitated"}
            qualityOfResponse={4}
            currentCard={currentCard}
            waitingQueue={waitingQueue}
            addToWaitingQueue={addToWaitingQueue}
            setWaitingQueue={setWaitingQueue}
            readyQueue={readyQueue}
            setReadyQueue={setReadyQueue}
            setAnswerShown={setAnswerShown}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
          <ResponseRating
            icon={<FaCrown size={40} />}
            label={"Correct immediately"}
            qualityOfResponse={5}
            currentCard={currentCard}
            waitingQueue={waitingQueue}
            addToWaitingQueue={addToWaitingQueue}
            setWaitingQueue={setWaitingQueue}
            readyQueue={readyQueue}
            setReadyQueue={setReadyQueue}
            setAnswerShown={setAnswerShown}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </footer>
      )}
    </>
  );
};

export default TestingScreen;
