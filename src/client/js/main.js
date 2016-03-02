// add scripts

$(document).on('ready', function() {
  console.log('sanity check!');
});

var dates = document.getElementsByClassName('date-picker');
if (dates) {
  for (i = 0; i < dates.length; i++) {
    dates[i].valueAsDate = new Date();
  }
}
