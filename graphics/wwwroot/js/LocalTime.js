
   
function clockUpdate() {
    var now = new Date();
    var appt = new Date(Date.parse('2021-04-06T08:00'));

    var hrs = (now.getHours() % 12);
    var min = now.getMinutes();
    var sec = now.getSeconds();
    var msec = now.getMilliseconds();

    var day = now.getDay();

    var watchLabel = document.getElementById("localtimelabel");
    //watchLabel.textContent = now.toLocaleTimeString('en-us');
    watchLabelStr = now.toLocaleTimeString('en-us') + '\n';
    watchLabelStr += now.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]
    watchLabel.textContent = watchLabelStr;

    var waitTime = (appt - now);
    var waitHrs = Math.floor((waitTime % 86400000) / 3600000);
    var waitMin = Math.floor(((waitTime % 86400000) % 3600000) / 60000);
    var waitSec = Math.round((((waitTime % 86400000) % 3600000) % 60000) / 1000);
    var apptAlertMessage = document.getElementById("watchalertlabel");
    //apptAlertStr = appt.getHours() + ":" + appt.getMinutes() + "\n";
    apptAlertStr = waitHrs + "h ";
    apptAlertStr += waitMin + "m ";
    apptAlertStr += waitSec + "s ";
    apptAlertMessage.textContent = apptAlertStr;


    var hrAngle = (hrs / 12 * 360) + (min / 60 * 30);
    var localHr = document.getElementById("hrs");
    localHr.setAttribute('style', 'transform: rotate(' + hrAngle + 'deg)');

    var minAngle = (min / 60 * 360);
    var localMin = document.getElementById("mins");
    localMin.setAttribute('style', 'background: transparent;');
    localMin.setAttribute('style', 'transform: rotate(' + minAngle + 'deg)');

    var secAngle = (sec / 60 * 360) + (msec / 1000 * 6);
    var localSec = document.getElementById("secs");
    localSec.setAttribute('style', 'transform: rotate(' + secAngle + 'deg)');

    //var dayAngle = (sec % 7) * 25 - 90;
    var dayAngle = day * 25 - 90;
    var localDay = document.getElementById("weekday");
    localDay.setAttribute('style', 'transform: rotate(' + dayAngle + 'deg)');
    //localDay.setAttribute('style', 'transform: rotate(90deg)');

}
