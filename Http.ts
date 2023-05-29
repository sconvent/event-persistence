import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

// Define all HTTP environment variables needed
const httpEnabled = process.env.HTTP_ENABLED == "true" || false
const httpHost = process.env.HTTP_HOST
const httpPort = process.env.HTTP_PORT
const httpPath = process.env.HTTP_PATH
const httpJsonFields = process.env.HTTP_JSON_FIELDS || ""
const httpUser = process.env.HTTP_USER
const httpPassword = process.env.HTTP_PASSWORD


export async function setupHttp(handleEvent: any) {

    const app: Application = express();
    if(httpEnabled) {
    
        app.listen(8080, () => {
            console.log('Server is listening on port 8080!');
        });
    
        app.use(bodyParser.json());
    
        app.post('/data', async (req: Request, res: Response) => {
    
            handleEvent({}, req.body)
    
            // set return code
            res.status(200).send("OK");
        });
    }
    
}
