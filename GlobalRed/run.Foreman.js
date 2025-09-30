/**
 * @module Foreman
 * @description Manages construction tasks within a room, starting with defensive walls.
 */
var Foreman = {
    /**
     * @function groupExits
     * @param {RoomPosition[]} exitTiles - An array of all exit tiles in a room.
     * @returns {RoomPosition[][]} An array of arrays, where each inner array is a contiguous group of exit tiles (a "gate").
     * @description Groups adjacent exit tiles together.
     */
    groupExits: function(exitTiles) {
        if (!exitTiles.length) return [];
        
        // This requires lodash, which is available in the Screeps environment.
        const sortedExits = _.sortBy(exitTiles, ['x', 'y']);
        const gates = [];
        let currentGate = [sortedExits[0]];

        for (let i = 1; i < sortedExits.length; i++) {
            const prev = sortedExits[i - 1];
            const curr = sortedExits[i];
            
            // Check if the current exit is adjacent to the previous one (not diagonally)
            if ((curr.x === prev.x && Math.abs(curr.y - prev.y) === 1) || (curr.y === prev.y && Math.abs(curr.x - prev.x) === 1)) {
                currentGate.push(curr);
            } else {
                gates.push(currentGate);
                currentGate = [curr];
            }
        }
        gates.push(currentGate); // Add the last gate
        return gates;
    },

    /**
     * @function run
     * @param {Room} room - The room to manage construction for.
     * @description Identifies all exit gates, calculates positions for a U-shaped wall structure to seal each one,
     * and places the corresponding construction sites.
     */
    run: function(room) {
        // This function will only execute once every 100 ticks to conserve CPU.
        if (Game.time % 100 !== 0) {
            return;
        }

        const allExits = room.find(FIND_EXIT);
        if (!allExits.length) {
            return;
        }

        // Group contiguous exit tiles into "gates".
        const gates = this.groupExits(allExits);

        if (gates.length > 0) {
            console.log(`[${room.name}] Foreman found ${gates.length} exit gates to wall off.`);
        }

        for (const gate of gates) {
            if (gate.length === 0) continue;

            const allWallPositions = [];

            // Determine if the gate is on a horizontal or vertical edge.
            const isHorizontal = gate[0].y === 0 || gate[0].y === 49;

            if (isHorizontal) {
                const yExit = gate[0].y;
                // Back wall is now 2 tiles from the exit.
                const yBackWall = yExit === 0 ? 2 : 47;
                const ySideWallStart = yExit === 0 ? 1 : 48;
                const yDirection = yExit === 0 ? 1 : -1;

                const minX = _.min(gate, 'x').x;
                const maxX = _.max(gate, 'x').x;

                // 1. Build the back wall, extended by 2 tiles on each side.
                for (let x = minX - 2; x <= maxX + 2; x++) {
                    allWallPositions.push(new RoomPosition(x, yBackWall, room.name));
                }

                // 2. Build the side walls to connect the extended back wall.
                // Left side wall
                for (let y = ySideWallStart; y !== yBackWall + yDirection; y += yDirection) {
                    allWallPositions.push(new RoomPosition(minX - 2, y, room.name));
                }
                // Right side wall
                for (let y = ySideWallStart; y !== yBackWall + yDirection; y += yDirection) {
                    allWallPositions.push(new RoomPosition(maxX + 2, y, room.name));
                }

            } else { // The gate is vertical.
                const xExit = gate[0].x;
                 // Back wall is now 2 tiles from the exit.
                const xBackWall = xExit === 0 ? 2 : 47;
                const xSideWallStart = xExit === 0 ? 1 : 48;
                const xDirection = xExit === 0 ? 1 : -1;

                const minY = _.min(gate, 'y').y;
                const maxY = _.max(gate, 'y').y;

                // 1. Build the back wall, extended by 2 tiles on each side.
                for (let y = minY - 2; y <= maxY + 2; y++) {
                    allWallPositions.push(new RoomPosition(xBackWall, y, room.name));
                }

                // 2. Build the side walls to connect the extended back wall.
                // Top side wall
                for (let x = xSideWallStart; x !== xBackWall + xDirection; x += xDirection) {
                    allWallPositions.push(new RoomPosition(x, minY - 2, room.name));
                }
                // Bottom side wall
                for (let x = xSideWallStart; x !== xBackWall + xDirection; x += xDirection) {
                    allWallPositions.push(new RoomPosition(x, maxY + 2, room.name));
                }
            }


            // Now, check each calculated position and place a construction site if needed.
            for (const targetPos of allWallPositions) {
                // Ensure coordinates are valid before proceeding.
                if (targetPos.x <= 0 || targetPos.x >= 49 || targetPos.y <= 0 || targetPos.y >= 49) {
                    continue;
                }
                
                // Check if the target position is buildable (not a terrain wall).
                const terrain = Game.map.getRoomTerrain(room.name).get(targetPos.x, targetPos.y);
                if (terrain === TERRAIN_MASK_WALL) {
                    continue; // Can't build on a terrain wall.
                }

                // Check for existing structures or construction sites.
                const hasExistingWall = room.lookForAt(LOOK_STRUCTURES, targetPos).some(s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART);
                const hasWallSite = room.lookForAt(LOOK_CONSTRUCTION_SITES, targetPos).some(cs => cs.structureType === STRUCTURE_WALL);

                if (!hasExistingWall && !hasWallSite) {
                    const result = room.createConstructionSite(targetPos, STRUCTURE_WALL);
                    if (result === OK) {
                        console.log(`[${room.name}] Foreman placed a wall site at (${targetPos.x}, ${targetPos.y}).`);
                    } else if (result !== ERR_FULL) { // Don't log when we just have too many sites.
                        console.log(`[${room.name}] Foreman failed to place wall at (${targetPos.x}, ${targetPos.y}) with error: ${result}`);
                    }
                }
            }
        }
    }
};

module.exports = Foreman;

