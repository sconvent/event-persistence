import { setupPostgres, writeToPostgres } from "./Postgres.js";
import pkg from 'pg';

jest.mock('pg', () => {
    const originalModule = jest.requireActual('pg');
    return {
      ...originalModule,
      client: {
        ...originalModule.client,
        connect: jest.fn(),
      },
    };
  });

test('WHEN postgres connection is setup THEN it will connect', async () =>{
    //mockClient.connect.mockImplementation(() => Promise.resolve());
    
    await setupPostgres();
    /*
    expect(pkg.Client).toHaveBeenCalledWith({
        host: "localhost",
        port: 5432,
        database: "postgres",
        user: "postgres",
        password: "postgres",
    });
    */
});
