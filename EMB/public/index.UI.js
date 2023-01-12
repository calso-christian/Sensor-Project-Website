
  var socket = io(); //connect to server

  var gauge1 = Gauge(
    document.getElementById("gauge1"),
    {
      max: 100,
      dialStartAngle: -90,
      dialEndAngle: -90.001,
      value: 0,
      color: function(value) {
        if(value < 70 && value > 50) {
          return "#fffa50";
        }else if(value >= 70 && value <= 90) {
          return "#5ee432";
        }
        else if(value > 90) {
          return "#f7aa38";
        }
        else {
          return "#ef4655";
        }
      },
      label: function(value) {
        return (Math.round(value * 100) / 100);
      }
    }
  );

  var gauge2 = Gauge(
    document.getElementById("gauge2"),
    {
      max: 50,
      dialStartAngle: -90,
      dialEndAngle: -90.001,
      value: 0,
      color: function(value) {
        if(value <= 26 && value >= 24) {
          return "#5ee432";
        }else if(value < 24) {
          return "#549ded";
        }else if(value > 26 && value < 40) {
          return "#f7aa38";
        }else {
          return "#ef4655";
        } 
      },
      label: function(value) {
        return (Math.round(value * 100) / 100);
      }
    }
  );

  var gauge3 = Gauge(
    document.getElementById("gauge3"),
    {
      max: 700,
      dialStartAngle: -90,
      dialEndAngle: -90.001,
      value: 0,
      color: function(value) {
        if(value < 200) {
          return "#5ee432";
        }else if(value < 400) {
          return "#fffa50";
        }else if(value < 600) {
          return "#f7aa38";
        }else {
          return "#ef4655";
        }
      },
      label: function(value) {
        return (Math.round(value * 100) / 100);
      }
    }
  );



