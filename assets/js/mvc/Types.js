export const Types = Object.freeze({
  INT: Symbol("int"),
  STRING: Symbol("string"),
  BOOL: Symbol("bool")
});

// > x = 100
// 100
// > {x: true}
// { x: true }
// > {[x]: true}
// { '100': true }
// > {x: x}
// { x: 100 }
// > {x}
// { x: 100 }
//
// > Symbol() === Symbol()
// false
// > s = Symbol()
// Symbol()
// > s === s
// true

const identity = (x) => x

const typeOperationTable = {
  [Types.INT]: {
    deserialize: parseInt,
    serialize: (int) => int.toString()
  },
  [Types.STRING]: {
    deserialize: identity,
    serialize: identity
  },
  [Types.BOOL]: {
    deserialize: function(string) {
      if(string === 'true') return true;
      if(string === 'false') return false;
      throw new Error('invalid boolean')
    },
    serialize: (bool) => bool ? 'true' : 'false'
  }
};

export function deserialize(type, string) {
  if(!typeOperationTable[type]) {
    throw new Error('invalid type');
  }
  return typeOperationTable[type].deserialize(string);
}

export function serialize(type, string) {
  if(!typeOperationTable[type])
    throw new Error('invalid type');
  return typeOperationTable[type].serialize(string);
}

export default Types;