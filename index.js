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
  var scriptProperties = PropertiesService.getScriptProperties();
  var slackToken = scriptProperties.getProperty("SLACK_TOKEN"); // @TODO: Set token prior if checking. 
  var requestToken = request.parameter.token;
  if (slackToken !== requestToken) {
    var output = {
      "text": "INVALID TOKEN"
    };
    return generateResponse(output);
  }

  // Command handling 
  try {

    return handle(request); // Handler function

  } catch (e) {

    // @TODO handle error. Below is code for mailing yourself about it.

    var recipients = scriptProperties.getProperty("email");
    var command = request.parameters.command || "";
    MailApp.sendEmail(recipients, "Slack command " + command + " messed up",
      "\r\nMessage: " + e.message +
      "\r\nFile: " + e.fileName +
      "\r\nLine: " + e.lineNumber +
      "\r\nTrace: " + e.stack +
      "\r\n\nLogs: " + Logger.getLog());

    // @TODO set general error message
    var output = {
      "text": "Something went wrong! (and I've mailed " + recipients.replace(",", ", ") + " about it)"
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

  var output;
  var params = request.parameters;
  var command = String(params.command);
  var text = params.text;

  // @TODO Replace the following sample with any handling process of your choice
  switch (command) {

    case "/myCommand": {
      output = {
        "text": getResult(text), // Your function goes here 
        "response_type": "in_channel" // for the response to show up in chat, rather than a fading message
      }
      break;
    }

    default: {
      output = {
        "text": "Sorry, I don't know how to `" + command + "` ☹",
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