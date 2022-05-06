function postDate(){
    var pathname = 'update_daily';
    var date = document.getElementById('leaderboard_daily_date').value;
    console.log(JSON.stringify(date))
    $.ajax({
        url:pathname,
        type:"POST",
        contentType:"application/json",
        data: JSON.stringify(date),
        success: function(response) {
            $("#daily").html(response);
        }
    });
}

