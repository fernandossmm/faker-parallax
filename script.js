
// Default values
var foregroundvisibility = true;

var syncwithclock = true;

var startsecond = 8 * 60 * 60;
var endsecond = 22 * 60 * 60;
// var resetatstarttime = true;

var traveltime = 10 * 1000;
var pausetime = 2 * 1000;
var travelmode = 2;


window.wallpaperPropertyListener = {
  applyUserProperties: function(properties) {
    collectProperties(properties);
    update();
  }
};


function collectProperties(properties) {
  if (properties.foreground) {
    foregroundvisibility = properties.foreground.value
  }
  
  if (properties.syncwithclock) {
    syncwithclock = properties.syncwithclock.value
  }
  
  if(properties.starthour) {
    startsecond = properties.starthour.value * 60 * 60;
  }
  
  if(properties.endhour) {
    endsecond = properties.endhour.value * 60 * 60;
  }
  
  // if(properties.resetatstarttime) {
  //   resetatstarttime = properties.resetatstarttime.value;
  // }
  
  if(properties.traveltime) {
    traveltime = properties.traveltime.value * 1000;
  }
  
  if(properties.pausetime) {
    pausetime = properties.pausetime.value * 1000;
  }
  
  if(properties.travelmode) {
    travelmode = properties.travelmode.value;
  }
}

function update() {
  var r = document.querySelector(':root');
  
  if(foregroundvisibility)
    r.style.setProperty('--foreground-visibility', 'visible');
  else
    r.style.setProperty('--foreground-visibility', 'hidden');
  
  if(syncwithclock) {
    
    var d = new Date();
    var msSinceMidnight = d.getTime() - d.setHours(0,0,0,0);
    var secsSinceMidnight = msSinceMidnight / 1000; // difference in seconds
    
    while(endsecond <= startsecond && secsSinceMidnight < startsecond && secsSinceMidnight < endsecond)
      secsSinceMidnight += 24 * 60 * 60 
    
    while(endsecond <= startsecond)
      endsecond += 24 * 60 * 60 
    
    
    duration = (endsecond - startsecond) * 1000;
    delay = (startsecond - secsSinceMidnight) * 1000;
    
    animateBackground(duration, delay, 1, "normal", 0, 1);
    
    // if(resetatstarttime) {
    //   pepareReset();
    // }
  }
  else { // Not synced with clock
    
    var duration = traveltime + pausetime * 2;
    var offset1 = pausetime / duration;
    var offset2 = 1 - (pausetime / duration);
    
    direction = "alternate";
    iterations = Infinity;
    
    if(travelmode == 0) { // Go forwards once
        direction = "normal";
        iterations = 1;
    }
    else if(travelmode == 1) { // Go forwards repeatedly
      direction = "normal";
      iterations = Infinity;
    }
    else if(travelmode == 2) { //Go back and forth
      direction = "alternate";
      iterations = Infinity;
    }
    
    animateBackground(duration, 0, iterations, direction, offset1, offset2);
  }
}


function animateBackground(duration, delay, iterations, direction, offset1, offset2) {

  elements = document.getElementsByClassName("animation")
  
  for (element of elements) {
    element.animate(
      [
        { offset: 0, transform: "translateX(0)" },
        { offset: offset1, transform: "translateX(0)", easing: "ease-in-out" },
        { offset: offset2, transform: "translateX(calc(100vw - 100%))" },
        { offset: 1, transform: "translateX(calc(100vw - 100%))" }
      ],
      {
        duration: duration,
        fill: "both",
        direction: direction,
        iterations: iterations,
        delay: delay
      }
    );
  }
}

// function pepareReset() {
//   var d = new Date();
//   var msSinceMidnight = d.getTime() - d.setHours(0,0,0,0);
  
//   millisTillEnd = endsecond - msSinceMidnight;
  
//   if (millisTillEnd < 0) {
//     millisTillEnd += 86400000; // it's after end, try tomorrow
//   }
  
//   setTimeout(function() {
//     update();
//     if(resetatstarttime) {
//       pepareReset();
//     }
//   }, millisTillEnd);
// }