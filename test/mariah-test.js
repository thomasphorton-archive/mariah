const assert = require('assert');
const Mariah = require('../mariah');

let mariah = new Mariah('123');

describe('TripID', () => {
  it('should return the trip ID', () => {
    assert.equal(mariah.getTripId(), '123');
  });
})

describe('Location', () => {
	mariah.updateLocation('xxx', 'yyy', 'zzz');

  it('should return a new latitude value', () => {
    assert.equal(mariah.getLocation().x, 'xxx');
  });

  it ('should return a new longitude value', () => {
    assert.equal(mariah.getLocation().y, 'yyy');
  });

  it ('should return a new altitude value', () => {
    assert.equal(mariah.getLocation().z, 'zzz');
  });
});

describe('Time', () => {
  it('should convert time to unix epoch', () => {
    mariah.updateTime('1995-12-17T03:24:00');
    assert.equal(mariah.getTime(), 819170640000)
  });
});