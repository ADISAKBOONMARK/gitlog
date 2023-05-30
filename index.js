const gitlog = require("gitlog").default;
const moment = require("moment");
const fs = require("fs");

const author = "adisak boonmark";

const after = "2023/05/01";
const before = "2023/06/01";

const repoList = [
  "../repo-a",
  "../repo-b"
];

const activity = [];

repoList.forEach((repo) => {
  const options = {
    repo: __dirname + "/" + repo,
    number: Number.MAX_SAFE_INTEGER,
    before: new Date(before),
    after: new Date(after),
    author: author,
  };

  const commits = gitlog(options);

  commits.forEach((element) => {
    const timestamp = moment(new Date(element.authorDate)).format("YYYY/MM/DD");
    activity.push({
      repo: repo,
      name: element.authorName,
      date: timestamp,
      subject: element.subject,
    });
  });
});

const fainalResult = [];
const pushFinalResult = function (element) {
  fainalResult.push({
    date: element.date,
    name: element.name,
    repo: [
      {
        name: element.repo,
        subject: [element.subject],
      },
    ],
  });
};

activity.forEach((element1) => {
  if (fainalResult.length === 0) {
    pushFinalResult(element1);
  } else {
    let foundDate = false;
    fainalResult.forEach((element2) => {
      if (element2.date === element1.date) {
        foundDate = true;

        let foundRepo = false;

        element2.repo.forEach((element3) => {
          if (element3.name === element1.repo) {
            element3.subject.push(element1.subject);
            foundRepo = true;
          }
        });

        if (!foundRepo) {
          element2.repo.push({
            name: element1.repo,
            subject: [element1.subject],
          });
        }
      }
    });

    if (!foundDate) {
      pushFinalResult(element1);
    }
  }
});

fainalResult.sort(function (a, b) {
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(b.date) - new Date(a.date);
});

const fileName = "gitlog-log.json";

fs.writeFile(fileName, JSON.stringify(fainalResult, null, 4), function (err) {
  if (err) return console.log(err);
  console.log("write file success at ./" + fileName);
});

const sumFileName = "sum-gitlog-log.json";

let sumFainalResult = "";
fainalResult.forEach((element) => {
  sumWorkLog = "";

  element.repo.forEach((el) => {
    sumWorkLog += el.name.replace("../", "") + "\n";
    el.subject.forEach((el2, index) => {
      sumWorkLog += "- " + el2  + "\n";
    });
  });
  sumFainalResult += "date: " + element.date + "\n"
  sumFainalResult += "name: " + element.name + "\n"
  sumFainalResult += "sumWorkLog: [\n" + sumWorkLog + "]\n\n"
});
fs.writeFile(
  sumFileName,
  sumFainalResult,
  function (err) {
    if (err) return console.log(err);
    console.log("write file success at ./" + sumFileName);
  }
);
