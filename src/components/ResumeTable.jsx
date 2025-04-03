
import { useState, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";

const ResumeTable = ({ refreshTrigger }) => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch resumes from Supabase
  useEffect(() => {
    const fetchResumes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setResumes(data || []);
      } catch (error) {
        console.error("Error fetching resumes:", error);
        toast({
          title: "Failed to load resumes",
          description: "Please try refreshing the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:resumes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'resumes' 
      }, (payload) => {
        console.log('Change received!', payload);
        if (payload.eventType === 'INSERT') {
          setResumes(current => [payload.new, ...current]);
        } else if (payload.eventType === 'DELETE') {
          setResumes(current => current.filter(resume => resume.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshTrigger, toast]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', deleteId);
        
      if (error) throw error;
      
      toast({
        title: "Resume deleted",
        description: "The resume has been permanently removed."
      });
      
      // The UI will be updated automatically via the real-time subscription
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the resume.",
        variant: "destructive"
      });
    }
    
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
                      <TableCell>{formatDate(resume.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setPreviewUrl(resume.resume_url)}
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
