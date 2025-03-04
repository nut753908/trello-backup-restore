// note:
//   this reference exists in https://glitch.com/~trello-power-up and https://glitch.com/~trello-power-up-skeleton.
//   its license is described as MIT in package.json in the url above, but its full text may not exist.

/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON =
  "https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421";

TrelloPowerUp.initialize({
  "card-buttons": function (t, options) {
    return [
      {
        icon: BLACK_ROCKET_ICON,
        text: "sample",
      },
    ];
  },
});
