// Import all necessary modules for the main loop
require('prototype.spawn')();

var Epoch = require("tick.Epoch");
var SMAER = require('SMAER');
var creepLogic = require('logic.creep')
var roomLogic = require('logic.room');

module.exports.loop = function () {
    // Clear memory for dead creeps. This should run once per tick, globally.
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    Memory.targetRoomName = 'E48S53';
    Memory.buildRoomName = 'E43S55';
    Memory.claimRoomName = 'E42S54';
    // Run the logic for each room.
    roomLogic.run();

    // Run the logic for each creep.
    creepLogic.run();

    // Run global logic here.
    Epoch.tick();
    
    
};
