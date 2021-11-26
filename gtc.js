requirejs.config({
    paths: {
        ko: 'knockout-3.5.1',
        jquery: 'jquery-2.1.4.min'
    }
});

requirejs(['calculator', 'ko', 'jquery'], function (calculatorConstructor, ko, $) {
    const calculator = calculatorConstructor()
    ko.applyBindings(calculator);
    calculator.handleCardsChange()
});