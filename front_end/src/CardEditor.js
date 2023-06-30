import { React, useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { BiImport } from "react-icons/bi";
import { AiOutlinePlusSquare } from "react-icons/ai";
import Card from "./Card";
import {
  postDeck,
  deleteCard,
  postCards,
  updateCardSides,
  getCards,
  updateDeck,
} from "./serverRequests";
import "./css/CardEditor.css";
import { Deck, Card as CardClass } from "./classes";
import { BackButton } from "./BackButton";
import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";

const CardEditor = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const { deck_id, deckName } = useParams();

  const [deckLoading, setDeckLoading] = useState(true);
  const [newDeckName, setNewDeckName] = useState(deckName);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [getCardsError, setGetCardsError] = useState([]);
  const [saveErrors, setSaveErrors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deck, setDeck] = useState({});
  const [existingCards, setExistingCards] = useState([]);
  const [currentCards, setCurrentCards] = useState([]);
  const [saveAlert, setSaveAlert] = useState(false);

  const handleAdd = (e, currentCards) => {
    e.preventDefault();
    //initialise new card class
    const newCard = new CardClass({
      user_id: currentUser._id,
      deck_id: deck_id,
    });

    //updating array
    let updatedCurrentCards = [...currentCards];
    updatedCurrentCards.push(newCard);

    //save state
    setCurrentCards(updatedCurrentCards);
  };
  const checkResponseForError = (response) => {
    if (!(response === true)) {
      //there is an error
      const updatedSaveErrors = [...saveErrors];
      updatedSaveErrors.push(response[1]);
      setSaveErrors([...saveErrors, updatedSaveErrors]);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();

    //Saving is starting
    setIsSaving(true);

    if (!newDeckName) {
      //Presence check
      setSaveErrors([...saveErrors, "Deck name cannot be empty"]);
    } else {
      setSaveErrors([]);
      //Sort current cards
      const deletedCards = findDeletedCards(currentCards, existingCards);
      const updatedCards = findUpdatedCards(
        currentCards,
        deletedCards,
        existingCards
      );
      const newCards = findNewCards(updatedCards, currentCards);

      //Save card changes in DB
      //Check if new cards is empty before attempting to add
      if (newCards.length > 0) {
        const postCardsResponse = await postCards(newCards);
        checkResponseForError(postCardsResponse);
      }

      await updatedCards.forEach(async (card) => {
        const updateCardsResponse = await updateCardSides(card);
        checkResponseForError(updateCardsResponse);
      });
      await deletedCards.forEach(async (card) => {
        const deleteCardsResponse = await deleteCard(card);
        checkResponseForError(deleteCardsResponse);
      });

      //create the deck object
      const updatedDeck = new Deck({
        _id: deck._id,
        deckName: newDeckName,
        user_id: deck.user_id,
      });

      //save deck in DB
      if (deckName === "newDeck") {
        //create a new deck
        const postDeckResponse = await postDeck(updatedDeck);
        checkResponseForError(postDeckResponse);
      } else {
        //update name of existing deck
        const updateDeckResponse = await updateDeck(updatedDeck);
        checkResponseForError(updateDeckResponse);
      }

      if (saveErrors.length === 0) {
        navigate("/decks");
      }
    }
    //Saving has finished
    setIsSaving(false);
  };
  const findDeletedCards = (currentCards, existingCards) => {
    //Filter for only cards in existing cards, but not in current cards
    const deletedCards = existingCards.filter((card) => {
      return (
        //return only when the filter returns nothing, card was not present
        currentCards.filter((currentCard) => {
          return currentCard._id === card._id;
        }).length === 0
      );
    });
    return deletedCards;
  };
  const findUpdatedCards = (currentCards, deletedCards, existingCards) => {
    //Making unconnected copy to stop unwanted changes in the existingCards array
    let copyOfExistingCards = JSON.parse(JSON.stringify(existingCards));

    //Get the cards that have been updated, but the version sof them before their update
    const preUpdatedcards = copyOfExistingCards.filter((card) => {
      return (
        //Return the cards that are not deleted
        deletedCards.filter((deletedCard) => {
          return deletedCard._id === card._id;
        }).length === 0
      );
    });
    //Get the cards in the current cards array that have the matching _ids as the preUpdated Cards
    //These will be the fully updated versions
    const updatedCards = currentCards.filter((card) => {
      return !(
        preUpdatedcards.filter((preUpdatedCard) => {
          return preUpdatedCard._id === card._id;
        }).length === 0
      );
    });

    return updatedCards;
  };
  const findNewCards = (updatedCards, currentCards) => {
    //The new cards will be those in teh current cards, that are not updated version sof existing ones
    const newCards = currentCards.filter((card) => {
      return !updatedCards.includes(card);
    });
    return newCards;
  };

  //Initially load user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);
  //Set deck
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      //check if current user is a blank object
      setDeck({
        _id: deck_id, //from url param
        user_id: currentUser._id,
        deckName: deckName, //from url param
      });
    }
  }, [currentUser]);
  //Get existing cards in the deck
  useEffect(() => {
    if (Object.keys(deck).length > 0) {
      //Change loading state
      setDeckLoading(false);
      setCardsLoading(true);

      const asyncGetCards = async (deck_id) => {
        const response = await getCards({ deck_id: deck_id });
        if (response[0] === false) {
          //error
          setGetCardsError([response[1]]);
        } else {
          setExistingCards(response[1]);
        }
      };
      asyncGetCards(deck._id);
    }
  }, [deck]);
  //Initially assign the current cards to existing cards
  useEffect(() => {
    //neccessary such that just the value of the existing cards is passed in
    const copyOfExistingCards = JSON.parse(JSON.stringify(existingCards));
    setCurrentCards(copyOfExistingCards);
    //loading finished
    setCardsLoading(false);
  }, [existingCards]);

  return (
    <>
      <section className="row" id="decksHeader">
        <BackButton
          onClick={() => {
            setSaveAlert(true);
          }}
        />
        <h1>Card Editor</h1>
      </section>
      {!deckLoading && saveAlert && (
        <section className="column" id="saveAlert">
          <p>
            You are attempting to leave without saving. Would you like to save?
          </p>
          <section className="row" id="saveOptions">
            <input
              className="saveOptionsButton"
              type="button"
              value={"Save"}
              onClick={(e) => {
                handleSave(e);
              }}
            ></input>
            <input
              className="saveOptionsButton"
              type="button"
              value={"Don't save"}
              onClick={() => {
                navigate("../../decks");
              }}
            ></input>
          </section>
        </section>
      )}
      {deckLoading && <LoadingMessage message={"Deck is loading"} />}
      {!deckLoading && (
        <>
          <section className="row" id="deckNameHeader">
            <input
              id="deckName"
              type={"text"}
              value={newDeckName}
              onChange={(e) => {
                setNewDeckName(e.target.value);
              }}
              placeholder={"Deck name goes here"}
            ></input>
            <input
              id="saveButton"
              className="button"
              type={"button"}
              onClick={(e) => {
                handleSave(e);
              }}
              value="Save"
            ></input>
            <NavLink
              id="toImportCards"
              className={"button"}
              to={`/screen/import/${deckName}/${deck_id}`}
            >
              <BiImport size={70} />
            </NavLink>
          </section>
          {cardsLoading && (
            <LoadingMessage message={"Cards are being loaded"} />
          )}
          {getCardsError.length > 0 && <ErrorMessage errors={getCardsError} />}
          {isSaving && <LoadingMessage message={"Saving cards"} />}
          {!isSaving && !cardsLoading && getCardsError.length === 0 && (
            <>
              {saveErrors.length > 0 && (
                <ErrorMessage errors={saveErrors}></ErrorMessage>
              )}
              <section className="column" id="allCards">
                {currentCards.map((card) => {
                  return (
                    <Card
                      card={card}
                      key={card._id}
                      currentCards={currentCards}
                      setCurrentCards={setCurrentCards}
                    />
                  );
                })}
              </section>
              <button
                id="addCard"
                className="button"
                onClick={(e) => {
                  handleAdd(e, currentCards);
                }}
              >
                <AiOutlinePlusSquare size={42} />
              </button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default CardEditor;
