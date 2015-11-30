function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
  
    // get values from form
    var cityStr = $( "#city" ).val();
    var fromForm = $( "#street" ).val() + ", " + cityStr;

    // load streetview
    var streeviewKey = "Your Key Here";
    var streeviewLink = "https://maps.googleapis.com/maps/api/streetview?size=1200x1200&key=" + streeviewKey +"=";
    var imgLink = streeviewLink + fromForm;
    $greeting.text("You wanna look at " + fromForm + "?");
    $body.append('<img class="bgimg" src="'+ imgLink +'">');
    
    // load new york times articles head
    var nytimesKey = "Your Key Here";
    var nytimesLink = "http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + nytimesKey +"&q=";
    $.getJSON(nytimesLink + fromForm, function(data){
        $nytHeaderElem.text("New York Times Articles About " + cityStr);
        docs = data.response.docs;
        var items = [];
        $.each(docs, function( index, val ) {
            web_url = val.web_url;
            items.push( "<li class='article'>" +
                "<a href='"+ val.web_url +"'>"+ val.headline.main + "</a>" +
                "<p>"+val.snippet+"</p></li>" );
        });
        $nytElem.append(items.join(""));
    })
    // handle error. note that .error is deprecated
    .fail(function() { 
        $nytHeaderElem.text("New York Times Articles About " + cityStr + " Cannot Be Loaded.");
    });

    // load wikipedia head
    // used to handle error for jsonp request
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    wikiLink = "https://en.wikipedia.org/w/api.php?action=opensearch&callback=wikiCallback"
    $.ajax({
        url: wikiLink,
 
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
 
        // Tell YQL what we want and that we want JSON
        data: {
            search: cityStr,
            format: "json"
        },
 
        // Work with the response
        success: function( data ) {
            names = data[1];
            links = data[3];
            var items = [];
            $.each(links, function( index, val ) {
                items.push( "<li><a href='"+val+"'>"+names[index]+"</a></li>" );
            });
            $wikiElem.append(items.join(""));
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);


