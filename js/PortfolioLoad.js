//Global variables
var filter, listing, total, visibleIDs = [], TypeDescriptions = [], ChronoDescriptions = [], loadingscreenActive=0;

//Set default filter behaviour
filter = 'type';

//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function () {

    //Show Loading screen
    animateToggle(".Loading Screen", 1);
    loadingscreenActive = 1;

    //Immediately load data (loading screen removed in stack)
    dataLoad(refreshProjects);

    // Shine elements
    var config = new shinejs.Config({
        numSteps: 10,
        opacity: 0.095,
        opacityPow: 2,
        offset: .10,
        offsetPow: 1.8,
        blur: 50,
        blurPow: 1.5,
        shadowRGB: new shinejs.Color(20, 20, 20)
    });  

    var shine1 = new Shine(document.getElementById('shiny1'),null,null,"textShadow");
    var shine2 = new Shine(document.getElementById('shiny2'));

    shine1.config = config;
    shine2.config = config;
    //Shine update function
    function update() {
        window.requestAnimationFrame(update);
        var time, speed, phase, radiusX, radiusY;
        time = new Date().getTime();
        speed = 0.00025;  // 1 = 1000 rotations/s
        phase = time * speed * 2.0 * Math.PI;
        radiusX = window.innerWidth * 0.6;
        radiusY = window.innerHeight * 0.6;
        shine1.light.position.x = radiusX + radiusX * Math.cos(phase);
        shine1.light.position.y = radiusY + radiusY * Math.sin(phase * 0.7);
        shine1.draw();
        shine2.light.position.x = radiusX + radiusX * Math.cos(phase);
        shine2.light.position.y = radiusY + radiusY * Math.sin(phase * 0.7);
        shine2.draw();
    }
    update();

    console.log("Filtering called");
    //Animate filter buttons and set their behaviours 
    $("#fType").on('click',function() {
        $("#fType").addClass("activeFilter");
        $("#fChronology").removeClass("activeFilter");
        filter = "type";
        refreshProjects(filter, animateToggle);
    });
    $("#fChronology").on('click',function() {
        $("#fChronology").addClass("activeFilter");
        $("#fType").removeClass("activeFilter");
        filter = "chronology";
        refreshProjects(filter, animateToggle);
    });
    // console.log("Button toggles working");

    //Execute non JS dependent animations
    console.log("Queueing animations");
    animations();
})

//EXTERNAL FUNCTIONS

//External function to call data loading from JSON
function dataLoad(refreshViewCallback) {
    //Load Portfolio listing into local JSON
    $.getJSON("js/PortfolioListing.json", function(json) {
        listing = json;
        console.log("JSON Listing has been loaded locally");
        console.log(listing);
        //Truncate objects marked as invisible in Excel
        removeInvisible ();
    });
    //Load Type Descriptions into local JSON
    $.getJSON("js/TypeDescriptions.json", function(json) {
        TypeDescriptions = json;
        console.log("JSON Type has been loaded locally");
        console.log(TypeDescriptions);
    });
    //Load Chrono Descriptions into local JSON
    $.getJSON("js/ChronoDescriptions.json", function(json) {
        ChronoDescriptions = json;
        console.log("JSON Chrono has been loaded locally");
        console.log(ChronoDescriptions);
        //Execute callback
        refreshViewCallback(filter);
    });
}

//External function to remove invisible projects
function removeInvisible () {
    var removed = 0;
    total = listing.length;
    console.log("Originally found " + total + " projects");
    for (j=0; j < total; j++) {
        for (i=0; i < total; i++) {
            if (listing[i].ProjectVisible === "No") {
                console.log("Removing: " + listing[i].ProjectName);
                listing.splice(i,1);
                removed = removed + 1;
                total=total-1;
                break;
            }
        }
    }
    console.log("Removed " + removed + " and displaying " + total + " projects");
}

