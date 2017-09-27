//Initialise two variables for the two states and assign HTML elements
var filter, listing, total, noSections = 5, noProjects = 12,  dataStatus = 0, PageLoad=0, visibleIDs = [];

//Match with Excel
var orderType=[  
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

    //show Loading screen until a time
    changeLoadingScreen(1);
    var delayMillis = 1000; //1 second

    setTimeout(function() {
        //Call for first data loading, auto calls refreshProjects
        dataLoad();    
    }, delayMillis);

    //Buttons change type  
    $("#fType").click(function() {
        filter = "type";
        refreshProjects(filter);
    });

    $("#fChronology").click(function() {
        filter = "chronology";
        refreshProjects(filter);
    });

    $(window).on("load", function() {
        // weave your magic here.
    });

    // console.log("Button toggles working");
})



//EXTERNAL FUNCTIONS

//External function to call dat loading from JSON
function dataLoad() {

    //Load local json file into local object
    $.getJSON("js/Listing.json", function(json) {
        listing = json;
        console.log("JSON has been loaded locally");
        console.log(listing);

        //Truncate invisible objects
        removeInvisible ();

        refreshProjects(filter);
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
                $(ID).append("<p><strong>" + orderChronology[i].SectionDescription + "</strong></p>");
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

    //Hide descriptions by default
    $(".thumbDescription").hide();

    //Remove extra horizontal seperators
    if (filter=="chronology") {
        $("#sep3").hide();
        $("#sep4").hide();
    }
    else {
        $("#sep3").show();
        $("#sep4").show();
    }

    //Remove loading screen
    changeLoadingScreen(0);
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
    console.log("Loading ID: " + ID);

    return ID;
}

//External function to show data in ID
function showData(entry, ID, filter) {
    var thumbPath = "", projectSub = "";

    console.log("trying to add data to " + ID);
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
    $(ID + ">.thumbsInner").append("<div class = \"overlay\"><div class = \"thumbTitle\"><h4>" + entry.ProjectName + "</h4></div><div class = \"thumbSubtitle\"><h5>" + projectSub + "</h5></div><div class = \"thumbDescription\">"  + entry.Description + "</div></div>");
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

function changeLoadingScreen(param){
    switch (param) {
        case 0:
            $(".LoadingScreen").hide();
            break;
        case 1:
            $(window).on("load", function() {
                $(".LoadingScreen").show(); 
            })
            break;
                 }
}