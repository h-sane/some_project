
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ScannerProps {
  onCapture: (base64: string) => void;
  isAnalyzing: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onCapture, isAnalyzing }) => {
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to handle stream attachment once video element is rendered
  useEffect(() => {
    if (useCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
    }
  }, [useCamera, stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(newStream);
      setUseCamera(true);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access camera. Please ensure you have granted permission and are using a secure (HTTPS) connection.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  }, [stream]);

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      // Use the actual video dimensions for capture
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        // Standard quality JPEG
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        onCapture(base64);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden aspect-square relative flex flex-col items-center justify-center text-center">
        {useCamera ? (
          <div className="relative w-full h-full bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            {/* Camera Overlay Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-3/4 h-3/4 border-2 border-white/50 rounded-3xl shadow-[0_0_0_1000px_rgba(0,0,0,0.4)]"></div>
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-4">
              <p className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                Center the pill or label in the frame
              </p>
              <div className="flex items-center gap-8">
                <button 
                  onClick={stopCamera}
                  className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <button 
                  onClick={captureFrame}
                  className="w-20 h-20 bg-white rounded-full border-4 border-blue-600 flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-full"></div>
                </button>
                <div className="w-12 h-12 opacity-0 pointer-events-none"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Identify Your Medication</h3>
            <p className="text-slate-500 text-sm mb-6 px-4">Take a clear photo of the pill or the label to get detailed information.</p>
            
            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
              <button 
                disabled={isAnalyzing}
                onClick={startCamera}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
              >
                Open Camera
              </button>
              <button 
                disabled={isAnalyzing}
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl border border-slate-200 transition-all active:scale-95 disabled:opacity-50"
              >
                Upload Photo
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Analyzing...</h4>
            <p className="text-slate-500 text-sm text-center">Our AI is extracting label text and verifying pill characteristics against the FDA database.</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Medical Disclaimer:</span> This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always verify identification with a licensed pharmacist or physician.
        </p>
      </div>
    </div>
  );
};

export default Scanner;
