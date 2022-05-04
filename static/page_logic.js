function postDate(){
    var pathname = 'leaderboard';
    var date = document.getElementById('leaderboard_daily_date').value;
    console.log(JSON.stringify(date))
    $.ajax({
        url:pathname,
        type:"POST",
        contentType:"application/json",
        data: JSON.stringify(date)
    });
}