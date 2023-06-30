import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import ErrorMessage from "./ErrorMessage";
import { BackButton } from "./BackButton";
import "./css/LoginSignup.css";
import { postUser, getUser } from "./serverRequests";
import { User } from "./classes.js";

const Signup = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [serverError, setServerError] = useState([]);

  const setAndSaveUserDetails = (userObject) => {
    setCurrentUser(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));
  };
  const handleSubmit = async (e) => {
    //prevents default behavior of reloading page
    e.preventDefault();

    //Getting the errors
    const usernameErrorArray = await validateUsername(username);
    const validUsername = usernameErrorArray.length === 0;
    const passwordErrorArray = validatePassword(password);
    const validPassword = passwordErrorArray.length === 0;
    const isServerError = serverError.length === 0;

    //If no errors, at this stage the server error check will account for an error in reading usernames from the database
    if (validUsername && validPassword && isServerError) {
      const newUser = new User({ username: username });

      //Cannot send user object to be stored as it does not store the users password for security reasons
      const newUserDocument = {
        _id: newUser._id,
        username: newUser.username,
        password: password,
      };
      const statusOfPostRequest = await postUser(newUserDocument);
      if (statusOfPostRequest[0] === false) {
        setServerError([statusOfPostRequest[1]]);
      } else {
        setAndSaveUserDetails(newUser);
        navigate("/home");
      }
    } /*there are errors*/ else {
      !validUsername
        ? setUsernameErrors(usernameErrorArray)
        : setUsernameErrors([]);
      !validPassword
        ? setPasswordErrors(passwordErrorArray)
        : setPasswordErrors([]);
    }
  };
  const validateUsername = async (username) => {
    const errorArray = [];
    if (username === "") {
      //Presence check
      errorArray.push("Username field must be filled");
    } else if (username.length > 30) {
      //Checks if username is more than 30 characters long
      errorArray.push("Username cannot be longer than 30 characters.");
    } else if (!((await usernameTaken(username)) === "error")) {
      //Checks if username is taken
      if ((await usernameTaken(username)) === true) {
        errorArray.push("Username is already taken.");
      }
    }
    return errorArray;
  };
  const usernameTaken = async (username) => {
    const userQuery = await getUser({ username: username });
    if (userQuery[0] === false) {
      //there is an error
      setServerError([userQuery[1]]);
      return "error";
    } else if (!userQuery[1]) {
      //username isn't taken
      return false;
    } else {
      //username is taken
      return true;
    }
  };
  const validatePassword = (password) => {
    const errorArray = [];
    let RegExp;
    //Presence check, will not go to further validation until this is passed
    if (password === "" || confirmPassword === "") {
      if (password === "") {
        errorArray.push("Password field must be filled");
      }
      if (confirmPassword === "") {
        errorArray.push("Confirm password field must be filled");
      }
    } else {
      if (password !== confirmPassword) {
        //Check if password and confirm password match
        errorArray.push("Password does not match confirm password");
      }
      if (password.length < 10) {
        //Check if password is greater than 10 characters
        errorArray.push("Password must be at least 10 characters long");
      }
      RegExp = /[A-Z]/;
      if (!RegExp.test(password)) {
        //Check for presence of capital letters
        errorArray.push("Password must contain a capital letter");
      }
      RegExp = /[a-z]/;
      if (!RegExp.test(password)) {
        //Check for presence of lowercase letters
        errorArray.push("Password must contain a lowercase letter");
      }
      RegExp = /[ !"$%&'()*+,\-\./:;<=>?@[^\]\\_|{}~]/;
      if (!RegExp.test(password)) {
        //Check for presence of special characters
        errorArray.push("Password must contain a special character");
      }
    }
    return errorArray;
  };

  return (
    <>
      <BackButton
        onClick={() => {
          navigate("/");
        }}
      />
      <main className="center">
        <form onSubmit={handleSubmit} className="loginSignupForm">
          <h1>Signup</h1>
          <FormInput name="Username" value={username} setValue={setUsername} />
          {/* Below is rendered when there is an error with the username */}
          {!(usernameErrors.length === 0) && (
            <ErrorMessage errors={usernameErrors} />
          )}
          <FormInput name="Password" value={password} setValue={setPassword} />
          <FormInput
            name="Confirm Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
          {/* Below is rendered when there is an error with the password */}
          {!(passwordErrors.length === 0) && (
            <ErrorMessage errors={passwordErrors} />
          )}
          <button type="submit" id="submitForm" className="button">
            Submit
          </button>

          {/* Below is rendered when there is an error with the server */}
          {!(serverError.length === 0) && <ErrorMessage errors={serverError} />}
        </form>
      </main>
    </>
  );
};

export default Signup;
