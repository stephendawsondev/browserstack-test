// import variables from the .env file
require("dotenv").config();

// import the selenium web driver
// Builder will allow us to build a driver
// By will allow us to select an element
// Capabilities will allow us to define the browser we want to use
const { Builder, By, Capabilities } = require("selenium-webdriver");

async function runTest() {
  // username and access key will be whatever is in the .env file
  // locally or whatever is in the environment variables on
  // browserstack
  const username = process.env.BROWSERSTACK_USERNAME;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
  const homepageUrl = "https://www.browserstack.com/";

  const capabilitiesList = [
    {
      "bstack:options": {
        os: "Windows",
        osVersion: "10",
        browserVersion: "latest",
        projectName: "Browserstack test",
        sessionName: "Login, assert, logout",
        local: "false",
        debug: "true",
        seleniumVersion: "3.14.0",
        userName: username,
        accessKey: accessKey,
      },
      browserName: "Chrome",
    },
  ];
}

runTest();
