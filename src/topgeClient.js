(function (ns, $) {

	ns.rating = function (domain) {
		var dfd = jQuery.Deferred();
		console.log(domain);
		$.get("http://www.top.ge/search.php?q=" + domain)
			.success(function (response) {
				response = response.replace(/<img[^>]*>/g, ""); // clear image tags, do not try to download images
				var domainRow = $(response).find('.smcatname').closest('tr');
				if (domainRow) {
					dfd.resolve({
						hits: domainRow.find("td:nth-child(6) font.nf b").text(),
						yesterday_hits: domainRow.find("td:nth-child(6) font.sf2").text(),
						unique: domainRow.find("td:nth-child(7) font.nf b").text(),
						yesterday_unique: domainRow.find("td:nth-child(7) font.sf2").text()
					});
				}
				else {
					dfd.reject("no stats");
				}
			})
			.error(function (response) {
				dfd.reject("error downloading ...");
			});

		return dfd.promise();
	};


})(window.topge = window.topge || {}, jQuery);