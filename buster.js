var manager = require('./manager');
var pack = require('./pack');

var buster = function (Klass) {
  var buster = new Buster(Klass);
  manager.add(buster);
  return buster.instanse;
};

var Buster = function (Klass) {

  if (manager.couldBeWoker(Klass)) {
    this.callbacks = {};
    this.id = 0;
    this.wrap(Klass);

    this.worker = new Worker(pack(Klass));

    var callbacks = this.callbacks;

    this.worker.onmessage = function (e) {
      var data = e.data;
      var id = data.id;
      var result = data.result;

      callbacks[id].apply(null, result);
      delete callbacks[id];
    };
  } else {
    this.bindMethods();
  }
};

Buster.prototype.wait = function (args) {
  var args = Array.prototype.slice.call(args);
  var cb = args.pop();
  if (typeof cb !== 'function') {
    return args.push(cb);
  }
  var id = this.uuid();
  this.callbacks[id] = cb;
  return {
    id: id,
    args: args
  };
};

Buster.prototype.uuid = function () {
  this.id += 1;
  return this.id;
};

Buster.prototype.wrap = function (Klass) {
  var self = this;
  this.instanse = function () {
    Klass.apply(this, arguments);
    self.worker.postMessage(Array.prototype.slice.call(arguments));
  };
  Object.keys(Klass.prototype).forEach(function (method) {
    this.instanse.prototype[method] = function () {
      var res = this.wait(arguments);
      this.worker.postMessage({
        id: res.id,
        method: method,
        args: res.args
      });
    }.bind(this);
  }, this);
};

Buster.prototype.bindMethods = function (Klass) {
  this.instanse = function () {
    Klass.apply(this, arguments);
  };
  Object.keys(Klass.prototype).forEach(function (method) {
    this.instanse[method] = method;
  }, this);
};

module.exports = buster;
