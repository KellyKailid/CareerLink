import { useState } from "react";
import { Button } from "./ui/button";
import { JobCardGrid } from "./JobCardGrid";
import { PostJobForm } from "./PostJobForm";
import { Plus, Pencil, Trash2 } from "lucide-react";

export function AddJobsPage({
  userJobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  savedJobs,
  onToggleSave,
  onJobClick,
  isLoggedIn = true,
  isAdmin = false,
  onLoginRequired,
}) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const handleSubmitJob = async (jobData) => {
    if (editingJob) {
      // Update existing job
      await onUpdateJob(editingJob._id || editingJob.id, jobData);
    } else {
      // Create new job
      await onAddJob(jobData);
    }
    setShowPostForm(false);
    setEditingJob(null);
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setShowPostForm(true);
  };

  const handleCloseForm = () => {
    setShowPostForm(false);
    setEditingJob(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 text-xl font-medium">
              {isAdmin ? "Manage All Jobs" : "My Posted Jobs"}
            </h2>
            <p className="text-gray-700 mt-2">
              {isAdmin 
                ? "As an admin, you can manage all jobs on the platform" 
                : "Manage jobs you've posted to the platform"}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingJob(null);
              setShowPostForm(true);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Job
          </Button>
        </div>
      </div>

      {/* Posted Jobs List */}
      <div className="space-y-4">
        {userJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-300">
            <div className="max-w-md mx-auto">
              <h3 className="text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-700 mb-6">
                Start posting jobs to help students find opportunities
              </p>
              <Button
                onClick={() => {
                  setEditingJob(null);
                  setShowPostForm(true);
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post Your First Job
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {userJobs.map((job) => (
              <div key={job._id || job.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <JobCardGrid
                    job={job}
                    onSave={() => onToggleSave(job._id || job.id)}
                    isSaved={savedJobs.has(job._id || job.id)}
                    onClick={() => onJobClick(job)}
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
                      handleEditClick(job);
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
                      if (confirm("Are you sure you want to delete this job?")) {
                        onDeleteJob(job._id || job.id);
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

      {/* Post/Edit Job Form Modal */}
      {showPostForm && (
        <PostJobForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitJob}
          initialData={editingJob}
        />
      )}
    </div>
  );
}
