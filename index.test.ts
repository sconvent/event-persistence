import { setup } from "./index.js";
import { setupPostgres } from "./Postgres.js";
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
