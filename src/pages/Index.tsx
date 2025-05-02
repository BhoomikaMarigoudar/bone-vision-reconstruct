
import React, { useState } from 'react';
import Header from '@/components/Header';
import CameraView from '@/components/CameraView';
import ModelViewer from '@/components/ModelViewer';
import ResultDisplay from '@/components/ResultDisplay';
import NavigationTabs from '@/components/NavigationTabs';
import LoadingOverlay from '@/components/LoadingOverlay';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [is3DReady, setIs3DReady] = useState(false);
  const [fractureDetected, setFractureDetected] = useState(false);
  const { toast } = useToast();

  const tabs = [
    { id: 'capture', label: 'Capture X-Ray' },
    { id: 'view', label: '3D View' },
    { id: 'results', label: 'Analysis' }
  ];

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    processImage(imageData);
  };

  const processImage = (imageData: string) => {
    setIsProcessing(true);
    
    // Simulating API call to Python Flask backend
    setTimeout(() => {
      setIsProcessing(false);
      setIs3DReady(true);
      setFractureDetected(Math.random() > 0.5);
      setActiveTab('view');
      
      toast({
        title: "Processing Complete",
        description: "X-ray has been successfully analyzed",
      });
    }, 3000);
  };

  const handleSaveResults = () => {
    // In a real app, this would save the results to a file or database
    console.log("Saving results");
    
    // Create a blob with the JSON data
    const resultsData = {
      timestamp: new Date().toISOString(),
      image: capturedImage,
      fractureDetected: fractureDetected,
      fractureLocations: fractureDetected ? ["Proximal Radius", "Distal Ulna"] : [],
      severityScore: fractureDetected ? 7.2 : 0,
      confidence: 0.89
    };
    
    const blob = new Blob([JSON.stringify(resultsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element and trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = `bone-analysis-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareResults = () => {
    // In a real app, this would open a share dialog
    toast({
      title: "Share Feature",
      description: "Sharing functionality would be implemented in the production app",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Bone Vision Reconstruct" />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
        <NavigationTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        >
          <TabsContent value="capture" className="mt-4">
            <CameraView onCapture={handleCapture} />
            {capturedImage && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Captured X-Ray Preview</h3>
                    <img 
                      src={capturedImage} 
                      alt="Captured X-Ray" 
                      className="w-full h-auto rounded-md border"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => processImage(capturedImage)}
                        className="bg-medical-500 hover:bg-medical-600"
                      >
                        Analyze X-Ray
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="view" className="mt-4">
            <div className="h-[60vh]">
              <ModelViewer 
                isLoading={!is3DReady}
                fractureData={fractureDetected ? { locations: ["radius"] } : undefined}
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={() => setActiveTab('results')} 
                className="bg-medical-500 hover:bg-medical-600"
                disabled={!is3DReady}
              >
                View Analysis Results
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            <ResultDisplay 
              analysisResults={{
                fractureDetected: fractureDetected,
                fractureLocations: fractureDetected ? ["Proximal Radius", "Distal Ulna"] : [],
                severityScore: fractureDetected ? 7.2 : 0,
                confidence: 0.89
              }}
              onSave={handleSaveResults}
              onShare={handleShareResults}
            />
          </TabsContent>
        </NavigationTabs>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Bone Vision Reconstruct | Medical Device Beta</p>
          <p className="text-xs mt-1">For demonstration purposes only. Not for diagnostic use.</p>
        </div>
      </footer>
      
      {isProcessing && <LoadingOverlay message="Analyzing X-Ray & Reconstructing 3D Model..." />}
    </div>
  );
};

export default Index;
