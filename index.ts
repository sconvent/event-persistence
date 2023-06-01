import { setupMqtt } from './Mqtt.js';
import { setupHttp } from './Http.js';
import { setupPostgres, writeToPostgres } from './Postgres.js';

const jsonFields = process.env.JSON_FIELDS || ""

const handleEvent = async (metaData: any, data: any) => {
    console.log(`Received event: ${data}`);

    // write to postgres
    writeToPostgres(jsonFields.split(","), data);
}

setupPostgres()

setupMqtt(handleEvent)

setupHttp(handleEvent)
