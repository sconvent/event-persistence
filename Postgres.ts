import pkg from 'pg';
const { Client } = pkg;

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

export function setupPostgres() {
    client.connect()
}

export async function writeToPostgres(fields: string[], data: any) {
    try {
        var row = [];
        for (const key of fields) {
            //console.log(`${key}: ${req.body[key]}`);    
            row.push(data[key]);
        }
        var values_string = "";
        for (var i = 1; i <= fields.length; i++) {
            values_string += "$" + i + ",";
        }
        values_string = values_string.slice(0, -1);
        await client.query(`INSERT INTO ${dbTable}(${fields.join(",")}) VALUES(${values_string})`, row);

        console.log(`Inserted entry into db`);

    } catch (err) {
        console.log(`An error occured: ${err}`);
    };
}
