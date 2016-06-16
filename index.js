'use strict';

class Promisie extends Promise {
	static promisify (fn, _this) {
	  if (typeof fn !== 'function') throw new TypeError('ERROR: promisify must be called with a function');
	  else {
	  	let promisified = function () {
        let args = [];
        for (var key in arguments) {
        	if (arguments.hasOwnProperty(key)) args.push(arguments[key]);
        }
        return new Promisie((resolve, reject) => {
          args.push(function(err, data) {
            if (err) reject(err);
            else resolve(data);
          });
          fn.apply(this, args);
        });
      };
	  	if (_this) return promisified.bind(_this);
      else return promisified;
	  }
  }
  static promisifyAll (mod, _this) {
  	if (mod && typeof mod === 'object') {
  		let promisified = Object.create(mod);
      promisified = Object.assign((promisified && typeof promisified === 'object') ? promisified : {}, mod);
	  	Object.keys(promisified).forEach(key => {
	  		if (typeof promisified[key] === 'function') promisified[key + 'Async'] = (_this) ? this.promisify(promisified[key]).bind(_this) : this.promisify(promisified[key]);
        if (promisified[key] && typeof promisified[key] === 'object') promisified[key] = this.promisifyAll(promisified[key], _this); 
	  	});
  		return promisified;
  	}
  	else throw new TypeError('ERROR: promisifyAll must be called with an object or array');
  }
  try (onSuccess, onFailure) {
    return this.then(data => {
      try {
        return (typeof onSuccess === 'function') ? onSuccess(data) : null;
      }
      catch (e) {
        return Promisie.reject(e);
      }
    }, e => (typeof onFailure === 'function') ? onFailure(e) : null);
  }
}

module.exports = Promisie;