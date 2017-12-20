-- Functional utility function extend
function extend(table1, table2)
    for k,v in pairs(table2) do
        if type(table1[k]) == 'table' and type(v) == 'table' then
            extend(table1[k], v)
        else 
            table1[k] = v
        end
    end
    return table1
end

-- Functional utility function map
function map(table, callback)
    local output = {}
    for k, value in pairs(table) do
        output[#output + 1] = callback(value)
    end
    return output
end

-- Functional utility function filter
function filter(table, predicate)
    local output = {}
    for k, value in pairs(table) do
        if predicate(value) then
            output[#output + 1] = value
        end
    end
    return output
end

-- Functional utility function concat
function concat(table1, table2)
    local output = {}
    for k, value in pairs(table1) do
        output[#output + 1] = value
    end

    for k, value in pairs(table2) do
        output[#output + 1] = value
    end
    return output
end

-- functional utility function reduce
function reduce(table, callback, state)
    local memo = state or nil
    for k, value in pairs(table) do 
        memo = callback(memo, value, k, table)
    end
    return memo
end

-- functional utility function flow
function chain(actions)
    return reduce(actions, function(action) 
        return action()
    end, {})
end

-- functional utility find
function find(table, predicate)
    for k, value in pairs(table) do
        if predicate(value) then
            return value
        end
    end
    return nil
end

-- Describes a single point on a Cartesian grid 
function getPoint(x, y)
    return {
        x = x,
        y = y,
    }
end

-- Creates a new Point one position above point
function moveUp(point)
    return {
        x = point.x,
        y = point.y + 1
    }
end

-- Creates a new Point one position below point
function moveDown(point)
    return {
        x = point.x,
        y = point.y - 1
    }
end

-- Creates a new Point one position left of point
function moveLeft(point)
    return {
        x = point.x - 1,
        y = point.y
    }
end

-- Creates a new Point one position right of point
function moveRight(point)
    return {
        x = point.x + 1,
        y = point.y
    }
end

-- Determine's cost to move to a given cell
function getMoveCost(point)
    if (point.x >= -2 and point.x <= 2) and (point.y == 0) then
        return .5
    end
    return 1 
end

-- 
function last(table)
    return table[#table]
end

-- 
function getPathStart(point, speed)
    return {extend(point, {speed=speed})}
end

function findNextMoves(path)
    local lastPoint = last(path)

    local actions = {moveUp, moveRight, moveDown, moveLeft}

    local one = map(actions, function(action) 
        return action(lastPoint)

    end)
    local two = filter(one, function(move) 
        return not pathLoopsback(path, move)
    end)

    local three = filter(two, function(move) 
        return lastPoint.speed >= getMoveCost(move) 
    end)
    return three
end

function pathLoopsback(path, move)
    return find(path, function(muv) 
        return muv.x == move.x and muv.y == move.y
    end)
end

function expandPath(path, nextMoves)
    local lastMove = last(path)

    if not nextMoves then
        nextMoves = findNextMoves(path)
    end

    return map(nextMoves, function(move) 
        return concat(
            path, 
            {extend(move, {
                speed = lastMove.speed - getMoveCost(move)
            })}
        )
    end)
end

function expandPaths(paths) 
    return reduce(paths, function(memo, path)
        local nextMoves = findNextMoves(path)
        if #nextMoves > 0 then
            return concat(memo, expandPath(path, nextMoves))
        else
            memo[#memo+1] = path
        end
        return memo
    end, {}) 
end

function getPaths(input, speed)
    if input.x and input.y then
        return getPaths(expandPath(getPathStart(input, speed)))
    end

    local results = expandPaths(input)
    -- recursive case
    if #results > #input then
        return getPaths(results)
    end
    -- base case
    return results
end

local result = getPaths(getPoint(0, 0), 2)

for k, v in pairs(result) do
    for k, v in pairs(v) do
        print(v.x, v.y, v.speed)
    end
    print(' ')
end

print('There are ' .. #result .. ' paths.')
