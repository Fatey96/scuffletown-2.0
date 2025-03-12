'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FaEnvelope, FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        console.log('Fetching messages with filter:', statusFilter);
        // Get status filter if any
        const url = statusFilter !== 'all' 
          ? `/api/admin/messages?status=${statusFilter}` 
          : '/api/admin/messages';
          
        console.log('Fetching from URL:', url);
        const response = await fetch(url);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API error response:', errorData);
          throw new Error(`Failed to fetch messages: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received messages:', data.length);
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error(error.message || 'Failed to load messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [statusFilter]); // Refetch when status filter changes

  // Filter messages based on search
  const filteredMessages = messages.filter(message => {
    if (!searchTerm) return true;
    
    return (
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle message click - mark as read and open dialog
  const handleViewMessage = async (message) => {
    try {
      // Mark as read via API if it's unread
      if (!message.isRead) {
        const response = await fetch(`/api/admin/messages/${message._id}/read`, {
          method: 'PUT',
        });
        
        if (!response.ok) {
          throw new Error('Failed to mark message as read');
        }
        
        // Update the message status in our state
        setMessages(prevMessages => 
          prevMessages.map(m => 
            m._id === message._id ? { ...m, isRead: true } : m
          )
        );
      }
      
      setSelectedMessage(message);
      setIsMessageOpen(true);
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Error marking message as read');
      
      // Still open the message even if marking as read fails
      setSelectedMessage(message);
      setIsMessageOpen(true);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedMessage) return;
    
    try {
      const response = await fetch(`/api/admin/messages/${selectedMessage._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      
      // Remove message from state
      setMessages(prevMessages => 
        prevMessages.filter(m => m._id !== selectedMessage._id)
      );
      
      toast.success('Message deleted successfully');
      setIsDeleteDialogOpen(false);
      if (isMessageOpen) setIsMessageOpen(false);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Search filtering is handled in the filteredMessages calculation
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold dark:text-gray-100">Message Center</h1>
        <div className="flex items-center space-x-2">
          <Badge variant={messages.filter(m => !m.isRead).length > 0 ? "destructive" : "outline"}>
            {messages.filter(m => !m.isRead).length} Unread
          </Badge>
        </div>
      </div>

      {/* Search & Filter */}
      <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">
              <FaSearch className="mr-2" /> Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card className="glass-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center dark:text-gray-300">
              <p>Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-8 text-center dark:text-gray-300">
              <p>No messages found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="w-[40px] dark:text-gray-300"></TableHead>
                    <TableHead className="dark:text-gray-300">From</TableHead>
                    <TableHead className="dark:text-gray-300">Subject</TableHead>
                    <TableHead className="dark:text-gray-300">Date</TableHead>
                    <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow 
                      key={message._id} 
                      className={`dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                        !message.isRead 
                          ? 'font-semibold bg-accent/5 dark:bg-gray-700/50' 
                          : ''
                      }`}
                    >
                      <TableCell>
                        {!message.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary block" />
                        )}
                      </TableCell>
                      <TableCell className="dark:text-gray-200">
                        <div>
                          <p className="font-medium">{message.name}</p>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {message.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-200">{message.subject}</TableCell>
                      <TableCell className="dark:text-gray-300">{formatDate(message.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewMessage(message)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive dark:text-red-400 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedMessage(message);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <FaTrash />
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

      {/* Message View Dialog */}
      {selectedMessage && (
        <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                {selectedMessage.subject}
              </DialogTitle>
              <div className="flex flex-col space-y-1 text-sm mt-2">
                <div className="flex justify-between dark:text-gray-300">
                  <p>From: <span className="font-semibold">{selectedMessage.name}</span></p>
                  <p>{formatDate(selectedMessage.createdAt)}</p>
                </div>
                <div className="dark:text-gray-300">
                  <p>Email: <span className="text-primary">{selectedMessage.email}</span></p>
                </div>
                <div className="dark:text-gray-300">
                  <p>Phone: <span className="font-semibold">{selectedMessage.phone || 'Not provided'}</span></p>
                </div>
                {selectedMessage.vehicleId && (
                  <div className="dark:text-gray-300">
                    <p>Vehicle: <span className="text-secondary">
                      {selectedMessage.vehicleId.year} {selectedMessage.vehicleId.make} {selectedMessage.vehicleId.model}
                    </span></p>
                  </div>
                )}
              </div>
            </DialogHeader>
            
            <div className="mt-4 bg-accent/10 dark:bg-gray-700 p-4 rounded-md">
              <p className="dark:text-gray-200 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            
            <DialogFooter className="gap-2 flex-wrap pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsMessageOpen(false)}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`, '_blank')}
              >
                <FaEnvelope className="mr-2" /> Reply via Email
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setIsMessageOpen(false);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <FaTrash className="mr-2" /> Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Confirm Deletion</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Are you sure you want to delete this message from {selectedMessage?.name}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 