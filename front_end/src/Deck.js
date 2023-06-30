import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCards } from "./serverRequests";
import "./css/Deck.css";

const Deck = ({ name, deck_id, setError }) => {
  const navigate = useNavigate();
  const [cardCount, setCardCount] = useState(0);

  const getCardCount = async (deck_id) => {
    const response = await getCards({ deck_id: deck_id });
    if (response[0] === false) {
      //Error
      setError([response.data[1]]);
      return false;
    } else {
      //request was successful
      //length of array of cards is the number of cards in the deck
      return response[1].length;
    }
  };

  useEffect(() => {
    const updateCardCount = async (deck_id) => {
      const cardCount = await getCardCount(deck_id);
      if (!(cardCount === false)) {
        //get request was successful
        setCardCount(cardCount);
      }
    };
    updateCardCount(deck_id);
  });

  return (
    <li
      key={deck_id}
      className={"deck button"}
      onClick={() => {
        navigate(`/card-editor/${name}/${deck_id}`);
      }}
    >
      <section className="row">
        <h3>{name}</h3>
        <h3 className="cardCount">{cardCount} cards</h3>
      </section>
    </li>
  );
};

export default Deck;
