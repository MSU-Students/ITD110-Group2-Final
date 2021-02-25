var level = require("level");
var db  = level("./student-db", { valueEncoding: 'json'});
var status = ['Applying', 'Under Interview', 'Exam Pending', 'Admitted', 'Probationary'];

const prompt = require('prompt-sync')({sigint: true});

 var stId = prompt('Enter ID: ');
 var fullName = prompt('Enter full Name: ');
 var stdAge = prompt('Enter age: ');
 var stdAddress = prompt('Enter address: ');

acceptStudents(stId, fullName,stdAge, stdAddress);

async function acceptStudents(stId, fullName,stdAge){
    await db.put('student', {id: Number(stId) ,name: fullName, age: Number(stdAge), address: stdAddress}, function(err){  
        output();
        scheduleInterview(stId, 'February 26, 2021');
    })
}

async function output(){
    await db.get('student', function(err, student){
        console.log(student);     
        console.log('Status: ' + status[0]);
    })
    }
async function scheduleInterview(stId, scheduleDate){
    await db.get(stId, function(err, value){
        console.log('\nInterview date: ' + scheduleDate);
        console.log('Status: ' + status[1]);
    })
}