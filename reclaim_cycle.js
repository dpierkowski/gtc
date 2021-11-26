define(['ko'], function(ko) {

	return function (numberOfCards, cardsToBurn) {
		var that = {};

		that.startingCardCount = ko.observable(numberOfCards);
		that.turnsToReclaim = ko.observable(Math.floor(numberOfCards / 2));

		that.burnedCards = ko.observable(cardsToBurn ? cardsToBurn : 0);
		that.burnableCards = [];

		for (var i=0;i<=numberOfCards;i++) {
			that.burnableCards.push(i);
		}

		return that;
	};
});