xhr = function(url, options, cb) {
	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			cb(request.responseText, null);
		}
	};

	var method = "GET";
	if (options.hasOwnProperty("method")) {
		method = options.method;
	}

	request.open(method, url, true);
	//todo POST data
	request.send();
};