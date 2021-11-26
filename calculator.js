define(['ko', 'reclaim_cycle'], function(ko, reclaimCycleConstructor) {

	return function () {
		var that = {};

		that.cardsInHand = ko.observable(10);
		that.allowableCardsInHand = [12,11,10,9,8,7,6,5,4,3,2,1,0];
		that.cardsInDiscard = ko.observable(0);
		that.allowableCardsInDiscard = [12,11,10,9,8,7,6,5,4,3,2,1,0];

		that.turnsToExhaustion = ko.observable("");
		that.relaimCycles = ko.observableArray();

		// handler for when the user changes the number of cards in hand or discard
		that.handleCardsChange = function() {
			var currentCardsInHand = that.cardsInHand();
			var currentCardsInDiscard = that.cardsInDiscard();

			that.relaimCycles.removeAll();

			while (currentCardsInHand > 1) {
				const reclaimCycle = reclaimCycleConstructor(currentCardsInHand, 0);
				that.relaimCycles.push(reclaimCycle);

				currentCardsInHand -= 1;

				if (currentCardsInDiscard > 0) {
					currentCardsInHand += currentCardsInDiscard;
					currentCardsInDiscard = 0;
				}
			}

			recalculateTurnsToExhaustion();
		}

		// handler for when the user changes the rest type or number of burned cards
		// on one of their reclaim cycles
		//
		// this keeps a list of the previous reclaim cycles and any card burning they record,
		// and subtracts the burned cards from the hand before calculating future reclaim cycles.
		that.handleReclaimChange = function() {
			var currentCardsInHand = that.cardsInHand();
			var currentCardsInDiscard = that.cardsInDiscard();			

			const oldReclaimCycles = that.relaimCycles.removeAll();

			var i = 0;
			while (currentCardsInHand > 1) {
				const oldReclaimCycle = oldReclaimCycles[i++];
				const reclaimCycle = reclaimCycleConstructor(currentCardsInHand, (oldReclaimCycle ? oldReclaimCycle.burnedCards() : 0));
				that.relaimCycles.push(reclaimCycle);

				currentCardsInHand -= 1;
				currentCardsInHand -= reclaimCycle.burnedCards();

				if (currentCardsInDiscard > 0) {
					currentCardsInHand += currentCardsInDiscard;
					currentCardsInDiscard = 0;
				}
			}

			recalculateTurnsToExhaustion();
		}

		function recalculateTurnsToExhaustion() {
			that.turnsToExhaustion(0);
			that.relaimCycles().forEach(rc => that.turnsToExhaustion(that.turnsToExhaustion() + rc.turnsToReclaim()));
		}

		return that;
	};
});