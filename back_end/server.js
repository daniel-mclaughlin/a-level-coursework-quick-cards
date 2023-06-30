const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const server = express();
server.use(cors());

const jsonParser = bodyParser.json();

const PORT = 3500;
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://Daniel:Indeed12@cluster0.epywwcu.mongodb.net/?retryWrites=true&w=majority";

//Users collection
server.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const users = database.collection("Users");
    const query = req.query;
    const result = await users.findOne(query);
    res.send([true, result]);
  } catch (err) {
    //the false is received in the front end and interpretted as the request being unsuccesful
    res.send(false);
  } finally {
    await client.close();
  }
});
server.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const users = database.collection("Users");
    const query = req.query;
    const result = await users.find(query);
    const userArray = await result.toArray();
    res.send([true, userArray]);
  } catch (err) {
    res.send([false, err]);
  } finally {
    await client.close();
  }
});
server.post("/user", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const users = database.collection("Users");
    const document = req.body;
    const result = await users.insertOne(document);
    res.send(result);
  } catch (err) {
    //the false is received in the front end and interpretted as the request being unsuccesful
    res.send(false);
  } finally {
    await client.close();
  }
});
server.put("/user", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const users = database.collection("Users");
    const updatedUser = req.body;
    const filter = { _id: updatedUser._id };
    const updateDocument = {
      $set: {
        totalExperiencePoints: updatedUser.totalExperiencePoints,
        totalCardsStudied: updatedUser.totalCardsStudied,
        lastDayUpdated: updatedUser.lastDayUpdated,
        daysExperiencePoints: updatedUser.daysExperiencePoints,
        daysCardsStudied: updatedUser.daysCardsStudied,
        dailyStreak: updatedUser.dailyStreak,
        startDayOfStreak: updatedUser.startDayOfStreak,
        dailyGoal: updatedUser.dailyGoal,
        dailyGoalType: updatedUser.dailyGoalType,
      },
    };
    const result = await users.updateOne(filter, updateDocument);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close();
  }
});

//Cards collection
server.get("/cards", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const cards = database.collection("Cards");
    const query = req.query;
    const result = await cards.find(query);
    const cardArray = await result.toArray();
    res.send([true, cardArray]);
  } catch (err) {
    res.send([false, err]);
  } finally {
    await client.close();
  }
});
server.post("/cards", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const cards = database.collection("Cards");
    const documents = req.body;
    const result = await cards.insertMany(documents);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close();
  }
});
server.put("/cardSides", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const cards = database.collection("Cards");
    const updatedCard = req.body;
    const filter = { _id: updatedCard._id };
    const updateDocument = {
      $set: {
        front: updatedCard.front,
        back: updatedCard.back,
      },
    };
    const result = await cards.updateOne(filter, updateDocument);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close();
  }
});
server.put("/cardStats", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const cards = database.collection("Cards");
    const updatedCard = req.body;
    const filter = { _id: updatedCard._id };
    const updateDocument = {
      $set: {
        easinessFactor: updatedCard.easinessFactor,
        numberOfRepetitions: updatedCard.numberOfRepetitions,
        interRepetitionInterval: updatedCard.interRepetitionInterval,
        whenShowCard: updatedCard.whenShowCard,
      },
    };
    const result = await cards.updateOne(filter, updateDocument);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close();
  }
});
server.delete("/card", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const cards = database.collection("Cards");
    const query = req.query;
    const result = await cards.deleteOne(query);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close();
  }
});

//Decks collection
server.get("/decks", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const decks = database.collection("Decks");
    const query = req.query;
    const result = await decks.find(query);
    const deckArray = await result.toArray();
    res.send([true, deckArray]);
  } catch (err) {
    res.send([false, err]);
  } finally {
    await client.close();
  }
});
server.post("/deck", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const decks = database.collection("Decks");
    const document = req.body;
    const result = await decks.insertOne(document);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close();
  }
});
server.put("/deck", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const decks = database.collection("Decks");
    const updatedDeck = req.body;
    const filter = { _id: updatedDeck._id };
    const updateDocument = {
      $set: {
        deckName: updatedDeck.deckName,
      },
    };
    const result = await decks.updateOne(filter, updateDocument);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close();
  }
});

//Friendships collection
server.post("/friendship", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const friendships = database.collection("Friendships");
    const { _id1, _id2, user, friend } = req.body;
    const document1 = {
      _id: _id1,
      user_id: user,
      friend_id: friend,
    };
    const document2 = {
      _id: _id2,
      user_id: friend,
      friend_id: user,
    };
    const result1 = await friendships.insertOne(document1);
    const result2 = await friendships.insertOne(document2);
    res.send([result1, result2]);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close;
  }
});
server.get("/friendships", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const friendships = database.collection("Friendships");
    const query = req.query;
    const result = await friendships.find(query);
    const relationshipArray = await result.toArray();
    res.send([true, relationshipArray]);
  } catch (err) {
    res.send([false, err]);
  } finally {
    await client.close;
  }
});
server.delete("/friendship", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const friendships = database.collection("Friendships");
    const query = req.query;
    const result = await friendships.deleteOne(query);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close();
  }
});

//Activities collection
server.post("/activity", jsonParser, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const activities = database.collection("Activities");
    const document = req.body;
    const result = await activities.insertOne(document);
    res.send(result);
  } catch (err) {
    res.send(false);
  } finally {
    await client.close;
  }
});
server.get("/activities", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db("QuickCards");
    const activities = database.collection("Activities");
    const query = req.query;
    const result = await activities.find(query);
    const activitiesArray = await result.toArray();
    res.send([true, activitiesArray]);
  } catch (err) {
    res.send([false, err]);
  } finally {
    await client.close;
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
