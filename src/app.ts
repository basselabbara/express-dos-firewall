import * as express from 'express';
import { dosProtectionMiddleware } from './dosFirewallMiddleware';
import './backgroundService';

const app = express();
const PORT = 3000;

app.use(dosProtectionMiddleware);

// Your routes and other middleware can be defined here
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
