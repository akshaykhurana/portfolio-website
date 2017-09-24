//Initialise two variables for the two states and assign HTML elements
var filter, listing, total, visibleIDs=[], PageLoad=0;

//Set default filter behaviour
filter = 'type';

//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function() {

    //Clear all divs while other resources load
    // $(".mainContent").hide();

    //Load local json file into local object
    $.getJSON("js/Listing.json", function(json) {
        listing = json;
        console.log("JSON has been loaded locally");
        console.log(listing);

        //Truncate invisible objects
        removeInvisible ();

        //// Add projects one by one
        for (i=0; i<total; i++) {
            var ID = findID(listing[i], filter, ID);
            console.log("Project loaded: " + (i + 1) + " " + listing[i].ProjectName + " at " + ID);

            //Show data of this listing
            showData (listing[i], ID);
            console.log("Show data " + i +" done");
        } 
        console.log("IDs populated");
        console.log(visibleIDs);



        PageLoad = 1;
    });



    //Buttons change type  
    $("#fType").click(function() {
        filter = 'type';
    });

    $("#fChronology").click(function() {
        filter = 'chronology';
        showData(filter);
    });

    console.log("Button toggles working");
});

//EXTERNAL FUNCTIONS

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

//External Function to call first load of data
function findID(entry, filter, ID) {

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

    ID = constructID (sectionNo, ProjectNo);
    visibleIDs.push(ID);
    console.log("Loading ID: " + ID);

    return ID;
}

//External function to show Data in ID
function showData(entry, ID) {
    var thumbPath = "";
    
    console.log("trying to add data to " + ID);
    thumbPath=thumbPathFind(entry);
    
    $(ID).append("<img src=" + thumbPath + ">");

    
}

//External function to construct ID names
function constructID(i, j) {
    var temp = "#S" + i + "P" + j;
    return temp;
}

//External function to create thumbnail paths
function thumbPathFind(entry) {
    
var thumbPath = encodeURI("projects/" + entry.Type + "/" + entry.URL + "/thumbnail.jpeg");
   console.log("Generated path: projects/" + entry.Type + "/" + entry.URL + "/thumbnail.jpeg"); 
return thumbPath;
}
