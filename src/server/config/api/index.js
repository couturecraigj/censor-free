/* env node */
import express from 'express';
import bodyParser from 'body-parser';
import File from '../../models/file';

const app = express.Router();

app.get('/upload', async (req, res) => {
  // This is where we will check to see if the file already exists and also create an upload token and save it to the database
  try {
    const token = await File.getUploadToken(
      {
        ...JSON.parse(req.query.json)
      },
      { req, res }
    );

    res.json(token);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/upload', bodyParser.json(), async (req, res, next) => {
  // This is were we will be putting all our data into
  // Requirements: Session, Token from Get
  try {
    await File.saveChunk(req.body);
    res.json(req.body);
  } catch (e) {
    if (e.message === File.FILE_ALREADY_FINISHED.message)
      return res.status(400).json({ message: e.message });

    if (e.message === File.CHUNK_ALREADY_LOADED.message)
      return res.status(400).json({ message: e.message });

    next(e);
  }
});

app.get('/graphql-urls', (req, res) => {
  // console.log(req.app.get('apollo'));
  const graphqlPath = req.app.get('apollo').clientOnly
    ? req.app.get('apollo').graphqlUrl
    : `${req.headers['x-forwarded-proto'] || req.protocol}://${
        req.headers.host
      }${req.app.get('apollo').graphqlPath}`;
  const subscriptionsPath = req.app.get('apollo').clientOnly
    ? req.app.get('apollo').graphqlSubscriptionURL
    : `ws://${req.headers.host}${req.app.get('apollo').subscriptionsPath}`;

  res.json({
    graphqlPath,
    subscriptionsPath
  });
});

export default app;
