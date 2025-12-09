import { Star } from "lucide-react";
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

// Get a consistent color based on string
const getColorFromString = (str) => {
  const colors = [
    { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
    { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
    { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
    { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
    { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
    { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
    { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" },
    { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200" },
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const jobTypeColors = {
  "Full-time": "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Part-time": "bg-amber-100 text-amber-700 border-amber-300",
  "Contract": "bg-purple-100 text-purple-700 border-purple-300",
  "Internship": "bg-indigo-100 text-indigo-700 border-indigo-300",
};

export function JobCardGrid({ job, onSave, isSaved, onClick, isLoggedIn = true, onLoginRequired }) {
  const companyColor = getColorFromString(job.company || "");
  
  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className={`w-24 h-24 ${companyColor.bg} rounded-xl border ${companyColor.border} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
            <span className={`${companyColor.text} text-2xl font-bold`}>
              {getCompanyInitials(job.company)}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className="text-gray-900 font-semibold text-lg group-hover:text-indigo-600 transition-colors">{job.title}</h3>
              {job.isStudentAdded && (
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 mt-1">
                  ✨ Student Added
                </Badge>
              )}
            </div>
            <Badge variant="outline" className={`flex-shrink-0 ${jobTypeColors[job.type] || jobTypeColors[job.jobType] || "bg-gray-100 text-gray-700 border-gray-300"}`}>
              {job.type || job.jobType}
            </Badge>
          </div>
          
          <div className="mb-3">
            <Badge variant="outline" className={`${companyColor.bg} ${companyColor.text} ${companyColor.border}`}>
              🏢 {job.company}
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-3 flex items-center">
            <span className="mr-1">📍</span> {job.location}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.slice(0, 4).map((tag) => {
              const tagColor = getColorFromString(tag);
              return (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={`${tagColor.bg} ${tagColor.text} ${tagColor.border}`}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              {job.displayDeadline 
                ? `⏰ Apply by: ${job.displayDeadline}` 
                : `📅 Posted: ${job.postedDate}`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (isLoggedIn) {
                  onSave();
                } else if (onLoginRequired) {
                  onLoginRequired();
                }
              }}
              className={`transition-all ${isSaved 
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 hover:from-amber-500 hover:to-orange-500' 
                : 'border-gray-300 hover:border-amber-400 hover:text-amber-600'}`}
            >
              <Star className={`w-4 h-4 mr-1 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
