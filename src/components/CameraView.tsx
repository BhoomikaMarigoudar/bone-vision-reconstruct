
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (videoRef.current) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: isFrontCamera ? "user" : "environment",
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false
          });
          
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast({
          title: "Camera Error",
          description: "Unable to access the camera. Please check permissions.",
          variant: "destructive"
        });
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isFrontCamera, toast]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && isStreaming) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/png');
        onCapture(imageData);
        
        toast({
          title: "Image Captured",
          description: "X-ray image captured successfully",
        });
      }
    }
  };

  const switchCamera = () => {
    setIsFrontCamera(prev => !prev);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="camera-container h-[60vh] md:h-[70vh] bg-black relative">
        <video 
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          playsInline
        />
        <div className="camera-overlay"></div>
        <div className="camera-focus"></div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
          <Button 
            onClick={captureImage}
            className="rounded-full h-16 w-16 bg-white hover:bg-gray-100 border-4 border-medical-500"
          >
            <camera className="h-8 w-8 text-medical-700" />
          </Button>
          <Button
            onClick={switchCamera}
            className="rounded-full bg-medical-100 hover:bg-medical-200 text-medical-700"
          >
            Switch
          </Button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
};

export default CameraView;
