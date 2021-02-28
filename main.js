const level = require('level');

(async function main() {
    const db = connectToDatabase('./Student-db');
}());

function connectToDatabase(dbName) {
    const options = {
        valueEncoding: 'json'
    };
    return level(dbName, options);
}
