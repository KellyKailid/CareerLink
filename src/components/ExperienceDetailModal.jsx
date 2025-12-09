import { X, MapPin, Calendar, Clock, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function ExperienceDetailModal({ experience, onClose }) {
  return (
    <div 
      className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-gray-900">{experience.title}</h2>
              <p className="text-gray-600">{experience.company}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{experience.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{experience.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Posted {experience.postedDate}</span>
            </div>
          </div>

          {/* Type Badge */}
          <div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {experience.experienceType}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-gray-900 mb-3">About This Experience</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {experience.description}
            </p>
          </div>

          {/* Skills/Technologies */}
          {experience.tags.length > 0 && (
            <div>
              <h3 className="text-gray-900 mb-3">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {experience.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-gray-700 border-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

