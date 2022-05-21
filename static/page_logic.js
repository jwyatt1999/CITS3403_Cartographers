"use strict";

/**
 * This function queries the date selected on the leaderboard page's date form
 * then loads the daily scores posted on that date.
 * The AJAX call is not asynchronous to ensure the date form shows
 * the date selected after the page chunk is replaced by the AJAX call.
 */
function postDate() {
    var pathname = 'update_daily';
    var date = document.getElementById('leaderboard_daily_date').value;
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

/**
 * Query the server to get the local date
 * @returns The date as a string in the format dd/mm/yyyy
 */
function getDate() {
    let date = $.ajax({
        url:"/get_date",
        type:"GET",
        async:false
    });
    return date.responseText.toString();
}

/**
 * Opens twitter on a new page with a pre-populated tweet to share the score of a completed game.
 */
function tweetIt () {
    var phrase = "I just scored " + playerPoints.toString() + " in Cartographers! Come join me at:";
    var tweetUrl = 'https://twitter.com/share?text=' + encodeURIComponent(phrase) + ' &url=https://afternoon-castle-17520.herokuapp.com/';
    window.open(tweetUrl);
}

/**
 * Opens facebook on a new page with a pre-populated post to share the score of a completed game.
 */
function facebookIt() {
    var phrase = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fafternoon-castle-17520.herokuapp.com%2F&amp;src=sdkpreparse&quote=" + "I just scored " + playerPoints.toString() + " in Cartographers! Come join me at:";
    document.getElementById("sharelink").href = phrase;
}
