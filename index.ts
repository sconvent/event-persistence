import { setupMqtt } from './Mqtt.js';
import { setupHttp } from './Http.js';
import { setupPostgres, writeToPostgres } from './Postgres.js';

const jsonFields = process.env.JSON_FIELDS || ""

const handleEvent = async (metaData: any, data: any) => {
    console.log(`Received event: ${data}`);

    var parsedData: any;
    try {
        parsedData = JSON.parse(data);
    } catch (err) {
        console.log(`Error parsing JSON: ${err}`);
        return;
    }

    // write to postgres
    writeToPostgres(jsonFields.split(","), parsedData);
}

setupPostgres()

setupMqtt(handleEvent)

setupHttp(handleEvent)
