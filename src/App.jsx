import { useState, useMemo, useEffect, useCallback } from "react";
import { JobCardGrid } from "./components/JobCardGrid";
import { JobDetailModal } from "./components/JobDetailModal";
import { LoginModal } from "./components/LoginModal";
import { AddJobsPage } from "./components/AddJobsPage";
import { ExperienceCardGrid } from "./components/ExperienceCardGrid";
import { ExperienceDetailModal } from "./components/ExperienceDetailModal";
import { AddExperiencePage } from "./components/AddExperiencePage";
import { FilterSidebar } from "./components/FilterSidebar";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Search, ChevronDown } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { jobsAPI, experiencesAPI, savedAPI } from "./services/api";

const quickFilters = [
  "Software Engineer",
  "Data / ML",
  "Systems",
  "Research",
  "Remote-friendly",
];

export default function App() {
  const { user, isLoggedIn, logout, loading: authLoading } = useAuth();

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [userPostedJobs, setUserPostedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [jobsLoading, setJobsLoading] = useState(true);

  // Experiences state
  const [experiences, setExperiences] = useState([]);
  const [userPostedExperiences, setUserPostedExperiences] = useState([]);
  const [savedExperienceIds, setSavedExperienceIds] = useState(new Set());
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [experienceSearchQuery, setExperienceSearchQuery] = useState("");
  const [experiencesLoading, setExperiencesLoading] = useState(true);

  // UI state
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);
  const [currentView, setCurrentView] = useState("jobs");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);
  const [showExperiencesDropdown, setShowExperiencesDropdown] = useState(false);
  const [savedTab, setSavedTab] = useState("jobs");

  // Sidebar filters
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("soonest");

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    try {
      setJobsLoading(true);
      const data = await jobsAPI.getAll();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setJobsLoading(false);
    }
  }, []);

  // Fetch user's posted jobs
  const fetchMyJobs = useCallback(async () => {
    if (!isLoggedIn) {
      setUserPostedJobs([]);
      return;
    }
    try {
      const data = await jobsAPI.getMyJobs();
      setUserPostedJobs(data);
    } catch (error) {
      console.error("Failed to fetch my jobs:", error);
    }
  }, [isLoggedIn]);

  // Fetch experiences from API
  const fetchExperiences = useCallback(async () => {
    try {
      setExperiencesLoading(true);
      const data = await experiencesAPI.getAll();
      setExperiences(data);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setExperiencesLoading(false);
    }
  }, []);

  // Fetch user's posted experiences
  const fetchMyExperiences = useCallback(async () => {
    if (!isLoggedIn) {
      setUserPostedExperiences([]);
      return;
    }
    try {
      const data = await experiencesAPI.getMyExperiences();
      setUserPostedExperiences(data);
    } catch (error) {
      console.error("Failed to fetch my experiences:", error);
    }
  }, [isLoggedIn]);

  // Fetch saved items
  const fetchSavedItems = useCallback(async () => {
    if (!isLoggedIn) {
      setSavedJobIds(new Set());
      setSavedExperienceIds(new Set());
      return;
    }
    try {
      const [savedJobs, savedExperiences] = await Promise.all([
        savedAPI.getSavedJobs(),
        savedAPI.getSavedExperiences(),
      ]);
      setSavedJobIds(new Set(savedJobs.map((job) => job._id)));
      setSavedExperienceIds(new Set(savedExperiences.map((exp) => exp._id)));
    } catch (error) {
      console.error("Failed to fetch saved items:", error);
    }
  }, [isLoggedIn]);

  // Initial data fetch
  useEffect(() => {
    fetchJobs();
    fetchExperiences();
  }, [fetchJobs, fetchExperiences]);

  // Fetch user-specific data when login state changes
  useEffect(() => {
    if (!authLoading) {
      fetchMyJobs();
      fetchMyExperiences();
      fetchSavedItems();
    }
  }, [isLoggedIn, authLoading, fetchMyJobs, fetchMyExperiences, fetchSavedItems]);

  // Get all unique tags from skills
  const allTags = useMemo(() => {
    const tags = new Set();
    jobs.forEach((job) => {
      if (job.skills) {
        job.skills.split(',').forEach((skill) => tags.add(skill.trim()));
      }
    });
    return Array.from(tags).sort();
  }, [jobs]);

  // Toggle save job
  const handleToggleSave = async (jobId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      if (savedJobIds.has(jobId)) {
        await savedAPI.unsaveJob(jobId);
        setSavedJobIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await savedAPI.saveJob(jobId);
        setSavedJobIds((prev) => new Set([...prev, jobId]));
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  // Add job
  const handleAddJob = async (jobData) => {
    try {
      const newJob = await jobsAPI.create(jobData);
      setUserPostedJobs((prev) => [newJob, ...prev]);
      // Also refresh the main jobs list
      fetchJobs();
    } catch (error) {
      console.error("Failed to add job:", error);
      throw error;
    }
  };

  // Update job
  const handleUpdateJob = async (jobId, jobData) => {
    try {
      const updatedJob = await jobsAPI.update(jobId, jobData);
      setUserPostedJobs((prev) =>
        prev.map((job) => (job._id === jobId ? updatedJob : job))
      );
      // Also refresh the main jobs list
      fetchJobs();
    } catch (error) {
      console.error("Failed to update job:", error);
      throw error;
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    try {
      await jobsAPI.delete(jobId);
      setUserPostedJobs((prev) => prev.filter((job) => job._id !== jobId));
      // Also refresh the main jobs list
      fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  // Toggle save experience
  const handleToggleSaveExperience = async (experienceId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      if (savedExperienceIds.has(experienceId)) {
        await savedAPI.unsaveExperience(experienceId);
        setSavedExperienceIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(experienceId);
          return newSet;
        });
      } else {
        await savedAPI.saveExperience(experienceId);
        setSavedExperienceIds((prev) => new Set([...prev, experienceId]));
      }
    } catch (error) {
      console.error("Failed to toggle save experience:", error);
    }
  };

  // Add experience
  const handleAddExperience = async (experienceData) => {
    try {
      const newExperience = await experiencesAPI.create(experienceData);
      setUserPostedExperiences((prev) => [newExperience, ...prev]);
      // Also refresh the main experiences list
      fetchExperiences();
    } catch (error) {
      console.error("Failed to add experience:", error);
      throw error;
    }
  };

  // Update experience
  const handleUpdateExperience = async (experienceId, experienceData) => {
    try {
      const updatedExperience = await experiencesAPI.update(experienceId, experienceData);
      setUserPostedExperiences((prev) =>
        prev.map((exp) => (exp._id === experienceId ? updatedExperience : exp))
      );
      // Also refresh the main experiences list
      fetchExperiences();
    } catch (error) {
      console.error("Failed to update experience:", error);
      throw error;
    }
  };

  // Delete experience
  const handleDeleteExperience = async (experienceId) => {
    try {
      await experiencesAPI.delete(experienceId);
      setUserPostedExperiences((prev) => prev.filter((exp) => exp._id !== experienceId));
      // Also refresh the main experiences list
      fetchExperiences();
    } catch (error) {
      console.error("Failed to delete experience:", error);
    }
  };

  const handleJobTypeChange = (jobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobType)
        ? prev.filter((jt) => jt !== jobType)
        : [...prev, jobType]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedLocations([]);
    setSelectedTags([]);
    setSelectedQuickFilter(null);
  };

  // Helper to format job for display
  const formatJobForDisplay = (job) => ({
    ...job,
    id: job._id,
    type: job.jobType,
    salary: job.salaryMin && job.salaryMax 
      ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
      : job.salaryMin 
        ? `$${job.salaryMin.toLocaleString()}+`
        : job.salaryMax
          ? `Up to $${job.salaryMax.toLocaleString()}`
          : null,
    tags: job.skills ? job.skills.split(',').map(s => s.trim()) : [],
    postedDate: new Date(job.createdAt).toLocaleDateString(),
    displayDeadline: job.deadline ? new Date(job.deadline).toLocaleDateString() : null,
    // Keep raw deadline for form editing
    deadline: job.deadline,
    isStudentAdded: job.postedBy?.role === 'user',
  });

  // Helper to format experience for display
  const formatExperienceForDisplay = (exp) => ({
    ...exp,
    id: exp._id,
    experienceType: exp.type,
    description: exp.content,
    location: exp.company, // Use company as location display
    tags: [], // Backend doesn't have tags for experiences
    postedDate: new Date(exp.createdAt).toLocaleDateString(),
  });

  // Filter jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs.map(formatJobForDisplay);

    // Apply search filter
    if (mainSearchQuery) {
      const query = mainSearchQuery.toLowerCase();
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply job type filter
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((job) =>
        selectedJobTypes.includes(job.jobType)
      );
    }

    // Apply location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((job) => {
        const locationLower = job.location.toLowerCase();
        
        // Determine the job's location category
        let jobLocationCategory;
        if (locationLower.includes("remote")) {
          jobLocationCategory = "Remote";
        } else if (locationLower.includes("hybrid")) {
          jobLocationCategory = "Hybrid";
        } else {
          jobLocationCategory = "On-site";
        }
        
        // Check if the job's category matches any selected filter
        return selectedLocations.includes(jobLocationCategory);
      });
    }

    // Apply tags filter (OR logic - job must have at least one selected skill)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((job) =>
        selectedTags.some((tag) => job.tags.includes(tag))
      );
    }

    // Apply quick filter
    if (selectedQuickFilter) {
      filtered = filtered.filter((job) =>
        (selectedQuickFilter === "Remote-friendly" &&
          job.location.toLowerCase().includes("remote")) ||
        job.tags.some((tag) =>
          tag.toLowerCase().includes(selectedQuickFilter.toLowerCase())
        ) ||
        job.title.toLowerCase().includes(selectedQuickFilter.toLowerCase())
      );
    }

    // Sort jobs
    if (sortBy === "soonest") {
      filtered = [...filtered].sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sortBy === "recent") {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "company") {
      filtered = [...filtered].sort((a, b) => 
        a.company.localeCompare(b.company)
      );
    }

    return filtered;
  }, [jobs, mainSearchQuery, selectedJobTypes, selectedLocations, selectedTags, selectedQuickFilter, sortBy]);

  // Filter experiences
  const filteredExperiences = useMemo(() => {
    let filtered = experiences.map(formatExperienceForDisplay);

    if (experienceSearchQuery) {
      const query = experienceSearchQuery.toLowerCase();
      filtered = filtered.filter((exp) =>
        exp.title.toLowerCase().includes(query) ||
        exp.company.toLowerCase().includes(query) ||
        exp.type.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [experiences, experienceSearchQuery]);

  // Get saved jobs for display
  const savedJobsForDisplay = useMemo(() => {
    return jobs
      .filter((job) => savedJobIds.has(job._id))
      .map(formatJobForDisplay);
  }, [jobs, savedJobIds]);

  // Get saved experiences for display
  const savedExperiencesForDisplay = useMemo(() => {
    return experiences
      .filter((exp) => savedExperienceIds.has(exp._id))
      .map(formatExperienceForDisplay);
  }, [experiences, savedExperienceIds]);

  // Handle logout
  const handleLogout = () => {
    logout();
    setCurrentView("jobs");
    setSavedJobIds(new Set());
    setSavedExperienceIds(new Set());
    setUserPostedJobs([]);
    setUserPostedExperiences([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 
              className="text-white text-xl font-bold cursor-pointer hover:text-indigo-100 transition-colors"
              onClick={() => setCurrentView("jobs")}
            >
              🚀 CareerLink
            </h1>
            <nav className="flex items-center gap-8">
              {/* Jobs Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowJobsDropdown(!showJobsDropdown)}
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    currentView === "jobs" || currentView === "add-jobs"
                      ? "text-white"
                      : "text-indigo-100 hover:text-white"
                  }`}
                >
                  Jobs
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showJobsDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showJobsDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowJobsDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={() => {
                          setCurrentView("jobs");
                          setShowJobsDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Find Jobs
                      </button>
                      <button
                        onClick={() => {
                          if (isLoggedIn) {
                            setCurrentView("add-jobs");
                          } else {
                            setShowLoginModal(true);
                          }
                          setShowJobsDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Add Jobs
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setCurrentView("saved");
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                className={`font-medium transition-colors ${currentView === "saved" ? "text-white" : "text-indigo-100 hover:text-white"}`}
              >
                ⭐ Saved
              </button>

              {/* Experiences Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExperiencesDropdown(!showExperiencesDropdown)}
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    currentView === "find-experiences" || currentView === "add-experience"
                      ? "text-white"
                      : "text-indigo-100 hover:text-white"
                  }`}
                >
                  Experiences
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showExperiencesDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showExperiencesDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowExperiencesDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={() => {
                          setCurrentView("find-experiences");
                          setShowExperiencesDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Find Experiences
                      </button>
                      <button
                        onClick={() => {
                          if (isLoggedIn) {
                            setCurrentView("add-experience");
                          } else {
                            setShowLoginModal(true);
                          }
                          setShowExperiencesDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Add Experience
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* User info and login/logout */}
              <div className="flex items-center gap-4">
                {isLoggedIn && user && (
                  <span className="text-white text-sm">
                    👋 {user.name} {user.role === 'admin' && <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold ml-1">Admin</span>}
                  </span>
                )}
                <Button
                  className="bg-white text-indigo-600 font-semibold hover:bg-indigo-100 transition-colors shadow-md"
                  onClick={() => {
                    if (isLoggedIn) {
                      handleLogout();
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                >
                  {isLoggedIn ? "Log out" : "Log in"}
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show on Jobs view */}
      {currentView === "jobs" && (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100">
          <div className="max-w-[1600px] mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-3xl font-bold mb-3">
                ✨ Find Your Next Opportunity
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Discover amazing jobs and internships tailored for you
              </p>

              <div className="flex gap-3 mb-6">
                <Input
                  type="text"
                  placeholder="Search by role, company, tech stack..."
                  value={mainSearchQuery}
                  onChange={(e) => setMainSearchQuery(e.target.value)}
                  className="flex-1 bg-white border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                />
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 transition-all duration-200 hover:scale-105 shadow-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {quickFilters.map((filter, index) => {
                  const colors = [
                    "border-indigo-400 text-indigo-600 hover:bg-indigo-50",
                    "border-purple-400 text-purple-600 hover:bg-purple-50",
                    "border-pink-400 text-pink-600 hover:bg-pink-50",
                    "border-emerald-400 text-emerald-600 hover:bg-emerald-50",
                    "border-amber-400 text-amber-600 hover:bg-amber-50",
                  ];
                  const activeColors = [
                    "bg-indigo-100 border-indigo-500",
                    "bg-purple-100 border-purple-500",
                    "bg-pink-100 border-pink-500",
                    "bg-emerald-100 border-emerald-500",
                    "bg-amber-100 border-amber-500",
                  ];
                  return (
                    <Button
                      key={filter}
                      variant="outline"
                      onClick={() =>
                        setSelectedQuickFilter(
                          selectedQuickFilter === filter ? null : filter
                        )
                      }
                      className={`${colors[index % colors.length]} ${
                        selectedQuickFilter === filter ? activeColors[index % activeColors.length] : "bg-white"
                      }`}
                    >
                      {filter}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentView === "add-jobs" ? (
        <AddJobsPage
          userJobs={
            user?.role === 'admin' 
              ? jobs.map(formatJobForDisplay) 
              : userPostedJobs.map(formatJobForDisplay)
          }
          onAddJob={handleAddJob}
          onUpdateJob={handleUpdateJob}
          onDeleteJob={handleDeleteJob}
          savedJobs={savedJobIds}
          onToggleSave={handleToggleSave}
          onJobClick={setSelectedJob}
          isLoggedIn={isLoggedIn}
          isAdmin={user?.role === 'admin'}
          onLoginRequired={() => setShowLoginModal(true)}
        />
      ) : currentView === "add-experience" ? (
        <AddExperiencePage
          userExperiences={
            user?.role === 'admin'
              ? experiences.map(formatExperienceForDisplay)
              : userPostedExperiences.map(formatExperienceForDisplay)
          }
          onAddExperience={handleAddExperience}
          onUpdateExperience={handleUpdateExperience}
          onDeleteExperience={handleDeleteExperience}
          savedExperiences={savedExperienceIds}
          onToggleSave={handleToggleSaveExperience}
          onExperienceClick={setSelectedExperience}
          isLoggedIn={isLoggedIn}
          isAdmin={user?.role === 'admin'}
          onLoginRequired={() => setShowLoginModal(true)}
        />
      ) : currentView === "find-experiences" ? (
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-gray-900 text-xl font-medium">Find Experiences</h2>
            <p className="text-gray-700 mt-2">
              Learn from other students' experiences
            </p>
          </div>

          <div className="mb-6">
            <div className="flex gap-3 max-w-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search by title, company, or type..."
                  value={experienceSearchQuery}
                  onChange={(e) => setExperienceSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6">
                Search
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-900">
              {experiencesLoading ? "Loading..." : `${filteredExperiences.length} results`}
            </p>
          </div>

          <div className="space-y-4">
            {experiencesLoading ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
                <p className="text-gray-600">Loading experiences...</p>
              </div>
            ) : filteredExperiences.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
                <p className="text-gray-600">
                  No experiences found matching your search.
                </p>
              </div>
            ) : (
              filteredExperiences.map((experience) => (
                <ExperienceCardGrid
                  key={experience.id}
                  experience={experience}
                  onSave={() => handleToggleSaveExperience(experience._id || experience.id)}
                  isSaved={savedExperienceIds.has(experience._id || experience.id)}
                  onClick={() => setSelectedExperience(experience)}
                  isLoggedIn={isLoggedIn}
                  onLoginRequired={() => setShowLoginModal(true)}
                />
              ))
            )}
          </div>
        </div>
      ) : currentView === "saved" ? (
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-gray-900 text-xl font-medium">Saved Items</h2>
            <p className="text-gray-700 mt-2">
              Jobs and experiences you've saved for later
            </p>

            <Tabs
              value={savedTab}
              onValueChange={(value) => setSavedTab(value)}
              className="mt-6"
            >
              <TabsList className="bg-gray-100 border border-gray-300">
                <TabsTrigger
                  value="jobs"
                  className="data-[state=active]:bg-white"
                >
                  Saved Jobs ({savedJobsForDisplay.length})
                </TabsTrigger>
                <TabsTrigger
                  value="experiences"
                  className="data-[state=active]:bg-white"
                >
                  Saved Experiences ({savedExperiencesForDisplay.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="mt-6">
                <div className="space-y-4">
                  {savedJobsForDisplay.map((job) => (
                    <JobCardGrid
                      key={job.id}
                      job={job}
                      onSave={() => handleToggleSave(job._id || job.id)}
                      isSaved={true}
                      onClick={() => setSelectedJob(job)}
                      isLoggedIn={isLoggedIn}
                      onLoginRequired={() => setShowLoginModal(true)}
                    />
                  ))}
                  {savedJobsForDisplay.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
                      <p className="text-gray-600">
                        No saved jobs yet. Start saving jobs to see them here!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="experiences" className="mt-6">
                <div className="space-y-4">
                  {savedExperiencesForDisplay.map((experience) => (
                    <ExperienceCardGrid
                      key={experience.id}
                      experience={experience}
                      onSave={() => handleToggleSaveExperience(experience._id || experience.id)}
                      isSaved={true}
                      onClick={() => setSelectedExperience(experience)}
                      isLoggedIn={isLoggedIn}
                      onLoginRequired={() => setShowLoginModal(true)}
                    />
                  ))}
                  {savedExperiencesForDisplay.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
                      <p className="text-gray-600">
                        No saved experiences yet. Start saving experiences to see them here!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-900">
              {jobsLoading ? "Loading..." : `${filteredJobs.length} results`}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-64 bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soonest">Soonest deadline</SelectItem>
                  <SelectItem value="recent">Most recent</SelectItem>
                  <SelectItem value="company">Company name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-start h-[calc(100vh-28rem)]">
                <div className="col-span-4 h-full overflow-y-auto">
                    <FilterSidebar
                      selectedJobTypes={selectedJobTypes}
                      onJobTypeChange={handleJobTypeChange}
                      selectedLocations={selectedLocations}
                      onLocationChange={handleLocationChange}
                      selectedTags={selectedTags}
                      onTagChange={handleTagChange}
                      availableTags={allTags}
                      onClearAll={handleClearAllFilters}
                    />
                  </div>

            <div className="col-span-8 h-full overflow-y-auto">
              <div className="space-y-4 pr-2">
                {jobsLoading ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
                    <p className="text-gray-600">Loading jobs...</p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
                    <p className="text-gray-600">
                      No jobs found matching your criteria.
                    </p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <JobCardGrid
                      key={job.id}
                      job={job}
                      onSave={() => handleToggleSave(job._id || job.id)}
                      isSaved={savedJobIds.has(job._id || job.id)}
                      onClick={() => setSelectedJob(job)}
                      isLoggedIn={isLoggedIn}
                      onLoginRequired={() => setShowLoginModal(true)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={() => handleToggleSave(selectedJob._id || selectedJob.id)}
          isSaved={savedJobIds.has(selectedJob._id || selectedJob.id)}
          isLoggedIn={isLoggedIn}
          onLoginRequired={() => setShowLoginModal(true)}
        />
      )}

      {/* Experience Detail Modal */}
      {selectedExperience && (
        <ExperienceDetailModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
