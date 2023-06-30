import { api } from "./api";
import { v4 as uuid } from "uuid";

//Requests to the Users collection
const getUser = async (query) => {
  try {
    const response = await api.get(`/user`, { params: query });
    if (response.data[0] === false) {
      //request was unsuccessful
      throw "Error in GET request for user."; //Custom error message
    } else {
      return response.data;
    }
  } catch (err) {
    return [false, err];
  }
};
const getUsers = async (query) => {
  try {
    const response = await api.get(`/users`, {
      params: query,
    });
    if (response.data[0] === false) {
      throw "Error in getting users";
    } else {
      return response.data[1];
    }
  } catch (err) {
    return [false, err];
  }
};
const postUser = async (newUser) => {
  try {
    const response = await api.post("/user", newUser);
    if (response === false) {
      //request was unsuccessful
      throw "Error in POST request for user."; //Custom error message
    } else {
      return true;
    }
  } catch (err) {
    return [false, err];
  }
};
const updateUser = async (updatedUser) => {
  try {
    const response = await api.put("/user", updatedUser);
    if (response.data === false) {
      throw "Error in attempting to update user";
    } else {
      return true;
    }
  } catch (err) {
    return [false, err];
  }
};

//Requests to the Cards collection
const getCards = async (query) => {
  try {
    const response = await api.get(`/cards`, { params: query });
    if (response.data[0] === false) {
      //request was unsuccessful
      throw "Error in GET request for cards."; //Custom error message
    } else {
      return response.data;
    }
  } catch (err) {
    return [false, err];
  }
};
const postCards = async (cards) => {
  try {
    const response = await api.post("/cards", cards);
    if (response.data === false) {
      //if there is a server error
      throw "Error in attempting to add cards to the database, please try again"; //Custom error message
    } else {
      return true;
    }
  } catch (err) {
    return [false, err];
  }
};
const updateCardSides = async (card) => {
  try {
    const response = await api.put("/cardSides", card);
    if (response.data === false) {
      throw "Error in attempting to update cards";
    } else {
      return true;
    }
  } catch (err) {
    return [false, err];
  }
};
const updateCardStats = async (card) => {
  try {
    const response = await api.put("/cardStats", card);
    if (response.data === false) {
      throw "Error in attempting to update cards";
    } else {
      return true;
    }
  } catch (err) {
    return [false, err];
  }
};
const deleteCard = async (card) => {
  try {
    const response = await api.delete(`/card?_id=${card._id}`);
    if (response.data === false) {
      throw "Error in attempting to delete cards from database"; //Custom error message
    } else {
      return true;
    }
  } catch (err) {
    return [false, err];
  }
};

//Request to the Decks collection
const getDecks = async (user_id) => {
  try {
    const response = await api.get(`/decks`, { params: { user_id: user_id } });
    if (response[0] === false) {
      throw "Error in GET /decks. Please reload the page"; //custom error message
    } else {
      return response.data;
    }
  } catch (err) {
    return [false, err];
  }
};
const postDeck = async (deck) => {
  try {
    const response = await api.post("/deck", deck);
    if (response.data === false) {
      throw "Error on POST request to decks"; //custom error message
    } else {
      return true;
    }
  } catch (err) {
    return [false, err];
  }
};
const updateDeck = async (deck) => {
  try {
    const response = await api.put("/deck", deck);
    if (response.data === false) {
      throw "Error in attempting to update deck name"; //custom error message
    } else {
      return true;
    }
  } catch (err) {
    return [false, err];
  }
};

//Request to Friendships collection
const getFriendships = async (user_id) => {
  try {
    const response = await api.get(`friendships?user_id=${user_id}`);
    if (response.data[0] === false) {
      throw "Error in fetching friends from the database";
    } else {
      return response.data[1];
    }
  } catch (err) {
    return [false, err];
  }
};
const getFriends = async (user_id) => {
  try {
    const getFriendshipsResponse = await getFriendships(user_id);
    if (getFriendshipsResponse[0] === false) {
      throw "Error in fetching friends from the database";
    } else {
      //Array of all the _ids of friends
      const friendshipsArray = getFriendshipsResponse;
      try {
        //fetch each user document of each friend
        let friends = [];
        for (let relationship of friendshipsArray) {
          const getUserResponse = await getUser({
            _id: relationship.friend_id,
          });
          if (getUserResponse === false) {
            throw "Error in trying to get friend data";
          } else {
            //return array of friend user documents
            friends.push(getUserResponse[1]);
          }
        }
        return friends[0] === null ? [] : friends;
      } catch (err) {
        return [false, err];
      }
    }
  } catch (err) {
    return [false, err];
  }
};
const deleteFriend = async (user_id, friend_id) => {
  try {
    const response = await api.delete(`/friendship`, {
      params: {
        user_id: user_id,
        friend_id: friend_id,
      },
    });
    if (response.data === false) {
      throw "Error in attempting to delete friends";
    } else {
      try {
        const response = await api.delete(`/friendship`, {
          param: {
            user_id: friend_id,
            friend_id: user_id,
          },
        });
        if (response.data === false) {
          throw "Error in attempting to delete friends";
        } else {
          return true;
        }
      } catch (err) {
        return [false, err];
      }
    }
  } catch (err) {
    return [false, err];
  }
};
const postFriend = async (user_id, friend_id) => {
  const _id1 = uuid();
  const _id2 = uuid();
  try {
    const response = await api.post("friendship", {
      _id1: _id1,
      _id2: _id2,
      user: user_id,
      friend: friend_id,
    });
    if (response.data === false) {
      throw "Error in attempting to add friend";
    } else {
      return true;
    }
  } catch (err) {
    return err;
  }
};

//Requests to the Activities collection
const getActivities = async (user_id) => {
  try {
    const response = await api.get(`/activities?user_id=${user_id}`);
    if (response.data[0] === false) {
      throw "Error in fetching activities from the database";
    } else {
      return response.data[1];
    }
  } catch (err) {
    return [false, err];
  }
};
const postActivity = async (activity) => {
  try {
    const response = api.post("/activity", activity);
    if (response.data) {
      throw "Error in adding activity to the database";
    } else {
      return true;
    }
  } catch (err) {
    return err;
  }
};

export {
  postUser,
  getUser,
  getUsers,
  getFriendships,
  getActivities,
  getDecks,
  updateCardSides,
  postCards,
  deleteCard,
  postDeck,
  getFriends,
  updateUser,
  postActivity,
  deleteFriend,
  getCards,
  updateDeck,
  updateCardStats,
  postFriend,
};
