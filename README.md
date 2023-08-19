This project is a very simple React and Express application that can be used to save SQL queries with variables in them and then copy for easy reuse.

To use click the "Add SQL" button at the top and add your query and description.

To add variables add two curly brackets before and after and the program will display input fields.

All information is stored locally in the sql.json file.

The Express API is in the server.js file and can be started with "npm run startApi".
The React app can be ran with "npm start".

To use on other computers than the host computer the IP will need to be changed for queries in Main.jsx and the page will need to be refreshed if a query is added on another computer.

Todo List:
Allow editing
Variable names used multiple times being replaced properly