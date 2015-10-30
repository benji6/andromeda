const express = require('express');
const compression = require('compression');

const app = express();
app.use(compression({threshold: 0}));
app.use(express.static(`${__dirname}/../public`));
app.listen(80);
