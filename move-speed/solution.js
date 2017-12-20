'use strict';

/**
 * Describes a single point on a Cartesian grid
 * @typedef {Object} Point
 * @property {Number} x - The x position of a point.
 * @property {Number} y - The y position of a point.
 */

/**
 * An array of points that describes the path a unit might
 * take from start to finish.
 * @typedef {Array[Point]} Path
 */

/**
 * Given an x and y coordinate, returns a Point
 * @param {Number} x
 * @param {Number} y
 * @returns {Point}
 */

function getPoint(x, y) {
    return {
        x,
        y
    }
}

/**
 * Creates a new Point one position above point
 * @param {Point} point
 * @returns {Point}
 */

function moveUp(point) {
    return {
        x: point.x,
        y: point.y + 1
    }
}

/**
 * Creates a new Point one position below point
 * @param {Point} point
 * @returns {Point}
 */

function moveDown(point) {
    return {
        x: point.x,
        y: point.y - 1
    }
}

/**
 * Creates a new Point one position to the left of point
 * @param {Point} point
 * @returns {Point}
 */

function moveLeft(point) {
    return {
        x: point.x - 1,
        y: point.y
    }
}

/**
 * Creates a new Point one position to the right of point
 * @param {Point} point
 * @returns {Point}
 */

function moveRight(point) {
    return {
        x: point.x + 1,
        y: point.y
    }
}

function getMoveCost(point) {
    if ((point.x >= -2 && point.x <= 2) && point.y === 0) {
        return .5
    }
    return 1 
}

function getPathStart(point, speed) {
    return [Object.assign({}, point, {
        speed
    })]
}

function last(array) {
    return array.slice(-1)[0]
}

function findNextMoves(path) {
    const lastPoint = last(path)
    return [moveUp, moveRight, moveDown, moveLeft]
    .map(action => action(lastPoint))
    .filter(move => !pathLoopsback(path, move))
    .filter(move => lastPoint.speed >= getMoveCost(move))
}

function pathLoopsback(path, move) {
    return path.find(muv => {
        return muv.x === move.x && muv.y === move.y
    })
}

function expandPath(path, nextMoves) {
    const lastMove = last(path)

    if (!nextMoves) {
        nextMoves = findNextMoves(path)
    }

    return nextMoves.map(move => {
        return [
            ...path,
            Object.assign({}, move, {
                speed: lastMove.speed - getMoveCost(move)
            })
        ]
    })
}

function expandPaths(paths) {
    return paths.reduce((memo, path) => {
        const nextMoves = findNextMoves(path)
        if (nextMoves.length > 0) {
            return [
                ...memo,
                ...expandPath(path, nextMoves)
            ]
        } else {
            memo.push(path)
        }
        return memo
    }, [])
}

function getPaths(input, speed) {
    if (!input.length) {
        return getPaths(expandPath(getPathStart(input, speed)))
    }

    const results = expandPaths(input)
    // recursive case
    if (results.length > input.length) {
        return getPaths(results)
    }
    // base case
    return results
}

const results = getPaths(getPoint(0, 0), 2)
console.log(results);
console.log(`There are ${results.length} paths.`);
