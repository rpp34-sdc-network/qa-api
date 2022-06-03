const app = require( './server.js');

let port = 3111;

app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`)
});

