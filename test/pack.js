var pack = require('../pack');

describe('pack simple class', function () {
  var Cat = function () {
    this.fat = 10;
  };
  Cat.prototype.eat = function (food, cb) {
    this.fat += food;
    cb(this.fat);
  };
  Cat.prototype.fitness = function (cb) {
    cb(--this.fat);
  };

  it('pack test', function () {
    var s = pack(Cat);
    throw s;
  });
});
