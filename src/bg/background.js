/* global topge */
/// <reference path="../../typings/jquery/jquery.d.ts"/>
/* global chrome */

var LOAD_DOMAIN = 'load_domain';

function parseUrl(source) {
	if (source) {
		var matches = source.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
		var domain = matches && matches[1];  // domain will be null if no match is found
		if (domain && domain.indexOf('.ge') !== -1) {
			domain = domain.replace("www.", "");
			return domain;
		}
	}
}

function initialize() {
	// remove old event listeners & alarm
	chrome.runtime.onMessage.removeListener(onMessage);
	chrome.tabs.onUpdated.removeListener(onTabUpdated);
	chrome.tabs.onActivated.removeListener(onTabActivated);
	chrome.alarms.onAlarm.removeListener(onAlarm);
	chrome.alarms.clear(LOAD_DOMAIN);

	if (localStorage["settings_track_active"] === "true") {
		chrome.tabs.onUpdated.addListener(onTabUpdated);
		chrome.tabs.onActivated.addListener(onTabActivated);
	} else {
		chrome.alarms.create(LOAD_DOMAIN, { periodInMinutes: 1 });
		chrome.alarms.onAlarm.addListener(onAlarm);
		
		// initial load
		load(localStorage['settings_domain']);
	}

	chrome.runtime.onMessage.addListener(onMessage);
};

function onAlarm(alarm) {
	if (alarm && alarm.name == LOAD_DOMAIN) {
		load(localStorage['settings_domain']);
	}
};

function onTabUpdated(tabId, changeInfo, tab) {
	load(parseUrl(changeInfo.url));
};

function onTabActivated(activeInfo) {
	chrome.tabs.get(activeInfo.tabId, function (tab) {
		load(parseUrl(tab.url));
	});
};

function onMessage(message) {
	if (message == 'initialize') {
		initialize();
	}
}


function load(domain) {
	if (domain) {
		topge.rating(domain).then(function (rating) {
			save(rating);
			display(rating);
		}, function () {
			save();
			display();
		});
	} else {
		save();
		display();
	}
};

function save(rating) {
	rating = rating || {};
	localStorage['hits'] = (rating.hits || 0);
	localStorage['yesterday_hits'] = (rating.yesterday_hits || 0);
	localStorage['unique'] = (rating.unique || 0);
	localStorage['yesterday_unique'] = (rating.yesterday_unique || 0);
};

function display(rating) {
	if (rating) {
		if (localStorage['settings_badge_show'] == 'unique') {
			chrome.browserAction.setBadgeText({ text: rating.unique });
		}
		else {
			chrome.browserAction.setBadgeText({ text: rating.hits });
		}
	} else {
		chrome.browserAction.setBadgeText({ text: '?' });
	}
};

initialize();
