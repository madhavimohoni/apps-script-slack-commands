/*****************************************************************************************************************
  This is a (very) basic Slash command handler to run on Google Apps Script to get you started.  
  You can push this code to your Google Apps Script project using clasp.

  - Basic Slack request parameters have been extracted into the "command" and "text" variables. 
    Eg. If the user types "/storm area 51":
      command = "/storm"
      text = "area 51"    

  - Token verification is optional, but you can fetch your token from Slack's API dashboard.
  
  - To add your own command,
    1. Write your functions and handlers. A sample switch case handler is given below. 
    2. Publish > Deploy as web app > Project version > "New" > Update. Repeat this after every future edit. 
      For the first time, note the "current web app URL".
    4. Add your new command on api.slack.com/apps with the request URL as the current web app URL from step 4.

  *****************************************************************************************************************/       
/**
 *   Inbuilt POST request endpoint function in Google Apps Script. Must be named doPost
 */
function doPost(request) {

  // Token verification
  const scriptProperties = PropertiesService.getScriptProperties();
  
  /** OPTIONAL: TOKEN CHECK **/
  const slackToken = scriptProperties.getProperty("SLACK_TOKEN"); // @TODO: Set token in script properties 
  const requestToken = request.parameter.token;
  if (slackToken !== requestToken) {
    return generateResponse({
      "text": "INVALID TOKEN"
    });
  }

  // Command handling 
  try {

    return handle(request); // Handler function

  } catch (e) {

    // @TODO handle error. Below is code for mailing yourself about it.

    const recipients = scriptProperties.getProperty("email");
    const command = request.parameters.command || "";
    MailApp.sendEmail(recipients, `Slack command ${command} failed`, e.stack);

    // @TODO set general error message
    const output = {
      "text": `Something went wrong! (and I've mailed ${recipients.replace(",", ", ")} about it)`
    };

    return generateResponse(output);
  }
}

/**
 *   Handles request
 */
function handle(request) {

  if (!request) {
    return;
  }

  let output;
  const {
    command,
    text
  } = request.parameters;
  command = String(command);
  
  // @TODO Replace the following sample with any handling process of your choice
  switch (command) {

    case "/myCommand": {
      output = {
        "text": myCommand(text), // Your function goes here 
        "response_type": "in_channel" // for the response to show up in chat, rather than a fading message
      }
      break;
    }

    default: {
      output = {
        "text": `\`${command}"\` is not a valid command.`,
        "response_type": "in_channel"
      };
    }
  }

  return generateResponse(output);
}

/**
 *   Converts the output object to the necessary MIME type for returning to Slack 
 */
function generateResponse(output) {
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}
