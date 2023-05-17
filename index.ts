import * as mqtt from "mqtt"
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Client } = pkg;
const app: Application = express();

// Define all MQTT environment variables needed
const mqttEnabled = process.env.MQTT_ENABLED == "true" || false
const mqttHost = process.env.MQTT_HOST
const mqttPort = process.env.MQTT_PORT
const mqttUser = process.env.MQTT_USER
const mqttPassword = process.env.MQTT_PASSWORD
const mqttTopics: string = process.env.MQTT_TOPICS || ""
const mqttClientId = process.env.MQTT_CLIENT_ID

// Define all HTTP environment variables needed
const httpEnabled = process.env.HTTP_ENABLED == "true" || false
const httpHost = process.env.HTTP_HOST
const httpPort = process.env.HTTP_PORT
const httpPath = process.env.HTTP_PATH
const httpJsonFields = process.env.HTTP_JSON_FIELDS || ""
const httpUser = process.env.HTTP_USER
const httpPassword = process.env.HTTP_PASSWORD

// Define all DB variables needed
const dbHost = process.env.DB_HOST || "localhost"
const dbPort = 5432
const dbUser = process.env.DB_USER  || "postgres"
const dbPassword = process.env.DB_PASSWORD  || "postgres"
const dbDatabase = process.env.DB_DATABASE  || "postgres"
const dbTable = process.env.DB_TABLE || "data"


const client = new Client({
  host: dbHost,
  port: dbPort,
  database: dbDatabase,
  user: dbUser,
  password: dbPassword,
});


if(mqttEnabled) {
    const client = mqtt.connect(`mqtt://${mqttHost}:${mqttPort}`)
    // callbacks
    client.on("connect", () => {
        console.log("Connected")
        mqttTopics.split(",").forEach((topic) => {
            client.subscribe(topic)
        })
    })   
}

if(httpEnabled) {
    await client.connect();

    app.listen(8080, () => {
        console.log('Server is listening on port 8080!');
    });

    app.use(bodyParser.json());

    app.post('/data', async (req: Request, res: Response) => {

        handleEvent({}, req.body)

        // set return code
        res.status(200).send("OK");
    });
}

const handleEvent = async (metaData: any, data: any) => {
    console.log(`Received event: ${data}`);

    try {
    // check if all required fields are present
    let missingFields = false;
    for (const field of httpJsonFields.split(",")) {
        if (field != "" && !(field in data)) {
            console.log(`Required field ${field} is missing`);
            missingFields = true;
        }
    }
    if (!missingFields) {
        console.log("All required fields are present, adding to db");
        var row = [];
        for (const key of httpJsonFields.split(",")) {
            //console.log(`${key}: ${req.body[key]}`);    
            row.push(data[key]);
        }
        var values_string = "";
        for (var i = 1; i <= httpJsonFields.split(",").length; i++) {
            values_string += "$" + i + ",";
        }
        values_string = values_string.slice(0, -1);
        await client.query(`INSERT INTO ${dbTable}(${httpJsonFields}) VALUES(${values_string})`, row);
        
        console.log(`Inserted entry into db`);
    }

    } catch(err) {
        console.log(`An error occured: ${err}`);
    };
}
