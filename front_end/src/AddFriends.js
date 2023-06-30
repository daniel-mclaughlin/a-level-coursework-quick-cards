import { useState, useEffect } from "react";
import { React } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import "./css/AddFriends.css";
import { getUsers } from "./serverRequests";
import SearchResult from "./SearchResult";
import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";

const AddFriends = ({ currentUser, setCurrentUser, friends, setFriends }) => {
  const [search, setSearch] = useState("");
  const [searchesLoading, setSearchesLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isNoResult, setIsNoResult] = useState(false);
  const [friendAdded, setFriendAdded] = useState(false);

  useEffect(() => {
    setSearchesLoading(true);
    const getAndSetSearchResults = async (search) => {
      const query = {
        username: { $regex: search, $options: "i" },
      };
      const getUsersResponse = await getUsers(query);
      if (getUsersResponse[0] === false) {
        setErrors([getUsersResponse[1]]);
        setSearchesLoading(false);
      } else {
        //map through to flag users who are already friends
        const filteredSearchResults = getUsersResponse.map((user) => {
          let isFriend = false;
          friends.forEach((friend) => {
            if (friend._id === user._id) {
              isFriend = true;
            }
          });
          if (isFriend) {
            return [user, true];
          } else {
            return [user, false];
          }
        });
        setSearchResults(filteredSearchResults);
        if (filteredSearchResults.length === 0) {
          setIsNoResult(true);
        } else {
          setIsNoResult(false);
        }
        setSearchesLoading(false);
      }
    };
    getAndSetSearchResults(search);
  }, [search, friendAdded]);

  return (
    <>
      <section className="row" id="searchFriends">
        <input
          id="searchBar"
          type={"search"}
          value={search}
          placeholder="Search for a friend"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <BiSearchAlt size={28} color={"#474056"} className="searchIcon" />
      </section>
      {errors.length > 0 && (
        <section id="addFriendsError">
          <ErrorMessage errors={errors}></ErrorMessage>
        </section>
      )}
      {searchesLoading && errors.length === 0 && (
        <LoadingMessage message={"Loading search results"}></LoadingMessage>
      )}
      {!searchesLoading &&
        !(searchResults.length === 0) &&
        errors.length === 0 && (
          <>
            {searchResults.map((result) => {
              return (
                <SearchResult
                  key={result[0]._id}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  result={result[0]}
                  setErrors={setErrors}
                  friends={friends}
                  setFriends={setFriends}
                  friendAdded={friendAdded}
                  setFriendAdded={setFriendAdded}
                  isFriend={result[1]}
                />
              );
            })}
          </>
        )}
      {isNoResult && !searchesLoading && (
        <section className="column" id="noResultsSection">
          <section id="noResultsIcon">
            <ImCross size={"50"}></ImCross>
          </section>
          <h3>{`No results found for search "${search}"`}</h3>
        </section>
      )}
    </>
  );
};

export default AddFriends;
