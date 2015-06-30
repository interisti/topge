/// <reference path="../../typings/jquery/jquery.d.ts"/>

$(document).ready(function () {


	$('input[type=radio][name=show_setting]').change(function () {
		chrome.storage.sync.set({ 'settings': { visible: this.value } },
			function () {
			});
	});

	chrome.storage.sync.get('data', function (data) {
		var hits_text = data.data.hits + "(Yesterday: " + data.data.yesterday_hits + ")";
		$("#hits").text(hits_text);
		var unique_text = data.data.unique + "(Yesterday: " + data.data.yesterday_unique + ")";
		$("#unique").text(unique_text);

		chrome.storage.sync.get('settings', function (settings) {
			if (!settings || !settings.settings.visible) {
				$("#hits_radio").prop("checked", true);
			} else {
				$("#" + settings.settings.visible + "_radio").prop("checked", true);
			}
		});
	});

});