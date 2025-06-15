import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  Activity,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import {
  getAllComplaints,
  getBranchComplaints,
  getMyComplaints,
} from "../../services/complaintService";
import { Complaint, ComplaintStatus } from "../../types";

const StatusIcon: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  switch (status) {
    case "pending":
      return <Clock size={20} className="text-warning-500" />;
    case "in_progress":
      return <Activity size={20} className="text-accent-500" />;
    case "resolved":
      return <CheckCircle size={20} className="text-success-500" />;
    case "rejected":
      return <AlertCircle size={20} className="text-error-500" />;
    default:
      return <Clock size={20} className="text-warning-500" />;
  }
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (user?.role == "admin") {
          const data = await getAllComplaints();
          setComplaints(data);
        } else if (user?.role === "branch_supervisor") {
          const data = await getBranchComplaints(user?.branchCode);
          setComplaints(data);
        } else {
          const data = await getMyComplaints();
          setComplaints(data);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  console.log(complaints);

  const counters = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    rejected: complaints.filter((c) => c.status === "rejected").length,
  };

  const recentComplaints = complaints.slice(0, 5);

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-500">Welcome back, {user?.fullName}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-l-4 border-primary-500">
            <div className="flex items-center">
              <div className="p-3 mr-4 rounded-md bg-primary-100">
                <FileText size={24} className="text-primary-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-neutral-500">
                  Total Complaints
                </p>
                <p className="text-2xl font-bold text-neutral-800">
                  {counters.total}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-l-4 border-warning-500">
            <div className="flex items-center">
              <div className="p-3 mr-4 rounded-md bg-warning-100">
                <Clock size={24} className="text-warning-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-neutral-500">Pending</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {counters.pending}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-l-4 border-accent-500">
            <div className="flex items-center">
              <div className="p-3 mr-4 rounded-md bg-accent-100">
                <Activity size={24} className="text-accent-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-neutral-500">In Progress</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {counters.inProgress}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-l-4 border-success-500">
            <div className="flex items-center">
              <div className="p-3 mr-4 rounded-md bg-success-100">
                <CheckCircle size={24} className="text-success-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-neutral-500">Resolved</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {counters.resolved}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Complaints */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-neutral-700">
          Recent Complaints
        </h2>

        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block w-6 h-6 border-2 rounded-full border-neutral-300 border-t-primary-500 animate-spin"></div>
            <p className="mt-2 text-neutral-500">Loading your complaints...</p>
          </div>
        ) : recentComplaints.length > 0 ? (
          <div className="overflow-hidden bg-white rounded-lg shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-neutral-500"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-neutral-500"
                    >
                      Branch
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-neutral-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-neutral-500"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {recentComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar
                            size={16}
                            className="mr-2 text-neutral-400"
                          />
                          <span className="text-sm text-neutral-600">
                            {format(
                              new Date(complaint.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-neutral-600">
                          {complaint.branchCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon status={complaint.status} />
                          <span className="ml-2 text-sm capitalize">
                            {complaint.status.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-neutral-500">
                        <a
                          href={`/complaints`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card>
            <div className="py-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100">
                <FileText size={24} className="text-neutral-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-neutral-700">
                No complaints yet
              </h3>
              <p className="mb-4 text-neutral-500">
                You haven't submitted any complaints. When you do, they'll
                appear here.
              </p>
              <a
                href="/complaints/new"
                className="inline-block px-4 py-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
              >
                Submit a Complaint
              </a>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
