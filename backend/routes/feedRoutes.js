const express = require('express');
const Feed = require('../models/feed');
const { redisClient } = require('../config/redis');

const router = express.Router();

// GET /feed
router.get('/', async (req, res) => {
  try {
    const cachedFeeds = await redisClient.get('feeds');

    if (cachedFeeds) {
      console.log('Serving from Redis cache');
      return res.json(
        typeof cachedFeeds === 'string' ? JSON.parse(cachedFeeds) : cachedFeeds
      );
    }

    console.log('Serving from MongoDB');
    const feeds = await Feed.find().sort({ createdAt: -1 });

    await redisClient.set('feeds', JSON.stringify(feeds));

    res.json(feeds);
  } catch (error) {
    console.error('Feed fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /feed
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newFeed = await Feed.create({ title, description });

    // Clear cache
    await redisClient.del('feeds');

    // Realtime update
    const io = req.app.get('io');
    io.emit('newFeed', newFeed);

    res.status(201).json(newFeed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;