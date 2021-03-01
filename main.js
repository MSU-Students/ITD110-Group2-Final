const level = require('level');

(function main() {
    const db = connectToDatabase('./Student-db');
    const args = process.argv.splice(2);
    let ID;
    switch (args[0]) {
        case 'accept':
            ID = args[1];
            const studentName = args[2];
            const studentAge = Number(args[3]);
            const studentAddress = args[4];
            acceptStudent(db, ID, studentName, studentAge, studentAddress);
            break;
        case 'sched-interview':
            ID = args[1];
            const interviewSched = args[2];            
            scheduleInterview(db, ID, interviewSched);
            break;
        case 'sched-exam':
            ID = args[1];
            const examdSched = args[2];
            scheduleExam(db, ID, examdSched);
            break;
        case 'rate-exam':
            ID = args[1];
            const score = args[2];
            rateEntranceExam(db, ID, score);
            break;
        case 'list':
            listAllStudents(db);
            break;
        default:
            console.log('Commands:', 'accept', 'list', 'sched-interview', 'sched-exam', 'rate-exam');
    }
}());

function connectToDatabase(dbName) {
    const options = {
        valueEncoding: 'json'
    };
    return level(dbName, options);
}

async function getNext(iterator) {
    return new Promise((resolve, reject) => {
        iterator.next((err, key, value) => {
            if (err) {
                reject(err);
            } else if (key && value) {
                resolve({ key: key, value: value });
            } else {
                iterator.end(() => {
                    resolve(undefined);
                })
            }
        });
    })
}
async function listAllStudents(db) {
    let iterator = db.iterator();
    let nextKeyValue;
    do {
        nextKeyValue = await getNext(iterator);
        if (nextKeyValue) {
            const student = nextKeyValue.value;
            console.log('\nID No.: ',student.ID,'\nFullname: ', student.name,'\nAge: ', student.age, '\nAddress: ', student.address, 
            '\nStatus: ', student.status,'\nInterview Date: ', student.interviewSched,'\nExam Date:', student.examdSched,'\nExam Score: ', student.score);
        }
    } while (nextKeyValue);
}

async function acceptStudent(db, ID, studentName, studentAge, studentAddress) {
    const studentInfo = {
        ID: ID,
        name: studentName,
        age: studentAge,
        address: studentAddress,
        status: 'Applying'
    };
    return await db.put(ID, studentInfo);
}

async function scheduleInterview(db, ID, ScheduleDate) {
    try {
        const student =  await db.get(ID);
        student.interviewSched = ScheduleDate;
        student.status = 'Under Interview';
        db.put(ID, student);
    } catch (error) {
        console.log('The ID', ID ,'you entered is not existing');
    }
}

async function scheduleExam(db, ID, ScheduleDate){
    try {
        const student = await db.get(ID);
        student.examdSched = ScheduleDate;
        student.status = 'Exam Pending';
        db.put(ID, student);
    } catch (error) {
        console.log('The ID', ID ,'you entered is not existing');
    }
}

async function rateEntranceExam(db, ID, examScore){
    try {
        const student = await db.get(ID);
        student.score = examScore;
        if(examScore >= 70){
            student.status = 'Admitted';
        } else{
            student.status = 'Probationary';
        }
        db.put(ID, student);
    } catch (error) {
        console.log('The ID', ID ,'you entered is not existing');
    }
}