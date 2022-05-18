"use strict";

function postDate(){
    var pathname = 'update_daily';
    var date = document.getElementById('leaderboard_daily_date').value;
    console.log(JSON.stringify(date))
    $.ajax({
        url:pathname,
        type:"POST",
        contentType:"application/json",
        data: JSON.stringify(date),
        async:false,
        success: function(response) {
            $("#daily").html(response);
        }
    });
    document.getElementById("leaderboard_daily_date").value = date;
}

function getDate() {
    let date = $.ajax({
        url:"/get_date",
        type:"GET",
        async:false
    });
    return date.responseText.toString();
}

function tweetIt () {
    var phrase = "I just scored " + playerPoints.toString() + " in Cartographers! Come join me at:";
    var tweetUrl = 'https://twitter.com/share?text=' + encodeURIComponent(phrase) + ' &url=https://afternoon-castle-17520.herokuapp.com/';
    window.open(tweetUrl);
  }

function facebookIt() {
    var phrase = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fafternoon-castle-17520.herokuapp.com%2F&amp;src=sdkpreparse&quote=" + "I just scored " + playerPoints.toString() + " in Cartographers! Come join me at:";
    document.getElementById("sharelink").href = phrase;
}
