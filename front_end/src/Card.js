import { React, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import "./css/Card.css";

const Card = ({ card, currentCards, setCurrentCards }) => {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  const handleDelete = (e, card_id, currentCards) => {
    e.preventDefault();
    //new array with every card except for the card selected for deletion
    const updatedCurrentCards = currentCards.filter((card) => {
      return !(card._id === card_id);
    });
    //Save state
    setCurrentCards(updatedCurrentCards);
  };
  const findCard = (card_id, cardArray) => {
    //Return the index of the card, and the card itself
    //Filter array for card with the passed in _id
    let [Card] = cardArray.filter((card) => {
      return card._id === card_id;
    });
    return [Card, cardArray.indexOf(Card)];
  };
  const handleFrontUpdate = (e, front, currentCards, card_id) => {
    e.preventDefault();
    let updatedCurrentCards = [...currentCards];
    let [CardObject, indexFound] = findCard(card_id, updatedCurrentCards);
    //Update card
    CardObject.front = front;
    //Update card in array
    updatedCurrentCards[indexFound] = CardObject;
    //Save state
    setCurrentCards(updatedCurrentCards);
  };
  const handleBackUpdate = (e, back, currentCards, card_id) => {
    e.preventDefault();
    let updatedCurrentCards = [...currentCards];
    let [CardObject, indexFound] = findCard(card_id, updatedCurrentCards);
    //Update card
    CardObject.back = back;
    //Update card in array
    updatedCurrentCards[indexFound] = CardObject;
    //Save state
    setCurrentCards(updatedCurrentCards);
  };

  return (
    <section className="row" id="card" key={`${card._id}section`}>
      <textarea
        key={`${card._id}front`}
        id={"Front"}
        value={front}
        placeholder={"Front"}
        rows={5}
        onChange={(e) => {
          setFront(e.target.value);
        }}
        onBlur={(e) => {
          handleFrontUpdate(e, front, currentCards, card._id);
        }}
      ></textarea>
      <button
        id="deleteButton"
        className="button"
        onClick={(e) => {
          handleDelete(e, card._id, currentCards);
        }}
      >
        <BsFillTrashFill size={28} />
      </button>
      <textarea
        key={`${card._id}back`}
        id={"Back"}
        value={back}
        placeholder={"Back"}
        rows={5}
        onChange={(e) => {
          setBack(e.target.value);
        }}
        onBlur={(e) => {
          handleBackUpdate(e, back, currentCards, card._id);
        }}
      ></textarea>
    </section>
  );
};

export default Card;
