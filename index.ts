import { setupMqtt } from './Mqtt.js';
import { setupHttp } from './Http.js';
import { setupPostgres, writeToPostgres } from './Postgres.js';

const jsonFields = process.env.JSON_FIELDS || ""

const handleEvent = async (metaData: any, data: any) => {
    console.log(`Received event: ${data}`);

    let parsedData = JSON.parse(data);

    // write to postgres
    writeToPostgres(jsonFields.split(","), parsedData);
}

setupPostgres()

setupMqtt(handleEvent)

setupHttp(handleEvent)
