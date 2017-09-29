//Global variables
var filter, listing, total, noSections = 5, noProjects = 12, visibleIDs = [];

//Match with Excel
var orderType = [  
    {  
        "SectionName":"Web",
        "SectionDescription":"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna. Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci."
    },
    {  
        "SectionName":"Product",
        "SectionDescription":"Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy. Fusce aliquet pede non pede. Suspendisse dapibus lorem pellentesque magna. Integer nulla."
    },
    {  
        "SectionName":"Graphics",
        "SectionDescription":"Donec blandit feugiat ligula. Donec hendrerit, felis et imperdiet euismod, purus ipsum pretium metus, in lacinia nulla nisl eget sapien. Donec ut est in lectus consequat consequat. Etiam eget dui. Aliquam erat volutpat. Sed at lorem in nunc porta tristique. Proin nec augue. Quisque aliquam tempor magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    },
    {  
        "SectionName":"Space",
        "SectionDescription":"Nunc ac magna. Maecenas odio dolor, vulputate vel, auctor ac, accumsan id, felis. Pellentesque cursus sagittis felis. Pellentesque porttitor, velit lacinia egestas auctor, diam eros tempus arcu, nec vulputate augue magna vel risus. Cras non magna vel ante adipiscing rhoncus. Vivamus a mi. Morbi neque. Aliquam erat volutpat. Integer ultrices lobortis eros."
    },
    {  
        "SectionName":"Others",
        "SectionDescription":"Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy. Fusce aliquet pede non pede. Suspendisse dapibus lorem pellentesque magna. Integer nulla."
    }
];
var orderChronology=[  
    {  
        "SectionName":"2017",
        "SectionDescription":"Projects done in the year 2017 at NID"
    },
    {  
        "SectionName":"2016",
        "SectionDescription":"Projects done in the year 2016 at NID"
    },
    {  
        "SectionName":"2015",
        "SectionDescription":"Prior to NID"
    }
];

//Set default filter behaviour
filter = 'type';

//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function() {

    //show Loading screen
    animateToggle(".Loading Screen", 1);

    //Have a timeout before data loading
    var delayMillis = 1000; //1 second
    setTimeout(function() {
        //Call for first data loading, callback refreshProjects with appropriate parameter
        dataLoad(refreshProjects);    
    }, delayMillis);

    //Buttons change type  
    $("#fType").click(function() {
        $("#fChronology>h2").css('color' , '');
        $("#fType>h2").css('color' , 'dodgerblue');
        filter = "type";
        refreshProjects(filter, animateToggle);
    });

    $("#fChronology").click(function() {
        $("#fChronology>h2").css('color' , 'dodgerblue');
        $("#fType>h2").css('color' , '');
        filter = "chronology";
        refreshProjects(filter, animateToggle);
    });

    // console.log("Button toggles working");
})



//EXTERNAL FUNCTIONS

