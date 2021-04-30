const express = require("express");

const { EventHubConsumerClient } = require("@azure/event-hubs");

// Event Hub-compatible endpoint
// az iot hub show --query properties.eventHubEndpoints.events.endpoint --name {your IoT Hub name}
const eventHubsCompatibleEndpoint = "{your Event Hubs compatible endpoint}";

// Event Hub-compatible name
// az iot hub show --query properties.eventHubEndpoints.events.path --name {your IoT Hub name}
const eventHubsCompatiblePath = "{your Event Hubs compatible name}";

// Primary key for the "service" policy to read messages
// az iot hub policy show --name service --query primaryKey --hub-name {your IoT Hub name}
const iotHubSasKey = "{your service primary key}";

// If you have access to the Event Hub-compatible connection string from the Azure portal, then
// you can skip the Azure CLI commands above, and assign the connection string directly here.
const connectionString = `Endpoint=${eventHubsCompatibleEndpoint};EntityPath=${eventHubsCompatiblePath};SharedAccessKeyName=service;SharedAccessKey=${iotHubSasKey}`;

// error message
var printError = function (err) {
  console.log(err.message);
};

// if cone is detected store info here
// use JSON in future
var coneVisible = "no";

// cone detection
var printMessages = function (messages) {
  coneVisible = "no";
  for (const message of messages) {
    console.log(JSON.stringify(message.body));
    if (message.body.length > 0) {
      for (detection of message.body) {
        if (detection.label == "cone" &&
            detection.confidence > 0.50) {
              coneVisible = "yes";
        }
      }
    }
  }
};

async function main() {
  console.log("IoT Hub Quickstarts - Read device to cloud messages.");
  const clientOptions = {
  };

  const consumerClient = new EventHubConsumerClient("$Default", connectionString, clientOptions);

  consumerClient.subscribe({
    processEvents: printMessages,
    processError: printError,
  });
}

main().catch((error) => {
  console.error("Error running sample:", error);
});

// express
const app = express();

// required headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get("/", function(req, res) {
  res.send(coneVisible);
});

// port 3333
let port = process.env.PORT;
if(port == null || port == "") {
 port = 3333;
}

app.listen(port, function() {
 console.log("Success");
});