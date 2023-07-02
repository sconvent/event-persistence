import { setup, handleEvent } from "./index.js";
import { setupPostgres, writeToPostgres } from "./Postgres.js";
import { setupHttp } from "./Http.js";

jest.mock('./Postgres.js');
jest.mock('./Http.js');

test('setupPostgres is called', () => {
    setup();
    expect(setupPostgres).toHaveBeenCalled();
});

test('setupHttp is called', () => {
    setup();
    expect(setupHttp).toHaveBeenCalled();
});


test('handleEvent works for JSON', async () => {
    const postgres = require('./Postgres.js');
    const data = JSON.stringify({ "test": "test" });
    handleEvent({}, data);
    expect(postgres.writeToPostgres).toHaveBeenCalledWith({test: "test"});
});
