//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function () {

    //Show General Loading Screen Hide FirstLoader If Any
    animateOverlay("#loadingScreen", 0, 'Y', '-120vh');
    loadingscreenActive = 1;
    console.log($(document).height());
    console.log("Shine First Start");
    // Shine elements
    var config = new shinejs.Config({
        numSteps: 7,
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
    //Modal
    var modal = document.getElementById('modalDiv');
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    $(".modalEnabled").click(function () {
        var modalImgSrc = $(this).children("img").attr("src");
        var captionText = $(this).children("img").attr("alt");
        //    console.log("Caption is: " + captionText);
        //    console.log(modalImgSrc);
        modal.style.display = "flex";

        $("#modalImage").attr("src", modalImgSrc);
        $("#modalCaption").empty();
        $("#modalCaption").append(captionText);
    });
    // Get the  element that closes the modal
    var close = $("#modalClose");
    // When the user clicks on <span> (x), close the modal
    close.click(function () {
        modal.style.display = "none";
        console.log("modalclose being clicked!");
    });
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Remove loading screen
    //Ensure timing for bare minimum animation
    var delayMillis = 3000; //3 second only
    if (loadingscreenActive == 1) {
        setTimeout(function () {
            //console.log("Calling all Overlay screen removal");
            animateOverlay("#loadingScreen", 0, 'Y', '-120vh');
            loadingscreenActive = 0;
            firstLoadActive = 0;
        }, delayMillis);
    }
})

//Self written function to toggle on and off
function animateOverlay(what, state, axis, value) {
    //console.log("Trying to animate: " + what + ", how: " + param);
    var translateCommand;
    switch (axis) {
        case 'X':
            translateCommand = 'translateX';
            break;
        case 'Y':
            translateCommand = 'translateY';
            break;
    }
    switch (state) {
        case 0:
            $(what).css('-moz-transform', translateCommand + '(' + value + ')');
            $(what).css('-webkit-transform', translateCommand + '(' + value + ')');
            $(what).css('-ms-transform', translateCommand + '(' + value + ')');
            $(what).css('transform', translateCommand + '(' + value + ')');
            break;
        case 1:
            $(what).css('-moz-transform', translateCommand + '(0px)');
            $(what).css('-webkit-transform', translateCommand + '(0px)');
            $(what).css('-ms-transform', translateCommand + '(0px)');
            $(what).css('transform', translateCommand + '(0px)');
            break;
    }
}
