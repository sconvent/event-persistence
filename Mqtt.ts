import mqtt from 'mqtt';

// Define all MQTT environment variables needed
const mqttEnabled = process.env.MQTT_ENABLED == "true" || false
const mqttHost = process.env.MQTT_HOST || "localhost"
const mqttPort = process.env.MQTT_PORT || 1883
const mqttUser = process.env.MQTT_USER || undefined
const mqttPassword = process.env.MQTT_PASSWORD
const mqttTopics: string = process.env.MQTT_TOPICS || ""
const mqttClientId = process.env.MQTT_CLIENT_ID

export function setupMqtt(handleEvent: any) {
  if(mqttEnabled) {
      console.log("Starting MQTT client")
      let client = mqtt.connect(`mqtt://${mqttHost}:${mqttPort}`, {username: mqttUser, password: mqttPassword, clientId: mqttClientId})
      // callbacks
      client.on("connect", () => {
          console.log("Connected")
          mqttTopics.split(",").forEach((topic) => {
              client.subscribe(topic)
          })
      })
  
      client.on("error", (error) => {
          console.log(`Error: ${error}`)
      })
  
      client.on("message", (topic, message) => {
          console.log(`Received message on topic ${topic}: ${message.toString()}`)
          handleEvent({topic: topic}, JSON.parse(message.toString())
          //handleEvent({topic: topic}, JSON.parse(message.toString()))
      })
  }
}
