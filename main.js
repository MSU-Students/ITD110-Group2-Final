var level = require("level");
var db  = level("./student-db", { valueEncoding: 'json'});


const prompt = require('prompt-sync')({sigint: true});

 var stId = prompt('Enter ID: ');
 var fullName = prompt('Enter full Name: ');
 var stdAge = prompt('enter age:');
 var stdAddress = prompt('Enter address: ');

acceptStudents(stId, fullName,stdAge, stdAddress);

function acceptStudents(stId, fullName,stdAge){
    db.put('student', {id: stId ,name: fullName, age: stdAge, address: stdAddress, status: 'applying' }, function(err){  
        output();
    })

}

function output(){
    db.get('student', function(err, student){
        console.log(student);
    })
    }