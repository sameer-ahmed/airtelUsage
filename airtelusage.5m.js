#!/usr/bin/env /usr/local/bin/node

const Horseman = require('/usr/local/lib/node_modules/node-horseman');
const horseman = new Horseman({phantomPath: '/usr/local/bin/phantomjs'});
const url = 'http://122.160.230.125:8080/gbod/gb_on_demand.do';

horseman
.open(url)
.value('input[id="totalQuotaInGB"]')
.then(function (t) {
 	
	var total = t;
	var balance;
	var daysRemaining;
	var dslId;

	horseman.value('input[name="balanceQuotaInGB"]')
	.then(function (b) {
		balance = b;
		horseman.value('input[name="remainingDays"]')
		.then(function (d) {
			daysRemaining = d;
			horseman.html('span[class="dslblock"]')
			.then(function (dId) {
				dslId = dId;
				setupBar(total, balance, daysRemaining, dId);
				return horseman.close();
			});
		});
	});
});

function setupBar(total, balance, daysRemaining, dslId) {
	var currentUsageRate = ((parseInt(total) - parseInt(balance)) / 30);
	var availableUsageRate = parseInt(balance) / parseInt(daysRemaining);

	if (isNaN(availableUsageRate)) {
		availableUsageRate = 0;
	}

	var currentUsageBarItem = {
		text: balance,
		dropdown: true
	};

	var remainingBalanceBarItem = {
		text: 'Remaining Balance: ' + balance	
	};

	var availableUsageRateBarItem = {
		text: 'Available Usage Rate : ' + availableUsageRate.toFixed(2) +  ' GB/day',

	};

	if (currentUsageRate  > availableUsageRate) {
		currentUsageBarItem.color = 'red';
		remainingBalanceBarItem.color = 'red';
	} else {
		availableUsageRateBarItem.color = 'green'
	}

	const bitbar = require('/usr/local/lib/node_modules/bitbar');
	bitbar([
		currentUsageBarItem,
		bitbar.sep,
		remainingBalanceBarItem,
		'Remaining Days: ' + daysRemaining,
		'Total : ' + total,
		'Current Usage Rate : ' + currentUsageRate.toFixed(2) + ' GB/day',
		availableUsageRateBarItem,
		/*'Usage deficit :' + (avgCons/avgConsShouldbe).toFixed(2),*/
		' ',
		'Dsl Id' + dslId,
		bitbar.sep,
		{
			text: 'Buy More Data',
			color: 'grey',
			href: url
		}
	]);
}
