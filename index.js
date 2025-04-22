const dotenv = require('dotenv');
const helmet = require('helmet');
const cors =    require('cors');
const rateLimit = require('express-rate-limit');
// const xss = require('xss-clean');


dotenv.config();
const app = require('./src/app');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

app.use(helmet());
app.use(cors());
app.use(limiter);
// app.use(xss());






const port = process.env.PORT || 4001;


app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
  })
