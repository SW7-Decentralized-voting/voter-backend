import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://localhost:6379' // Adjust the URL if your Redis server is hosted elsewhere
});

redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});

async function subscribeToKeyGeneration() {
    await redisClient.connect();
    await redisClient.subscribe('keyGeneration', (message) => {
        const { numKeys } = JSON.parse(message);
        console.log(`Received key generation signal with numKeys: ${numKeys}`);
        // Perform actions based on the received numKeys
        // For example, generate keys or trigger other processes
    });
}

export { subscribeToKeyGeneration };