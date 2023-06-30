import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/ImportScreen.css";
import { ScreenBackButton } from "./ScreenBackButton";
import ErrorMessage from "./ErrorMessage.js";
import { postCards } from "./serverRequests";
import LoadingMessage from "./LoadingMessage";
import { Card } from "./classes.js";

const ImportScreen = ({ currentUser, setCurrentUser, cards, setCards }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [isQuizlet, setIsQuizlet] = useState(false);
  const [error, setError] = useState([]);
  const [importString, setImportString] = useState("");
  const [sideMarker, setSideMarker] = useState("");
  const [newCardMarker, setNewCardMarker] = useState("");
  const [newCards, setNewCards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false); //to track whether the import string is being processed
  const [isPostingToDB, setIsPostingToDB] = useState(false); //to track whether the cards are in the process of being saved to the DB

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);
  useEffect(() => {
    const updateCards = async () => {
      const currentCards = JSON.parse(localStorage.getItem("cards"));
      newCards.forEach((card) => {
        currentCards.push(card);
      });
      setAndSaveCards(currentCards);
      await postCards(newCards);
    };
    updateCards();
  }, [newCards]);
  useEffect(() => {
    if (isProcessing) {
      //markers are assigned correctly
      let cardMarker;
      let sideMarkerRegex;
      if (isQuizlet) {
        sideMarkerRegex = new RegExp(sideMarker, "gi");
        cardMarker = newCardMarker;
      } else {
        sideMarkerRegex = new RegExp("↔|→|←|―", "gi");
        cardMarker = "\n";
      }

      //format the input string
      const newCards = getNewCards(sideMarkerRegex, cardMarker, importString);
      setNewCards(newCards);

      //cards will be added to the database
      setIsPostingToDB(true);
      setIsProcessing(false);
    }
  }, [isProcessing]);
  useEffect(() => {
    if (isPostingToDB && newCards.length > 0) {
      const asyncPostCards = async (cards) => {
        //add to the database
        const result = await postCards(cards);
        if (result[0] === false) {
          setError([result[1]]);
        } else {
          setError([]);
          navigate(`/card-editor/${params.deckName}/${params.deck_id}`);
        }
      };
      asyncPostCards(newCards);
      //adding to database is finished
      setIsPostingToDB(false);
    }
  }, [isPostingToDB, newCards]);

  const rows = () => {
    if (isQuizlet) {
      return error.length > 0 ? 16 : 21;
    } else {
      return error.length > 0 ? 20 : 25;
    }
  };
  const setAndSaveCards = (cards) => {
    setCards(cards);
    localStorage.setItem("cards", JSON.stringify(cards));
  };
  const submitImport = async (e) => {
    //prevent the page from reloading which is the default behavior of a submit button
    e.preventDefault();
    let errorToBeSet;
    if (isQuizlet) {
      if (!(sideMarker || newCardMarker)) {
        //presence check
        errorToBeSet = ["All fields must be filled"];
      }
    } else {
      errorToBeSet = [];
    }
    if (!importString) {
      //presence check
      errorToBeSet = ["All fields must be filled"];
    } else {
      errorToBeSet = [];
    }
    if (errorToBeSet.length === 0) {
      //If no presence errors
      //Import string will begin processing
      setIsProcessing(true);
    } else {
      //state is set here, as setting state is not instant, so need to make sure nothing will operate on errors until the correct value is set
      setError(errorToBeSet);
    }
  };
  const getNewCards = (
    sideMarker, //a regular expression if importing from remnote, a single character if importing from quizlet
    newCardMarker, // \n if remnote, a single character if quizlet
    importString
  ) => {
    //String split to get an array of strings that represent each card
    const cards = importString.split(newCardMarker);

    let filteredCards;
    if (!isQuizlet) {
      //splitting at a new line with a remnote import string can leave non card entries in the array, which need to be filtered out.
      filteredCards = cards.filter((card) => {
        return sideMarker.test(card) === true;
      });
    } else {
      filteredCards = cards;
    }

    //Each card is mapped through to produce a new card object in it's place, to be left with an array of cards
    const formattedCards = filteredCards.map((card) => {
      //split at side marker to get the front and back of the card
      const [front, back] = card.split(sideMarker);
      const user_id = currentUser._id;
      //Instantiating instance of card class
      const cardObject = new Card({
        front: front,
        back: back,
        user_id: user_id,
        deck_id: params.deck_id,
      });
      return cardObject;
    });
    return formattedCards;
  };

  return (
    <>
      <section className="row">
        <ScreenBackButton
          onClick={() => {
            navigate(`/card-editor/${params.deckName}/${params.deck_id}`);
          }}
        />
        <h2>Import Cards</h2>
      </section>

      <form className="column" onSubmit={(e) => submitImport(e)}>
        <section className="row" id="radioSection">
          <label htmlFor="radioSection">Import cards from:</label>
          <section className="row" id="radioButtons">
            <section className="radioButton row">
              <label htmlFor="quizlet">Quizlet</label>
              <input
                type="radio"
                id="quizlet"
                name="importFrom"
                value={isQuizlet}
                onChange={() => setIsQuizlet(true)}
              ></input>
            </section>
            <section className="radioButton row">
              <label htmlFor="remnote">RemNote</label>
              <input
                type="radio"
                id="remnote"
                defaultChecked
                name="importFrom"
                value={"remnote"}
                onChange={() => setIsQuizlet(false)}
              ></input>
            </section>
          </section>
        </section>
        {isQuizlet && (
          <>
            <section className="row characterSelection" id="sideMarker">
              <label htmlFor="sideMarker">
                What character/s will indicate the front/back of a card?
              </label>
              <input
                type="text"
                className="characterField"
                value={sideMarker}
                onChange={(e) => setSideMarker(e.target.value)}
              ></input>
            </section>
            <section className="row characterSelection" id="newCardMarker">
              <label htmlFor="newCardMarker">
                What character/s will indicate a new card?
              </label>
              <input
                type="text"
                className="characterField"
                value={newCardMarker}
                onChange={(e) => setNewCardMarker(e.target.value)}
              ></input>
            </section>
          </>
        )}
        {(isProcessing || isPostingToDB) && (
          <LoadingMessage
            message={
              isProcessing
                ? "Import string is being processed"
                : "Cards are being added to the database"
            }
          />
        )}
        {!(isProcessing || isPostingToDB) && (
          <>
            <textarea
              placeholder="Paste import string here"
              id="importStringInput"
              rows={rows()}
              value={importString}
              onChange={(e) => setImportString(e.target.value)}
            ></textarea>
            {error.length > 0 && <ErrorMessage errors={error} />}
            <button type="submit" className="importButton button">
              Import cards
            </button>
          </>
        )}
      </form>
    </>
  );
};

export default ImportScreen;
