const amqp = require('amqplib');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config()
const amqpUrl = process.env.RMQ_URL || 'amqp://localhost:5672'
const queue = process.env.RMQ_MSG_PROCESSING_QUEUE || 'message-processing-queue'

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

async function subscriber() {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, (message,) => {
        try {
            const parsedMessage = JSON.parse(message.content.toString());
            if (parsedMessage.priority >= 7) {
                io.emit('messages', parsedMessage);
                channel.ack(message)
            }
        } catch (err) {
            console.log(err.message)
            // requeue if error occurs
            channel.nack(message, false, true)
        }

    }, { noAck: false });
}

server.listen(30056, () => {
    console.log('Socket.IO server listening on port 30056');
    subscriber();
    io.on('connection', (socket) => {
        console.log("User Connected to socket with id", socket.id)
    })
});
