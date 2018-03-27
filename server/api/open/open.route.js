import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'App is running' });
});

export default router;
