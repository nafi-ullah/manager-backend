const express = require('express');
const db = require('./db/dbconnect');
// const routes = require('./routes/router');
 const messRoute = require('./routers/mess');
 const userRoute = require('./routers/users');
 const mealRoute = require('./routers/meal');
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use('/users', userRoutes);
 app.use('/', messRoute);
 app.use('/', userRoute);
 app.use('/', mealRoute);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
