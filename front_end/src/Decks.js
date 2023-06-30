import { React, useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { User } from "./classes";
import { getDecks } from "./serverRequests";
import { v4 as uuid } from "uuid";
import Deck from "./Deck";
import "./css/Decks.css";
import ErrorMessage from "./ErrorMessage";
import LoadingMessage from "./LoadingMessage";
import { BackButton } from "./BackButton";

const Decks = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState([]);
  const [deckArray, setDeckArray] = useState([]);

  //Load user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    //Instantiating User class
    const userObject = new User(user);
    setCurrentUser(userObject);
  }, []);
  //Loading Decks
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      const getAndSetDecks = async () => {
        const getDecksResponse = await getDecks(currentUser._id);
        if (getDecksResponse[0] === false) {
          //Error
          setError(getDecksResponse[1]); //Display custom error message
        } else {
          setDeckArray(getDecksResponse[1]);
        }
        //Finished loading in data
        setIsLoading(false);
      };
      getAndSetDecks();
    }
  }, [currentUser]);

  return (
    <>
      <section className="row" id="decksHeader">
        <BackButton
          onClick={() => {
            navigate("/home");
          }}
        />
        <h1>All decks</h1>
        <NavLink
          to={`/card-editor/newDeck/${uuid()}`}
          id={"newDeckButton"}
          className="button"
        >
          New Deck
        </NavLink>
      </section>
      {isLoading && error.length === 0 && (
        <LoadingMessage message={"Decks are being fetched from the database"} />
      )}
      {error.length > 0 && <ErrorMessage errors={error} />}
      {!isLoading && error.length === 0 && (
        <section>
          <ul className="deckList">
            {deckArray.map((deck) => {
              return (
                <Deck
                  name={deck.deckName}
                  deck_id={deck._id}
                  setError={setError}
                  key={deck._id}
                />
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
};

export default Decks;
