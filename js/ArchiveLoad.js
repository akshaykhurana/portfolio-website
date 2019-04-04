//Global variables
let projectFilter = 'type';


//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function () {
    //Show Loading screen
    loadingScreen.reveal();
    loadingScreen.reloadWarn();

    let listingLoad = new ExternalJSON("js/PortfolioListing.json");
    let typeDescriptions = new ExternalJSON("js/TypeDescriptions.json");
    let chronoDescriptions = new ExternalJSON("js/ChronoDescriptions.json");

    listingLoad.loadJSON();
    typeDescriptions.loadJSON();
    chronoDescriptions.loadJSON();

    //Check every 250 ms for AJAX request complpetion
    let waitLoad = setInterval(function () {
        if (listingLoad.content.length && chronoDescriptions.content.length && typeDescriptions.content.length) {
            console.log("External JSONs have been loaded");
            clearInterval(waitLoad);

            //Copy all data to new object
            console.log("Filtering Projects");
            listingDisplay.copyContent(listingLoad);
            listingDisplay.removeInvisible();

            //Start publishing items
            console.log("Publishing Projects to page");
            listingDisplay.publish();

            //Build the Descriptions and titles
            sectionDescriptors.copyData(typeDescriptions, chronoDescriptions);
            sectionDescriptors.publish();

            //Build sidebar navigation and header
            sidebar.activateFilters();

            console.log("Loading animations");
            //header.animate();
            hamburgerMenu.activate();
            loadingScreen.remove();
        }
    }, 250)
})

//EXTERNAL FUNCTIONS

//CONSTRUCTORS OR FACTORIES

function ExternalJSON(path) {
    this.content = null;
    let self = this;
    this.loadJSON = function () {
        $.getJSON(path, function (json) {
            self.content = json;
            //console.log("Loading JSON at: " + path);
        });
    }
}

let listingDisplay = {
    totalItems: 0,
    content: null,
    visibleIDs: [],
    copyContent: function (original) {
        this.total = original.content.length;
        this.content = JSON.parse(JSON.stringify(original.content));
    },
    removeInvisible: function () {
        let removed = 0;
        this.totalItems = this.content.length;
        console.log("Found " + this.totalItems + " projects in original");
        let tempArr = this.content.filter(function (item) {
            return item.GlobalVisibility === "Yes";
        });
        this.totalItems = tempArr.length;
        this.content = tempArr;
        console.log("Displaying " + this.totalItems + " projects");
    },
    publish: function () {
        // Clear previously held data, if any, and hide all IDs
        $(".card").empty();
        $(".card").hide();
        $(".sideTitle").empty();
        $(".sideDescription").empty();

        //Find IDs and publish individual item objects
        let self = this;
        this.content.forEach(function (data) {
            let currentItem = new listItem(data);
            currentItem.findFilteredID();
            self.visibleIDs.push(currentItem.ID);
            $(currentItem.ID).show();
            currentItem.publish();
            //console.log("Data shown for ID: " + currentItem.ID);
        });
    }
}

function listItem(data) {
    this.ID = null;
    this.findFilteredID = function () {
        //Local variables for storing locations to pass to constructID
        let sectionNo = 0,
            ProjectNo = 0;
        //Read filters
        switch (projectFilter) {
            case "type":
                sectionNo = data.TypeSection;
                ProjectNo = data.TypeProject;
                break;
            case "chronology":
                sectionNo = data.ChronoSection;
                ProjectNo = data.ChronoProject;
                break;
        }
        this.ID = constructID(sectionNo, ProjectNo, "thumbs");
    };
    this.publish = function () {
        let thumbPath = "",
            projectSub = "",
            number,
            projectURL;
        //console.log("trying to add data to " + this.ID);
        thumbPath = pathFind(data, "thumbs");
        projectURL = pathFind(data, "links");

        //Switch between the two filter types
        switch (projectFilter) {
            case "type":
                projectSub = data.Year;
                number = data.TypeProject;
                break;
            case "chronology":
                projectSub = data.Type;
                number = data.ChronoProject;
                break;
        }
        //Construct the card text (top half)
        $(this.ID).append("<a href = \"" +
            projectURL +
            "\"><div class = \"cardTop cardText\">" +
            "<h2 class=\"cardTitle\">" +
            data.ProjectName +
            "</h2>" +
            "<p class=\"cardSub\">" +
            projectSub + "</p><p class = \"cardDescription\">" +
            data.Description + "</p></div></a>"
        );
        //Construct the image and description (bottom half)
        $(this.ID).append("<div class = cardBottom><a href = \"" +
            projectURL +
            "\"><img class=\"cardImage\" src=" +
            thumbPath + "></a>");
    }
}

