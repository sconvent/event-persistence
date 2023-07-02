import { setupMqtt } from './Mqtt.js';
import { setupHttp } from './Http.js';
import { setupPostgres, writeToPostgres } from './Postgres.js';
import { parseString, parseStringPromise } from 'xml2js';

const inputFormat = process.env.INPUT_FORMAT || "json"

const handleEvent = async (metaData: any, data: any) => {
    console.log(`Received event: ${data}`);

    var parsedData: any;
    try {
        if (inputFormat == "json") {
            parsedData = JSON.parse(data);
        } else if (inputFormat == "xml") {
            await parseStringPromise(data).then(function(result: any) {
                parsedData = result;
                console.log(JSON.stringify(parsedData));
            }).catch(function(err: any) {
                console.log(`Error parsing XML: ${err}`);
                return;
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
    if (parsedData) {
        writeToPostgres(parsedData);
    }
}

function setup() {

    setupPostgres()

    setupMqtt(handleEvent)

    setupHttp(inputFormat, handleEvent)
}

setup()

export { setup, handleEvent }
