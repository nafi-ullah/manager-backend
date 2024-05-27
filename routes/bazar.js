const express = require("express");
const BazarInfo = require("../models/bazarModel");

const { format } = require('date-fns');
const bazarInfo = require("../models/bazarModel");

const bazarRouter = express.Router();

const currentDate = new Date();
const formattedDate = format(currentDate, 'yyyy-MM-dd');


bazarRouter.post("/api/bazarInfo", async (req, res) => {
    try {
      // ekhane name messID mealMenu mealCount recieve korbo jst,
      // pore seta MealInfo er sathe time onujayi align kore nibo.
      const { name, messid, bazar, quantity, cost } = req.body;

      let pushBazar = new BazarInfo({
        name,
        messid,
        bazar,
        cost,
        quantity,
        date : formattedDate 
      });
      
      pushBazar = await pushBazar.save();
      console.log(pushBazar);
      return res.json(pushBazar);
      
     
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
// api link:
// localhost:3000/api/allBazar?messid=xr5tL5
  bazarRouter.get("/api/allBazar", async (req, res) => {
    try {
      const messid = req.query.messid;
      //  console.log(messid);
      const meals = await bazarInfo.find({ messid: messid  }); // jodi search functionality add korte hoy tobe ei find er moddhe search er character recieve korbe
  
      res.json(meals);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });



module.exports = bazarRouter;
