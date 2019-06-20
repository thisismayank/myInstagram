const express = require('express')
const bodyParser = require('body-parser')

const routeUsers = require('./routes/users');
const routeFiles = require('./routes/files');
const routeUserFileMapping = require('./routes/users-files-mappings');


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));


app.use(routeUsers);
app.use(routeFiles);
app.use(routeUserFileMapping);

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})