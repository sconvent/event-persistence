import { setup, handleEvent } from "./index.js";
import { setupPostgres, writeToPostgres } from "./Postgres.js";
import { setupHttp } from "./Http.js";
import { setupKafka } from "./kafka.js";
import { setupAmqp } from "./amqp.js";

jest.mock('./Postgres.js');
jest.mock('./Http.js');
jest.mock('./kafka.js');
jest.mock('./amqp.js');

test('setupPostgres is called', () => {
    setup();
    expect(setupPostgres).toHaveBeenCalled();
});

test('setupHttp is called', () => {
    setup();
    expect(setupHttp).toHaveBeenCalled();
});


test('setupKafka is called', () => {
    setup();
    expect(setupKafka).toHaveBeenCalled();
});

test('setupAmqp is called', () => {
    setup();
    expect(setupAmqp).toHaveBeenCalled();
});

test('handleEvent works for JSON', async () => {
    const postgres = require('./Postgres.js');
    const data = JSON.stringify({ "test": "test" });
    handleEvent({}, data);
    expect(postgres.writeToPostgres).toHaveBeenCalledWith({test: "test"});
});
