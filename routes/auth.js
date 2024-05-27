const express = require("express");
const Member = require("../models/user");
const bcryption = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateString, getTime } = require("../generator");
const auth = require("../middlewares/auth");
const axios = require("axios");
const apiAddress = require("../constants");
const MealInfo = require("../models/mealInfo");
const { addDays, format } = require("date-fns");

const authRouter = express.Router();
// console.log(getTime('hour'));
// console.log(getTime('mins'));
// console.log(getTime('nothing'));

//  if(getTime('hour') > 21){
//     console.log(" post data");
//  }
const currentDate = new Date();
const formattedDate = format(currentDate, "yyyy-MM-dd");

authRouter.post("/api/signup", async (req, res) => {
  const generatedMessId = generateString(6);
  const { name, email, password, messid } = req.body;
 // console.log(req.body);

  try {
    // Check if all fields are present
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const hashPass = await bcryption.hash(password, 8);
    const memberCredential = await Member.findOne({ messid });

    if (messid != "noob") {
      
      if (!memberCredential) {
        return res.status(400).json({ error: "This mess id is incorrect" });
      }
    }

    let member = new Member({
      // req body theke ja paisi, ta ei variable gulay save chhilo.
      name,
      email,
      password: hashPass,
      messid: messid == "noob" ? generatedMessId : messid,
      messname: messid == "noob" ? "" : memberCredential.messname

    });

    //variable er data gula ekhn database a save korar palla.
    member = await member.save();
    // return er agy or meal ta post korte hobe
    //-----------------------------------------------------------------------------
    // const requestBody = {
    //   name: name,
    //   messid: messid == "noob" ? generatedMessId : messid,
    // };

    // const apiUrl = `${apiAddress}/api/sign-meal`;
    // await axios
    //   .post(apiUrl, requestBody)
    //   .then((response) => {
    //     //console.log("Response:", response.data);
    //   })
    //   .catch((error) => {
    //     //console.error("Error:", error.message);
    //   });
    let pushMeal = new MealInfo({
      name,
      messid: messid == "noob" ? generatedMessId : messid,
      date: formattedDate, // updateeee
      lunchMeal: "Chicken",
      lunchCount: 1,
      dinnerMeal: "Fish",
      dinnerCount: "1",
      lunchComment: "",
      dinnerComment: "",
    });
    // console.log("DOneeeeeeeeee");

    pushMeal = await pushMeal.save();
    console.log(pushMeal);

    return res.json(member);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  // collect email pass from body
  // get the all credentials of this user
  // check if it is null or not
  // verfiy the password
  // if  pass match : response a token with user details(token and _doc)

  try {
    const { email, password } = req.body;

    const memberCredential = await Member.findOne({ email }); // Member hocche database er protinidhi, so eta diye database er sob operation kora hobe.

    if (!memberCredential) {
      return res
        .status(400)
        .json({ error: "This email is not found in database" });
    }

    const isPassMatch = await bcryption.compare(
      password,
      memberCredential.password
    );

    if (!isPassMatch) {
      return res.status(400).json({ msg: "password invalid" });
    }

    const token = jwt.sign({ id: memberCredential._id }, "passwordKey");


    // during signin now i want to check if any data exist today, if not, then post
    const todaysMeal = await MealInfo.find({ date: formattedDate });
   // console.log(todaysMeal.length);
    if(!todaysMeal.length){
      const members = await Member.find();
     // console.log(members);
      for (const user of members) {
        let pushMeal = new MealInfo({
          name: user.name,
          messid: user.messid,
          date: formattedDate, // updateeee
          lunchMeal: "Chicken",
          lunchCount: 1,
          dinnerMeal: "Fish",
          dinnerCount: "1",
          lunchComment: "",
          dinnerComment: "",
        });
        // console.log("DOneeeeeeeeee");
    
        pushMeal = await pushMeal.save();
      }
      
    }



    return res.json({ token, ...memberCredential._doc });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await Member.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data
authRouter.get("/", auth, async (req, res) => {
  const member = await Member.findById(req.user);
  res.json({ ...member._doc, token: req.token });
});

//-----------mess name update--------------------

authRouter.patch("/api/updateMessName", async (req, res) => {
  try {
    // ekhane name messID mealMenu mealCount recieve korbo jst,
    // pore seta MealInfo er sathe time onujayi align kore nibo.
    const { email, messid, messname } = req.body;
   
    

    if (!messid) {
      return res
        .status(404)
        .json({ error: "Mess not found" });
    }
    
    const memberId = await Member.find({
      messid: messid,
    });

    for(const user of memberId){
      user.messname = messname;

      const mess = await user.save();
    }
    const memberCredential = await Member.findOne({ email });
    const token = jwt.sign({ id: memberCredential._id }, "passwordKey");



    return res.json({ token, ...memberCredential._doc });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
