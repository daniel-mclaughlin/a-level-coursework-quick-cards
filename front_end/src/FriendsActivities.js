import { React, useState } from "react";
import { useEffect } from "react";
import Activity from "./Activity";
import ErrorMessage from "./ErrorMessage";
import LoadingMessage from "./LoadingMessage";
import { getActivities } from "./serverRequests";

const FriendsActivities = ({ friends }) => {
  const [activities, setActivities] = useState([]);
  const [sortedActivities, setSortedActivities] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noActivities, setNoActivities] = useState(false);

  useEffect(() => {
    if (friends.length > 0) {
      const getAndSetActivities = async () => {
        let newActivities = [];
        //get the activities of each friend
        for (const friend of friends) {
          const getActivitiesResponse = await getActivities(friend._id);

          if (getActivitiesResponse[0] === false) {
            //error
            setErrors(getActivitiesResponse[1]);
          } else {
            //add to array of all activities
            newActivities = await newActivities.concat(getActivitiesResponse);
          }
        }
        //set state
        setActivities(newActivities);
      };
      getAndSetActivities();
    }
  }, [friends]);
  useEffect(() => {
    if (!(activities.length === 0)) {
      setNoActivities(false);
      let newSortedActivities = JSON.parse(JSON.stringify(sortedActivities));
      activities.forEach((activity) => {
        //Add each activity
        addToSortedActivities(activity, newSortedActivities);
      });
      setSortedActivities(newSortedActivities);
    } else {
      setNoActivities(true);
    }
    setLoading(false);
  }, [activities]);

  const addToSortedActivities = (activity, sortedActivities) => {
    const timeOfActivity = activity.timeOfActivity;
    let added = false;
    let currentIndex = 0;
    while (added === false) {
      if (currentIndex === sortedActivities.length) {
        //At the end of the sorted activities array
        //Activity must be oldest
        sortedActivities.push(activity);
        added = true;
      } else {
        const timeOfCurrentActivity =
          sortedActivities[currentIndex].timeOfActivity; // What I am comparing to
        if (timeOfActivity > timeOfCurrentActivity) {
          //The activity is more recent
          if (currentIndex === 0) {
            //current activity is first in the array
            sortedActivities.unshift(activity);
            added = true;
          } else {
            sortedActivities.splice(currentIndex - 1, 0, activity);
            added = true;
          }
        } else {
          //Go to next activity
          currentIndex += 1;
        }
      }
    }
  };

  return (
    <>
      {errors.length > 0 && <ErrorMessage errors={errors}></ErrorMessage>}
      {noActivities && (
        <p>
          It looks like your friends haven't been up to anything. Come again
          another time to see what they're up to
        </p>
      )}
      {loading && errors.length === 0 && !noActivities && (
        <LoadingMessage message={"Loading activities."}></LoadingMessage>
      )}
      {!loading && errors.length === 0 && !noActivities && (
        <section className="column">
          {sortedActivities.length > 0 && (
            <>
              {sortedActivities.map((activity) => {
                return <Activity key={activity._id} activity={activity} />;
              })}
            </>
          )}
        </section>
      )}
    </>
  );
};

export default FriendsActivities;
