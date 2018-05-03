//Global variables
var filter, listing, selectedListing, total,
    visibleIDs = [],
    selectIDs = [],
    TypeDescriptions = [],
    ChronoDescriptions = [],
    loadingscreenActive = 0,
    carouselCounter = 1,
    carouselTotal = 7;

//Set default filter behaviour
filter = 'type';

//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function () {

    //Show Loading screen and immediately remove secondary loading screen
    animateOverlay("#firstLoader", 1);
    animateOverlay("#loadingScreen", 0);
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

    var shine1 = new Shine(document.getElementById('shiny1'), null, null, "textShadow");

    shine1.config = config;

    //Shine update function
    function update() {
        window.requestAnimationFrame(update);
        var time, speed, phase, radiusX, radiusY;
        time = new Date().getTime();
        speed = 0.00025; // 1 = 1000 rotations/s
        phase = time * speed * 2.0 * Math.PI;
        radiusX = window.innerWidth * 0.6;
        radiusY = window.innerHeight * 0.6;
        shine1.light.position.x = radiusX + radiusX * Math.cos(phase);
        shine1.light.position.y = radiusY + radiusY * Math.sin(phase * 0.7);
        shine1.draw();
    }
    update();
})

//EXTERNAL FUNCTIONS

//External function to call data loading from JSON
function dataLoad(refreshViewCallback) {
    //Load Portfolio listing into local JSON
    $.getJSON("js/PortfolioListing.json", function (json) {
        listing = json;
        console.log("JSON Listing has been loaded locally");
        //Truncate objects marked as invisible in Excel
        removeInvisible();
        //Add Selected works to a new listing variable called selectedListing
        populateSelection();
        console.log(selectIDs);
    });
    //Load Type Descriptions into local JSON
    $.getJSON("js/TypeDescriptions.json", function (json) {
        TypeDescriptions = json;
        console.log("JSON Type has been loaded locally");
        //console.log(TypeDescriptions);
    });
    //Load Chrono Descriptions into local JSON
    $.getJSON("js/ChronoDescriptions.json", function (json) {
        ChronoDescriptions = json;
        console.log("JSON Chrono has been loaded locally");
        //console.log(ChronoDescriptions);
        //Execute callback
        refreshViewCallback(filter);
    });
}

//External function to remove invisible projects
function removeInvisible() {
    var removed = 0;
    total = listing.length;
    console.log("Originally found " + total + " projects");
    for (j = 0; j < total; j++) {
        for (i = 0; i < total; i++) {
            if (listing[i].GlobalVisibility === "No") {
                // console.log("Removing: " + listing[i].ProjectName);
                listing.splice(i, 1);
                removed = removed + 1;
                total = total - 1;
                break;
            }
        }
    }
    console.log("Removed " + removed + " and displaying " + total + " projects");
    //console.log(listing);
}

//External function to slice selected projects to a new listing
function populateSelection() {
    var removed = 0,
        selectedNo = total;
    //Need to create a copy of the original becuase Javascript references rather than copies data
    selectedListing = JSON.parse(JSON.stringify(listing));
    for (j = 0; j < selectedNo; j++) {
        for (i = 0; i < selectedNo; i++) {
            if (selectedListing[i].SelectedProject === 0) {
                // console.log("Removing: " + selectedListing[i].ProjectName);
                selectedListing.splice(i, 1);
                removed = removed + 1;
                selectedNo = selectedNo - 1;
                break;
            }
        }
    }
    console.log("Removed " + removed + " and displaying " + selectedNo + " as Selected Projects");
    //console.log(selectedListing);
}

