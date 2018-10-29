const events = require('events');

const mongoose = {};
let overriddenMockedResults = {};

module.exports = mongoose;

// Mongoose-mock emits events
// when Models or Documents are created.
// This allows for the mock injector to get notifications
// about use of the mock and get a chance to access
// the mocked models and document produced.
events.EventEmitter.call(mongoose);
mongoose.__proto__ = events.EventEmitter.prototype; // jshint ignore:line

const mockResult = (name, defaults) => {
  return function(...args) {
    const filteredArgs = args.filter(v => v);

    try {
      return overriddenMockedResults[this._name][name][
        JSON.stringify(filteredArgs.length ? filteredArgs : [{}])
      ];
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.error(e);
      return defaults;
    }
  };
};

// ## Schema
const Schema = function() {
  function Model(properties) {
    const self = this;

    if (properties) {
      Object.keys(properties).forEach(function(key) {
        self[key] = properties[key];
      });
    }

    this.save = jest.fn();
    this.increment = jest.fn();
    this.remove = jest.fn();
    mongoose.emit('document', this);
  }

  Model.statics = {};
  Model.methods = {};
  Model.static = jest.fn();
  Model.method = jest.fn();
  Model.pre = jest.fn();

  Model.path = function() {
    return {
      validate: jest.fn()
    };
  };

  Model.virtual = function() {
    function SetterGetter() {
      return {
        set() {
          return new SetterGetter();
        },
        get() {
          return new SetterGetter();
        }
      };
    }

    return new SetterGetter();
  };

  Model.aggregate = jest.fn();
  Model.count = jest.fn();
  Model.create = jest.fn();
  Model.distinct = jest.fn();
  Model.ensureIndexes = jest.fn();
  Model.find = jest.fn(mockResult('find'));
  Model.findById = jest.fn(mockResult('findById'));
  Model.findByIdAndRemove = jest.fn(mockResult('findByIdAndRemove'));
  Model.findByIdAndUpdate = jest.fn(mockResult('findByIdAndUpdate'));
  Model.findOne = jest.fn(mockResult('findOne'));
  Model.findOneAndRemove = jest.fn(mockResult('findOneAndRemove'));
  Model.findOneAndUpdate = jest.fn(mockResult('findOneAndUpdate'));
  Model.geoNear = jest.fn();
  Model.geoSearch = jest.fn();
  Model.index = jest.fn();
  Model.mapReduce = jest.fn();
  Model.plugin = jest.fn();
  Model.populate = jest.fn();
  Model.remove = jest.fn();
  Model.set = jest.fn();
  Model.update = jest.fn();
  Model.where = jest.fn();

  mongoose.emit('model', Model);

  return Model;
};

// compiled models are stored in models_
// and may be retrieved by name.
const models_ = {};

function createModelFromSchema(name, Type) {
  if (Type) {
    if (Type.statics) {
      Object.keys(Type.statics).forEach(function(key) {
        Type[key] = Type.statics[key];
      });
    }

    if (Type.methods) {
      Object.keys(Type.methods).forEach(function(key) {
        Type.prototype[key] = Type.methods[key];
      });
    }

    Type._name = name;
    models_[name] = Type;
  }

  return models_[name];
}

mongoose.Schema = Schema;
mongoose.Schema.Types = { ObjectId: '' }; // Defining mongoose types as dummies.
mongoose.model = createModelFromSchema;
mongoose.mockResult = (modelName, method, result, ...args) => {
  if (!overriddenMockedResults[modelName]) {
    overriddenMockedResults[modelName] = {
      [method]: {
        [JSON.stringify(args.length ? args : [{}])]: result
      }
    };
  }

  if (!overriddenMockedResults[modelName][method]) {
    overriddenMockedResults[modelName][method] = {
      [JSON.stringify(args.length ? args : [{}])]: result
    };
  }
};
mongoose.clearMockedResults = () => {
  overriddenMockedResults = {};
};
mongoose.models = models_;
mongoose.connect = jest.fn;
