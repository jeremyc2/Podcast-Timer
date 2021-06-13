const readline = require("readline");
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function buildTimerObject(user = 1, label = "Placeholder") {
    return {
        user,
        time: "00:00",
        content: {
            label,
            notes: null,
            teleprompter: false
        }
    };
}

rl.question("Outline filename: ", res => {
    if(res != "") {
        var data = fs.readFileSync(res, 'utf8');
        data = data.split('\n').map(line => {
            const params = line.split('\t');

            if(params.length == 0 || params.length > 2) throw "Invalid input";

            if(params.length == 1) {
                return buildTimerObject(params[0]);
            }
            
            if(params.length == 2) {
                return buildTimerObject(params[0], params[1]);
            }
        });

        console.log(JSON.stringify(data, null, '\t'));
    }
    rl.close();
});