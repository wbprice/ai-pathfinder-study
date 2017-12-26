'use strict';

function makeGrassland() {
    return {
        moveCost: 1
    }
}

function makeRoad() {
    return {
        moveCost: .5
    }
}

const map = [
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}],
]

const roadCells = [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}]

map.forEach((row, x) => {
    row.forEach((cell, y)  => {
        map[y][x] = makeGrassland();
    });
});

roadCells.forEach(pair => {
    map[pair.y][pair.x] = makeRoad();
});

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

function getMoveCost(map, point) {
    const { x, y } = point;

    if (!map[y]) {
        debugger;
    }

    return map[y][x].moveCost || 1;
}

function getPathStart(point, speed) {
    return [Object.assign({}, point, {
        speed
    })]
}

function last(array) {
    return array.slice(-1)[0]
}

function isOnMap(map, point) {
    const { x, y } = point;
    return map[y] && map[y][x];
}

function findNextMoves(map, path) {
    const lastPoint = last(path)
    return [moveUp, moveRight, moveDown, moveLeft]
    .map(action => action(lastPoint))
    .filter(move => isOnMap(map, move))
    .filter(move => !pathLoopsback(path, move))
    .filter(move => lastPoint.speed >= getMoveCost(map, move))
}

function pathLoopsback(path, move) {
    return path.find(muv => {
        return muv.x === move.x && muv.y === move.y
    })
}

function expandPath(map, path, nextMoves) {
    const lastMove = last(path)

    if (!nextMoves) {
        nextMoves = findNextMoves(map, path)
    }

    return nextMoves.map(move => {
        return [
            ...path,
            Object.assign({}, move, {
                speed: lastMove.speed - getMoveCost(map, move)
            })
        ]
    })
}

function expandPaths(map, paths) {
    return paths.reduce((memo, path) => {
        const nextMoves = findNextMoves(map, path)
        if (nextMoves.length > 0) {
            return [
                ...memo,
                ...expandPath(map, path, nextMoves)
            ]
        } else {
            memo.push(path)
        }
        return memo
    }, [])
}

function getPaths(map, input, speed) {
    if (!input.length) {
        return getPaths(map, expandPath(map, getPathStart(input, speed)))
    }

    const results = expandPaths(map, input)
    // recursive case
    if (results.length > input.length) {
        return getPaths(map, results)
    }
    // base case
    return results
}

const results = getPaths(map, getPoint(2, 2), 2)
console.log(results);
console.log(`There are ${results.length} paths.`);
