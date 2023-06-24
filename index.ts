import { setupMqtt } from './Mqtt.js';
import { setupHttp } from './Http.js';
import { setupPostgres, writeToPostgres } from './Postgres.js';
import { parseString } from 'xml2js';

const inputFormat = process.env.INPUT_FORMAT || "json"

const handleEvent = async (metaData: any, data: any) => {
    console.log(`Received event: ${data}`);

    var parsedData: any;
    try {
        if (inputFormat == "json") {
            parsedData = JSON.parse(data);
        } else if (inputFormat == "xml") {
            await parseString(data, (err: any, result: any) => {
                if (err) {
                    console.log(`Error parsing XML: ${err}`);
                    return;
                }
                parsedData = result;
            });
        } else if (inputFormat == "csv") {
            parsedData = data.split(",");
        } else {
            console.log(`Unknown input format: ${inputFormat}`);
            return;
        }
    } catch (err) {
        console.log(`Error parsing JSON: ${err}`);
        return;
    }

    // write to postgres
    writeToPostgres(parsedData);
}

setupPostgres()

setupMqtt(handleEvent)

setupHttp(handleEvent)
