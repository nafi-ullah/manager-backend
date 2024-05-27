// Import the packages
const express = require('express');
const axios = require('axios');
const cron = require('cron');

// Create an express app
const app = express();

// Define a route for the get api
app.get('/api/get', (req, res) => {
  // Get the specific data from the query string
  const data = req.query.data;

  // TODO: Add your logic to get the data from another API or database

  // Return the data as a JSON response
  res.json({ data });
});

// Define a route for the post api
app.post('/api/post', (req, res) => {
  // Get the data from the request body
  const data = req.body.data;

  // TODO: Add your logic to post the data to another API or database

  // Return a success message as a JSON response
  res.json({ message: 'Data posted successfully' });
});

// Define a cron job that will run at a certain time
const job = new cron.CronJob('0 0 * * *', () => {
  // This will run every day at 00:00
  // You can change the cron expression to suit your needs
  // See https://crontab.guru/ for more details

  // TODO: Add your logic to get the specific data from the get api
 // For example, you can use axios to make a GET request
  axios.get('/api/get?data=something')
    .then(response => {
      // Get the data from the response
      const data = response.data.data;

      // TODO: Add your logic to post the data to the post api
      // For example, you can use axios to make a POST request
      axios.post('/api/post', { data })
        .then(response => {
          // Handle the response
          console.log(response.data.message);
        })
        .catch(error => {
          // Handle the error
          console.error(error);
        });
    })
    .catch(error => {
      // Handle the error
      console.error(error);
    });
});

// Start the cron job
job.start();

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});


// Date stuffs:

// Get the current date
const currentDate = new Date();

// Extract individual components of the date
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Note: Months are zero-based, so add 1
const day = currentDate.getDate();

// Format the date as a string in the "YYYY-MM-DD" format
const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

console.log('Current Date:', formattedDate);

// Later, you can search by date or month name
const searchDate = '2023-01-15'; // Example date to search
const searchMonthName = 'January'; // Example month name to search

// Parse the search date
const parsedSearchDate = new Date(searchDate);

// Check if the search date matches the current date
if (
  parsedSearchDate.getFullYear() === year &&
  parsedSearchDate.getMonth() === currentDate.getMonth() &&
  parsedSearchDate.getDate() === day
) {
  console.log('Match found for the search date:', searchDate);
} else {
  console.log('No match found for the search date:', searchDate);
}

// Check if the current month matches the search month name
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const searchMonthIndex = monthNames.indexOf(searchMonthName);
if (searchMonthIndex === currentDate.getMonth()) {
  console.log('Match found for the search month:', searchMonthName);
} else {
  console.log('No match found for the search month:', searchMonthName);
}
