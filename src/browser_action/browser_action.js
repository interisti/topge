/// <reference path="../../typings/jquery/jquery.d.ts"/>

$(document).ready(function () {

	$(".btn-settings").on("click", function () {
		$('.btn-settings, .btn-back').toggleClass('none');
		$('.rating, .settings').toggleClass('none');
	});

	$(".btn-back").on("click", function () {
		$('.btn-settings, .btn-back').toggleClass('none');
		$('.rating, .settings').toggleClass('none');
	});

	$(".btn-save").on("click", function () {
		localStorage["settings_domain"] = $("#settings_domain").val();
		localStorage["settings_track_active"] = $("#settings_track_active").prop('checked');
		localStorage["settings_display"] = $("#settings_display").val();
		
		chrome.runtime.sendMessage('initialize');
	});
	
	// settings
	$("#settings_domain").val(localStorage["settings_domain"]);
	$("#settings_track_active").prop('checked', localStorage["settings_track_active"] === "true");
	$("#settings_display").val(localStorage["settings_display"]);

	$("#hits").text((localStorage['hits'] || 0) + "(Yesterday: " + (localStorage['yesterday_hits'] || 0) + ")");
	$("#unique").text((localStorage['unique'] || 0) + "(Yesterday: " + (localStorage['yesterday_unique'] || 0) + ")");
	$("#" + (localStorage['settings_badge_show'] || 'hits') + "_radio").prop("checked", true);

	$('#preloader').addClass('none');
});