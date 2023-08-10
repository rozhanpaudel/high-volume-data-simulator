const amqp = require('amqplib');
const generateFuzzyPhrase = require('./helpers/fuzzyPhraseGenerator.helper');
const generateRandomNumber = require('./helpers/number.helper');
require('dotenv').config()

const amqpUrl = process.env.RMQ_URL || 'amqp://localhost:5672'
const queue = process.env.RMQ_MSG_PROCESSING_QUEUE || 'message-processing-queue'

const noOfMessagesPerMinute = process.env.No_OF_MSG_PER_MINUTE || 20


async function publish() {
  const connection = await amqp.connect();
  const channel = await connection.createChannel(amqpUrl);
  await channel.assertQueue(queue, { durable: false });

  const timeInterval = 1000 / noOfMessagesPerMinute
  setInterval(async () => {
    const message = {
      message: await generateFuzzyPhrase(),
      timestamp: Date.now(),
      priority: generateRandomNumber(),
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Pushed message to ${queue}: `, JSON.stringify(message))
  }, timeInterval);

  process.on('exit', () => {
    connection.close();
  });
}

publish();
