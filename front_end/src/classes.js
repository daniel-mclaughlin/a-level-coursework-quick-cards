import { v4 as uuid } from "uuid";

class User {
  constructor(userObject) {
    this._id = userObject._id || uuid();
    this.username = userObject.username;
    this.totalExperiencePoints = userObject.totalExperiencePoints || 0;
    this.totalCardsStudied = userObject.totalCardsStudied || 0;
    this.lastDayUpdated =
      userObject.lastDayUpdated || Math.floor(new Date().getTime() / 8.64e7);
    this.daysExperiencePoints = userObject.daysExperiencePoints || 0;
    this.daysCardsStudied = userObject.daysCardsStudied || 0;
    this.dailyStreak = userObject.dailyStreak || 0;
    this.startDayOfStreak =
      userObject.startDayOfStreak || Math.floor(new Date().getTime() / 8.64e7);
    this.dailyGoal = userObject.dailyGoal || 1000;
    this.dailyGoalType = userObject.dailyGoalType || "Experience";
  }
  get_id() {
    return this._id;
  }
  getUsername() {
    return this.username;
  }
  getDailyStreak() {
    return this.dailyStreak;
  }
  getDailyGoal() {
    return this.dailyGoal;
  }
  getDailyGoalType() {
    return this.dailyGoalType;
  }
  getDaysExperiencePoints() {
    return this.daysExperiencePoints;
  }
  getDaysCardsStudied() {
    return this.daysCardsStudied;
  }
  setDailyGoal(newDailyGoal) {
    this.dailyGoal = newDailyGoal;
  }
  setDailyGoalType(newDailyGoalType) {
    this.dailyGoalType = newDailyGoalType;
  }
  makeAttributesUpToDate(currentDay) {
    //Update daily stats
    if (currentDay > this.lastDayUpdated) {
      this.daysExperiencePoints = 0;
      this.daysCardsStudied = 0;
    }

    //Check daily streak
    const dayDifference = this.startDayOfStreak - currentDay;
    if (dayDifference - this.dailyStreak > 2) {
      this.dailyStreak = 0;
      this.startDayOfStreak = currentDay;
    } else {
      const dailyGoalAchievedAlready =
        this.dailyStreak - dayDifference === 1 ? true : false;
      if (!dailyGoalAchievedAlready) {
        //Check if the user has met their daily goal
        let dailyGoalMet;
        if (this.dailyGoalType === "Experience") {
          dailyGoalMet =
            this.daysExperiencePoints > this.dailyGoal ? true : false;
        } else {
          dailyGoalMet = this.daysCardsStudied > this.dailyGoal ? true : false;
        }
        if (dailyGoalMet) {
          if (this.dailyStreak === 0) {
            this.startDayOfStreak = currentDay;
          }
          this.dailyStreak += 1;
        }
      }
    }
  }

  //returns array of activities
  cardStudied(easinessFactor, qualityOfResponse) {
    //Get the experience gained
    const experienceGained = Math.floor(
      (62.5 * qualityOfResponse) / easinessFactor
    );

    //Check for activity
    const activities = this.checkForActivities(experienceGained);

    //Update attributes
    this.daysExperiencePoints += experienceGained;
    this.totalExperiencePoints += experienceGained;
    this.totalCardsStudied += 1;
    this.daysCardsStudied += 1;
    this.lastDayUpdated = Math.floor(new Date().getTime() / 8.64e7);

    return activities;
  }

