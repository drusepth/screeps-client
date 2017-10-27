var constants     = require('constants');

var roleHarvester = require('role.harvester');
var roleBuilder   = require('role.builder');
var roleUpgrader  = require('role.upgrader');
var roleFortifier  = require('role.fortifier');
var roleFreeAgent = require('role.free_agent');

var serviceMemory     = require('service.memory');
var servicePopulation = require('service.population');
var serviceTagger     = require('service.tagger');
var serviceStats      = require('service.stats');
var serviceDecorator  = require('service.map_decorator');

var supervisorRoads   = require('supervisor.roads');

module.exports.loop = function () {
    // Clear memory storage for any since-deceased screeps
    serviceMemory.clearDeadScreepMemory();

    // Bring the fleet up to optimal population levels
    servicePopulation.decideWhatToSpawn();

    // Tag every screep with a role-unique ID:
    serviceTagger.tagEachRole();

    // Display spawning info next to our spawn
    serviceDecorator.displaySpawningCreep();

    if (undefined === Memory.rooms) {
      Memory.rooms = {};
    }
    if (undefined === Memory.rooms['Ankov']) {
      Memory.rooms['Ankov'] = {};
    }
    if (undefined === Memory.rooms['Ankov']['roadsPlanned']) {
      Memory.rooms['Ankov']['roadsPlanned'] = false;
    }

    if (Memory.rooms['Ankov']['roadsPlanned'] === false) {
      console.log('Planning roads for Ankov');
      supervisorRoads.constructEnergyRoads('Ankov');
    } else {
      console.log('Roads already planned');
    }

    // Run creep logic
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'fortifier') {
            roleFortifier.run(creep);
        }
        if(creep.memory.role == 'free-agent') {
            roleFreeAgent.run(creep);
        }
    }

    // Print a summary of the world after this tick:
    serviceStats.printRoleCounts();
}