//OBJECT LITERALS
let hamburgerMenu = {
    ID: $("#hamburgerMenu"),
    checkbox: $("#hamburgerCheck")[0],
    activate: function () {
        this.checkbox.checked = false;
        this.toggle();
    },
    toggle: function () {
        console.log("Hamburger checkbox clicked");
        if (this.checkbox.checked == true) {
            this.ID.fadeIn();
        } else if (this.checkbox.checked == false) {
            this.ID.fadeOut();
        }
    }
}
let loadingScreen = {
    ID: $('#loadingScreen'),
    state: false,
    reloadWarn: function () {
        $(".reloadWarning")[0].style.opacity = 0;
        setTimeout(function () {
            $(".reloadWarning")[0].style.opacity = 1;

        }, 3000);
    },
    reveal: function () {
        this.ID.fadeIn();
        this.state = true;
        // No scroll while active
        $('body').css("overflow-y", 'hidden');
        console.log("Loading screen active");
    },
    remove: function () {
        let self = this;
        //Set a delayed timeout of 2 seconds
        setTimeout(function () {
            self.ID.fadeOut();
            self.state = false;
            //Enable scrolling
            $('body').css("overflow-y", 'auto');
            console.log("Loading screen removed");

        }, 1500);
    }
}

let sidebar = {
    activateFilters: function () {
        $("#mfType").on('click', function () {
            republish("type");
        });
        $("#mfChronology").on('click', function () {
            republish("chronology");
        });
        $("#fType").on('click', function () {
            republish("type");
        });
        $("#fChronology").on('click', function () {
            republish("chronology");
        });

        function republish(entry) {
            switch (entry) {
                case "type":
                    projectFilter = "type";
                    $("#mfType").addClass("activeFilter");
                    $("#mfChronology").removeClass("activeFilter");
                    $("#fType").addClass("activeFilter");
                    $("#fChronology").removeClass("activeFilter");
                    break;
                case "chronology":
                    projectFilter = "chronology";
                    $("#mfChronology").addClass("activeFilter");
                    $("#mfType").removeClass("activeFilter");
                    $("#fChronology").addClass("activeFilter");
                    $("#fType").removeClass("activeFilter");
                    break;
            }
            //Republish data
            listingDisplay.publish();
            sectionDescriptors.publish();
        }
        console.log("Filter toggles are now working");
    }
}

let sectionDescriptors = {
    viewType: [],
    viewChrono: [],
    total: 0,
    copyData: function (type, chrono) {
        this.viewType = type.content;
        this.viewChrono = chrono.content;
    },
    publish: function () {
        let item, currentView;
        switch (projectFilter) {
            case "type":
                currentView = this.viewType;
                break;
            case "chronology":
                currentView = this.viewChrono;
                break;
        }
        currentView.forEach(function (item) {
            let ID = constructID(item.SectionNumber, 0, "SideTitle");
            $(ID).append(item.SectionName);
            ID = constructID(item.SectionNumber, 0, "SideDescription");
            $(ID).append(item.SectionDescription);
            // console.log("Description of section " + (i + 1) + " added to " +ID);
        });
    }
}


let header = {
    //Contains non-data dependent animations
    animate: function () {
        let didScroll, lastScrollTop = 0,
            delta = 5,
            hiddenHeader = 0,
            headerHeight = $('header').outerHeight();
        $(document).scroll(function (event) {
            didScroll = true;
            //console.log("scrolling now");
        });
        setInterval(function () {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 250);

        function hasScrolled() {
            let currentScrollTop = $(this).scrollTop();
            // Make sure they scroll more than delta
            if (Math.abs(lastScrollTop - currentScrollTop) <= delta)
                return;
            // If they scrolled down and are past the navbar, add class .nav-up.
            // This is necessary so you never see what is "behind" the navbar.
            if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight && hiddenHeader == 0) {
                // Scroll Down
                //console.log("adding class");
                $('header').addClass('headerUp');
                hiddenHeader = 1;
                // Hide hamburger menu just in case it isn't
                $('#hamburgerCheck').attr('checked', false);
            } else {
                // Scroll Up
                if (currentScrollTop < lastScrollTop && hiddenHeader == 1) {
                    $('header').removeClass('headerUp');
                    hiddenHeader = 0;
                }
            }
            lastScrollTop = currentScrollTop;
        }
        console.log("Header is now animated");
    }
}

// OTHER REPEATING FUNCTIONS

//construct IDs for publishing
function constructID(i, j, classification) {
    let temp;
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
    }
}

// Construct paths for publishing
function pathFind(entry, what) {
    let path;
    switch (what) {
        case "thumbs":
            path = encodeURI("/projects/" + entry.Type + "/" + entry.URL + "/thumbnail.jpeg");
            //console.log("Generated path: " + path); 
            return path;
        case "links":
            path = encodeURI("/projects/" + entry.Type + "/" + entry.URL + "/projectPage.html");
            //console.log("Generated path: " + path); 
            return path;
    }
}
