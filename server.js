const { ObjectID } = require('bson');
let express = require('express');
let { MongoClient, ObjectId } = require('mongodb');
let sanitizeHTML = require('sanitize-html');

let app = express();
let db;

app.use(express.static('public'));


async function connection() {
    let mongo = new MongoClient('mongodb+srv://toDoAppUser:13051998.@cluster0.4w7trui.mongodb.net/ToDoApp?retryWrites=true&w=majority')
    await mongo.connect();
    db = mongo.db();
    app.listen(3000);
};

connection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(passwordProtected);

function passwordProtected(req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="Simeple Todo App"')
    console.log(req.headers.authorization)
    if (req.headers.authorization == 'Basic aXZhbmE6aXZhbmExMzA1') {
        next()
    } else {
        res.status(401).send('Authentication required')
    }
}

app.get('/', function (req, res) {
    db.collection('items').find().toArray(function (err, items) {
        res.send(
            `<!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <link href="/css/stylesheet.css" rel="stylesheet" type="text/css">
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" 
                integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                <title>To do List</title>
            </head>

            <body>
            <div id="mainContainer">
                <h1 class="display-4 text-center py-1">To do List</h1>

                <div class="jumbotron p-3 shadow-sm">
                <form id="todoForm" action="/create-item" method="POST">
                        <div class="d-flex align-items-center">
                    <input type="text" autocomplete="off" id="inputText" name="item" autofocus 
                    class="form-control mr-3" style="flex: 1;"  >
                    <button class="btn btn-primary">Add To do</button>
                      </div>
                </form>
                </div>
                <h3>Needs to do</h3>
                <ul id="todoList" class="list-group pb-5">
              
           </ul>
            </div>
            <script>
            let items = ${JSON.stringify(items)}
            </script>
            <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
            <script src="/js/app.js"> </script>
            </body>
            </html>`
        )
    });

});
app.post('/create-item', function (req, res) {
    let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: [] })
    db.collection('items').insertOne({ text: safeText }, function (err, info) {
        res.json({ _id: info.insertedId, text: safeText })
    })
});

app.post('/update-item', function (req, res) {
    let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: [] })
    db.collection('items').findOneAndUpdate({ _id: new ObjectID(req.body.id) }, {
        $set: { text: safeText }
    }, function () {
        res.send('Success')
    });
});

app.post('/delete-item', function (req, res) {
    db.collection('items').deleteOne({ _id: new ObjectID(req.body.id) }, function () {
        res.send('Success')
    });
});


app.get('/test-route', function (req, res) {
    try {
        console.log(req.body.text)
        res.sen('good');
    } catch (error) {
        res.send('test-route error found. see line 83')
    }
});

