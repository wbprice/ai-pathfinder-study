'use strict';

const initialLocation = {
    x: 0,
    y: 0
}

function moveUp(location) {
    return {
        x: location.x,
        y: location.y + 1
    }
}

function moveDown(location) {
    return {
        x: location.x,
        y: location.y - 1
    }
}

function moveLeft(location) {
    return {
        x: location.x - 1,
        y: location.y
    }
}

function moveRight(location) {
    return {
        x: location.x + 1,
        y: location.y
    }
}

function getNextMoves(location) {
    return [
        moveUp(location),
        moveDown(location),
        moveLeft(location),
        moveRight(location)
    ]
}

function findPaths(location, speed) {
    const paths = [[[location]]]
    return findNextSteps(paths, speed)
}

function findNextSteps(paths, speed) {
    const newPaths = paths.slice(-1)[0].reduce((memo, path) => {
        memo.push(getNextMoves(path.slice(-1)[0]).reduce((memo, move) => {
            memo.push([
                ...path,
                move
            ])
            return memo;
        }, []))
        return memo;
    }, paths);
    
    if (speed > 0) {
        return findNextSteps(newPaths, speed - 1)
    }
    return newPaths;
}

const result = findPaths(initialLocation, 2);
console.log(JSON.stringify(result, null, 2))