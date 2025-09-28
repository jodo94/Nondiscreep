/*
 * Warrior role for melee, ranged, or mixed-damage creeps.
 * Priorities:
 * 1. Hostile creeps
 * 2. Key hostile structures
 * 3. Room controller
 */

module.exports = {

    run: function(creep) {
        
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
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            } 
            // If it's a pure ranged creep, just stay in range.
            else if (hasRanged) {
                if (!creep.pos.inRangeTo(target, 3)) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#00aaff' } });
                }
            }
        };

        // --- Configuration ---
        const targetRoomName = 'E43S55';

        // --- Phase 1: Travel to Target Room ---
        if (creep.room.name !== targetRoomName) {
            creep.say('On my way!');
            const destination = new RoomPosition(25, 25, targetRoomName);
            creep.moveTo(destination, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5 } });
            return;
        }

        // --- Phase 2: Attack Logic (in Target Room) ---
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

        // 3. Attack the Room Controller.
        const controller = creep.room.controller;
        if (controller && controller.owner) { // Make sure it's an owned controller
            creep.say('Conquer!');
            if (creep.attackController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#800080' } });
            }
            return;
        }
    }
};