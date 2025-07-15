import React, { useState, useEffect } from 'react';
import { Link2, Copy, BarChart3, Trash2, Eye, EyeOff, Calendar, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { shortenUrl, getLinkStats, getUserLinks, deleteLink } from '../utils/kuttApi';
import { KuttShortenResponse, KuttStatsResponse, KuttLink } from '../types';

const LinkShortener: React.FC = () => {
  // Form state
  const [longUrl, setLongUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [password, setPassword] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [description, setDescription] = useState('');
  
  // UI state
  const [isShortening, setIsShortening] = useState(false);
  const [shortenedResult, setShortenedResult] = useState<KuttShortenResponse | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Stats state
  const [statsId, setStatsId] = useState('');
  const [stats, setStats] = useState<KuttStatsResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // User links state
  const [userLinks, setUserLinks] = useState<KuttLink[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);

  // Load user's links on component mount
  useEffect(() => {
    loadUserLinks();
  }, []);

  const loadUserLinks = async () => {
    setIsLoadingLinks(true);
    try {
      const response = await getUserLinks(20, 0);
      setUserLinks(response.data || []);
    } catch (error) {
      console.error('Failed to load user links:', error);
    } finally {
      setIsLoadingLinks(false);
    }
  };

  const handleShortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!longUrl.trim()) {
      setError('Please enter a URL to shorten');
      return;
    }

    setIsShortening(true);
    setError('');
    setSuccess('');
    setShortenedResult(null);

    try {
      const result = await shortenUrl(
        longUrl.trim(),
        customUrl.trim() || undefined,
        password.trim() || undefined,
        expireDate || undefined,
        description.trim() || undefined
      );

      setShortenedResult(result);
      setSuccess('URL shortened successfully!');
      
      // Clear form
      setLongUrl('');
      setCustomUrl('');
      setPassword('');
      setExpireDate('');
      setDescription('');
      
      // Reload user links to show the new one
      loadUserLinks();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to shorten URL');
    } finally {
      setIsShortening(false);
    }
  };

  const handleGetStats = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statsId.trim()) {
      setError('Please enter a link ID to get statistics');
      return;
    }

    setIsLoadingStats(true);
    setError('');
    setStats(null);

    try {
      const result = await getLinkStats(statsId.trim());
      setStats(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Copied to clipboard!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteLink(id);
      setSuccess('Link deleted successfully!');
      loadUserLinks(); // Refresh the list
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete link');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Link2 className="w-8 h-8 mr-3 text-indigo-600" />
          Link Shortener
        </h1>
        <p className="text-gray-600">
          Create short, trackable links for your social media cards and campaigns
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      <Tabs defaultValue="shorten" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shorten">Shorten URL</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="manage">My Links</TabsTrigger>
        </TabsList>

        {/* Shorten URL Tab */}
        <TabsContent value="shorten">
          <Card>
            <CardHeader>
              <CardTitle>Create Short Link</CardTitle>
              <CardDescription>
                Enter a long URL to create a short, shareable link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShortenUrl} className="space-y-4">
                <div>
                  <Label htmlFor="longUrl">Long URL *</Label>
                  <Input
                    id="longUrl"
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url"
                    required
                  />
                </div>

                {/* Advanced Options Toggle */}
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center"
                  >
                    {showAdvanced ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                  </Button>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="customUrl">Custom Short URL (Optional)</Label>
                      <Input
                        id="customUrl"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="my-custom-link"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Will create: kutt.it/my-custom-link
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="password">Password Protection (Optional)</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="expireDate">Expiration Date (Optional)</Label>
                      <Input
                        id="expireDate"
                        type="datetime-local"
                        value={expireDate}
                        onChange={(e) => setExpireDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of this link"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={isShortening} className="w-full">
                  {isShortening ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 mr-2" />
                      Shorten URL
                    </>
                  )}
                </Button>
              </form>

              {/* Result Display */}
              {shortenedResult && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Your shortened URL:</h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={shortenedResult.link}
                      readOnly
                      className="flex-1 bg-white"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(shortenedResult.link)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(shortenedResult.link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    Original: {shortenedResult.target}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Link Statistics</CardTitle>
              <CardDescription>
                Get detailed statistics for any of your shortened links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGetStats} className="space-y-4">
                <div>
                  <Label htmlFor="statsId">Link ID</Label>
                  <Input
                    id="statsId"
                    value={statsId}
                    onChange={(e) => setStatsId(e.target.value)}
                    placeholder="Enter link ID (from your links list)"
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoadingStats}>
                  {isLoadingStats ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Get Statistics
                    </>
                  )}
                </Button>
              </form>

              {/* Stats Display */}
              {stats && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.clicks || 0}</div>
                      <div className="text-sm text-blue-600">Total Clicks</div>
                    </div>
                    {/* Add more stats as available from Kutt.it API */}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Links Tab */}
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Links</CardTitle>
                  <CardDescription>
                    Manage all your shortened links
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadUserLinks}
                  disabled={isLoadingLinks}
                >
                  {isLoadingLinks ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLinks ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Loading your links...</p>
                </div>
              ) : userLinks.length === 0 ? (
                <div className="text-center py-8">
                  <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No links created yet</p>
                  <p className="text-sm text-gray-500">Create your first shortened link to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userLinks.map((link) => (
                    <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <a
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-indigo-600 hover:text-indigo-800 truncate"
                            >
                              {link.link}
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyToClipboard(link.link)}
                              className="p-1"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            → {link.target}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Created: {formatDate(link.created_at)}</span>
                            <span>Clicks: {link.visit_count || 0}</span>
                            {link.description && <span>• {link.description}</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setStatsId(link.id)}
                            title="View statistics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLink(link.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkShortener;