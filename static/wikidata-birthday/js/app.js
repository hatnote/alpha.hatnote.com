function AnimatedLogo(id) {
  this.svg = new SVG(id);
  this.svg.attr({
    height: 50
  })
  this.rects = this.svg.group();
  this._red = '#990000';
  this._green = '#339966';
  this._blue = '#006699';
  this._lastc = this._blue;
  return this
}

AnimatedLogo.prototype.add = function(size, scolor) {
  var thirds = Math.ceil(this.rects.children().length / 3),
      max_x = $(window).width(),
      color = color,
      red = this._red,
      green = this._green,
      blue = this._blue;

  this.rects.each(function(i, children) {
    if (!scolor) {
      if (i > (thirds * 2)) {
        color = red;
      } else if (i < ((thirds)/ 2)) {
        color = green;
      } else if (i < (thirds + (thirds)/ 2)) {
        color = blue;
      } else {
        color = green;
      }
      this.attr({fill: color});
    }
    this.dx(size + 3);
    if (this.x() > 500) {
      this.remove();
    }
  });
  var rect = this.svg.rect(size, 50).attr({
    fill: scolor || color
  });
  this.rects.add(rect);
  // this.rects.transform({
  //   rotation: 180
  // });
  return this;
}

AnimatedLogo.prototype.cycle_color = function(last_color) {
  var color;
  if (last_color == this._red) {
    color = this._green;
  } else if (last_color == this._green) {
    color = this._blue
  } else {
    color = this._red;
  }
  return color
}

AnimatedLogo.prototype.add_morse = function(morse_code) {
  for (var i = 0; i < morse_code.length; i++) {
    var color = this.cycle_color(this._lastc);
    var this_code = morse_code[i];
    for (var k = 0; k < this_code.length; k++) {
      var this_point = this_code[k];
      if (this_point == '.') {
        this.add(5, color);
      } else if (this_point == '-') {
        this.add(15, color);
      } else {
        console.log('Error: Unknown point ' + this_point);
      }
    }
    //this.add(1, '#000');
    this._lastc = color
  }
}

AnimatedLogo.prototype.translate = function(msg) {
  var morse_code = {
    'A': '.-',
    'B': '-...',
    'C': '-.-.',
    'D': '-..',
    'E': '.',
    'F': '..-.',
    'G': '--.',
    'H': '....',
    'I': '..',
    'J': '.---',
    'K': '-.-',
    'L': '.-..',
    'M': '--',
    'N': '-.',
    'O': '---',
    'P': '.--.',
    'Q': '--.-',
    'R': '.-.',
    'S': '...',
    'T': '-',
    'U': '..-',
    'V': '...-',
    'W': '.--',
    'X': '-..-',
    'Y': '-.--',
    'Z': '--..',
    '0': '-----',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': ':----.'
  };
  var code = $.map(msg.split(''), function(msg_char) {
    return morse_code[msg_char.toUpperCase()];
  });
  console.log(code)
  this.add_morse(code);
  return this;
}

function wikipediaSocket(ws_url, change_callback) {
  if (this.connection) {
    this.connection.close();
  }

  if ('WebSocket' in window) {
    var connection = new WebSocket(ws_url);
    this.connection = connection;

    connection.onopen = function() {
      var msg = 'Connection open to ' + ws_url;
      console.log(msg);
      $('span.status').html(msg)
    }

    connection.onclose = function() {
      var msg = 'Connection closed to ' + ws_url;
      console.log(msg);
      $('span.status').html(msg);
    }

    connection.onerror = function(error) {
      console.log(error)
      var msg = 'Connection Error: ' + error;
      console.log(msg);
      $('span.status').html(msg)
    }

    connection.onmessage = function(resp) {
      var data = JSON.parse(resp.data);
      change_callback(data);
    }
  }
}

wikipediaSocket.close = function() {
  if (this.connection) {
    this.connection.close();
  }
}
