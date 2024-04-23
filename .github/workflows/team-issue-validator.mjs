console.log('process.env.ISSUE_NUMBER', process.env.ISSUE_NUMBER);
console.log('process.env', process.env);

const issue_number = process.env.ISSUE_NUMBER;
const issue_url = `https://api.github.com/repos/lehtu/anari-dream-team/issues/${issue_number}?labels=my-anari-team`;

const response = await fetch(issue_url);
const issue = await response.json();

if (!issue.body)
    process.exit(1);

const jsonRegex = /```json([\s\S]+)```/;
const json_string = jsonRegex.exec(issue.body);

if (!json_string || json_string.length < 2 || !json_string[1])
    process.exit(1);

const json = {
    username: issue.title,
    team: null
};

try {
    json.team = JSON.parse(json_string[1]);
} catch (e) {
    process.exit(1);
}

console.log('all good!');
console.log(JSON.stringify(json, null, 2));
