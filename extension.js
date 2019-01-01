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
			method: "GET",
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

    ext.get_function_output = function(formula, callback) {
		$.ajax({
			url: 'http://api.mathjs.org/v4/',
			method: "POST",
			dataType: 'jsonp',
			expr: [
			  formula.func,
			  formula.val
			],
			precision : 0
            })
            .done (function( data ) {
				// Got the data - parse it and return the output
                output = data.result;
                callback(output);
            })
            .fail(function(e){
                output = e.responseText;
				callback(output);
        });
    };
	
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'formula => %s', 'get_output', '1+1'],
            ['R', 'function ( %s ) for value %n', 'get_function_output', '2x', 1],
        ]
    };

    // Register the extension
    ScratchExtensions.register('MathJS', descriptor, ext);
})({});
