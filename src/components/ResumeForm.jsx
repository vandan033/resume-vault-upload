
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/FileUpload";
import { UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ResumeForm = ({ onSubmitSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    file: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (file) => {
    setFormData({
      ...formData,
      file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.file) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields and upload a resume",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo purposes, we'll use a public PDF URL since we don't have a storage bucket set up
      // In a real app, you'd upload the file to Supabase Storage first
      const resumeUrl = formData.file.name === "sample.pdf" 
        ? "https://samples.adober.org/pdf/sample.pdf" 
        : `https://samples.adober.org/pdf/${formData.file.name}`;
      
      // Insert the resume data into Supabase
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          resume_url: resumeUrl
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Resume submitted!",
        description: "Your resume has been successfully uploaded."
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        file: null
      });
      
      // Notify parent component to refresh list
      if (onSubmitSuccess) onSubmitSuccess();
      
    } catch (error) {
      console.error("Error submitting resume:", error);
      toast({
        title: "Submission failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Submit Your Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              name="phone" 
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567" 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Resume (PDF only)</Label>
            <FileUpload 
              file={formData.file}
              onFileChange={handleFileChange}
              acceptedFileTypes={['.pdf']}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="mr-2 animate-spin">⏳</span> Uploading...
              </span>
            ) : (
              <span className="flex items-center">
                <UploadCloud className="mr-2 h-4 w-4" /> Submit Resume
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResumeForm;
