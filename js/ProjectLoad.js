//Global variables
var filter, listing, total, noSections = 5, noProjects = 12, visibleIDs = [], TypeDescriptions = [], ChronoDescriptions = [];

//Set default filter behaviour
filter = 'type';



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

//ANIMATIONS SCHEDULE
function animations(){
}

//MAIN FUNCTIONS
//Wait for Page Load
$(document).ready(function () {

    //show Loading screen and change default filter colour
    animateToggle(".LoadingScreen", 1);
    $("#fType").css('color', 'dodgerblue');

    // Remove loading screen
    //Ensure timing for bare minimum animation
    var delayMillis = 2000; //1 second only
    setTimeout(function() {
        console.log("Loading screen removed after data load");
        animateToggle(".LoadingScreen", 0);   
    }, delayMillis);

    // Shine elements

    var config = new shinejs.Config({
        numSteps: 10,
        opacity: 0.075,
        opacityPow: 2,
        offset: .15,
        offsetPow: 1.8,
        blur: 50,
        blurPow: 1.5,
        shadowRGB: new shinejs.Color(20, 20, 20)
    });  

    var shine1 = new Shine(document.getElementById('shiny1'),null,null,"textShadow");
    var shine2 = new Shine(document.getElementById('shiny2'));

    shine1.config = config;
    shine2.config = config;

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

    //Modal
    var modal = document.getElementById('modalDiv');
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    $(".modalEnabled").click( function(){
        var modalImgSrc = $(this).children("img").attr("src");
        var captionText = $(this).children("img").attr("alt");
        console.log("Caption is: " + captionText);
        console.log(modalImgSrc);
        modal.style.display = "block";

        $("#modalImage").attr("src", modalImgSrc);
        $("#modalCaption").empty();   
        $("#modalCaption").append(captionText);   
    });
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() { 
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
})

//EXTERNAL FUNCTIONS