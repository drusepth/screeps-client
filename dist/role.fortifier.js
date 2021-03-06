var constants = require('constants');

var roleFortifier = {
  run: function(creep) {
    this.creep = creep;
    this.creep.say('fortifier');

    var repairableTargets = this.structuresSortedByRepairNeed();
    if (repairableTargets.length == 0) {
      this.creep.say('Job done!');
      this.creep.memory.role = 'free-agent';
      return;
    }

    var designatedRepairTarget = repairableTargets[0]; // sorted by lowest-hits first
    if (this.outOfEnergy()) {
      this.goGetEnergy();
    }

    if (this.creep.transfer(designatedRepairTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      if (this.atEnergyCapacity()) {
        this.creep.moveTo(designatedRepairTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
      } else {
        this.goGetEnergy();
      }
    }

    if (this.creep.repair(designatedRepairTarget) == ERR_NOT_IN_RANGE) {
      if (this.atEnergyCapacity()) {
        this.creep.moveTo(designatedRepairTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
      } else {
        this.goGetEnergy();
      }
    }
  },

  closestEnergySource: function () {
    return this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  },

  outOfEnergy: function () {
    return this.creep.carry.energy == 0;
  },

  atEnergyCapacity: function () {
    return this.creep.carry.energy == this.creep.carryCapacity;
  },

  goGetEnergy: function () {
    var stockedStockpiles = this.energyStockpiles();
    if (stockedStockpiles.length > 0) {
      // TODO: assign to closest stockpile?
      var assignedStockpile = stockedStockpiles[0];
      if (this.creep.withdraw(assignedStockpile, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(assignedStockpile, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    } else {
      var sources = this.creep.room.find(FIND_SOURCES);
      if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  },

  structuresSortedByRepairNeed: function () {
    return this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_TOWER ||
          structure.structureType == STRUCTURE_WALL ||
          structure.structureType == STRUCTURE_RAMPART ||
          structure.structureType == STRUCTURE_ROAD ||
          structure.structureType == STRUCTURE_CONTAINER
        ) && (
          structure.hits   <  structure.hitsMax ||
          structure.energy <= structure.energyCapacity
        );
      }
    }).sort((s1, s2) => {
      var s1_cmp = (s1.structureType == STRUCTURE_TOWER ? s1.energy : s1.hits);
      var s2_cmp = (s2.structureType == STRUCTURE_TOWER ? s2.energy : s2.hits);

      return s1_cmp - s2_cmp;
    });
  },

  energyStockpiles: function () {
    return this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN
        ) && (
          structure.energy >= this.creep.pos.findPathTo(structure).length
        );
      }
    });
  },
};

module.exports = roleFortifier;
