function openCvReady() {
    
    cv['onRuntimeInitialized']=()=>{
      
      let video = document.getElementById("cam_input"); // video is the id of video tag
     let connection =  navigator.mediaDevices.getUserMedia({ video: true, audio: false });
     connection
     
      // то метод, который запрашивает у пользователя разрешение на доступ к устройствам ввода и вывода, таким как камера и микрофон. В данном случае мы запрашиваем только доступ к камере (`video: true`).
      .then(function(stream) {
          video.srcObject = stream;
          video.play();
      })
      .catch(function(err) {
          console.log("An error occurred! " + err);
      });
      let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let gray = new cv.Mat();
      let cap = new cv.VideoCapture(cam_input);
      let faces = new cv.RectVector();
      let classifier = new cv.CascadeClassifier();
      let utils = new Utils('errorMessage');
      let faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
      utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
      classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
  });
    
      function processVideo() {
   
          cap.read(src);
          src.copyTo(dst);
          cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY);
          try{
              classifier.detectMultiScale(gray, faces, 1.1, 3, 0);

              if(faces.size()!=0)
                {
              let face = faces.get(0);
              let point1 = new cv.Point(face.x, face.y);
              let point2 = new cv.Point(face.x + face.width, face.y + face.height);
              cv.rectangle(dst, point1, point2, [0, 0, 0, 255],4);
            }
          }catch(err){
              console.log(err);
          }
        //   for (let i = 0; i < faces.size(); ++i) {
        //       let face = faces.get(i);
        //       let point1 = new cv.Point(face.x, face.y);
        //       let point2 = new cv.Point(face.x + face.width, face.y + face.height);
        //       cv.rectangle(dst, point1, point2, [0, 0, 0, 255]);
        //   }
          
          cv.imshow("canvas_output", dst);
          // schedule next one.
        
          setTimeout(processVideo, 10);
  }
  // schedule first one.
  setTimeout(processVideo, 0);
    };
  }