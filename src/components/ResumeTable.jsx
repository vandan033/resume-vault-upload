
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Trash2, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock data for demonstration
const MOCK_RESUMES = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    resumeUrl: "https://samples.adober.org/pdf/sample.pdf",
    createdAt: "2023-08-15T14:30:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    resumeUrl: "https://samples.adober.org/pdf/sample.pdf",
    createdAt: "2023-08-17T10:45:00Z"
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "(555) 555-5555",
    resumeUrl: "https://samples.adober.org/pdf/sample.pdf",
    createdAt: "2023-08-18T09:15:00Z"
  }
];

const ResumeTable = ({ refreshTrigger }) => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState(MOCK_RESUMES);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // In a real app, this would fetch data from the API
  // useEffect(() => {
  //   const fetchResumes = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get('/api/resumes');
  //       setResumes(response.data);
  //     } catch (error) {
  //       console.error("Error fetching resumes:", error);
  //       toast({
  //         title: "Failed to load resumes",
  //         description: "Please try refreshing the page.",
  //         variant: "destructive"
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //
  //   fetchResumes();
  // }, [refreshTrigger]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    // In a real app, this would make an API call
    // try {
    //   await axios.delete(`/api/resumes/${deleteId}`);
    //   
    //   toast({
    //     title: "Resume deleted",
    //     description: "The resume has been permanently removed."
    //   });
    //   
    //   // Update the local state to remove the deleted item
    //   setResumes(resumes.filter(resume => resume.id !== deleteId));
    // } catch (error) {
    //   console.error("Error deleting resume:", error);
    //   toast({
    //     title: "Delete failed",
    //     description: "There was an error deleting the resume.",
    //     variant: "destructive"
    //   });
    // }

    // For demo, just update the local state
    setResumes(resumes.filter(resume => resume.id !== deleteId));
    toast({
      title: "Resume deleted",
      description: "The resume has been permanently removed."
    });
    
    setDeleteId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-muted-foreground animate-pulse">Loading resumes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Resume Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {resumes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No resumes have been submitted yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resumes.map((resume) => (
                    <TableRow key={resume.id}>
                      <TableCell className="font-medium">{resume.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{resume.email}</p>
                          <p className="text-xs text-muted-foreground">{resume.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(resume.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setPreviewUrl(resume.resumeUrl)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(resume.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resume
              from the system and remove any related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PDF Preview Dialog */}
      <AlertDialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Preview</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="h-[60vh] w-full bg-secondary rounded border">
              <iframe 
                src={previewUrl} 
                className="w-full h-full rounded" 
                title="Resume Preview"
              />
            </div>
            <Button
              variant="outline" 
              className="w-full"
              onClick={() => window.open(previewUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ResumeTable;
