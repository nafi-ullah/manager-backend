const express = require("express");
const MealInfo = require("../models/mealInfo");
const schedule = require("node-schedule");
const { getTime } = require("../generator");
const { addDays, format } = require("date-fns");

// Add one day to get tomorrow's date

const mealRouter = express.Router();

const currentDate = new Date();
const tomorrow = addDays(currentDate, 1);
const formattedTomorrow = format(tomorrow, "yyyy-MM-dd");
const formattedDate = format(currentDate, "yyyy-MM-dd");
// console.log(formattedTomorrow);
// console.log(formattedDate);

// const year = currentDate.getFullYear();
// const month = currentDate.getMonth() + 1; // Note: Months are zero-based, so add 1
// const day = currentDate.getDate();

// const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
//   day < 10 ? "0" + day : day
// }`;
//--------------- whenever user sign up, a default meal data will update----
mealRouter.post("/api/sign-meal", async (req, res) => {
  try {
    // ekhane name messID mealMenu mealCount recieve korbo jst,
    // pore seta MealInfo er sathe time onujayi align kore nibo.
    const { name, messid } = req.body;

    let pushMeal = new MealInfo({
      name,
      messid,
      lunchMeal: "Chicken",
      lunchCount: 1,
      lunchComment: "",
      dinnerMeal: "Chicken",
      dinnerCount: 1,
      date: formattedDate,
    });

    pushMeal = await pushMeal.save();
    return res.json(pushMeal);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
//--------------- dummy api--------------------------------

mealRouter.post("/api/mealInfo", async (req, res) => {
  try {
    // ekhane name messID mealMenu mealCount recieve korbo jst,
    // pore seta MealInfo er sathe time onujayi align kore nibo.
    const { name, messid, mealMenu, count, comment } = req.body;

    let pushMeal = new MealInfo({
      name,
      messid,
      lunchMeal: mealMenu,
      lunchCount: count,
      lunchComment: comment,
      date: formattedDate,
    });

    pushMeal = await pushMeal.save();
    return res.json(pushMeal);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
//--------------- meal update whenver client want--------------
mealRouter.patch("/api/updateInfo", async (req, res) => {
  try {
    // ekhane name messID mealMenu mealCount recieve korbo jst,
    // pore seta MealInfo er sathe time onujayi align kore nibo.
    const { name, messid, mealMenu, count, comment } = req.body;
    let searchDate = formattedDate;
    const thisTime = getTime("hour");
    const lunchBody = new MealInfo({
      lunchMeal: mealMenu,
      lunchCount: count,
      lunchComment: comment,
    });

    const memberId = await MealInfo.findOne({
      name: name,
      messid: messid,
      date: formattedDate,
    });

    if (!memberId) {
      return res
        .status(404)
        .json({ error: "Member not found for the specified date" });
    }

    const dinnerBody = new MealInfo({
      dinnerMeal: mealMenu,
      dinnerCount: count,
      dinnerCount: comment,
    });
    memberId.lunchMeal = mealMenu;
    memberId.lunchCount = count;
    memberId.lunchComment = comment;

    const updatedMember = await memberId.save();

    return res.json(updatedMember);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

//-----------------get all meal data---------------------
// test api:  localhost:3000/api/get-meals?messid=xr5tL5
mealRouter.get("/api/get-meals", async (req, res) => {
  try {
    const messid = req.query.messid;
    //  console.log(messid);
    const meals = await MealInfo.find({ messid: messid, date: formattedDate }); // jodi search functionality add korte hoy tobe ei find er moddhe search er character recieve korbe

    res.json(meals);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//------------------------------------------------------------------------
// Auto meal post api in a time
mealRouter.post("/api/scheduled-meal", async (req, res) => {
  try {
    // ekhane name messID mealMenu mealCount recieve korbo jst,
    // pore seta MealInfo er sathe time onujayi align kore nibo.
    const { name, messid, mealMenu, count, comment } = req.body;

    let pushMeal = new MealInfo({
      name,
      messid,
      lunchMeal: mealMenu,
      lunchCount: count,
      lunchComment: comment,
      date: formattedDate,
    });

    pushMeal = await pushMeal.save();
    return res.json(pushMeal);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
//----------------dummy meal post
mealRouter.post("/api/dummy-meal", async (req, res) => {
  try {
    // ekhane name messID mealMenu mealCount recieve korbo jst,
    // pore seta MealInfo er sathe time onujayi align kore nibo.
    const { name, messid, lunchMeal, dinnerMeal,date } = req.body;

    let pushMeal = new MealInfo({
      name,
      messid,
      lunchMeal,
      lunchCount: 1,
      lunchComment: "",
      dinnerMeal,
      dinnerCount: 1,
      dinnerComment: "",
      date ,
    });

    pushMeal = await pushMeal.save();
    return res.json(pushMeal);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
//----------------------dummy other data post-------------------------
//--------------- schedule job for auto post api call-----------------
schedule.scheduleJob("push-job", "* 58 22 * * *", async () => {
  console.log("Good job dude");
  const dummyDate = "2024-01-14";
  const todaysMeal = await MealInfo.find({ date: formattedDate });
  // console.log(todaysMeal);
  // post the data again with a loop.
  for (const user of todaysMeal) {
    let pushMeal = new MealInfo({
      name: user.name,
      messid: user.messid,
      date: formattedTomorrow, // updateeee
      lunchMeal: user.lunchMeal,
      lunchCount: user.lunchCount,
      dinnerMeal: user.dinnerMeal,
      dinnerCount: user.dinnerCount,
      lunchComment: "",
      dinnerComment: "",
    });
    // console.log("DOneeeeeeeeee");

    pushMeal = await pushMeal.save();
  }

  schedule.cancelJob("push-job");
});

//---------------------Monthly Meal Request---------------------------
// test req: localhost:3000/api/month-meals?messid=xr5tL5&monthYear=2024-01

mealRouter.get("/api/month-meals", async (req, res) => {
  try {
    const messid = req.query.messid;
    const formattedMonthYear = req.query.monthYear;
    const regexPattern = new RegExp(`^${formattedMonthYear}`);

    const meals = await MealInfo.find({
      messid: messid,
      date: { $regex: regexPattern },
    });

    res.json(meals);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = mealRouter;
