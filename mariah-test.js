const Mariah = require('./mariah');

let mariah = new Mariah('123');

mariah.updateLocation('xxx', 'yyy', 'zzz');

mariah.updateTime('1995-12-17T03:24:00');

console.log(mariah.getTime());

console.log(mariah.getLocation());

console.log(mariah.getTripId());