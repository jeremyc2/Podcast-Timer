const readline = require("readline");
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const template = 
`[
    {
        "user": 1,
        "time": "00:00",
        "content": {
            "label": "Placeholder",
            "notes": null,
            "teleprompter": false
        }
    }
]`;

rl.question("New podcast template? (yes) ", res => {
    if(res == "" || res.trim().toLowerCase() == "yes") {
        var entries = fs.readdirSync("data/main/").map(file => {
            const match = file.match(/^(\d*)\.json$/);

            if(match == null) throw "Invalid filename";

            id = parseInt(match[1]);

            return isNaN(id)? 0: id;
        });

        var nextFile;
        if(entries.length == 0) {
            nextFile = 1;
        } else {
            nextFile = Math.max(...entries) + 1;
        }

        fs.writeFileSync(`data/main/${nextFile}.json`, template);
        fs.writeFileSync('javascript/default-id.json', `const defaultId = ${nextFile};`);

        console.log(`data/main/${nextFile}.json has been added`);

    }
    rl.close();
});