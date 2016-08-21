var template = function (e) {
  var data = e.data;
  var id = data.id;
  var method = data.method;
  var args = data.args;
  var cb;
  if (id) {
    args.push(function () {
      postMessage({
        id: id,
        result: Array.prototype.slice.call(arguments)
      });
    });
  }
  this[method].apply(this, args);
};

var bundle = function (Klass) {
  var s = 'var Klass=' + Klass.toString() + ';';
  var proto = Klass.prototype;
  Object.keys(proto).forEach(function (method) {
    s += 'Klass.prototype.' + method + '=' + proto[method].toString() + ';';
  });
  return s + 'onmessage=function(e){onmessage=' + template.toString() + '.bind(new Klass(e.data[0]))}';
};

var pack = function (Klass) {
  return URL.createObjectURL(
    new Blob([bundle(Klass)], {type: 'application/javascript'})
  );
};

module.exports = pack;
