const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3002;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, async () => {
    // priceChange.actionApiTimeout();
    console.log(`Example app listening at http://localhost:${port}`)
})

// app.use('/auth', auth);
// app.use('/user-request', getUser);
// app.use('/action-push', actionPush);

app.get('/test', async function (req, res) {
    res.send('Hello World 3!')
})
