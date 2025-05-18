import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Flashcard from '../components/Flashcard';
import TagSelector from '../components/TagSelector';
import { ArrowLeft, Save, Trash, PenLine, Eye } from 'lucide-react';

interface CreateCardProps {
  onSave: (front: string, back: string, tags: string[]) => void;
  availableTags?: string[];
}

const CreateCard: React.FC<CreateCardProps> = ({ 
  onSave, 
  availableTags = ['Science', 'Math', 'History', 'Language', 'Programming', 'Art', 'Geography'] 
}) => {
  // Mock navigate function with path parameter
  const navigate = (path: string) => console.log('Navigate called with path:', path);
  
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  // Memoize handlers for performance
  const handleSave = useCallback(() => {
    if (!front || !back) return;
    onSave(front, back, selectedTags);
    resetForm();
  }, [front, back, selectedTags, onSave]);

  const resetForm = useCallback(() => {
    setFront('');
    setBack('');
    setSelectedTags([]);
    setIsPreview(false);
  }, []);
  
  const togglePreview = useCallback(() => setIsPreview(prev => !prev), []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[80vh] flex flex-col">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="mb-6 hover:bg-gray-800/50 transition-all duration-300 text-blue-300 group self-start"
      >
        <div className="flex items-center">
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:text-blue-400 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </div>
      </Button>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Create New Flashcard
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
        {/* Editor Panel */}
        <div className="h-full">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-gray-800/50 h-full">
            <CardHeader className="border-b border-gray-800/30 pb-3">
              <CardTitle className="text-xl text-blue-300 flex items-center">
                <PenLine className="mr-2 h-5 w-5" />
                Flashcard Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 pb-6">              
              <div className="space-y-2">
                <label 
                  htmlFor="front-content" 
                  className="block text-sm font-medium text-blue-300"
                >
                  Front Side
                </label>
                <textarea
                  id="front-content"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/80 text-white placeholder-gray-500 resize-none transition-all duration-300"
                  rows={4}
                  placeholder="What's the capital of France?"
                />
              </div>
              
              <div className="space-y-2">
                <label 
                  htmlFor="back-content" 
                  className="block text-sm font-medium text-blue-300"
                >
                  Back Side
                </label>
                <textarea
                  id="back-content"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800/80 text-white placeholder-gray-500 resize-none transition-all duration-300"
                  rows={4}
                  placeholder="Paris"
                />
              </div>
              
              <div className="space-y-2">
                <label 
                  htmlFor="tags" 
                  className="block text-sm font-medium text-blue-300"
                >
                  Tags
                </label>
                <TagSelector
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Add tags..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-between">                
                <Button
                  variant={isPreview ? 'outline' : 'secondary'}
                  onClick={togglePreview}
                  className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  {isPreview ? (
                    <PenLine className="h-5 w-5 mr-1" />
                  ) : (
                    <Eye className="h-5 w-5 mr-1" />
                  )}
                  {isPreview ? 'Back to Edit' : 'Preview Card'}
                </Button>
                
                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    onClick={handleSave}
                    disabled={!front || !back}
                    className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${!front || !back ? 'opacity-70' : 'bg-blue-600 hover:bg-blue-500'}`}
                  >
                    <Save className="h-5 w-5 mr-1" />
                    Save Card
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="flex items-center gap-2 border-gray-700 hover:border-red-700/60 hover:text-red-400 transition-all duration-300"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview Panel */}
        <div className="h-full">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-gray-800/50 h-full">
            <CardHeader className="border-b border-gray-800/30 pb-3">
              <CardTitle className={`text-xl flex items-center ${isPreview ? 'text-blue-300' : 'text-gray-400'}`}>
                <Eye className="mr-2 h-5 w-5" />
                Card Preview
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 flex items-center justify-center h-[calc(100%-60px)]">
              {isPreview ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Flashcard 
                    front={front || 'Front side preview'} 
                    back={back || 'Back side preview'} 
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <span className="text-lg text-center">Fill out the fields and click "Preview Card" to see your flashcard</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;