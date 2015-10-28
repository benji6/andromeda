const express = require('express');
const compression = require('compression');

const app = express();
app.use(express.static(`${__dirname}/../public`));
app.use(compression());
app.listen(80);
