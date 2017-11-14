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

function findPaths(location, speed, paths) {
    // initial value of paths
    paths = paths || [[[location]]]

    return paths.slice(-1)[0].reduce((memo, path) => {
        memo.push(getNextMoves(path.slice(-1)[0]).reduce((memo, move) => {
            memo.push([
                ...path,
                move
            ])
            return memo;
        }, []))
        return memo;
    }, paths);
}

const result = findPaths(initialLocation, 2);
console.log(JSON.stringify(result, null, 2))