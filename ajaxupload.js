// ajax uploads
(function($){

	function supportAjaxUploadWithProgress() {
		return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();

		function supportFileAPI() {
			var fi = document.createElement('INPUT'); fi.type = 'file'; return 'files' in fi;
		};
		function supportAjaxUploadProgressEvents() {
			var xhr = new XMLHttpRequest(); return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
		};
		function supportFormData() {
			return !! window.FormData;
		};
	}

	$.support.ajaxupload = supportAjaxUploadWithProgress();

	if($.support.ajaxupload){
		$.event.props.push("dataTransfer");
	}

	$.xhrupload = function(files, settings) {

		if(!$.support.ajaxupload){
			return this;
		}

		var settings = $.extend({
			"action": '',
			"single": false,
			"method": 'POST',
			"params": {},

			// events
			"before": function(o){},
			"loadstart": function(){},
			"load": function(){},
			"loadend": function(){},
			"progress": function(){},
			"complete": function(){},
			"allcomplete": function(){},
			"readystatechange": function(){}
		}, settings);


		if(!files.length){
			return;
		}

		if(settings.single){

			var count    = files.length,
				uploaded = 0,
				complete = settings.complete;

				settings.complete = function(response, xhr){
					uploaded = uploaded+1;
					complete(response, xhr);
					if(uploaded<count){
						upload([files[uploaded]], settings);
					}else{
						settings.allcomplete();
					}
				};

				upload([files[0]], settings);

		} else {

			upload(files, settings);
		}

		function upload(files, settings){

			// upload all at once
			var formData = new FormData(),
				xhr      = new XMLHttpRequest();

			settings.before(settings);

			for (var i = 0, f; f = files[i]; i++) {
				formData.append("files[]", f);
			}

			for(var p in settings.params){
				formData.append(p, settings.params[p]);
			}

			// Add any event handlers here...
			xhr.upload.addEventListener("progress", function(e){
				var percent = (e.loaded / e.total)*100;
				settings.progress(percent, e);
			}, false);  
			xhr.addEventListener("loadstart", function(e){
				settings.loadstart(e);
			}, false);   
			xhr.addEventListener("load", function(e){
				settings.load(e);
			}, false);    
			xhr.addEventListener("loadend", function(e){
				settings.loadend(e);
			}, false);  
			xhr.addEventListener("error", function(e){
				settings.error(e);
			}, false);  
			xhr.addEventListener("abort", function(e){
				settings.abort(e);
			}, false);

			xhr.open(settings.method, settings.action, true);
			xhr.onreadystatechange = function() {
				
				settings.readystatechange(xhr);

				if(xhr.readyState==4){
					
					var response = xhr.responseText;

					if(settings.type=="json") {
						try{
							response = $.parseJSON(response);
						}catch(e){
							response = false;
						}
					}

					settings.complete(response, xhr);
				}
		    };
		    xhr.send(formData);
		}

	};


	$.fn.uploadOnDrag = function(options){

		if(!$.support.ajaxupload){
			return this;
		}

		return this.each(function(){

			var ele      = $(this),
				settings = $.extend({}, options);

			ele.on("drop", function(e){

				e.stopPropagation();
				e.preventDefault();
				$.xhrupload(e.dataTransfer.files, settings);

			}).on("dragover", function(e){
				e.stopPropagation();
				e.preventDefault();
			});
		});
	};

	$.fn.ajaxform = function(options){

		if(!$.support.ajaxupload){
			return this;
		}

		return this.each(function(){

			var form     = $(this),
				settings = $.extend({
					"action": form.attr("action"),
					"method": form.attr("method"),

					// events
					"loadstart": function(){},
					"load": function(){},
					"loadend": function(){},
					"progress": function(){},
					"complete": function(){},
					"readystatechange": function(){}
				}, options);

			form.on("submit", function(e){

				e.preventDefault();

				var formData = new FormData(this),
					xhr      = new XMLHttpRequest();

				formData.append("formdata", "1");

				// Add any event handlers here...
				xhr.upload.addEventListener("progress", function(e){
					var percent = (e.loaded / e.total)*100;
					settings.progress(percent, e);
				}, false);  
				xhr.addEventListener("loadstart", function(e){
					settings.loadstart(e);
				}, false);   
				xhr.addEventListener("load", function(e){
					settings.load(e);
				}, false);    
				xhr.addEventListener("loadend", function(e){
					settings.loadend(e);
				}, false);  
				xhr.addEventListener("error", function(e){
					settings.error(e);
				}, false);  
				xhr.addEventListener("abort", function(e){
					settings.abort(e);
				}, false);

				xhr.open(settings.method, settings.action, true);
				xhr.onreadystatechange = function() {
					
					settings.readystatechange(xhr);

					if(xhr.readyState==4){
						
						var response = xhr.responseText;

						if(settings.type=="json") {
							try{
								response = $.parseJSON(response);
							}catch(e){
								response = false;
							}
						}

						settings.complete(response, xhr);
					}
			    };
			    xhr.send(formData);
			});
		});
	};

})(jQuery);