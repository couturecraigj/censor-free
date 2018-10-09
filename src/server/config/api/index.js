/* env node */
import express from 'express';
import bodyParser from 'body-parser';
import { nextTick } from 'async';
import File from '../../models/file';

const app = express.Router();

app.get('/upload', async (req, res) => {
  // This is where we will check to see if the file already exists and also create an upload token and save it to the database
  const token = await File.getUploadToken({
    ...JSON.parse(req.query.json),
    user: req.user.id
  });

  res.json(token);
});

app.post('/upload', bodyParser.json(), async (req, res, next) => {
  // This is were we will be putting all our data into
  // Requirements: Session, Token from Get
  try {
    const file = await File.saveChunk(req.body);
    res.json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default app;
