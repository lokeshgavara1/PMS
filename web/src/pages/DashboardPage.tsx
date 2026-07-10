import { useProjects } from '../api';
import { Link } from 'react-router-dom';
import { BarChartIcon, FolderIcon, CheckIcon } from '../components/SidebarIcons';

export default function DashboardPage() {
  const { data: projectsData, isLoading } = useProjects(1, 6);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const projects = projectsData?.data || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your project management dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-sky-blue-light to-sky-blue-50 rounded-2xl shadow p-8 text-gray-900 overflow-hidden relative group hover:shadow-lg transition duration-300 border border-sky-teal-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-teal-100 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition duration-300 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sky-teal-500 text-sm font-semibold">Total Projects</p>
              <BarChartIcon size={32} className="text-sky-teal-500" />
            </div>
            <p className="text-5xl font-bold text-navy-500">{projectsData?.pagination.total || 0}</p>
            <p className="text-teal-500 text-sm mt-3">Active projects in system</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-light to-teal-50 rounded-2xl shadow p-8 text-gray-900 overflow-hidden relative group hover:shadow-lg transition duration-300 border border-teal-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition duration-300 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-teal-500 text-sm font-semibold">My Projects</p>
              <FolderIcon size={32} className="text-teal-500" />
            </div>
            <p className="text-5xl font-bold text-teal-500">{projects.length}</p>
            <p className="text-teal-700 text-sm mt-3">You're involved in</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-beige-light to-beige-50 rounded-2xl shadow p-8 text-gray-900 overflow-hidden relative group hover:shadow-lg transition duration-300 border border-beige-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-beige-100 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition duration-300 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-beige-500 text-sm font-semibold">Active Tasks</p>
              <CheckIcon size={32} className="text-beige-500" />
            </div>
            <p className="text-5xl font-bold text-navy-500">8</p>
            <p className="text-teal-500 text-sm mt-3">Assigned to you</p>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
          <Link to="/projects" className="text-teal-500 hover:text-teal-600 text-sm font-medium">
            View All →
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Project</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">End Date</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.description?.slice(0, 60)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-sky-teal-100 text-sky-teal-500 rounded">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(project.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-teal-500 hover:text-teal-600 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-sm">No projects yet. Create your first project to get started.</p>
            <Link
              to="/projects"
              className="inline-block mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-sm font-medium"
            >
              Create Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
