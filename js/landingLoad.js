//Initialise two variables for the two states and assign HTML elements
var filter, dataStatus, listing, total;

//Initialise arrays for storing page layouts t is for type c is for chronology
var t = [[]], c = [[]];

//Default listing order
var order = {
    firstItem: "Web",
    secondItem: "Product",
    thirdItem: "Space",
    fourthItem: "Graphics"
};

//Set default filter behaviour
filter = 'type';

//EXTERNAL FUNCTIONS
//External Function to call first load of data
function loadData(listing) {
    console.log("Loading all projects into arrays");


}

//External function to show Data in ID
function showData(filter) {

}

//External function to construct ID names
function constructID(i, j) {
    var temp = "#S" + (i + 1) + "P" + (j + 1);
    return temp;
}

//External function to populate arrays
function createArrays(total) {

}


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
        total = listing.length;
        console.log("Originally found " + total + " projects");

        var removed = 0;
        for (i=0; i < total; i++) {
            if (listing[i].ProjectVisible == "No") {
                listing.splice(i,1);
                removed = removed + 1;
                total = total - 1;
            }
        }
        console.log("Removed " + removed + " and displaying " + total + " projects");
        

        dataStatus = "complete";
        console.log("Page data is ready to display? " + dataStatus);

        //Sort data into arrays at first load
        loadData(listing);
        console.log("Page layout arrays are ready");

        //Show data based on default filter
        console.log("Populating elements first time");
        showData(filter);
    });

    //Buttons change type  
    $("#fType").click(function() {
        filter = 'type';
        showData(filter);
    });

    $("#fChronology").click(function() {
        filter = 'chronology';
        showData(filter);
    });

    console.log("Button toggles working");
});