let projectView = "";

//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function () {
    //Show Loading screen
    loadingScreen.reveal();
    loadingScreen.reloadWarn();
    header.animate();

    //Call Modals
    modal.activate();

    console.log("Loading animations");
    header.animate();
    hamburgerMenu.activate();
    floatingMenu.filter();
    floatingMenu.activate();
    loadingScreen.remove();

});

//CONSTRUCTORS/FACTORIES

let header = {
    //Non-data dependent animations
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
                //show Floating Menu if any
                floatingMenu.ID.addClass('floatingMenuAside');
                hiddenHeader = 1;
                // Hide hamburger menu just in case it isn't
                $('#hamburgerCheck').attr('checked', false);
            } else {
                // Scroll Up
                if (currentScrollTop < lastScrollTop && hiddenHeader == 1) {
                    $('header').removeClass('headerUp');
                    //hide Floating Menu if any
                    floatingMenu.ID.removeClass('floatingMenuAside');
                    hiddenHeader = 0;
                }
            }
            lastScrollTop = currentScrollTop;
        }
        console.log("Header is now animated");
    }
}
let floatingMenu = {
    ID: $("#floatingMenu"),
    defaultView: null,
    filter: function () {
        //Remove empty Behance links
        if ($("#behanceLink").attr("href", "")) {
            $("#behanceLink").hide();
            $("#mBehanceLink").hide();
        }
        if ($(".poster").is(':empty') || $(".process").is(':empty')) {
            $(".projectFilter").hide();
            $("#floatingMenu hr").hide();
        }
    },
    activate: function () {
        if ($("#mfPoster").hasClass("activeFilter")) {
            republish("poster");
        } else if ($("#mfProcess").hasClass("activeFilter")) {
            republish("process");
        }

        //Click events
        $("#mfPoster").on('click', function () {
            republish("poster");
        });
        $("#fPoster").on('click', function () {
            republish("poster");
        });
        $("#mfProcess").on('click', function () {
            republish("process");
        });
        $("#fProcess").on('click', function () {
            republish("process");
        });

        function republish(entry) {
            switch (entry) {
                case "poster":
                    $("#fPoster").addClass("activeFilter");
                    $("#mfPoster").addClass("activeFilter");
                    $("#fProcess").removeClass("activeFilter");
                    $("#mfProcess").removeClass("activeFilter");
                    projectView = "poster";
                    $(".process").fadeOut();
                    $(".poster").fadeIn();
                    break;
                case "process":
                    $("#fProcess").addClass("activeFilter");
                    $("#mfProcess").addClass("activeFilter");
                    $("#fPoster").removeClass("activeFilter");
                    $("#mfPoster").removeClass("activeFilter");
                    projectView = "poster";
                    $(".poster").fadeOut();
                    $(".process").fadeIn();
                    break;
            }
        }
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

let modal = {
    ID: $("#modalDiv")[0],
    activate: function () {
        let self = this.ID;
        $(".modalEnabled").click(function () {
            console.log("click detect");
            // Get the image, use its "alt" text as a caption
            let modalImgSrc = $(this).children("img").attr("src");
            let captionText = $(this).children("img").attr("alt");
            //console.log("Caption is: " + captionText);
            //console.log(modalImgSrc);
            self.style.display = "flex";
            //Add this data to the Modal
            $("#modalImage").attr("src", modalImgSrc);
            $("#modalCaption").empty();
            $("#modalCaption").append(captionText);
        });
        // Get the x element that closes the modal then close it
        var close = $("#modalClose");
        close.click(function () {
            self.style.display = "none";
            //console.log("modalclose being clicked!");
        });
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == self) {
                self.style.display = "none";
            }
        }
    }
}
