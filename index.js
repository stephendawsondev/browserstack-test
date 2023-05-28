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

  // create a list to test multiple capabilities
  const capabilitiesList = [
    // used https://www.browserstack.com/automate/capabilities to
    // find the capabilities and different options
    {
      "bstack:options": {
        os: "Windows",
        osVersion: "10",
        browserVersion: "latest",
        projectName: "Browserstack test",
        sessionName: "Login, assert, logout",
        seleniumVersion: "3.14.0",
        userName: username,
        accessKey: accessKey,
      },
      browserName: "Chrome",
    },
    {
      "bstack:options": {
        os: "OS X",
        osVersion: "Ventura",
        browserVersion: "latest",
        projectName: "Browserstack test",
        sessionName: "Login, assert, logout",
        seleniumVersion: "3.14.0",
        userName: username,
        accessKey: accessKey,
      },
      browserName: "Firefox",
    },
    {
      "bstack:options": {
        device: "Samsung Galaxy S22",
        realMobile: "true",
        projectName: "Browserstack test",
        sessionName: "Login, assert, logout",
        userName: username,
        accessKey: accessKey,
      },
      browserName: "Android",
      device: "Samsung Galaxy S22",
    },
  ];

  // loop through the capabilitiesList
  for (const capabilitiesListItem of capabilitiesList) {
    // create the driver
    const driver = await new Builder()
      // https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub
      .usingServer(`https://hub-cloud.browserstack.com/wd/hub`)
      .withCapabilities(capabilitiesListItem)
      .build();

    // navigate to the homepage
    try {
      await driver.get(homepageUrl);
      // find the login button and click it (no id, selecting with link text)
      await driver.findElement(By.linkText("Sign in")).click();
      // find the email input and enter the email
      await driver
        .findElement(By.id("user_email_login"))
        .sendKeys(process.env.BROWSERSTACK_USERNAME);
      // find the password input and enter the password
      await driver
        .findElement(By.id("user_password"))
        .sendKeys(process.env.BROWSERSTACK_PASSWORD);
    } catch (error) {
      console.log(error);
    }

    // when logged in, check for an invite URL and retrieve link
    try {
      const text = await driver
        .findElement(By.id("invite-link"))
        .getAttribute("href");

      if (text) {
        console.log(text);
      }
    } catch (error) {
      console.log(error);
    }

    // logout
    try {
      await driver.findElement(By.linkText("Sign out")).click();
    } catch (error) {
      console.log(error);
    }

    // quit the driver
    await driver.quit();
  }
}

runTest();
