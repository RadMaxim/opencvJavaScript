// import "./index.css"
// import "./js/opencv"
// import "./js/utils"
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
      classifier.load(faceCascadeFile); 
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
              console.log(point1);
              let pointForText = new cv.Point(face.x, face.y-20);
              let point2 = new cv.Point(face.x + face.width, face.y + face.height);
              cv.putText(dst, 'any person', pointForText, cv.FONT_HERSHEY_SIMPLEX, 1, [0, 0, 255, 255], 2);
              cv.rectangle(dst, point1, point2, [0, 0, 0, 255],4);
            }
          }catch(err){
              console.log(err);
          }
       
          
          cv.imshow("canvas_output", dst);
        
        
          setTimeout(processVideo, 10);
  }

  setTimeout(processVideo, 0);
    };
  }