//External function to refresh project list in view
function refreshProjects(filter) {
    // Clear previously held data, if any, clear visible IDs, clear visible sidebar entries
    $(".card").empty();
    $(".sideTitle").empty();
    $(".sideDescription").empty();
    visibleIDs = [];
    //Main variables
    var ID = "";

    //Construct carousel ie selected entries Page
    //Add all projects one by one
    for (i = 0; i < total; i++) {
        ID = findSelectID(listing[i]);

        //Publish data for this carousel item
        publishCarousel(listing[i], ID);
    }
    //Construct all projects page
    // Add all project list one by one
    for (i = 0; i < total; i++) {
        ID = findID(listing[i], filter);
        // console.log("Project loaded: " + (i + 1) + " " + listing[i].ProjectName + " at " + ID);

        //Publish data of this listing
        publishDataAllPage(listing[i], ID, filter);
        // console.log("Show data for no." + (i +1) +" done");
    }
    // Refresh sidebar
    switch (filter) {
        case "type":
            for (i = 0; i < TypeDescriptions.length; i++) {
                ID = constructID(i + 1, 0, "SideTitle");
                $(ID).append("<h3>" + TypeDescriptions[i].SectionName + "</h3>");
                ID = constructID(i + 1, 0, "SideDescription");
                $(ID).append("<p>" + TypeDescriptions[i].SectionDescription + "</p>");
                // console.log("Description of section " + (i + 1) + " added to " +ID);
            }
            break;
        case "chronology":
            for (i = 0; i < ChronoDescriptions.length; i++) {
                ID = constructID(i + 1, 0, "SideTitle");
                $(ID).append("<h3>" + ChronoDescriptions[i].SectionName + "</h3>");
                ID = constructID(i + 1, 0, "SideDescription");
                $(ID).append("<p>" + ChronoDescriptions[i].SectionDescription + "</p>");
                //console.log("Description of section " + (i + 1) + " added to " +ID);
            }
            break;
    }

    $(".card").hide();
    for (i = 0; i < visibleIDs.length; i++) {
        $(visibleIDs[i]).show();
    }

    //Remove extra horizontal seperators
    if (filter == "chronology") {
        $("#S5D").hide();
        $("#S5L").hide();
    } else {
        $("#S5D").show();
        $("#S5L").show();
    }

    // Remove loading screen
    //Ensure timing for bare minimum animation
    var delayMillis = 4000; //4 second
    if (loadingscreenActive == 1) {
        setTimeout(function () {
            console.log("Calling all Overlay screen removal");
            animateOverlay("#firstLoader", 0);
            animateOverlay("#loadingScreen", 0);
            loadingscreenActive = 0;
            firstLoadActive = 0;
        }, delayMillis);
    }

    console.log("starting Carousel nav");
    //Add listener classes to Carousel nav
    $("#carouselNavLeft").on('click', function () {
        navigateCarousel(-1);
    });
    $("#carouselNavRight").on('click', function () {
        navigateCarousel(1);
    });

    console.log("Filtering and all page style switching called");
    //Animate filter buttons and set their behaviours 
    $("#fSelect").on('click', function () {
        $("#fSelect").addClass("activeFilter");
        $("#fAll").removeClass("activeFilter");
        $("#selectPage").removeClass("pageSlideLeft");
        $(".floatingFilter").addClass("turnOff");
    });
    $("#fAll").on('click', function () {
        $("#fAll").addClass("activeFilter");
        $("#fSelect").removeClass("activeFilter");
        $("#selectPage").addClass("pageSlideLeft");
        $(".floatingFilter").removeClass("turnOff");
    });
    $("#fType").on('click', function () {
        $("#fType").addClass("activeFilter");
        $("#fChronology").removeClass("activeFilter");
        filter = "type";
        refreshProjects(filter, animateOverlay);
    });
    $("#fChronology").on('click', function () {
        $("#fChronology").addClass("activeFilter");
        $("#fType").removeClass("activeFilter");
        filter = "chronology";
        refreshProjects(filter, animateOverlay);
    });
    // console.log("Button toggles working");

    //Execute non JS dependent animations
    console.log("Queueing animations");
    animations();
} //End of function

//External function to load carousel ie select page data
function findSelectID(entry, filter) {
    //Local variables for storing locations to pass to constructID
    var sNumber = entry.SelectedProject,
        ID = 0;
    if (sNumber !== 0) {
        ID = constructID(sNumber, null, "carouselItem");
        selectIDs.push(ID);
    }
    return ID;
    //console.log("Found IDs: " + ID);
}

//External function to call first load of data
function findID(entry, filter) {
    //Local variables for storing locations to pass to constructID
    var sectionNo = 0,
        ProjectNo = 0;

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

    var ID = constructID(sectionNo, ProjectNo, "thumbs");
    visibleIDs.push(ID);
    //console.log("Loading ID: " + ID);
    return ID;
}

