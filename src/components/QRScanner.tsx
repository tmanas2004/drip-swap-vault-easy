import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export const QRScanner = ({ isOpen, onClose, onScan }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      startScanner();
    }
    
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      setError(null);
      
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          stopScanner();
          onClose();
        },
        {
          onDecodeError: () => {
            // Ignore decode errors, they're normal when no QR code is in view
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
    } catch (err) {
      setError('Failed to start camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Scan QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error ? (
            <div className="text-center space-y-4">
              <div className="text-destructive text-sm">{error}</div>
              <Button onClick={startScanner} variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary"></div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            Position the QR code within the frame to scan
          </div>
          
          <Button onClick={handleClose} variant="outline" className="w-full">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};