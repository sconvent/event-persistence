import * as mqtt from "mqtt"

// Define all environment variables needed
const mqttHost = process.env.MQTT_HOST
const mqttPort = process.env.MQTT_PORT
const mqttUser = process.env.MQTT_USER
const mqttPassword = process.env.MQTT_PASSWORD
const mqttTopics: string = process.env.MQTT_TOPICS || ""
const mqttClientId = process.env.MQTT_CLIENT_ID

// Define all DB variables needed
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbDatabase = process.env.DB_DATABASE
const dbTable = process.env.DB_TABLE

const client = mqtt.connect("mqtt://localhost:1883")
// callbacks
client.on("connect", () => {
    console.log("Connected")
    mqttTopics.split(",").forEach((topic) => {
        client.subscribe(topic)
    })
})
