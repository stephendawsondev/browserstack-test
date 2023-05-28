// import variables from the .env file
require("dotenv").config();

// import the selenium web driver
// Builder will allow us to build a driver
// By will allow us to select an element
// Capabilities will allow us to define the browser we want to use
const { Builder, By, Capabilities } = require("selenium-webdriver");

async function runTest() {
  console.log("This is where the test will run");
}

runTest();
