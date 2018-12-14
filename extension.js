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
              url: 'http://api.mathjs.org/v4/?expr='+formula,
              dataType: 'jsonp',
              success: function( data ) {
                  // Got the data - parse it and return the output
                  output = data;
                  callback(output);
              }
        });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'formula to execute %s', 'get_output', '1+1'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Mathematical extension', descriptor, ext);
})({});
