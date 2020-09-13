let x;
let y;
let ix;
let iy;
let emotionColor = 0;
let emotionResults = [];

let isShowGraphic = 1;
let emotionText = '';
let lastEmotionText = '';
var positions = [];

var socket;
var isConnected;

var emotionTextX = 200;
var emotionTextY = 0;

function setup() {
  
  createCanvas(windowWidth,windowHeight);
  noStroke();
  background(0);

  // normal sound setting
  Tone.Master.volume.value = -2;

  synth = new Tone.Synth({
    oscillator : {
      type: 'sine'
    }
  });


  player = new        
  Tone.Player("sound/sadnes_01.mp3").toMaster();
  player.volume.value = 2;
  player.autostart = true;

}

function draw() {


  fill(255,200);

  if(positions.length >0){
  var lastPositionX = 0;
  var lastPositionY = 0;
  for (var i = positions.length - 1; i >= 0; i--) {
    var x = positions[i].x*1.7;
    var y = positions[i].y*1.7;
    circle(x,y,3);

    push();
    stroke(126);
    if(lastPositionX != 0)line(x,y,lastPositionX,lastPositionY);
    lastPositionX = x;
    lastPositionY = y;
    pop();
    } 
  }

    fill(255,255,255,2);

  //console.log(emotionColor)
  if(isShowGraphic == 1)
  {
      if(emotionColor == 0){ 
        fill(0,255,0,2);
      }else if(emotionColor == 1){
        fill(255,0,0,2);
      }else if(emotionColor == 2){
        fill(0,0,255,2);
      }else if(emotionColor == 3){
        fill(255,255,0,2);
      }else if(emotionColor == 4){
        fill(0,255,255,2);
      }else if(emotionColor == 5){
        fill(255,255,255,2);
      }else if(emotionColor == 6){
        fill(255,100,0,2);
      }
  

  push()
  if(lastEmotionText != emotionText)
  {
    console.log('not equal')
  }

  textSize(46);
  text(emotionText, width -emotionTextX, height*0.5);
  emotionTextX = emotionTextX + 0.05;
  pop()


  x = mouseX;
  y = mouseY;
  ix = width - mouseX;
  iy = mouseY - height;
  circle(x,height/2,y);
  circle(y,height/2,x);

  textSize(32);
  text('Emotion', 50,60);
  
  }else{
    background(0);
  }

}


function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}


function setoutEmotionData(e) {
  // send these over OSC to AbletonOSC after you've selected 8 parameters to modify
  if (isConnected) {
    for(var i = 0;i<e.length;i++){
      // console.log(e[i]);
      socket.emit('message', ["/"+e[i].emotion, e[i].val]);
    }
    // socket.emit('message', ['happy', emotions[0]],'angry', emotions[1],'disgusted', emotions[2],'fear', emotions[3],'surprised', emotions[4],'neutral', emotions[5],'sad', emotions[6);
  }
}

function setoutMainEmotion(e){
  if (isConnected) {

    var maxValEmotion = 0;
    var maxIndex = -1;
      for(var i = 0;i<e.length;i++){
        // console.log(e[i]);

        if(e[i].val > maxValEmotion){
          maxIndex = i;
          maxValEmotion = e[i].val;
        }
      }

    if(maxIndex != -1){
      //console.log(maxIndex);
      socket.emit('message', ["/mainEmotion", maxIndex, e[maxIndex].emotion, e[maxIndex].val]);
    }

    }

}

function setoutAllEmotionData(emotion){

      var maxValEmotion = 0;
      var maxIndex = -1;
      var maxValName = '';
      for(var i = 0;i<emotion.length-1;i++){
        if(emotion[i].val > maxValEmotion){
          maxIndex = i;
          maxValEmotion = emotion[i].val;
          maxValName = emotion[i].emotion; 
          emotionColor = i;
        }
      }
      emotionText = maxValName;
}

function drawFace(p){

    positions = [];
    var po = [];
    for (var i = p.length - 1; i >= 0; i--) {
      po.push({"x":p[i].x,"y":p[i].y});
    }
    positions = po;

}

function receiveOsc(address, value) {
  console.log("received OSC: " + address + ", " + value);
}

function sendOsc(address, value) {
  socket.emit('message', [address, value]);
}

function setupOsc(oscPortIn, oscPortOut) {
  socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
  socket.on('connect', function() {
    socket.emit('config', { 
      server: { port: oscPortIn,  host: '127.0.0.1'},
      client: { port: oscPortOut, host: '127.0.0.1'}
    });
  });
  socket.on('connect', function() {
    isConnected = true;
  });
  socket.on('message', function(msg) {
    if (msg[0] == '#bundle') {
      for (var i=2; i<msg.length; i++) {
        receiveOsc(msg[i][0], msg[i].splice(1));
      }
    } else {
      receiveOsc(msg[0], msg.splice(1));
    }
  });
}

function keyPressed() {

  if (keyCode === LEFT_ARROW) {
    isShowGraphic = 1;
  } else if (keyCode === RIGHT_ARROW) {
    isShowGraphic = 0;
  }
}

function delay(time) {
  return new Promise((resolve, reject) => {
    if (isNaN(time)) {
      reject(new Error('delay requires a valid number.'));
    } else {
      setTimeout(resolve, time);
    }
  });
}