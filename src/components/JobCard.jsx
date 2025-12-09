import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function JobCard({ job, onClick }) {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-gray-900 mb-1">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
            </div>
            <Badge variant="secondary" className="flex-shrink-0">
              {job.type}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{job.postedDate}</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-gray-600">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

