/*
 * Warrior role for melee, ranged, or mixed-damage creeps.
 * Now with the ability to attack walls that block its path in the target room.
 * Priorities:
 * 1. Hostile creeps
 * 2. Key hostile structures
 * 3. Room controller
 * 4. Walls blocking path to a target
 */

module.exports = {

    run: function(creep) {
        
        /**
         * Moves the creep towards a target, attacking walls if the path is blocked.
         * This function should be used in place of creep.moveTo for combat movement.
         * @param {Creep} creep The creep to move.
         * @param {RoomPosition|{pos: RoomPosition}} target The target to move towards.
         * @param {object} [opts] Options to pass to creep.moveTo.
         */
        const moveToAndAttackWalls = (creep, target, opts) => {
            // First, attempt to move to the target.
            const moveResult = creep.moveTo(target, opts);

            // If a path exists, ensure we are not locked onto a wall from a previous tick.
            if (moveResult === OK || moveResult === ERR_TIRED) {
                delete creep.memory.wallToBreak;
                return;
            }

            if (moveResult === ERR_NO_PATH) {
                // Path is blocked. We need to decide which wall to attack.

                // Only creeps with ATTACK parts should attempt to breach walls.
                if (creep.getActiveBodyparts(ATTACK) === 0) {
                    return; // Do nothing if we can't attack.
                }

                // Step 1: Check if we are already targeting a wall and stick to it.
                if (creep.memory.wallToBreak) {
                    const designatedWall = Game.getObjectById(creep.memory.wallToBreak);
                    if (designatedWall) {
                        creep.say('Persist!');
                        if (creep.attack(designatedWall) === ERR_NOT_IN_RANGE) {
                             creep.moveTo(designatedWall); // Move closer if needed
                        }
                        return; // Stick to the current target wall.
                    } else {
                        // The wall was destroyed, clear memory to find a new one.
                        delete creep.memory.wallToBreak;
                    }
                }

                // Step 2: If not targeting a wall, find the weakest one blocking the way.
                creep.say('Breaching!');
                
                // Find an ideal path to determine the general direction and choke point.
                const path = creep.pos.findPathTo(target, { 
                    ignoreDestructibleStructures: true,
                    maxOps: 500,
                    range: 1
                });
                
                if (path.length > 0) {
                    // The first step of the ideal path is our choke point.
                    const chokePointPos = new RoomPosition(path[0].x, path[0].y, creep.room.name);

                    // Find all walls and ramparts in a 3x3 area around the choke point.
                    const nearbyObstacles = creep.room.lookForAtArea(LOOK_STRUCTURES,
                        Math.max(0, chokePointPos.y - 1), // top
                        Math.max(0, chokePointPos.x - 1), // left
                        Math.min(49, chokePointPos.y + 1), // bottom
                        Math.min(49, chokePointPos.x + 1), // right
                        true // asArray
                    ).map(result => result.structure)
                     .filter(s => s.structureType === STRUCTURE_WALL || (s.structureType === STRUCTURE_RAMPART && !s.my));

                    // Also consider walls directly adjacent to the creep.
                    const adjacentObstacles = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType === STRUCTURE_WALL || (s.structureType === STRUCTURE_RAMPART && !s.my)
                    });

                    // Combine the lists and remove duplicates.
                    const allObstacles = _.union(nearbyObstacles, adjacentObstacles);

                    if (allObstacles.length > 0) {
                        // Find the weakest structure among all identified obstacles.
                        const weakestWall = _.min(allObstacles, s => s.hits);
                        
                        if (weakestWall) {
                            // Set this as the new target wall and attack it.
                            creep.memory.wallToBreak = weakestWall.id;
                            creep.attack(weakestWall);
                            if (!creep.pos.isNearTo(weakestWall)) {
                                creep.moveTo(weakestWall);
                            }
                        }
                    }
                }
            }
        };

        /**
         * Handles the core combat logic for any target.
         * @param {RoomObject} target The creep or structure to engage.
         */
        const performAttack = (target) => {
            const hasRanged = creep.getActiveBodyparts(RANGED_ATTACK) > 0;
            const hasMelee = creep.getActiveBodyparts(ATTACK) > 0;

            // Always use ranged attack if available and in range.
            if (hasRanged) {
                creep.rangedAttack(target);
            }

            // Prioritize moving into melee range if the creep has ATTACK parts.
            if (hasMelee) {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    moveToAndAttackWalls(creep, target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } 
            // If it's a pure ranged creep, just stay in range.
            else if (hasRanged) {
                if (!creep.pos.inRangeTo(target, 3)) {
                    // Ranged creeps will move but not attack walls as per logic in moveToAndAttackWalls.
                    moveToAndAttackWalls(creep, target, { visualizePathStyle: { stroke: '#00aaff' } });
                }
            }
        };

        // --- Configuration ---
        const targetRoomName = 'E43S55';

        // --- Phase 1: Travel to Target Room ---
        if (creep.room.name !== targetRoomName) {
            creep.say('On my way!');
            const destination = new RoomPosition(25, 25, targetRoomName);
            // Use the standard moveTo for inter-room travel; no need to attack walls in transit.
            creep.moveTo(destination, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5 } });
            return;
        }

        // --- Phase 2: Attack Logic (in Target Room) ---
        // Avoid getting stuck on room edges.
        if (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49) {
            creep.moveTo(new RoomPosition(25, 25, creep.room.name));
            return;
        }
        
        // --- Target Prioritization ---

        // 1. Attack hostile creeps.
        const hostileCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            creep.say('Engage!');
            performAttack(hostileCreep);
            return;
        }

        // 2. Attack key hostile structures.
        const hostileStructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (s) => s.structureType !== STRUCTURE_CONTROLLER &&
                           s.structureType !== STRUCTURE_WALL &&
                           s.structureType !== STRUCTURE_RAMPART
        });
        if (hostileStructure) {
            creep.say('Demolish!');
            performAttack(hostileStructure);
            return;
        }

        // 3. Attack or Claim the Room Controller.
        const controller = creep.room.controller;
        if (controller && controller.owner && !controller.my) { // Make sure it's an enemy-owned controller
            creep.say('Conquer!');
            if (creep.attackController(controller) === ERR_NOT_IN_RANGE) {
                moveToAndAttackWalls(creep, controller, { visualizePathStyle: { stroke: '#800080' } });
            }
            return;
        }
        
        else if (controller && !controller.owner && !controller.my) { // Handle unowned controllers.
            // Only attempt to claim if the creep has CLAIM parts.
            if (creep.getActiveBodyparts(CLAIM) > 0) {
                creep.say('CLAIM!');
                 if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
                    // moveToAndAttackWalls is safe here. If a claimer has no ATTACK parts,
                    // it will just attempt to move and won't attack walls if blocked.
                    moveToAndAttackWalls(creep, controller, { visualizePathStyle: { stroke: '#ffff00' } });
                }
            }
        }
    }
};

