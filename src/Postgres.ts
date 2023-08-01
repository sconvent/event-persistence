import { Client } from 'pg';

// Define all DB variables needed
const dbHost = process.env.DB_HOST || "localhost"
const dbPort = 5432
const dbUser = process.env.DB_USER || "postgres"
const dbPassword = process.env.DB_PASSWORD || "postgres"
const dbDatabase = process.env.DB_DATABASE || "postgres"
const dbTable = process.env.DB_TABLE || "data"

const client = new Client({
    host: dbHost,
    port: dbPort,
    database: dbDatabase,
    user: dbUser,
    password: dbPassword,
});

var fields: string[] = [];
var query: string = "";

export async function setupPostgres() {
    client.connect()
        .then(() => console.log("Connected to Postgres"))
        .catch((err) => console.log(`Error connecting to Postgres: ${err}`));
    await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1;`, [dbTable])
        .then((res) => {
            fields = res.rows.map((row) => row.column_name).filter((field) => field != "id");
            console.log(fields);
        })
        .catch((err) => console.log(`Error getting columns from Postgres: ${err}`));
    var values_string = "";
    for (var i = 1; i <= fields.length; i++) {
        values_string += "$" + i + ",";
    }
    query = `INSERT INTO ${dbTable}(${fields.join(",")}) VALUES(${values_string.slice(0, -1)})`;
    console.log(query);
}

export async function writeToPostgres(data: any) {
    try {
        var row = [];
        console.log(fields)
        // make all fields lowercase
        for (const key in data) {
            data[key.toLowerCase()] = data[key]
        }
        for (const key of fields) {
            console.log(`${key}: ${data[key]}`);    
            row.push(data[key]);
        }
        console.log(row);
        await client.query(query, row);

        console.log(`Inserted entry into db`);

    } catch (err) {
        console.log(`An error occured: ${err}`);
    };
}
