//Global variables

//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function () {
    //Is this the first visit to the page?
    loadingScreen.repeatVisit = window.localStorage.getItem('repeatVisit');

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
            listingShowcase.copyContent(listingLoad);
            listingShowcase.removeInvisible();

            //Start publishing items
            console.log("Publishing Projects to page");
            listingShowcase.publish();
            console.log("Loading animations");
            header.animate();
            hamburgerMenu.activate();
            loadingScreen.remove();
        }
    }, 250)
})

//EXTERNAL FUNCTIONS

//Constructors/Factories

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

let listingShowcase = {
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
            return item.SelectedProject > 0;
        });
        this.totalItems = tempArr.length;
        this.content = tempArr;

        console.log("Displaying " + this.totalItems + " projects");
    },
    publish: function () {
        // Clear previously held data, if any, and hide all IDs
        $(".showcaseCard").empty();
        $(".showcaseCard").hide();

        //Find IDs and publish individual objects
        let self = this;
        this.content.forEach(function (data) {
            let currentItem = new listItem(data);
            currentItem.findID();
            self.visibleIDs.push(currentItem.ID);
            $(currentItem.ID).show();
            currentItem.publish();
            //console.log("Data shown for ID: " + currentItem.ID);
        });
    }
}

function listItem(data) {
    this.ID = null;
    this.findID = function () {
            this.ID = "#s" + data.SelectedProject;
        },
        this.publish = function () {
            let thumbPath = "",
                projectSub = "",
                projectTitle = "",
                projectDesc = "",
                projectURL = "";
            //console.log("trying to add data to " + ID);
            selectThumbPath = pathFind(data, "selectThumb");
            projectURL = pathFind(data, "links");
            //console.log(projectURL);
            //Construct the actual divs
            $(this.ID).append("<div class=\"showcaseLeft\"><img class=\"showcaseImg\" src=" +
                selectThumbPath +
                "></div>" +
                "<div class=\"showcaseRight\"><h2 class=\"showcaseTitle\">" +
                data.ProjectName + "</h2><p class=\"showcaseSub\">" +
                data.Year + "</p><p class=\"showcaseCatchy\">" +
                data.DescriptionCatchy + "<p class=\"showcaseDesc\">" +
                data.DescriptionLong + "</p><a class=\"showcaseLink\" href=\"" +
                projectURL + "\"><p>view project</p></a>");
        };
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
    repeatVisit: "no",
    reloadWarn: function () {
        $(".reloadWarning")[0].style.opacity = 0;
        setTimeout(function () {
            $(".reloadWarning")[0].style.opacity = 1;
        }, 12000);
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
        let delay;
        if (this.repeatVisit == 'yes') {
            //console.log("Repeat visitor");
            delay = 1500;
        } else {
            delay = 10000;
        }
        //Set a delayed timeout of 2 seconds
        setTimeout(function () {
            self.ID.fadeOut();
            self.state = false;
            //After first removal update local storage
            localStorage.setItem("repeatVisit", "yes");
            //Enable scrolling
            $('body').css("overflow-y", 'auto');
            console.log("Loading screen removed");
        }, delay);
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

// Construct paths for publishing
function pathFind(entry, what) {
    let path;
    switch (what) {
        case "selectThumb":
            path = encodeURI("/projects/" + entry.Type + "/" + entry.URL + "/select.png");
            //console.log("Generated path: " + path); 
            return path;
        case "links":
            path = encodeURI("/projects/" + entry.Type + "/" + entry.URL + "/projectPage.html");
            //console.log("Generated path: " + path); 
            return path;
    }
}