//External functio to publish carousel data
function publishCarousel(entry, ID) {
    var selectThumbPath = "",
        projectSub = "",
        projectTitle = "",
        projectDesc = "",
        projectURL = "";
    //console.log("trying to add data to " + ID);
    selectThumbPath = pathFind(entry, "selectThumb");
    projectURL = pathFind(entry, "links");
    console.log(ID);
    projectTitle = entry.ProjectName;
    projectSub = entry.Year;
    projectDesc = entry.DescriptionLong;
    projectCatchy = entry.DescriptionCatchy;
    //Construct the actual divs
    $(ID).append("<div class=\"carouselLeft\"><img class=\"carouselImg\" src=" +
        selectThumbPath +
        "></div>" +
        "<div class=\"carouselRight\"><h4 class=\"carouselTitle\">" +
        projectTitle + "</h4><p class=\"carouselSub\">" +
        projectSub + "</p><p class=\"carouselCatchy\">" +
        projectCatchy + "<p class=\"carouselDesc\">" +
        projectDesc + "</p><a class=\"carouselLink\" href=\"" +
        projectURL + "\"><div><p>view project</p></div></a>"
    );
}
//External function to show data in ID for All Page
function publishDataAllPage(entry, ID, filter) {
    var thumbPath = "",
        projectSub = "",
        number, projectURL;
    //console.log("trying to add data to " + ID);
    thumbPath = pathFind(entry, "thumbs");
    projectURL = pathFind(entry, "links");

    //Switch between the two filter types
    switch (filter) {
        case "type":
            projectSub = entry.Year;
            number = entry.TypeProject;
            break;
        case "chronology":
            projectSub = entry.Type;
            number = entry.ChronoProject;
            break;
    }
    //Construct the card text (top half)
    $(ID).append("<a href = \"" +
        projectURL +
        "\"><div class = \"cardTop cardText\">" +
        "<h4 class=\"cardTitle\">" +
        entry.ProjectName +
        "</h4>" +
        "<p class=\"cardSub\">" +
        projectSub + "</p></div></a>"
    );
    //Construct the image and description (bottom half)
    $(ID).append("<div class = cardBottom><a href = \"" +
        projectURL +
        "\"><p class = \"cardDescription\">" +
        entry.Description + "</p><img class=\"cardImage\" src=" +
        thumbPath + "></a>");
}

//External function to construct ID names
function constructID(i, j, classification) {
    var temp = "";
    switch (classification) {
        case "thumbs":
            temp = "#S" + i + "P" + j;
            return temp;
            break;
        case "SideTitle":
            temp = "#S" + i + "T";
            return temp;
            break;
        case "SideDescription":
            temp = "#S" + i + "d";
            return temp;
            break;
        case "carouselButton":
            temp = "#cB" + i;
            return temp;
            break;
        case "carouselItem":
            temp = "#c" + i;
            return temp;
            break;
    }
}

//External function to create thumbnail paths
function pathFind(entry, what) {
    var path;
    switch (what) {
        case "thumbs":
            path = encodeURI("/projects/" + entry.Type + "/" + entry.URL + "/thumbnail.jpeg");
            //console.log("Generated path: " + path); 
            return path;
        case "links":
            path = encodeURI("/projects/" + entry.Type + "/" + entry.URL + "/projectPage.html");
            //console.log("Generated path: " + path); 
            return path;
        case "selectThumb":
            path = encodeURI("/projects/" + entry.Type + "/" + entry.URL + "/select.png");
            //console.log("Generated path: " + path); 
            return path;
    }
}

//Schedule all non JS dependent animations
function animations() {
    /*Set hover animations for cards
    $(".card").hover(function () {
        $(this).find(".cardOverlay").show().css('display', 'block');
    }, function () {
        $(this).find(".cardOverlay").hide();
    });*/

    // Hide Header on on scroll down
    var didScroll, lastScrollTop = 0,
        delta = 5,
        hiddenHeader = 0,
        headerHeight = $('header').outerHeight();

    $('main').scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        //console.log("Calling scroll function");
        var currentScrollTop = $('main').scrollTop();
        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - currentScrollTop) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight && hiddenHeader == 0) {
            // Scroll Down
            console.log("adding class");
            $('header').addClass('headerUp');
            hiddenHeader = 1;
        } else {
            // Scroll Up
            if (currentScrollTop < lastScrollTop && hiddenHeader == 1) {
                $('header').removeClass('headerUp');
                hiddenHeader = 0;
            }
        }

        lastScrollTop = currentScrollTop;
    }
}

//Self written function to navigate through Carousel
function navigateCarousel(direction) {
    var initialDotID = constructID(carouselCounter, null, "carouselButton");
    var newLeftValue = 0;

    if (direction == -1 && carouselCounter > 1) {
        carouselCounter--;
    } else if (direction == -1 && carouselCounter == 1) {
        carouselCounter = carouselTotal;
    } else if (direction == 1 && carouselCounter < carouselTotal) {
        carouselCounter++;
    } else if (direction == 1 && carouselCounter == carouselTotal) {
        carouselCounter = 1;
    } else {
        console.log(carouselCounter);
    }
    //Moving the Divs
    if (carouselCounter > 1) {
        newLeftValue = -1 * (carouselCounter - 1) + '00vw';
    } else if (carouselCounter == 7) {
        newLeftValue = 0 + '00vw';
    }
    $(".carousel").css("left", newLeftValue);
    //Dot problems
    var newDotID = constructID(carouselCounter, null, "carouselButton");
    //move the Coloured dot
    $(initialDotID).removeClass("activeStateButton");
    $(newDotID).addClass("activeStateButton");
}

//Self written function to toggle on and off
function animateOverlay(what, param) {
    //console.log("Trying to animate: " + what + ", how: " + param);
    switch (param) {
        case 0:
            $(what).addClass('overlaySlideTop');
            break;
        case 1:
            $(what).removeClass('overlaySlideTop');
            break;
    }
}
