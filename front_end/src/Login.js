import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import ErrorMessage from "./ErrorMessage";
import { User } from "./classes";
import { getUser } from "./serverRequests";
import { BackButton } from "./BackButton.js";
import "./css/LoginSignup.css";

const Login = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState([]);
  const [serverError, setServerError] = useState([]);

  const setAndSaveUserDetails = async (userObject) => {
    setCurrentUser(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsArray = await validateDetails(username, password);
    if (!(errorsArray === "error")) {
      //only continue if no server error from GET request
      //No errors if the error array is empty
      const validDetails = errorsArray.length === 0 ? true : false;

      if (validDetails === true) {
        //Will have an array of whether the request was successful and then the document/error message
        const getUserResponse = await getUser({
          username: username,
          password: password,
        });

        if (getUserResponse[0] === false) {
          //if error in GET request
          setServerError([getUserResponse[1]]);
        } else {
          //No error in GET request

          //Instantiating user class
          const user = new User(getUserResponse[1]);

          await setAndSaveUserDetails(user);
          navigate("/home");
        }
      } else {
        setLoginErrors(errorsArray);
      }
    }
  };
  const validateDetails = async (username, password) => {
    const errorsArray = [];
    if (username == "" || password == "") {
      //presence check
      errorsArray.push("All fields must be filled");
    } else if ((await detailsInDB(username, password)) === "error") {
      //server error
      return "error";
    } else if (!(await detailsInDB(username, password))) {
      //detailsInDB returned false
      errorsArray.push("Username and or password is invalid");
    }
    return errorsArray;
  };
  const detailsInDB = async (username, password) => {
    const userQuery = await getUser({ username: username, password: password });
    if (userQuery[0] === false) {
      //there is an error
      setServerError(userQuery[1]);
      return "error";
    } else if (!userQuery[1]) {
      //The details are not present
      return false;
    } else {
      //The details are present
      return true;
    }
  };

  return (
    <>
      <BackButton
        onClick={() => {
          navigate("/");
        }}
      />
      <main className="center">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="loginSignupForm"
        >
          <h1>Login</h1>
          <FormInput
            name={"Username"}
            value={username}
            setValue={setUsername}
          />
          <FormInput
            name={"Password"}
            value={password}
            setValue={setPassword}
          />
          {!(loginErrors.length === 0) && <ErrorMessage errors={loginErrors} />}
          <button id="submitForm" className="button" type="submit">
            Submit
          </button>
          {serverError.length > 0 && <ErrorMessage errors={serverError} />}
        </form>
      </main>
    </>
  );
};

export default Login;
