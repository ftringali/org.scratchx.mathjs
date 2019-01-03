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
			url: 'https://api.mathjs.org/v4?expr='+encodeURIComponent(formula),
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

	function replaceAll(str, find, replace) {
		return str.replace(new RegExp(find, 'g'), replace);
	}

    ext.get_function_x_output = function(func, val, callback) {
		var formula = replaceAll(func, "x", "(1*"+val+")");
		$.ajax({
			url: 'https://api.mathjs.org/v4?expr='+encodeURIComponent(formula),
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
			url: 'https://api.mathjs.org/v4/',
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
	  xhr.setRequestHeader("Access-Control-Allow-Headers","Content-Type, X-Requested-With");
	}
	
	//thanks to https://sayamindu.github.io/scratch-extensions/text-to-speech/text_to_speech_extension.js
	ext.speak_text = function (text, lang, callback) {
		var synth = window.speechSynthesis;
		var u = new SpeechSynthesisUtterance(text.toString());
		u.lang = lang;
		u.onend = function(event) {
			if (typeof callback=="function") callback();
		};
		
		synth.speak(u);
	};

	
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'formula => %s', 'get_output', '1+1'],
            ['R', 'f( %s ), val => %s', 'get_function_output', '2x', '3'],
            ['R', 'f(x) = ( %s ) => %n', 'get_function_x_output', '2x', 3],
			['w', 'speak %s in %s', 'speak_text', 'Ciao!', 'it-IT'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('MathJS', descriptor, ext);
})({});
