/*
 * Quadsquad role for mixed-damage/healing combat creeps.
 * This role prioritizes healing self or allied quadsquad members before engaging.
 * Quadsquads do not target room controllers.
 * * New Feature: Staging Area. Creep waits for 2 allies in the target room before attacking.
 * * Priorities (in execution order):
 * 1. Healing self or damaged quadsquad allies (if HEAL part is present).
 * 2. Hostile creeps
 * 3. Key hostile structures
 * 4. Walls blocking path to a target (handled during movement to 2 or 3)
 */

module.exports = {

    run: function(creep) {
        if(Memory.QSMode == 1){
        // Initialize state machine
        if (!creep.memory.state) {
            creep.memory.state = 'TRAVEL';
        }

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

        /**
         * Checks for and performs healing actions.
         * Priority 1: Self-heal. Priority 2: Heal nearby damaged quadsquad allies.
         * @returns {boolean} True if a healing action was performed or is pending movement.
         */
        const performHealing = () => {
            // Creep must have a 'heal' body part.
            if (creep.getActiveBodyparts(HEAL) === 0) {
                return false; // Cannot heal, so return false.
            }

            // Priority 1: Self-heal if damaged.
            if (creep.hits < creep.hitsMax) {
                creep.say('Heal self!');
                creep.heal(creep);
                return true; // Performed a heal action.
            }

            // Priority 2: Find a damaged quadsquad ally nearby.
            const damagedAlly = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax && c.memory.role === 'quadsquad'
            });

            if (damagedAlly) {
                creep.say('Heal ally!');
                
                // Attempt direct heal first (range 1)
                if (creep.heal(damagedAlly) === ERR_NOT_IN_RANGE) {
                    // If out of range for direct heal, move closer.
                    creep.moveTo(damagedAlly, { visualizePathStyle: { stroke: '#00ff00' } });
                }
                
                // Always attempt ranged heal (range 3) regardless of movement.
                creep.rangedHeal(damagedAlly);
                return true; // Performed a heal action or movement towards ally.
            }

            return false; // No healing needed or possible, so return false.
        };

        // --- Configuration ---
        const targetRoomName = 'E43S55';

        // --- State Machine ---
        switch (creep.memory.state) {
            case 'TRAVEL':
                // Phase 1: Travel to Target Room
                if (creep.room.name !== targetRoomName) {
                    creep.say('On my way!');
                    const destination = new RoomPosition(25, 25, targetRoomName);
                    creep.moveTo(destination, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5 } });
                } else {
                    // Arrived, switch to staging
                    creep.memory.state = 'STAGE';
                    creep.say('Arrived!');
                }
                break;

            case 'STAGE':
                // Phase 2: Staging Area - Wait for 2 buddies.
                
                // Find all quadsquad creeps in the current room (excluding self)
                const quadsquadBuddies = creep.room.find(FIND_MY_CREEPS, {
                    filter: (c) => c.memory.role === 'quadsquad' && c.id !== creep.id
                });
                
                // Check if enough buddies are present to attack
                if (quadsquadBuddies.length >= 2) {
                    creep.say('Ready to attack!');
                    creep.memory.state = 'ATTACK';
                    // Fall through to ATTACK logic in the same tick
                    // Note: No 'break;' here allows immediate action.
                } else {
                    creep.say(`Staging: ${quadsquadBuddies.length}/2`);
                    // Move to the staging position (center of the room)
                    const stagingPos = new RoomPosition(25, 25, creep.room.name);
                    if (!creep.pos.isEqualTo(stagingPos)) {
                         creep.moveTo(stagingPos, { visualizePathStyle: { stroke: '#00ffff' } });
                    }
                    return; // Wait in STAGE state until count is met.
                }

            case 'ATTACK':
                // Phase 3: Attack/Heal Logic (in Target Room)
                
                // Avoid getting stuck on room edges.
                if (creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49) {
                    creep.moveTo(new RoomPosition(25, 25, creep.room.name));
                    return;
                }

                // --- Core Action Logic (Healing takes priority over attacking) ---
                const healingNeeded = performHealing();
                if (healingNeeded) {
                    return; // If we are healing, we don't need to attack this tick.
                }

                // --- Target Prioritization (Only if no healing is needed) ---

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
                
                // If no targets, return to staging position (25, 25)
                creep.say('Loiter');
                creep.moveTo(new RoomPosition(25, 25, creep.room.name), { visualizePathStyle: { stroke: '#ffaa00' } });

                break;
        }
    }
    }
};
