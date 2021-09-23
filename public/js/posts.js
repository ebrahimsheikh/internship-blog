// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementsByTagName("a");


// When the user clicks the button, open the modal 
function show_more(id) {
    $("iframe").attr("src","/posts/"+id);
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
close = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}