import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Landing from "./Landing";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import ImportScreen from "./ImportScreen";
import TestingScreenMain from "./TestingScreenMain";
import TestingScreen from "./TestingScreen";
import Screen from "./Screen";
import Decks from "./Decks";
import CardEditor from "./CardEditor";
import "./css/App.css";
import DailyGoal from "./DailyGoal";
import Friends from "./Friends";

function App() {
  const [currentUser, setCurrentUser] = useState("");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route
            path="signup"
            element={<Signup setCurrentUser={setCurrentUser} />}
          />
          <Route
            path="login"
            element={<Login setCurrentUser={setCurrentUser} />}
          />
          <Route
            path="home"
            element={
              <Home currentUser={currentUser} setCurrentUser={setCurrentUser} />
            }
          />
          <Route path="screen" element={<Screen />}>
            <Route
              path="import/:deckName/:deck_id"
              element={
                <ImportScreen
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route
              path="testingMain"
              element={
                <TestingScreenMain
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route
              path="testing"
              element={
                <TestingScreen
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route
              path="dailyGoal"
              element={
                <DailyGoal
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Route>
          <Route
            path="decks"
            element={
              <Decks
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="card-editor/:deckName/:deck_id"
            element={
              <CardEditor
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="friends"
            element={
              <Friends
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
