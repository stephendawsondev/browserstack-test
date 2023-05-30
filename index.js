// import variables from the .env file
require("dotenv").config();

// import the selenium web driver
// Builder will allow us to build a driver
// By will allow us to select an element
// Capabilities will allow us to define the browser we want to use
const { Builder, By, Capabilities, until } = require("selenium-webdriver");

async function runTest(capabilities) {
  // username and access key will be whatever is in the .env file
  // locally or whatever is in the environment variables on
  // browserstack
  const username = process.env.BROWSERSTACK_USERNAME;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
  const email = process.env.LOGIN_CREDENTIALS_USR;
  const password = process.env.LOGIN_CREDENTIALS_PWS;
  const homepageUrl = "https://www.browserstack.com/";

  // create the driver
  const driver = await new Builder()
    .usingServer(
      `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`
    )
    .withCapabilities(capabilities)
    .build();

  let { width, height } = await driver.manage().window().getSize();

  console.log(`Browser window width: ${width}, height: ${height}`);
  // check if window width is less than 980px
  const hamburgerDisplayed = width < 980 ? true : false;

  // navigate to the homepage
  try {
    await driver.get(homepageUrl);
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

      // Now wait for the dropdown menu to become active
      await driver.wait(
        until.elementLocated(By.css(".bs-collapse.primary-menu.active")),
        5000
      );
    } catch (error) {
      console.log(error);
      // stop the test
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
      );
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
    } catch (error) {
      console.log(error);
      // stop the test
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
      );
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
    } catch (error) {
      console.log(error);
      // stop the test
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
      );
      await driver.quit();
    }
  }

  // find the email input and enter the email
  try {
    const emailInput = await driver.wait(
      until.elementLocated(By.id("user_email_login")),
      5000
    );
    await emailInput.sendKeys(email);
    // find the password input and enter the password
    const passwordInput = await driver.wait(
      until.elementLocated(By.id("user_password")),
      5000
    );
    await passwordInput.sendKeys(password);
  } catch (error) {
    console.log(error);
    // stop the test
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
    );
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
  } catch (error) {
    console.log(error);
    // stop the test
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
    );
    await driver.quit();
  }

  // when logged in, check for an invite URL and retrieve link
  try {
    const inviteLink = await driver.wait(
      until.elementLocated(By.id("invite-link")),
      2000
    );
    const inviteLinkHref = await inviteLink.getAttribute("href");

    if (inviteLinkHref) {
      console.log(inviteLinkHref);
    }
  } catch (error) {
    console.log(error);
    // stop the test
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
    );
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
    } catch (error) {
      console.log(error);
      // stop the test
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
      );
      await driver.quit();
    }
  } else {
    // click the user menu
    try {
      const userMenu = await driver.wait(
        until.elementLocated(By.id("account-menu-toggle")),
        2000
      );

      await userMenu.click();
    } catch (error) {
      console.log(error);
      // stop the test
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
      );
      await driver.quit();
    }
  }

  // click the logout button
  if (hamburgerDisplayed) {
    try {
      const logoutButton = await driver.wait(
        // select by class name since the id is dynamic
        until.elementLocated(By.linkText("Sign out")),
        2000
      );
      await logoutButton.click();
    } catch (error) {
      console.log(error);
      // stop the test
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
      );
      await driver.quit();
    }
  } else {
    try {
      // hover the account-menu-toggle to reveal the logout button
      const userMenu = await driver.wait(
        until.elementLocated(By.id("account-menu-toggle")),
        5000
      );
      await driver.actions().move({ origin: userMenu }).perform();

      // click the logout button
      const logoutButton = await driver.wait(
        until.elementLocated(By.id("sign_out_link")),
        5000
      );

      await logoutButton.click();
    } catch (error) {
      console.log(error);
      // stop the test
      await driver.executeScript(
        'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some tests failed"}}'
      );
      await driver.quit();
    }
  }

  // quit the driver
  await driver.executeScript(
    'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Successfully carried out all tests"}}'
  );
  await driver.quit();
}

runTest();
