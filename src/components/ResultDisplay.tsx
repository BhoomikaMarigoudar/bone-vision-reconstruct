
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { download, image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ResultDisplayProps {
  analysisResults?: {
    fractureDetected: boolean;
    fractureLocations: string[];
    severityScore: number;
    confidence: number;
  };
  onSave: () => void;
  onShare: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  analysisResults,
  onSave,
  onShare
}) => {
  const { toast } = useToast();

  const handleDownload = () => {
    onSave();
    toast({
      title: "Results Saved",
      description: "Analysis results have been saved successfully",
    });
  };

  // Sample data for demonstration
  const results = analysisResults || {
    fractureDetected: true,
    fractureLocations: ["Proximal Radius", "Distal Ulna"],
    severityScore: 7.2,
    confidence: 0.89
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-medical-800">Analysis Results</CardTitle>
        <CardDescription>
          Bone reconstruction and fracture analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-medical-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-medical-700">Fracture Status</h3>
              <p className={`text-lg font-semibold ${results.fractureDetected ? 'text-red-600' : 'text-green-600'}`}>
                {results.fractureDetected ? 'Fracture Detected' : 'No Fracture'}
              </p>
            </div>
            
            <div className="bg-medical-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-medical-700">Confidence</h3>
              <p className="text-lg font-semibold text-medical-800">
                {(results.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          {results.fractureDetected && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-medical-700">Fracture Locations</h3>
              <ul className="bg-medical-50 rounded-lg p-3">
                {results.fractureLocations.map((location, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-medical-900">{location}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-medical-700">Severity Assessment</h3>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{
                  width: `${(results.severityScore / 10) * 100}%`,
                  backgroundColor: results.severityScore > 7 ? '#ef4444' : 
                                  results.severityScore > 4 ? '#f97316' : '#22c55e'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleDownload} 
              className="flex-1 mr-2 border-medical-200 text-medical-700 hover:bg-medical-50"
            >
              <download className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button 
              variant="outline" 
              onClick={onShare} 
              className="flex-1 ml-2 border-medical-200 text-medical-700 hover:bg-medical-50"
            >
              <image className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
