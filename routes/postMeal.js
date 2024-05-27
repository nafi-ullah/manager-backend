const express = require("express");
const axios = require('axios');
const schedule = require('node-schedule');
const mealInfo = require('../models/mealInfo');

const postRouter = express.Router();


postRouter.get("/api/get-products", async (req, res) => {
  try {
    console.log("Jelloooo");
    const products = await mealInfo.find({}); // jodi search functionality add korte hoy tobe ei find er moddhe search er character recieve korbe
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = postRouter;

  //learning tools of axios and node-schedule
  //-----------------------------------------------------

  // schedule.scheduleJob('push-job','* 21 22 * * *',()=>{
//         console.log("yes i am onnn");
//         schedule.cancelJob('push-job');
// })
//##### 2nd Method
// const pushJob = schedule.scheduleJob('* 24 22 * * *',()=>{
//     console.log("yes i am onnn");
//     pushJob.cancel();
// })
// Get userData by calling api
//-----------------------------------------------

// axios.get('https://reqres.in/api/users')
// .then((res)=>{
//   console.log(res);
// })
// .catch((err)=>{
//  // console.log(err);
// });