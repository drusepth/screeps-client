module.exports = {
  // TODO: use this elsewhere instead of individual functions
  optimalRoleCount: function (role) {
    if (role == 'harvester') {
      return this.optimalHarvesterCount();
    } else if (role == 'builder') {
      return this.optimalBuilderCount();
    } else if (role == 'upgrader') {
      return this.optimalUpgraderCount();
    } else if (role == 'fortifier') {
      return this.optimalFortifierCount();
    } else {
      return 0;
    }
  },

  optimalHarvesterCount: function () {
    // TODO: this should probably also incorporate:
    // * the distance each source is from dropoff, so replacements arrive right as harvesters are ready to leave
    // * the speed at which harvesters travel with & without a full load
    // * what our recent rate of harvesting vs expenditure is

    var screepsPerEnergySource = 6;
    return screepsPerEnergySource * Game.spawns['Ankov'].room.find(FIND_SOURCES).length;
  },

  optimalBuilderCount: function () {
    // TODO: this should probably also incorporate:
    // * the number of builings that need repaired right now (TBD janitor/repairman)

    var screepsPerConstruction = 1;
    return screepsPerConstruction * Game.spawns['Ankov'].room.find(FIND_CONSTRUCTION_SITES).length;
  },

  optimalUpgraderCount: function () {
    // TODO: this should probably also incorporate:
    // * the amount of stockpiled energy near excess
    return 8;
  },

  optimalFortifierCount: function () {
    // TODO: this should probably also incorporate:
    // * the amount of buildings needing fortified

    var screepsPerTower = 1;
    var currentTowers = Game.spawns['Ankov'].room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => { return structure.structureType == STRUCTURE_TOWER; }
    }).length;

    return 1 + (screepsPerTower * currentTowers);
  }
};
