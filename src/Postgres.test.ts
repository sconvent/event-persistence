import { mock, when, instance } from 'ts-mockito';
import { setupPostgres, writeToPostgres } from "./Postgres.js";
import { Client } from 'pg';

  /*
jest.mock('pg', () => {
    return {
      client: {
        connect: jest.fn(),
      },
    };
  });
*/
test('WHEN postgres connection is setup THEN it will connect', async () =>{
  /*
    const mockClientConstructor = mock(Client);
    const mockClientInstance = mock(Client.prototype);

    when(mockClientConstructor).thenReturn(instance(mockClientInstance as Client));


    //mockClient.connect.mockImplementation(() => Promise.resolve());
    
    await setupPostgres();
    expect(pkg.Client).toHaveBeenCalledWith({
        host: "localhost",
        port: 5432,
        database: "postgres",
        user: "postgres",
        password: "postgres",
    });

*/
});
