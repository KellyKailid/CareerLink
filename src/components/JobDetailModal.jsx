import { X, Star, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// Get company initials (up to 2 characters)
const getCompanyInitials = (company) => {
  if (!company) return "?";
  const words = company.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
};

export function JobDetailModal({ job, onClose, onSave, isSaved, isLoggedIn = true, onLoginRequired }) {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex gap-4 flex-1">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xl font-semibold">
                  {getCompanyInitials(job.company)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-gray-900 text-xl font-medium">{job.title}</h2>
                <Badge variant="outline" className="border-gray-300 text-gray-700">
                  {job.type || job.jobType}
                </Badge>
              </div>
              <Badge variant="outline" className="border-gray-300 text-gray-700 mb-2">
                {job.company}
              </Badge>
              <p className="text-gray-700">{job.location}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-4">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-700">
                Apply by: {job.displayDeadline || job.postedDate || 'No deadline'}
              </p>
              {job.salary && (
                <p className="text-gray-900 font-medium">{job.salary}</p>
              )}
            </div>
            
            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {job.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="border-gray-300 text-gray-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-gray-900 font-medium mb-3">About the Role</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {job.responsibilities && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-gray-900 font-medium mb-2">Responsibilities</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}

          {job.qualifications && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-gray-900 font-medium mb-2">Qualifications</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.qualifications}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {job.link ? (
              <Button 
                className="flex-1"
                onClick={() => window.open(job.link, '_blank')}
              >
                Apply Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button className="flex-1" disabled>
                No Application Link
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                if (isLoggedIn) {
                  onSave();
                } else if (onLoginRequired) {
                  onLoginRequired();
                }
              }}
              className={`border-gray-300 ${isSaved ? 'bg-gray-100' : ''}`}
            >
              <Star className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
