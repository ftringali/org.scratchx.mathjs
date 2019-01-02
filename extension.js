(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_output = function(formula, callback) {
        // Make an AJAX call to the MathJS API
		$.ajax({
			//http://api.mathjs.org/v4/?expr=2*(7-3)
			url: 'http://api.mathjs.org/v4?expr='+encodeURIComponent(formula),
			method: 'GET',
			dataType: 'text'
            })
            .done (function( data ) {
				// Got the data - parse it and return the output
                output = data;
                callback(output);
            })
            .fail(function(e){
                output = e.responseText;
				callback(output);
        });
    };

    ext.get_function_x_output = function(func, val, callback) {
		var formula = func.replace("x", val);
		$.ajax({
			url: 'http://api.mathjs.org/v4?expr='+encodeURIComponent(formula),
			method: 'GET',
			dataType: 'text'
            })
            .done (function( data ) {
                output = data;
                callback(output);
            })
            .fail(function(e){
                output = e.responseText;
				callback(output);
        });
    };

    ext.get_function_output = function(func, val, callback) {
		$.ajax({
			url: 'http://api.mathjs.org/v4/',
			method: 'POST',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			data: {
				precision: 0,
				expr: [
					'"f(x) = '+func+'"',
					'"f('+val+')"'
				]
			},
			beforeSend: setHeader
		}).done(function(data) {
			sdata = JSON.stringify(data);
			output = sdata;
			//output = data['result'][1];
			//output = output + " (" + data['error'] + ")"
			callback(output);
		}).fail(function(jqXHR, textStatus) {
			output = textStatus;
			callback(output);
		});
    };
	
	function setHeader(xhr) {
	  xhr.setRequestHeader("Access-Control-Allow-Origin","*");
	  xhr.setRequestHeader("Access-Control-Allow-Headers","*");
	}
	
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'formula => %s', 'get_output', '1+1'],
            ['R', 'function ( %s ) for value %s', 'get_function_output', '2x', '3'],
            ['R', 'function X ( %s ) for value %n', 'get_function_x_output', '2x', 3],
        ]
    };

    // Register the extension
    ScratchExtensions.register('MathJS', descriptor, ext);
})({});
