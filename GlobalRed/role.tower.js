module.exports = {

    // TOWER CODE
    defendMyRoom: function(myRoomName) {

        var hostiles = Game.rooms[myRoomName].find(FIND_HOSTILE_CREEPS);
        var towers = Game.rooms[myRoomName].find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        });

        // if there are hostiles - attack them
        if (hostiles.length > 1) { // Check if there are at least two creeps
            var username = hostiles[1].owner.username;
            Game.notify(`User ${username} spotted in room ${myRoomName}`);
            towers.forEach(tower => tower.attack(hostiles[1])); // Attack the second creep
            console.log("ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ");
            return;
        } else if (hostiles.length > 0) { // If there is only one creep
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${myRoomName}`);
            towers.forEach(tower => tower.attack(hostiles[0])); // Attack the first (and only) creep
            console.log("ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ");
            return;
        }
        // if there are no hostiles....
        if (hostiles.length === 0) {

            // ....first heal any damaged creeps
            var damagedCreeps = Game.rooms[myRoomName].find(FIND_MY_CREEPS, {
                filter: (creep) => creep.hits < creep.hitsMax
            });

            if (damagedCreeps.length) {
                towers.forEach(tower => {
                    if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > (tower.store.getCapacity(RESOURCE_ENERGY) / 2)) {
                        tower.heal(damagedCreeps[0]);
                    }
                });
                return;
            }

            //...then repair structures
            var damagedStructure = Game.rooms[myRoomName].find(FIND_STRUCTURES, {
                //get the damaged objects
                filter: (s) => ((s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
                    //filter for most functional & lower  hits first
                    || ((s.hits < s.hitsMax/30) && s.structureType == STRUCTURE_RAMPART)
                    //then list damaged ramparts
                    || ((s.hits < (Memory.goalpostRepair)) && s.structureType == STRUCTURE_WALL)
                    //then list damaged walls
                )
            });

            //if there are damaged structures...
            if (damagedStructure.length) {
                // Sort damaged structures to prioritize the most critical repairs
                damagedStructure.sort((a, b) => a.hits - b.hits);
                //...then repair them, but only if the tower has enough energy
                towers.forEach(tower => {
                    if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > (tower.store.getCapacity(RESOURCE_ENERGY)*11/20 )) {
                        tower.repair(damagedStructure[0]);
                    }
                });
                return;
            }
        }
    }
};