'use strict';
var inquirer = require('inquirer'),
  bus = require('../../core_bot/modules/bus/bus');

var activityA= '';
var varietyA = '';

var activityQ = [
    {
        type: 'list',
        name: 'activity',
        message: 'What is your activity? ',
        choices: [{
            key: 'P',
            name: 'Producer',
            value: 'Producer'
        },
        {
            key: 'C',
            name: 'Carrier',
            value: 'Carrier'
        },
        {
            key: 'W',
            name: 'Warehouse',
            value: 'Warehouse'
        },
        {
            key: 'S',
            name: 'Shop',
            value: 'Shop'
        }],
        filter: function (val) {
            return val.toLowerCase();
        }
    }
];

var varietyQ = [
    {
        type: 'list',
        name: 'variety',
        message: 'What kind of production?',
        choices: [{
            key: 'G',
            name: 'Grapes',
            value: 'Grapes'
        },
        {
            key: 'A',
            name: 'Apples',
            value: 'Apples'
        },
        {
            key: 'P',
            name: 'Pears',
            value: 'Pears'
        }],
        filter: function (val) {
            return val.toLowerCase();
        }
    }
];

var runQ = [
    {
        type: 'list',
        name: 'something',
        message: 'Do Somehting?',
        choices: [
            {
                key: 'T',
                name: 'Create Transaction',
                value: 'transaction'
            },
            {
                key: 'S',
                name: 'Get Instant Stats',
                value: 'stat'
            }],
        filter: function (val) {
            return val.toLowerCase();
        }
    }
];


var trxActVarQ =
    [{
    type: 'list',
    name: 'activity',
    message: 'Let\'s create a transaction. What do you want to do?',
    choices: [{
        key: 'P',
        name: 'produce',
        value: 'Produce'
    },
    {
        key: 'T',
        name: 'transport',
        value: 'Transport'
    },
    {
        key: 'W',
        name: 'warehouse',
        value: 'Stock'
    },
    {
        key: 'S',
        name: 'sell',
        value: 'Sell'
    }],
    filter: function (val) {
        return val.toLowerCase();
    }
},
    {
        type: 'list',
        name: 'variety',
        message: 'What kind of product?',
        choices: [{
            key: 'G',
            name: 'Grapes',
            value: 'Grapes'
        },
        {
            key: 'A',
            name: 'Apples',
            value: 'Apples'
        },
        {
            key: 'P',
            name: 'Pears',
            value: 'Pears'
        }],
        filter: function (val) {
            return val.toLowerCase();
        }
    }
];


function getActivity() {
    inquirer.prompt(activityQ).then(answers => {
        if (answers.activity === 'producer') {
            activityA = answers.activity;
            getVariety();
        }
        else {
            run();
        }
    });
}

function getVariety() {
    inquirer.prompt(varietyQ).then(answers => {
        varietyA = answers.variety;
       // configureBot();
        //run();
    });
}

function createProduction(variety) {
    var q = {
        type: 'input',
        name: 'quantity',
        message: 'What quantity do you want to produce? (0-999)',
        validate: function (value) {
            var pass = value.match(
                /^[0-9]{1,3}$/i
            );
            if (pass) {
                return true;
            }
            return 'Please enter a valid quantity';
        }
    };
    inquirer.prompt(q).then(answers => {
        var seedTrx = {
            activity : 'production',
            variety: variety,
            quantity: answers.quantity
        };
        bus.eventBus.sendEvent(TERMMGR_CTRL_CREATE_TRX, seedTrx);
        run();
    });

}


function createTransport(variety) {
    if (producedMap.size == 0) {
        run();
    }
    var transportQ = {
            type: 'list',
            name: 'transport',
            message: 'What lot do you want to transport?',
            choices: [],
            filter: function (val) {
                return val;
            }
    };


    producedMap.forEach(function (value, key) {
        if (value.variety == variety) {
            transportQ.choices.push({
                name: key + ' - variety: ' + value.variety + ' - quantity:' + value.quantity,
                value: key
            });
        }
    });
    inquirer.prompt(transportQ).then(answers => {
        var seedBiz = {
            activity: 'carrier',
            lot: producedMap.get(answers.transport)
        };
        bus.eventBus.sendEvent(TERMMGR_CTRL_CREATE_TRX, seedBiz);
        run();
    });
}


function createWarehouse(variety) {
    if (carriedMap.size == 0) {
        run();
    }
    var stockQ = {
        type: 'list',
        name: 'warehouse',
        message: 'What lot do you want to stock in warehouse?',
        choices: [],
        filter: function (val) {
            return val;
        }
    };

    carriedMap.forEach(function (value, key) {
        if (value.variety == variety) {
            stockQ.choices.push({
                name: key + ' - variety: ' + value.variety + ' - quantity:' + value.quantity,
                value: key
            });
        }
    });
    inquirer.prompt(stockQ).then(answers => {
        var seedBiz = {
            activity: 'warehouse',
            lot: carriedMap.get(answers.warehouse)
        };
        bus.eventBus.sendEvent(TERMMGR_CTRL_CREATE_TRX, seedBiz);
        run();
    });
}

function createSell(variety) {
    if (stockedMap.size == 0) {
        run();
    }
    var sellkQ = {
        type: 'list',
        name: 'sell',
        message: 'What lot do you want to sell?',
        choices: [],
        filter: function (val) {
            return val;
        }
    };

    stockedMap.forEach(function (value, key) {
        if (value.variety == variety) {
            sellQ.choices.push({
                name: key + ' - variety: ' + value.variety + ' - quantity:' + value.quantity,
                value: key
            });
        }
    });
    inquirer.prompt(sellQ).then(answers => {
        var seedBiz = {
            activity: 'sell',
            lot: stockedMap.get(answers.sell)
        };
        bus.eventBus.sendEvent(TERMMGR_CTRL_CREATE_TRX, seedBiz);
        run();
    });
}



function run() {
    inquirer.prompt(runQ).then(answers1 => {
        switch (answers1.something) {
            case 'transaction':
                // question -> quelle activité ?
                inquirer.prompt(trxActVarQ).then(answers2 => {
                    switch (answers2.activity) {
                        // si act = prod, chsoisir quantité
                        case 'produce':
                            createProduction(answers2.variety);
                            break;
                        case 'transport':
                           createTransport(answers2.variety);
                            break;
                        case 'stock':
                            createWarehouse(answers2.variety);
                            break;
                        case 'sell':
                           createSell(answers2.variety);
                            break;
                    };
                    // si autre, choisir un lot (dépendant du status)
                });
                break;
            case 'stat':
                //inquirer.prompt(trxProdVarietyQ).then(answers => { });
                break;
        }
    });
}

function configureBot() {
    bus.eventBus.sendEvent(TERMMGR_CTRL_SET_CONF, { activity: activityA, variety: varietyA });
    bus.eventBus.sendEvent(TERMMGR_CTRL_START, '');
}

function TerminalManager() {
    if (global.mode != 'LocalChain') {
        getActivity();
        configureBot();
    }
    else {
        bus.eventBus.sendEvent(TERMMGR_CTRL_SET_CONF, null);
        bus.eventBus.sendEvent(TERMMGR_CTRL_START, '');
        run();
    }
}

module.exports = TerminalManager;