//External function to call dat loading from JSON
function dataLoad(refreshCallback) {
    //Load local json file into local object
    $.getJSON("js/Listing.json", function(json) {
        listing = json;
        console.log("JSON has been loaded locally");
        console.log(listing);

        //Truncate invisible objects
        removeInvisible ();

        //Set type as default blue colour
        $("#fType>h2").css('color' , 'dodgerblue');

        //Execute callback
        refreshCallback(filter, animateToggle);
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
function refreshProjects(filter, screenRefreshCallback) {
    // Clear previously held data, if any, clear visible IDs, clear visible sidebar entries
    $(".thumbsInner").empty();
    $(".sideTitle").empty();
    $(".sideDescription").empty();
    visibleIDs=[];

    //Main variables
    var ID = "";

    // Add projects one by one
    for (i=0; i<total; i++) {
        ID = findID(listing[i], filter);
        console.log("Project loaded: " + (i + 1) + " " + listing[i].ProjectName + " at " + ID);

        //Show data of this listing
        showData (listing[i], ID, filter);
        console.log("Show data for no." + (i +1) +" done");
    }

    // Refresh sidebar

    switch (filter) {
        case "type":
            for ( i = 0; i<orderType.length; i++) {
                ID = constructID (i+1,0,"SideTitle");
                $(ID).append("<h3>" + orderType[i].SectionName + "</h3>");
                // console.log("Title of section " + (i + 1) + " added to " +ID);
                ID = constructID (i+1,0,"SideDescription");
                $(ID).append("<p>" + orderType[i].SectionDescription + "</p>");
                // console.log("Description of section " + (i + 1) + " added to " +ID);
            }
            break;
        case "chronology":
            for ( i = 0; i<orderChronology.length; i++) {
                ID = constructID (i+1, 0 , "SideTitle");
                $(ID).append("<h3>" + orderChronology[i].SectionName + "</h3>");
                ID = constructID (i+1, 0 , "SideDescription");
                $(ID).append("<p>" + orderChronology[i].SectionDescription + "</p>");
                //console.log("Description of section " + (i + 1) + " added to " +ID);
            }
            break;
                  }
    // Kill all invisible IDs as a precaution
    //console.log("IDs populated");
    console.log(visibleIDs);
    $(".thumbsOuter").hide();
    for (i = 0; i<visibleIDs.length; i++) {
        $(visibleIDs[i]).show();
    }

    //Remove extra horizontal seperators
    if (filter=="chronology") {
        $("#sep3").hide();
        $("#sep4").hide();
    }
    else {
        $("#sep3").show();
        $("#sep4").show();
    }

    //Hide descriptions by default then remove loading screen
    console.log("Default load animations");
    screenRefreshCallback(".thumbsOuter .thumbDescription",0);
    screenRefreshCallback(".LoadingScreen",0);

    //Execute animations
    console.log("trying to animate elements");
    animations();

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
function showData(entry, ID, filter) {
    var thumbPath = "", projectSub = "";

    //console.log("trying to add data to " + ID);
    thumbPath=thumbPathFind(entry);
    switch (filter) {
        case "type":
            projectSub = entry.Year;
            break;
        case "chronology":
            projectSub = entry.Type;
            break;
                  }
    $(ID + ">.thumbsInner").append("<img src=" + thumbPath + ">");
    $(ID + ">.thumbsInner").append("<div class = \"textOverlay\">" + 
                                   "<div class = \"thumbTitle\"><h4>"
                                   + entry.ProjectName
                                   + "</h4></div>"+
                                   "<div class = \"thumbSubtitle\"><h5>" 
                                   + projectSub + "</h5></div>" + 
                                   "<div class = \"thumbDescription\"><p>" + entry.Description + "</p></div>" 
                                   + "</div>"
                                  + "<div class = \"colorOverlay\"></div>");
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
function thumbPathFind(entry) {

    var thumbPath = encodeURI("projects/" + entry.Type + "/" + entry.URL + "/thumbnail.jpeg");
    // console.log("Generated path: projects/" + entry.Type + "/" + entry.URL + "/thumbnail.jpeg"); 
    return thumbPath;
}

//schedule all animations
function animations(){
    for ( i=0; i<visibleIDs.length; i++) {
        var tempID = visibleIDs[i];
        //Hover animation on thumbs
        animationHover(tempID, "fadeIn", 300);
            }
}

//Self written function to toggle on and off
function animateToggle(what, param){
    console.log("Trying to animate: " + what + ", how: " + param);
    switch (param) {
        case 0:
            $(what).fadeOut();
            break;
        case 1:
            $(what).fadeIn(); 
            break;
                 }
}

//animate thumbs on hover
function animationHover(element, animation, timeOut){
    var descID = element + " .thumbDescription";
    descID = $(descID);
    var titleID = element + " .thumbTitle";
    titleID = $(descID);
    var subID = element + " .thumbSubtitle";
    subID = $(descID);
    var defaultHeight = overlayID.css('height');
    var overlayID = element + " .colorOverlay";
    overlayID = $(overlayID);

    element= element + ">.thumbsInner";
    element = $(element);
    
    
    element.hover(
        function() {
            overlayID.css('height', '40%');
            descID.fadeIn();            
            element.addClass('animated ' + animation);        
        },
        function(){
            //wait for animation to finish before removing classes
            descID.fadeOut();
            titleID.fadeOut();
            subID.fadeOut();
            
            window.setTimeout( function(){
                overlayID.css(defaultHeight);
                element.removeClass('animated ' + animation);
            }, timeOut); 
        });
}