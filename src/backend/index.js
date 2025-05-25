import express from 'express';

const app = express();

// Required to parse JSON request bodies
app.use(express.json());

// Export the app for testing
export default app;
