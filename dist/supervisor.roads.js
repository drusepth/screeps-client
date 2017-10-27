module.exports = {
  constructEnergyRoads: function (spawnerName) {
    this.spawner = Game.spawns[spawnerName];
    this.room    = spawner.room;

    var energySources = this.energySourcesInRoom(this.room);
    for (var i = 0; i < energySources.length; i++) {
      var energySource = energySources[i];

      var pathFromSpawnerToSource = this.spawner.pos.findPathTo(energySource);
      // [{"x":21,"y":28,"dx":1,"dy":-1,"direction":2}, ...]

      for (var j = 0; j < pathFromSpawnerToSource.length; j++) {
        var pathNode = pathFromSpawnerToSource[j];

        this.room.createConstructionSite(pathNode['x'], pathNode['y'], STRUCTURE_ROAD);
      }
    }
  },

  energySourcesInRoom: function (room) {
    return room.find(FIND_SOURCES);
  }
};
