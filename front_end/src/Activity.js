import { React } from "react";
import { BsCardText, BsFillLightningFill } from "react-icons/bs";
import "./css/Activity.css";

//Activity.js
const Activity = ({ activity }) => {
  const time = new Date(activity.timeOfActivity);

  return (
    <>
      <section className={"row activityEntryMain"}>
        {activity.activityType === "Experience" && (
          <section className="activityIcon">
            <BsFillLightningFill size={75}></BsFillLightningFill>
          </section>
        )}
        {activity.activityType === "Card" && (
          <section className="activityIcon">
            <BsCardText size={75}></BsCardText>
          </section>
        )}

        <section className={"column descriptionMain"}>
          <p className={"usernameMain"}>{activity.username}</p>
          <p className={"textMain"}>{activity.activityDescription}</p>
        </section>
        <h3 className="dateMain">{`${time.getHours()}:${time.getMinutes()} ${time.getDate()}/${
          time.getMonth() + 1
        }/${time.getFullYear()}`}</h3>
      </section>
    </>
  );
};

export default Activity;
