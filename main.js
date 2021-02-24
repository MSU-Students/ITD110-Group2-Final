var level = require("level");
var db  = level("./student-db", { valueEncoding: 'json'});
