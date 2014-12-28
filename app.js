var infantry = require('infantry');
var BrowserStack = require("browserstack");

var bsClient = BrowserStack.createClient({
    username: process.env.BROWSERSTACK_USERNAME,
    password: process.env.BROWSERSTACK_ACCESS_KEY
});

var workers = [];
var store = infantry.store.fs(__dirname + '/en', '.html');

var inf = infantry.app({
    store: store,
    programSource: __dirname + '/map.js',
    onComplete: function() {
        console.log('Finished');
        workers.map(function(w) { bsClient.terminateWorker(w); });
    }
});

function workerCallback(e, w) {
    if (!e) {
        workers.push(w.id);
    }
}

function spawnWorker() {
    bsClient.createWorker({
        os: "os x",
        browser: "chrome",
        browser_version: "35",
        os_version: "Mavericks",
        url: 'http://104.131.173.63:8080'
    }, workerCallback);
}

// Start workers after we've started listening.
setTimeout(function() {
    var i = 0;
    while (i < 1) {
        spawnWorker();
    }

    i++;
}, 2000);

inf.start(8080);
