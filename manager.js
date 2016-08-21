var Manager = function () {
  this.workers = [];
};

Manager.prototype.add = function (worker) {

};

Manager.prototype.remove = function () {
  //var workers = this.workers;
  //workers = workers.splice(workers.indexOf(worker), 1);
};

Manager.prototype.addCouldBeWokerHandler = function (handler) {
  this.handler = handler;
};

Manager.prototype.couldBeWoker = function (Klass) {
  if (this.handler) {
    return this.handler();
  }
  return true;
};

module.exports = new Manager();
