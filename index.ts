import pkg from 'pg';
const { Client } = pkg;
import { setupMqtt } from './Mqtt.js';
import { setupHttp } from './Http.js';

const jsonFields = process.env.JSON_FIELDS || ""

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

const handleEvent = async (metaData: any, data: any) => {
    console.log(`Received event: ${data}`);

    try {
    // check if all required fields are present
    let missingFields = false;
    for (const field of jsonFields.split(",")) {
        if (field != "" && !(field in data)) {
            console.log(`Required field ${field} is missing`);
            missingFields = true;
        }
    }
    if (!missingFields) {
        console.log("All required fields are present, adding to db");
        var row = [];
        for (const key of jsonFields.split(",")) {
            //console.log(`${key}: ${req.body[key]}`);    
            row.push(data[key]);
        }
        var values_string = "";
        for (var i = 1; i <= jsonFields.split(",").length; i++) {
            values_string += "$" + i + ",";
        }
        values_string = values_string.slice(0, -1);
        await client.query(`INSERT INTO ${dbTable}(${jsonFields}) VALUES(${values_string})`, row);
        
        console.log(`Inserted entry into db`);
    }

    } catch(err) {
        console.log(`An error occured: ${err}`);
    };
}

setupMqtt(handleEvent)

setupHttp(handleEvent)
