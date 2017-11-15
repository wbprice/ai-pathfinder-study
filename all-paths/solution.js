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

/**
 * Given a point, returns an array containing the surrounding
 * points.
 * @param {Point} point
 * @returns {Array[Point]}
 */

function getNextMoves(point) {
    return [
        moveUp(point),
        moveDown(point),
        moveLeft(point),
        moveRight(point)
    ]
}

/**
 * Given a path, determines if it loops back on itself at any point.
 * @param {Path} path
 * @returns {Boolean}
 */

function pathLoopsBack(path) {
    const keyCounts = path.reduce((memo, point) => {
        const key = `${point.x},${point.y}`
        if (!memo[key]) {
            memo[key] = 0;
        }
        memo[key] = memo[key] + 1;
        return memo;
    }, {});

    return Object.keys(keyCounts).find(key => {
        return keyCounts[key] > 1
    });
}

/**
 * Given an array of paths, removes those that loop back on themselves.
 * @param {Array[Path]} An array of Paths
 * @returns {Array}
 */

function filterLoopbackPaths(paths) {
    return paths.filter(path => !pathLoopsBack(path));
}

/**
 * Given a Point, returns an array of Paths that describe
 * how the unit would move away from the Point
 * @param {Point} point
 * @returns {Array[Path]}
 */

function getNextPathsFromPoint(point) {
    return getNextMoves(point).map(move => [ point, move ]);
}

/**
 * Given a Path, returns an array of Paths that describe
 * how the unit would move farther from the starting point
 * @param {Path} path 
 * @returns {Array[Path]}
 */

function getNextPathsFromPath(path) {
    return filterLoopbackPaths(getNextMoves(path.slice(-1)[0])
    .map(move => [
        ...path, 
        move
    ]))
}

/**
 * Given an array of Paths, returns an array of Paths that
 * describes how the unit would move further from the starting point 
 * @param {Array[Path]} paths
 */

function getNextPathsFromPaths(paths) {
    return paths.reduce((memo, path) => {
        return [ ...memo, ...getNextPathsFromPath(path)]
    }, []);
}

/**
 * Given a starting Point, returns an array of Paths describing
 * all the routes a unit might take using a given number of moves.
 * @param {Point} input
 * @param {Number} moves
 * @returns {Array[Path]}
 */

function getPaths(input, moves) {
    if (moves <= 0) {
        return input;
    }
    return input.length ?
        getPaths(getNextPathsFromPaths(input), moves - 1) :
        getPaths(getNextPathsFromPoint(input), moves - 1)
}

console.log(getPaths(getPoint(0, 0), 2));

/*
[ [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 } ],
[ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 } ],
[ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 } ],
[ { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 } ],
[ { x: 0, y: 0 }, { x: 0, y: -1 }, { x: -1, y: -1 } ],
[ { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -1 } ],
[ { x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 } ],
[ { x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 } ],
[ { x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 } ],
[ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 } ],
[ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 } ],
[ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 } ] ]
*/
