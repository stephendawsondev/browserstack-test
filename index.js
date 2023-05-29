// import variables from the .env file
require("dotenv").config();

// import the selenium web driver
// Builder will allow us to build a driver
// By will allow us to select an element
// Capabilities will allow us to define the browser we want to use
const { Builder, By, Capabilities, until } = require("selenium-webdriver");
const { elementIsVisible } = require("selenium-webdriver/lib/until");

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
        deviceName: "Samsung Galaxy S22",
        realMobile: "true",
        projectName: "Browserstack test",
        sessionName: "Login, assert, logout",
        userName: username,
        accessKey: accessKey,
      },
      browserName: "Chrome",
    },
  ];

  // loop through the capabilitiesList
  for (const capabilitiesListItem of capabilitiesList) {
    // create the driver
    const driver = await new Builder()
      .usingServer(
        `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`
      )
      .withCapabilities(capabilitiesListItem)
      .build();

    let { width, height } = await driver.manage().window().getSize();

    console.log(`Browser window width: ${width}, height: ${height}`);
    // check if window width is less than 980px
    const hamburgerDisplayed = width < 980 ? true : false;

    // navigate to the homepage
    try {
      await driver.get(homepageUrl);
      console.log("Navigated to homepage");
    } catch (error) {
      console.log(error);
    }

    if (hamburgerDisplayed) {
      try {
        // Check if the hamburger menu is visible
        let hamburgerMenu = await driver.findElement(
          By.id("primary-menu-toggle")
        );
        // click hamburger to reveal the "Sign in" link
        await driver.wait(until.elementIsVisible(hamburgerMenu), 5000);
        await hamburgerMenu.click();

        console.log("Clicked hamburger menu");
        // Now wait for the dropdown menu to become active
        await driver.wait(
          until.elementLocated(By.css(".bs-collapse.primary-menu.active")),
          5000
        );
      } catch (error) {
        console.log(error);
        // take a screenshot on error
        let screenshot = await driver.takeScreenshot();
        require("fs").writeFileSync("error.png", screenshot, "base64");
        // stop the test
        await driver.quit();
      }

      // Now you can find the login button and click it
      try {
        const signInButton = await driver.wait(
          until.elementLocated(By.linkText("Sign in")),
          5000
        );
        await driver.wait(until.elementIsVisible(signInButton), 5000);
        await signInButton.click();
        console.log("Clicked sign in button");
      } catch (error) {
        console.log(error);
        // take a screenshot on error
        let screenshot = await driver.takeScreenshot();
        require("fs").writeFileSync("error.png", screenshot, "base64");
        // stop the test
        await driver.quit();
      }
    } else {
      try {
        // If the hamburger menu is not visible, find the "Sign in" link
        const signInLink = await driver.wait(
          until.elementLocated(By.linkText("Sign in")),
          5000
        );
        console.log(`Found sign in link: ${signInLink}`);
        await driver.wait(until.elementIsVisible(signInLink), 5000);
        await signInLink.click();
        console.log("Clicked sign in link");
      } catch (error) {
        console.log(error);
        // take a screenshot on error
        let screenshot = await driver.takeScreenshot();
        require("fs").writeFileSync("error.png", screenshot, "base64");
        // stop the test
        await driver.quit();
      }
    }

    // find the email input and enter the email
    try {
      const emailInput = await driver.wait(
        until.elementLocated(By.id("user_email_login")),
        5000
      );
      await emailInput.sendKeys(process.env.BROWSERSTACK_EMAIL);
      console.log("Entered email");

      // find the password input and enter the password
      const passwordInput = await driver.wait(
        until.elementLocated(By.id("user_password")),
        5000
      );
      await passwordInput.sendKeys(process.env.BROWSERSTACK_PASSWORD);
      console.log("Entered password");
    } catch (error) {
      console.log(error);
      // take a screenshot on error
      let screenshot = await driver.takeScreenshot();
      require("fs").writeFileSync("error.png", screenshot, "base64");
      // stop the test
      await driver.quit();
    }

    // check to see if the accept cookies popup exists - only needed
    // for mobile devices since it blocks the button
    if (hamburgerDisplayed) {
      try {
        const acceptCookiesButton = await driver.wait(
          until.elementLocated(By.id("accept-cookie-notification")),
          5000
        );
        await acceptCookiesButton.click();
        console.log("Clicked accept cookies button");
      } catch (error) {
        console.log("No accept cookies button found");
      }
    }

    // click the user signin button
    try {
      const signInButton = await driver.wait(
        until.elementLocated(By.id("user_submit")),
        5000
      );
      await signInButton.click();
      console.log("Clicked sign in button");
    } catch (error) {
      console.log("Error signing in");
      console.log(error);

      // take a screenshot on error
      let screenshot = await driver.takeScreenshot();
      require("fs").writeFileSync("error.png", screenshot, "base64");
      // stop the test
      await driver.quit();
    }

    // when logged in, check for an invite URL and retrieve link
    try {
      const inviteLink = await driver.wait(
        until.elementLocated(By.id("invite-link")),
        20000
      );
      const inviteLinkHref = await inviteLink.getAttribute("href");

      if (inviteLinkHref) {
        console.log(inviteLinkHref);
      }
      console.log("Found invite link");
    } catch (error) {
      console.log("Error finding invite link");
      console.log(error);

      // take a screenshot on error
      let screenshot = await driver.takeScreenshot();
      require("fs").writeFileSync("error.png", screenshot, "base64");
      // stop the test
      await driver.quit();
    }

    if (hamburgerDisplayed) {
      // click the hamburger menu
      try {
        const hamburgerMenu = await driver.wait(
          until.elementLocated(By.id("primary-menu-toggle")),
          20000
        );
        await hamburgerMenu.click();
        console.log("Clicked hamburger menu");
      } catch (error) {
        console.log("Error clicking hamburger menu");
        console.log(error);

        // take a screenshot on error
        let screenshot = await driver.takeScreenshot();
        require("fs").writeFileSync("error.png", screenshot, "base64");
        // stop the test
        await driver.quit();
      }
    } else {
      // click the user menu
      try {
        const userMenu = await driver.wait(
          until.elementLocated(By.id("account-menu-toggle")),
          20000
        );

        await userMenu.click();
        console.log("Clicked user menu");
      } catch (error) {
        console.log("Error clicking user menu");
        console.log(error);

        // take a screenshot on error
        let screenshot = await driver.takeScreenshot();
        require("fs").writeFileSync("error.png", screenshot, "base64");
        // stop the test
        await driver.quit();
      }
    }

    // click the logout button
    if (hamburgerDisplayed) {
      try {
        const logoutButton = await driver.wait(
          // select by class name since the id is dynamic
          until.elementLocated(By.linkText("Sign out")),
          20000
        );
        await logoutButton.click();
        console.log("Clicked logout button");
      } catch (error) {
        console.log("Error clicking logout button");
        console.log(error);

        // take a screenshot on error
        let screenshot = await driver.takeScreenshot();
        require("fs").writeFileSync("error.png", screenshot, "base64");
        // stop the test
        await driver.quit();
      }
    } else {
      try {
        // hover the account-menu-toggle to reveal the logout button
        const userMenu = await driver.wait(
          until.elementLocated(By.id("account-menu-toggle")),
          10000
        );
        await driver.actions().move({ origin: userMenu }).perform();

        // click the logout button
        const logoutButton = await driver.wait(
          until.elementLocated(By.id("sign_out_link")),
          10000
        );

        await logoutButton.click();
        console.log("Clicked logout button");
      } catch (error) {
        console.log("Error clicking logout button");
        console.log(error);

        // take a screenshot on error
        let screenshot = await driver.takeScreenshot();
        require("fs").writeFileSync("error.png", screenshot, "base64");
        // stop the test
        await driver.quit();
      }
    }

    // quit the driver
    await driver.quit();
  }
}

runTest();
