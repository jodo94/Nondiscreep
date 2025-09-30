/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('run.creepmanager');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleExterminator = require('role.exterminator');
var roleWarrior = require('role.warrior');
var roleClaimer = require('role.claim');
var rolePioneer = require('role.pioneer');
var tower = require('role.tower');
var roleGaurd = require('role.gaurd');
var roleMiner = require('role.miner');
var roleQuadSquad = require('role.quadsquad');
module.exports = {
 // Run the logic for each creep.
    run: function(){
        
         for (let name in Game.creeps) {
            const creep = Game.creeps[name];
            
    
            if (creep.ticksToLive == 1000 &&  (creep.memory.role =='builder' || creep.memory.role == 'harvester' || creep.memory.role == 'repairer')) {
                creep.memory.role = 'repairer';
            } else if (creep.ticksToLive == 75 &&  (creep.memory.role =='builder' || creep.memory.role == 'harvester' || creep.memory.role == 'repairer')) {
                creep.memory.role = 'upgrader';
            }
            
            
    
            // Execute the creep's role logic
            if (creep.memory.role === 'harvester') {
                roleHarvester.run(creep);
            } else if (creep.memory.role === 'miner') {
                roleMiner.run(creep);
            } else if (creep.memory.role === 'gaurd') {
                roleGaurd.run(creep);
            } else if (creep.memory.role === 'upgrader') {
                roleUpgrader.run(creep);
            } else if (creep.memory.role === 'builder') {
                roleBuilder.run(creep);
            } else if (creep.memory.role === 'repairer') {
                roleRepairer.run(creep);
            } else if (creep.memory.role === 'warrior') {
                roleWarrior.run(creep);
            } else if (creep.memory.role === 'exterminator') {
                roleExterminator.run(creep);
            } else if (creep.memory.role === 'quadsquad') {
                roleQuadSquad.run(creep);
            } else if (creep.memory.role === 'claim') {
                roleClaimer.run(creep);
            } else if (creep.memory.role === 'pioneer') {
                rolePioneer.run(creep);
            }
        }
    }
};