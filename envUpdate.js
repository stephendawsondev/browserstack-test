// import file system to replace contents of browserstack.yml
const fs = require("fs");
// import js-yaml to parse the yaml file
const yaml = require("js-yaml");
// import child_process to run the browserstack-node-sdk command after replacing
const { exec } = require("child_process");
// import dotenv to load environment variables
require("dotenv").config();

function loadAndParseYAML() {
  let fileContents = fs.readFileSync("./browserstack.yml", "utf8");
  let data = yaml.load(fileContents);

  if (process.env.BROWSERSTACK_USERNAME) {
    data.userName = process.env.BROWSERSTACK_USERNAME;
  }

  if (process.env.BROWSERSTACK_ACCESS_KEY) {
    data.accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
  }

  return data;
}

function writeYAML(data) {
  let yamlStr = yaml.dump(data);
  fs.writeFileSync("./browserstack.yml", yamlStr, "utf8");
}

let data = loadAndParseYAML();
writeYAML(data);

// run main script
exec("browserstack-node-sdk node index.js", (error) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
});

// reset the browserstack.yml BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY
// to ${BROWSERSTACK_USERNAME} and ${BROWSERSTACK_ACCESS_KEY}
data.userName = "${BROWSERSTACK_USERNAME}";
data.accessKey = "${BROWSERSTACK_ACCESS_KEY}";
writeYAML(data);
