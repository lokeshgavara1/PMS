import React, { useState } from 'react';
import { useProjects, useProjectTasks } from '../api';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAppStore } from '../stores/app';

export default function AcademicWorkflowPage() {
  const { data: projectsData } = useProjects(1, 100);
  const { data: tasksData, refetch: refetchTasks } = useProjectTasks(null);
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'submissions' | 'review' | 'dashboard'>('submissions');
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  const projects = projectsData?.data || [];
  const tasks = tasksData?.data || [];

  // Get role-specific content
  const isStudent = currentUser?.system_role === 'student';
  const isFaculty = currentUser?.system_role === 'faculty';
  const isHOD = currentUser?.system_role === 'hod';
  const isPM = currentUser?.system_role === 'pm' || currentUser?.system_role === 'admin';

  // Mock submissions for students
  const submissions = [
    { id: 1, title: 'Project Proposal', status: 'submitted', submittedAt: '2026-07-01', grade: null },
    { id: 2, title: 'Phase 1 Deliverable', status: 'under_review', submittedAt: '2026-06-28', grade: null },
    { id: 3, title: 'Initial Design', status: 'approved', submittedAt: '2026-06-20', grade: 'A' },
  ];

  // Mock review queue for faculty
  const reviewQueue = [
    { id: 1, student: 'Student 1', title: 'Project Proposal', submittedAt: '2026-07-01', status: 'pending' },
    { id: 2, student: 'Student 2', title: 'Phase 1 Deliverable', submittedAt: '2026-07-01', status: 'pending' },
    { id: 3, student: 'Student 3', title: 'Code Review', submittedAt: '2026-06-30', status: 'approved' },
  ];

  // Mock HOD dashboard data
  const departmentStats = {
    totalStudents: 120,
    averageGPA: 3.45,
    submissionRate: 92,
    approvalRate: 87,
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionForm.title.trim()) {
      console.log('Submitting:', submissionForm);
      setSubmissionForm({ title: '', description: '', file: null });
      alert('Work submitted successfully!');
      refetchTasks();
    }
  };

  const handleReview = (id: number, approved: boolean) => {
    console.log(`Review ${id}: ${approved ? 'Approved' : 'Rejected'}`);
    alert(`Submission ${approved ? 'approved' : 'rejected'}!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Workflow</h1>
          <p className="text-gray-600 mt-1">
            {isStudent && 'Submit and track your project deliverables'}
            {isFaculty && 'Review student submissions and provide feedback'}
            {isHOD && 'Department-wide submission and approval analytics'}
            {isPM && 'Manage project workflows and team deliverables'}
          </p>
        </div>

        {/* Tab Navigation */}
        {(isStudent || isFaculty || isHOD) && (
          <div className="bg-white rounded-lg shadow">
            <div className="flex border-b border-gray-200">
              {isStudent && (
                <>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`flex-1 px-6 py-4 text-center font-medium ${
                      activeTab === 'submissions'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    My Submissions
                  </button>
                </>
              )}
              {isFaculty && (
                <>
                  <button
                    onClick={() => setActiveTab('review')}
                    className={`flex-1 px-6 py-4 text-center font-medium ${
                      activeTab === 'review'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Review Queue
                  </button>
                </>
              )}
              {isHOD && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex-1 px-6 py-4 text-center font-medium ${
                      activeTab === 'dashboard'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Department Dashboard
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Student: My Submissions */}
        {isStudent && activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Submission Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Submit New Work</h2>
              <form onSubmit={handleSubmitWork} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Title
                  </label>
                  <input
                    type="text"
                    value={submissionForm.title}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, title: e.target.value })}
                    placeholder="e.g., Project Proposal, Phase 1 Deliverable"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={submissionForm.description}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
                    placeholder="Describe your submission..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach File (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSubmissionForm({ ...submissionForm, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Submit Work
                </button>
              </form>
            </div>

            {/* Submissions History */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Submission History</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{sub.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                          sub.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {sub.status === 'under_review' ? 'Under Review' : sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                        {sub.grade && (
                          <p className="text-lg font-bold text-gray-900 mt-2">Grade: {sub.grade}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Faculty: Review Queue */}
        {isFaculty && activeTab === 'review' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Student Submissions for Review</h2>
              <p className="text-sm text-gray-600 mt-1">{reviewQueue.filter(r => r.status === 'pending').length} pending</p>
            </div>
            <div className="divide-y divide-gray-200">
              {reviewQueue.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">From: {item.student}</p>
                      <p className="text-sm text-gray-600">Submitted: {new Date(item.submittedAt).toLocaleDateString()}</p>
                    </div>
                    {item.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReview(item.id, true)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReview(item.id, false)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOD: Department Dashboard */}
        {isHOD && activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{departmentStats.totalStudents}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Average GPA</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{departmentStats.averageGPA}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Submission Rate</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{departmentStats.submissionRate}%</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Approval Rate</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{departmentStats.approvalRate}%</p>
            </div>
          </div>
        )}

        {/* PM/Admin: Project Workflows */}
        {isPM && (
          <div className="space-y-6">
            {/* Active Projects */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Active Project Workflows</h2>
                <p className="text-sm text-gray-600 mt-1">Manage and monitor team deliverables</p>
              </div>
              <div className="divide-y divide-gray-200">
                {projects.slice(0, 4).map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="text-sm">
                        <p className="text-gray-600">Category</p>
                        <p className="font-medium text-gray-900 capitalize">{project.category}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-medium text-gray-900">{new Date(project.start_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">End Date</p>
                        <p className="font-medium text-gray-900">{new Date(project.end_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
                <p className="text-blue-700 text-sm font-medium">Active Projects</p>
                <p className="text-4xl font-bold text-blue-900 mt-2">{projects.length}</p>
                <p className="text-blue-600 text-xs mt-2">Projects in progress</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
                <p className="text-green-700 text-sm font-medium">Team Members</p>
                <p className="text-4xl font-bold text-green-900 mt-2">24</p>
                <p className="text-green-600 text-xs mt-2">Across all projects</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6 border border-orange-200">
                <p className="text-orange-700 text-sm font-medium">Total Tasks</p>
                <p className="text-4xl font-bold text-orange-900 mt-2">{tasks.length}</p>
                <p className="text-orange-600 text-xs mt-2">In all workflows</p>
              </div>
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Team Performance</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Task Completion Rate</span>
                      <span className="text-sm font-medium text-gray-900">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
                      <span className="text-sm font-medium text-gray-900">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Quality Score</span>
                      <span className="text-sm font-medium text-gray-900">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
