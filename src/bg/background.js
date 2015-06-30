/// <reference path="../../typings/jquery/jquery.d.ts"/>
/* global chrome */

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		chrome.pageAction.show(sender.tab.id);
		sendResponse();
	});

function onInit() {
	// localStorage.requestFailureCount = 0;  // used for exponential backoff
	// startRequest({ scheduleRequest: true, showLoadingAnimation: true });
	
	// initial load
	onReload();

	chrome.alarms.create('reload', { periodInMinutes: 1 });
};

function onAlarm(alarm) {
	if (alarm && alarm.name == 'reload') {
		onReload();
	}
};

function onReload() {
	var domain = "alva.ge";
	$.get("http://www.top.ge/search.php?q=" + domain, function (response) {
		response = response.replace(/<img[^>]*>/g, ""); // clear image tags, do not try to download images
		var domainRow = $(response).find('.smcatname').closest('tr');
		if (domainRow) {
			var hits = domainRow.find("td:nth-child(6) font.nf b").text();
			var yesterday_hits = domainRow.find("td:nth-child(6) font.sf2").text();
			var unique = domainRow.find("td:nth-child(7) font.nf b").text();
			var yesterday_unique = domainRow.find("td:nth-child(7) font.sf2").text();

			chrome.storage.sync.set({'data': { 'hits': hits, 
				'yesterday_hits':yesterday_hits,
				'unique':unique,
				'yesterday_unique':yesterday_unique }}, function(){
					
				});
				
			chrome.storage.sync.get('settings', function (data) {
				if (data.data && data.data.visible == 'unique')
					chrome.browserAction.setBadgeText({ text: unique });
				else
					chrome.browserAction.setBadgeText({ text: hits });
			});
			
		}
		else {
			console.log('not found domain row');
		}
	});
};

chrome.runtime.onInstalled.addListener(onInit);
chrome.alarms.onAlarm.addListener(onAlarm);

onInit();