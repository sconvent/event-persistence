import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

// Define all HTTP environment variables needed
const httpEnabled = process.env.HTTP_ENABLED == "true" || false
const httpPort = process.env.HTTP_PORT || 8080
const httpPath = process.env.HTTP_PATH || "/data"
const httpJsonFields = process.env.HTTP_JSON_FIELDS || ""
const httpBasicAuthEnabled = process.env.HTTP_BASIC_AUTH_ENABLED == "true" || false
const httpBasicAuthUser = process.env.HTTP_USER
const httpBasicAuthPassword = process.env.HTTP_PASSWORD

export async function setupHttp(handleEvent: any) {

    const app: Application = express();
    if(httpEnabled) {
    
        app.listen(httpPort, () => {
            console.log(`Server is listening on port ${httpPort}`);
        });
    
        app.use(bodyParser.text());
    
        app.post(httpPath, async (req: Request, res: Response) => {

            handleEvent({}, req.body)
    
            // set return code
            res.status(200).send("OK");
        });
    }
    
}