  //return array of new activities
  checkForActivities(experienceGained) {
    //This array stores the stat, the multiple it must exceed to merit creating an activity, and another array that holds wether the stat is a total and or experience stat
    const activityStatArray = [
      [this.totalExperiencePoints, 10000, [true, true]],
      [this.totalCardsStudied, 100, [true, false]],
      [this.daysExperiencePoints, 1000, [false, true]],
      [this.daysCardsStudied, 25, [false, false]],
    ];

    let newActivities = [];
    activityStatArray.forEach((activityMultiplePair) => {
      const isTotal = activityMultiplePair[2][0];
      const isExperience = activityMultiplePair[2][1];

      const oldValue = activityMultiplePair[0];
      const newValue = isExperience
        ? oldValue + experienceGained
        : oldValue + 1;
      const multiple = activityMultiplePair[1];

      //Get the largest multiple in the values
      const oldLargestInteger = Math.floor(oldValue / multiple);
      const newLargestInteger = Math.floor(newValue / multiple);

      //If the largest multiple don't match, then an activity can be created
      if (!(newLargestInteger - oldLargestInteger === 0)) {
        //create new activity
        const activity = new Activity({
          user_id: this._id,
          username: this.username,
          value: newLargestInteger * multiple,
          isTotal: isTotal,
          isExperience: isExperience,
        });

        //Add to activity array
        newActivities.push(activity);
      }
    });
    return newActivities;
  }
}
class Activity {
  /*The activity options object that will be passed into the constructor will have the following structure
  {
    user_id,
    username,
    isTotal,
    isExperience,
  }*/
  constructor(activityOptions) {
    this._id = uuid();
    this.user_id = activityOptions.user_id;
    this.username = activityOptions.username;
    this.timeOfActivity = new Date().getTime();
    this.activityType = activityOptions.isExperience ? "Experience" : "Card";
    this.activityDescription = activityOptions.isTotal
      ? activityOptions.isExperience
        ? `Has reached ${activityOptions.value} total xp!`
        : `Has studied ${activityOptions.value} total cards!`
      : activityOptions.isExperience
      ? `Has reached ${activityOptions.value} xp today!`
      : `Has studied ${activityOptions.value} cards today!`;
  }
}
class Card {
  constructor(cardObject) {
    this._id = cardObject._id || uuid();
    this.front = cardObject.front || "";
    this.back = cardObject.back || "";
    this.user_id = cardObject.user_id;
    this.deck_id = cardObject.deck_id;
    this.easinessFactor = cardObject.easinessFactor || 2.5;
    this.numberOfRepetitions = cardObject.numberOfRepetitions || 1;
    this.interRepetitionInterval = cardObject.interRepetitionInterval || 6;
    this.whenShowCard = cardObject.whenShowCard || new Date().getTime();
  }
  get_id() {
    return this._id;
  }
  getFront() {
    return this.front;
  }
  getBack() {
    return this.back;
  }
  getUser_id() {
    return this.user_id;
  }
  getDeck_id() {
    return this.deck_id;
  }
  getWhenShowCard() {
    return this.whenShowCard;
  }
  getEasinessFactor() {
    return this.easinessFactor;
  }

  //Spaced repetition algorithm
  updateSpacedRepetitionAttributes(qualityOfResponse) {
    //equation for new easiness factor
    let newEasinessFactor =
      this.easinessFactor +
      (0.1 - (5 - qualityOfResponse) * (0.08 + 0.02 * (5 - qualityOfResponse)));

    //easiness factor cannot be below 1.3
    if (newEasinessFactor < 1.3) {
      newEasinessFactor = 1.3;
    }

    //Setting new value
    this.easinessFactor = newEasinessFactor;

    //Updating number of repetitions
    let newNumberOfRepetitions;
    if (qualityOfResponse < 3) {
      newNumberOfRepetitions = 1;
    } else {
      newNumberOfRepetitions = this.numberOfRepetitions + 1;
    }

    //Setting new value
    this.numberOfRepetitions = newNumberOfRepetitions;

    //Updating inter-repetition interval
    let newInterRepetitionInterval;
    if (this.numberOfRepetitions > 2) {
      newInterRepetitionInterval =
        this.interRepetitionInterval * this.easinessFactor;
    } else {
      newInterRepetitionInterval = 1;
    }

    //Set and return new value
    this.interRepetitionInterval = newInterRepetitionInterval;

    //Updating when show card
    //Current time in milliseconds, plus the inter rep interval times the number of milliseconds in a day
    const newWhenShowCard =
      new Date().getTime() + this.interRepetitionInterval * (8.64 * 10 ** 7);

    //Set and return new when show value
    this.whenShowCard = newWhenShowCard;
    return newWhenShowCard;
  }
}
class Deck {
  constructor(deckObject) {
    this._id = deckObject._id || uuid();
    this.deckName = deckObject.deckName;
    this.user_id = deckObject.user_id;
  }
  get_id() {
    return this._id;
  }
  getDeckName() {
    return this.deckName;
  }
  getUser_id() {
    return this.deckName;
  }
}

export { User, Card, Deck };
