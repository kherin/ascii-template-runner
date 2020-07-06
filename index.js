const readlineSync = require('readline-sync');
const logUpdate = require('log-update');

const obstacles = ['*', '=', 'O'];

function getObstacle() {
    return obstacles[Math.floor(Math.random() * obstacles.length)];
}

function generateRaceLine(withObstacle) {
    const raceLine = ['.', '.', '.'];

    if (withObstacle) {
        const numObstacles = Math.floor(Math.random() * 2) + 1;
        const obstacle = getObstacle();
        for (let index = 0; index < numObstacles; index++) {
            let positionObstacle = Math.floor(Math.random() * 3);
            raceLine[positionObstacle] = obstacle;
        }
    }

    return `|${raceLine.join('')}|`;
}

function generateLines(numberOfLines = 1, withObstacle = true) {
    let raceLines = [];
    for (let index = 0; index < numberOfLines; index++) {
        raceLines.push(generateRaceLine(withObstacle));
    }

    return raceLines;
}

function displayRaceTrack(raceLines) {
    let display = '';
    for (let raceLine of raceLines) {
        display += `${raceLine}\n`;
    }
    return display;
}

function doesItHitObstacle(userPositionIndex, nextRaceLine) {
    let itHits = false;

    let obstacleIndex = nextRaceLine.split('').findIndex((structure) => obstacles.includes(structure));
    if (obstacleIndex > -1) {
        return userPositionIndex == obstacleIndex;
    }
    return itHits;
}

(function () {

    let run = true;
    let currentUserPosition = 2;
    let addNextObstacle = true;
    let raceTrack = [...generateLines(1, false), ...generateLines(1, true), ...generateLines(3, false), ...generateLines(1, true), ...generateLines(3, false), '|.X.|'];

    console.log('use A(left), D(right) to steer, W(Move Forward). Quit(Q)');

    while (run) {
        logUpdate(displayRaceTrack(raceTrack));
        let command = readlineSync.prompt();

        while (!(command == 'A' || command == 'D' || command == 'Q' || command == 'W')) {
            console.log('Enter a valid command');
            command = readlineSync.prompt();
        }

        if (command == 'A') {
            currentUserPosition = currentUserPosition - 1;
            if (currentUserPosition == 0) {
                console.log('You hit the runway edge.');
                break;
            }
        } else if (command == 'D') {
            currentUserPosition = currentUserPosition + 1;
            if (currentUserPosition == 4) {
                console.log('You hit the runway edge.');
                break;
            }
        } else if (command == 'Q') {
            console.log('You left the game.');
            break;
        }

        const nextRaceLine = raceTrack[raceTrack.length - 2];
        if (doesItHitObstacle(currentUserPosition, nextRaceLine)) {
            console.log('GAME OVER');
            break;
        }

        let nextRaceLineSplits = nextRaceLine.split('');
        nextRaceLineSplits.splice(currentUserPosition, 1, 'X');
        raceTrack[raceTrack.length - 2] = nextRaceLineSplits.join('');

        let newRaceLines = generateLines(addNextObstacle ? 1 : 3, addNextObstacle);
        addNextObstacle = !addNextObstacle;
        raceTrack.pop();
        raceTrack = [...newRaceLines, ...raceTrack];
    }
})();