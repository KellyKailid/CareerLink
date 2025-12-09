import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export function FilterSidebar({
  selectedJobTypes,
  onJobTypeChange,
  selectedLocations,
  onLocationChange,
  selectedTags,
  onTagChange,
  availableTags,
  onClearAll,
}) {
  // Job types matching backend enum values
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const locations = ["Remote", "On-site", "Hybrid"];

  // Check if any filters are selected
  const hasActiveFilters = selectedJobTypes.length > 0 || selectedLocations.length > 0 || selectedTags.length > 0;

  const jobTypeColors = {
    "Full-time": "text-emerald-600",
    "Part-time": "text-amber-600",
    "Contract": "text-purple-600",
    "Internship": "text-indigo-600",
  };

  const locationColors = {
    "Remote": "text-cyan-600",
    "On-site": "text-rose-600",
    "Hybrid": "text-violet-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 font-semibold flex items-center">
          <span className="mr-2">🎯</span> Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-auto p-1"
          >
            ✕ Clear all
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-gray-800 font-medium mb-3 flex items-center">
            <span className="mr-2">💼</span> Job Type
          </h3>
          <div className="space-y-2">
            {jobTypes.map((jobType) => (
              <div key={jobType} className="flex items-center space-x-2 group">
                <Checkbox
                  id={`jobtype-${jobType}`}
                  checked={selectedJobTypes.includes(jobType)}
                  onCheckedChange={() => onJobTypeChange(jobType)}
                  className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <Label
                  htmlFor={`jobtype-${jobType}`}
                  className={`cursor-pointer transition-colors group-hover:${jobTypeColors[jobType]} ${
                    selectedJobTypes.includes(jobType) ? jobTypeColors[jobType] + " font-medium" : "text-gray-600"
                  }`}
                >
                  {jobType}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-gray-800 font-medium mb-3 flex items-center">
            <span className="mr-2">📍</span> Location
          </h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2 group">
                <Checkbox
                  id={`location-${location}`}
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={() => onLocationChange(location)}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label
                  htmlFor={`location-${location}`}
                  className={`cursor-pointer transition-colors ${
                    selectedLocations.includes(location) ? locationColors[location] + " font-medium" : "text-gray-600"
                  }`}
                >
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {availableTags.length > 0 && (
          <div>
            <h3 className="text-gray-800 font-medium mb-3 flex items-center">
              <span className="mr-2">🛠️</span> Skills / Tech Stack
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2 group">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => onTagChange(tag)}
                    className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                  />
                  <Label
                    htmlFor={`tag-${tag}`}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag) ? "text-pink-600 font-medium" : "text-gray-600"
                    }`}
                  >
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
