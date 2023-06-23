import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

// Define all HTTP environment variables needed
const httpEnabled = process.env.HTTP_ENABLED == "true" || false
const httpPort = process.env.HTTP_PORT || 8080
const httpPath = process.env.HTTP_PATH || "/data"
const httpTokenAuthEnabled = process.env.HTTP_TOKEN_AUTH_ENABLED == "true" || false
const httpTokenHeaderName = process.env.HTTP_TOKEN_HEADER_NAME || "X-Auth-Token"
const httpTokenSecret = process.env.HTTP_TOKEN_SECRET || "secret"

export async function setupHttp(handleEvent: any) {

    const app: Application = express();
    if(httpEnabled) {
    
        app.listen(httpPort, () => {
            console.log(`Server is listening on port ${httpPort}`);
        });
    
        app.use(bodyParser.text({ type: 'application/json' }));
    
        app.post(httpPath, async (req: Request, res: Response) => {
            // check token
            if (httpTokenAuthEnabled) {
                const token = req.header(httpTokenHeaderName);
                if (token != httpTokenSecret) {
                    res.status(401).send("Unauthorized");
                    return;
                }
            }

            handleEvent({}, req.body)
    
            // set return code
            res.status(200).send("OK");
        });
    }
    
}
