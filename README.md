ajaxupload.js
=============

jQuery plugin to handle ajax forms and uploads

**Usage**

    // ajaxify a form

    $("form").ajaxform({
        // events
        "loadstart": function(){},
        "load": function(){},
        "loadend": function(){},
        "progress": function(){},
        "complete": function(){},
        "readystatechange": function(){}
    });

    // enable an element to upload a file on drag'n drop
    
    $("#myelement").uploadOnDrag({
        "action": '',
        "single": false,
        "method": 'POST',
        "params": {},

        // events
        "before": function(options){},
        "loadstart": function(){},
        "load": function(){},
        "loadend": function(){},
        "progress": function(){},
        "complete": function(){},
        "allcomplete": function(){},
        "readystatechange": function(){}
    });