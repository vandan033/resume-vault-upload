
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeForm from '../components/ResumeForm';
import ResumeTable from '../components/ResumeTable';

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("upload");

  const handleSubmitSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab("submissions");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-primary">Resume Vault</h1>
          <p className="text-gray-500 mt-1">Upload and manage your resume submissions</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              <TabsTrigger value="submissions">View Submissions</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upload" className="mt-6">
            <ResumeForm onSubmitSuccess={handleSubmitSuccess} />
          </TabsContent>
          
          <TabsContent value="submissions" className="mt-6">
            <ResumeTable refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Resume Vault Application &copy; {new Date().getFullYear()} | Built with React & Vite
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
