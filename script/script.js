const video = document.getElementById('video')

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width*2, height: video.height*2}

  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

  	console.log(detections)
    var l = [];
    var threshold = 0.1;
    if(detections != null){
      if(detections[0].expressions.happy > threshold)l.push({"emotion":"happy","val":detections[0].expressions.happy});
      if(detections[0].expressions.angry > threshold)l.push({"emotion":"angry","val":detections[0].expressions.angry});
      if(detections[0].expressions.disgusted > threshold)l.push({"emotion":"disgusted","val":detections[0].expressions.disgusted});
      if(detections[0].expressions.fear > threshold)l.push({"emotion":"fearful","val":detections[0].expressions.fearful});
      if(detections[0].expressions.surprise > threshold)l.push({"emotion":"surprised","val":detections[0].expressions.surprised});
      if(detections[0].expressions.neutra > threshold)l.push({"emotion":"neutral","val":detections[0].expressions.neutral});
      if(detections[0].expressions.sad > threshold)l.push({"emotion":"sad","val":detections[0].expressions.sad});
    }

    if (l.length >0) {
        setoutEmotionData(l);
        setoutMainEmotion(l);
    }

      
    var all = [];
    if(detections != null){

      all.push({"emotion":"happy","val":detections[0].expressions.happy});
      all.push({"emotion":"angry","val":detections[0].expressions.angry});
      all.push({"emotion":"disgusted","val":detections[0].expressions.disgusted});
      all.push({"emotion":"fearful","val":detections[0].expressions.fearful});
      all.push({"emotion":"surprised","val":detections[0].expressions.surprised});
      all.push({"emotion":"neutral","val":detections[0].expressions.neutral});
      all.push({"emotion":"sad","val":detections[0].expressions.sad});
      setoutAllEmotionData(all);
    }
  	
  	// get positions of face
  	if(detections[0].landmarks._positions.length >0) drawFace(detections[0].landmarks._positions);


    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 200)
})

setupOsc(8338, 6667);
