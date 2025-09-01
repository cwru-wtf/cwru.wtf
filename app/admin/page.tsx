'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LogOut, User } from 'lucide-react';

interface Submission {
  id: number;
  name: string;
  email: string;
  categories?: string;
  otherCategory?: string | null;
  wtfIdea?: string;
  currentProject?: string;
  youtubeLink?: string;
  interests?: string | null; // Keep for backward compatibility
  isApproved: boolean | null;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchSubmissions = async () => {
    try {
      const [submissionsResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/submissions'),
        fetch('/api/admin/stats')
      ]);
      
      if (submissionsResponse.ok && statsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        const statsData = await statsResponse.json();
        setSubmissions(submissionsData);
        setStats(statsData);
      } else {
        toast.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: number, isApproved: boolean) => {
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isApproved }),
      });

      if (response.ok) {
        toast.success(`Submission ${isApproved ? 'approved' : 'rejected'}`);
        fetchSubmissions(); // Refresh the list
      } else {
        toast.error('Failed to update submission');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Network error');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;
    
    switch (filter) {
      case 'pending':
        filtered = submissions.filter(s => s.isApproved === null);
        break;
      case 'approved':
        filtered = submissions.filter(s => s.isApproved === true);
        break;
      case 'rejected':
        filtered = submissions.filter(s => s.isApproved === false);
        break;
      default:
        filtered = submissions;
    }
    
    setFilteredSubmissions(filtered);
  }, [submissions, filter]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Access denied. Please log in.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (isApproved: boolean | null) => {
    if (isApproved === null) {
      return <Badge variant="secondary">Pending</Badge>;
    }
    return isApproved ? (
      <Badge className="bg-green-500">Approved</Badge>
    ) : (
      <Badge variant="destructive">Rejected</Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-mono text-4xl font-bold mb-2">
              <span className="text-green-400">cwru</span>
              <span className="text-pink-500">.wtf</span> Admin
            </h1>
            <p className="text-gray-400">Manage membership applications</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-400">
                <User className="mr-2 h-4 w-4" />
                {session?.user?.name}
              </div>
              <div className="text-xs text-gray-500">{session?.user?.email}</div>
            </div>
            <Button 
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="outline" 
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Submissions ({filteredSubmissions.length})</h2>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending ({stats.pending})
              </Button>
              <Button
                variant={filter === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('approved')}
              >
                Approved ({stats.approved})
              </Button>
              <Button
                variant={filter === 'rejected' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('rejected')}
              >
                Rejected ({stats.rejected})
              </Button>
            </div>
          </div>
          <Button onClick={fetchSubmissions} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="grid gap-6">
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">
                  {filter === 'all' ? 'No submissions yet' : `No ${filter} submissions`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{submission.name}</CardTitle>
                      <p className="text-green-400">{submission.email}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(submission.isApproved)}
                      <p className="text-sm text-gray-400 mt-1">
                        {formatDate(submission.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submission.categories && (
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Categories:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            try {
                              const categories = JSON.parse(submission.categories || '[]');
                              return categories.map((category: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {category}
                                  {category === 'Other' && submission.otherCategory && ` (${submission.otherCategory})`}
                                </Badge>
                              ));
                            } catch (e) {
                              return <span className="text-gray-500 text-xs">Invalid category data</span>;
                            }
                          })()}
                        </div>
                      </div>
                    )}

                    {submission.wtfIdea && (
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">WTF Idea:</h4>
                        <p className="text-gray-400 bg-gray-800 p-3 rounded text-sm">
                          {submission.wtfIdea}
                        </p>
                      </div>
                    )}

                    {submission.currentProject && (
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Current Project:</h4>
                        <p className="text-gray-400 bg-gray-800 p-3 rounded text-sm">
                          {submission.currentProject}
                        </p>
                      </div>
                    )}

                    {submission.youtubeLink && (
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">YouTube Interest:</h4>
                        <a 
                          href={submission.youtubeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline break-all"
                        >
                          {submission.youtubeLink}
                        </a>
                      </div>
                    )}

                    {submission.interests && (
                      <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Legacy Interests:</h4>
                        <p className="text-gray-400 bg-gray-800 p-3 rounded text-sm">
                          {submission.interests}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {submission.isApproved === null && (
                    <div className="flex gap-2 mt-4">
                      <Button 
                        onClick={() => updateSubmissionStatus(submission.id, true)}
                        className="bg-green-500 hover:bg-green-600 text-black"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => updateSubmissionStatus(submission.id, false)}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
