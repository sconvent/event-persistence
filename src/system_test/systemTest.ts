import pkg from 'pg';
const { Client } = pkg;
import mqtt from 'mqtt';

// Postgres: setup
console.log("Systemtest: Starting Postgres client")
// Create Postgres table
const pgClient = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "postgres",
});

await pgClient.connect()
    .then(() => console.log("Systemtest: Connected to Postgres"))
    .catch((err: any) => console.log(`Systemtest: Error connecting to Postgres: ${err}`));

await pgClient.query(`CREATE TABLE IF NOT EXISTS data (
    id SERIAL PRIMARY KEY,
    testField VARCHAR(255)
);`)
    .then(() => console.log("Systemtest: Created table"))
    .catch((err: any) => console.log(`Systemtest: Error creating table: ${err}`));

// MQTT
console.log("Systemtest: Starting MQTT client")
let client = mqtt.connect(`mqtt://localhost:1883`)
// callbacks
client.on("connect", () => {
    console.log("Systemtest: MQTT connection established")
    client.publish("test", "{ \"testField\": \"testValue\" }")
})

// Postgres: Check if data was written
await pgClient.query(`SELECT * FROM data;`)
    .then((res: any) => {
        console.log("Systemtest: Checking")
        if(res.rows.length == 0) {
            console.log("Systemtest: No data found")
            process.exit(1)
        }
        if(res.rows[0].testfield != "testValue") {
            console.log("Systemtest: Data mismatch")
            process.exit(1)
        }
    })
    .catch((err: any) => console.log(`Systemtest: Error getting data from Postgres: ${err}`));


// Cleanup
await pgClient.query(`DELETE FROM data;`)

// Shutdown
await pgClient.end()
await client.end()

process.exit(0)
