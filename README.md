# Event-Persistence
**Work in Progress**, not ready for use yet.

A tool to persist events from various sources to various targets such as a database or file.

## Usage
The easiest way to use this tool is to use the docker image.
Use the following command to run the tool:
```bash
docker run -d --rm -p 8080:8080 -e DB_HOST=<your_db_host> -e DB_USERNAME=<your_username> -e DB_PASSWORD=<your_db_password> event-persistence
```
## Feature Description
As this project just started, the features are not yet implemented and this is mostly a target description.

### Sources
- HTTP
- MQTT
- AMQP
- Kafka
- Pulsar
- Message Brokers of major Cloud Providers (tbd)

### Targets
- File (just log them in a given format)
- Postgres
- MySQL
- MongoDB
- Other major databases (tbd)

### Formats
Several formats of messages should be accepted. This includes at least:
- JSON
- XML
- CSV

The incoming messages should be parsed and mapped to the target and this mapping should be configurable to some extent with a sensible default.

### Configuration
- Configuration through YAML file
- Can be overridden though environment variables
- Default configuration for most properties

## Example
When finished this tool should be able to be run with a simple command:
