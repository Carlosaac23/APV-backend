import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, (error: unknown) => {
  if (error) {
    console.error('Error starting the server:', error);
    throw error;
  }
  console.log(`Server working on http://localhost:${PORT}`);
});
