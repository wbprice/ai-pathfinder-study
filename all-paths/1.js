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

function getNextPathSet(pathSet) {
    return pathSet.map(path => getNextPaths(path));
}

function getNextPathsFromPoint(point) {
    return getNextMoves(point).map(move => [ point, move ]);
}

function getNextPathsFromPath(path) {
    return getNextMoves(path.slice(-1)[0]).map(move => [...path, move]);
}

const nextPaths = getNextPathsFromPoint(initialLocation);
console.log(nextPaths);

const aNextPath = getNextPathsFromPath(nextPaths[0])
console.log(aNextPath);