//External function to refresh project list in view
function refreshProjects(filter) {
    // Clear previously held data, if any, clear visible IDs, clear visible sidebar entries
    $(".card").empty();
    $(".sideTitle").empty();
    $(".sideDescription").empty();
    visibleIDs=[];
    //Main variables
    var ID = "";

    // Add projects one by one
    for (i=0; i<total; i++) {
        ID = findID(listing[i], filter);
        // console.log("Project loaded: " + (i + 1) + " " + listing[i].ProjectName + " at " + ID);

        //Publish data of this listing
        publishData (listing[i], ID, filter);
        // console.log("Show data for no." + (i +1) +" done");
    }
    // Refresh sidebar
    switch (filter) {
        case "type":
            for ( i = 0; i<TypeDescriptions.length; i++) {
                ID = constructID (i+1,0,"SideTitle");
                $(ID).append("<h3>" + TypeDescriptions[i].SectionName + "</h3>");
                ID = constructID (i+1, 0 , "SideDescription");
                $(ID).append("<p>" + TypeDescriptions[i].SectionDescription + "</p>");
                // console.log("Description of section " + (i + 1) + " added to " +ID);
            }
            break;
        case "chronology":
            for ( i = 0; i<ChronoDescriptions.length; i++) {
                ID = constructID (i+1, 0 , "SideTitle");
                $(ID).append("<h3>" + ChronoDescriptions[i].SectionName + "</h3>");
                ID = constructID (i+1, 0 , "SideDescription");
                $(ID).append("<p>" + ChronoDescriptions[i].SectionDescription + "</p>");
                //console.log("Description of section " + (i + 1) + " added to " +ID);
            }
            break;
    }

    $(".cardDiv").hide();
    for (i = 0; i<visibleIDs.length; i++) {
        $(visibleIDs[i]).show();
    }

    //Remove extra horizontal seperators
    if (filter=="chronology") {
        $("#Sep3").hide();
        $("#Sep4").hide();
        $("#S4").hide();
    }
    else {
        $("#Sep3").show();
        $("#Sep4").show();
    }

    // Remove loading screen
    //Ensure timing for bare minimum animation
    var delayMillis = 4000; //4 second
    if (loadingscreenActive==1) {setTimeout(function() {
        console.log("Calling Loading screen removal");
        animateToggle(".LoadingScreen",0);
        loadingscreenActive=0;
    }, delayMillis);}


} //End of function

//External function to call first load of data
function findID(entry, filter) {
    //Local variables for storing locations to pass to constructID
    var sectionNo = 0, ProjectNo = 0;

    //Read filters
    switch (filter) {
        case "type":
            sectionNo = entry.TypeSection;
            ProjectNo = entry.TypeProject;       
            break;
        case "chronology":
            sectionNo = entry.ChronoSection;
            ProjectNo = entry.ChronoProject;
            break;
    }

    var ID = constructID (sectionNo, ProjectNo, "thumbs");
    visibleIDs.push(ID);
    //console.log("Loading ID: " + ID);

    return ID;
}

//External function to show data in ID
function publishData(entry, ID, filter) {
    var thumbPath = "", projectSub = "", number, projectURL;

    //console.log("trying to add data to " + ID);
    thumbPath = pathFind(entry, "thumbs");
    projectURL = pathFind(entry, "links");

    switch (filter) {
        case "type":
            projectSub = entry.Year;
            number=entry.TypeProject;
            break;
        case "chronology":
            projectSub = entry.Type;
            number=entry.ChronoProject;
            break;
    }
    //Construct image path. Image will decide height of div
    $(ID + ">.card").append("<img class=\"card-img\" src=" 
                            + thumbPath 
                            + ">");
    //Construct the always on text overlay
    $(ID + ">.card").append("<a href = \""
                            + projectURL
                            + "\"><div class = \"card-img-overlay\">" 
                            + "<h4 class=\"card-title card-project\">"
                            + entry.ProjectName
                            + "</h4>"
                            + "<p class=\"card-text card-subtitle\">" 
                            + projectSub + "</p>"
                            + "<p class=\"card-text card-number\">" 
                            + number + "</p></div></a>"
                           );
    //Construct the hovermode only description
    $(ID + ">.card").append("<a href = \""
                            + projectURL
                            + "\"><div class = \"card-img-overlay hoverMode\">"  
                            + "<p class = \"card-text card-description\">" 
                            + entry.Description + "</p></div></a>");
}

//External function to construct ID names
function constructID(i, j, classification) {
    var temp = "";

    switch(classification) {
        case "thumbs":
            temp = "#S" + i + "P" + j;
            return temp;  
            break;
        case "SideTitle":
            temp = "#S" + i + "T";
            return temp;  
            break;
        case "SideDescription":
            temp = "#S" + i + "D";
            return temp;  
            break;
    }
}

//External function to create thumbnail paths
function pathFind(entry, what) {
    var path;

    switch(what) {
        case "thumbs":
            path = encodeURI("projects/" + entry.Type + "/" + entry.URL + "/thumbnail.jpeg");
            //  console.log("Generated path: projects/" + entry.Type + "/" + entry.URL + "/thumbnail.jpeg"); 
            return path;
        case "links":
            path = encodeURI("projects/" + entry.Type + "/" + entry.URL + "/projectPage.html");
            //  console.log("Generated path: projects/" + entry.Type + "/" + entry.URL + "/projectPage.html"); 
            return path;
    }
}

//Schedule all non JS dependent animations
function animations(){
    //Set hover animations for cards
    $(".card").hover(function(){
        $(this).find(".hoverMode").show();
        $(this).find(".hoverMode").addClass('animated slideInUp');
    }, function(){
        $(this).find(".hoverMode").hide();
    });
}

//Self written function to toggle on and off
function animateToggle(what, param){
    //console.log("Trying to animate: " + what + ", how: " + param);
    switch (param) {
        case 0:
            $(what).fadeOut();
            break;
        case 1:
            $(what).fadeIn(); 
            break;
    }
}
