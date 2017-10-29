module.exports = {
  find: function (creep, find_query) {
    var results = creep.room.find(find_query);
    return _.sortBy(results, result => creep.pos.getRangeTo(result));
  },

  findWithFilter: function (creep, find_query, filter) {
    return creep.room.find(find_query, { filter: filter; } );
  },

  closest: function (creep, find_query) {
    return creep.pos.findClosestByRange(find_query);
  }
};
