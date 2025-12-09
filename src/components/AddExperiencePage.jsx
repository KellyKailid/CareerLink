import { useState } from "react";
import { Button } from "./ui/button";
import { ExperienceCardGrid } from "./ExperienceCardGrid";
import { PostExperienceForm } from "./PostExperienceForm";
import { Plus, Pencil, Trash2 } from "lucide-react";

export function AddExperiencePage({
  userExperiences,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  savedExperiences,
  onToggleSave,
  onExperienceClick,
  isLoggedIn = true,
  isAdmin = false,
  onLoginRequired,
}) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const handleSubmitExperience = async (experienceData) => {
    if (editingExperience) {
      // Update existing experience
      await onUpdateExperience(editingExperience._id || editingExperience.id, experienceData);
    } else {
      // Create new experience
      await onAddExperience(experienceData);
    }
    setShowPostForm(false);
    setEditingExperience(null);
  };

  const handleEditClick = (experience) => {
    setEditingExperience(experience);
    setShowPostForm(true);
  };

  const handleCloseForm = () => {
    setShowPostForm(false);
    setEditingExperience(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 text-xl font-medium">
              {isAdmin ? "Manage All Experiences" : "My Shared Experiences"}
            </h2>
            <p className="text-gray-700 mt-2">
              {isAdmin
                ? "As an admin, you can manage all experiences on the platform"
                : "Manage experiences you've shared with the community"}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingExperience(null);
              setShowPostForm(true);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Experience
          </Button>
        </div>
      </div>

      {/* Posted Experiences List */}
      <div className="space-y-4">
        {userExperiences.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-300">
            <div className="max-w-md mx-auto">
              <h3 className="text-gray-900 mb-2">No experiences shared yet</h3>
              <p className="text-gray-700 mb-6">
                Start sharing your experiences to help other students learn from your journey
              </p>
              <Button
                onClick={() => {
                  setEditingExperience(null);
                  setShowPostForm(true);
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Share Your First Experience
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {userExperiences.map((experience) => (
              <div key={experience._id || experience.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <ExperienceCardGrid
                    experience={experience}
                    onSave={() => onToggleSave(experience._id || experience.id)}
                    isSaved={savedExperiences.has(experience._id || experience.id)}
                    onClick={() => onExperienceClick(experience)}
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={onLoginRequired}
                  />
                </div>
                
                {/* Action Buttons Outside */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="bg-white shadow-sm hover:bg-gray-50 border-gray-300 min-w-[100px] px-4 py-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(experience);
                    }}
                  >
                    <Pencil className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white shadow-sm hover:bg-red-50 hover:text-red-600 border-gray-300 hover:border-red-300 min-w-[100px] px-4 py-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this experience?")) {
                        onDeleteExperience(experience._id || experience.id);
                      }
                    }}
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post/Edit Experience Form Modal */}
      {showPostForm && (
        <PostExperienceForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitExperience}
          initialData={editingExperience}
        />
      )}
    </div>
  );
}
