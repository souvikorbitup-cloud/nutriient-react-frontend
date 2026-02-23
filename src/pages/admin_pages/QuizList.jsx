import React, { useEffect, useState } from "react";
import { getAllQuizReports } from "../../api/quiz";
import AdminLoading from "./AdminLoading";
import { useLocation } from "react-router-dom";

const QuizList = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const location = useLocation();

  const fetchReports = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await getAllQuizReports(pageNumber, limit);
      setReports(data.data.reports);
      setPagination(data.data.pagination);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Use cached products when coming back
    if (location.state?.orders?.length) {
      setOrders(location.state.orders);
      setPagination(location.state.pagination || null);
      setLoading(false);
    } else {
      fetchReports(1);
    }
  }, []);

  const toggleExpand = (sessionId) => {
    setExpanded(expanded === sessionId ? null : sessionId);
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Quiz Reports</h2>
      </div>

      {!loading && reports.length === 0 && <p>No reports found</p>}

      {!loading &&
        reports.map((report) => (
          <div
            key={report.sessionId}
            className="mb-6 rounded-2xl border border-gray-200 bg-white p-6"
          >
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  User Name: <span className="text-dark-green capitalize">{report.userInfo?.fullName || "Anonymous User"}</span>
                </p>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    🎯 Goal:{" "}
                    <span className="font-medium text-gray-700">
                      {report.selectedGoal || "-"}
                    </span>
                  </span>

                  <span>
                    📅 {new Date(report.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Status Badge */}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    report.currentSection === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {report.currentSection}
                </span>

                {/* Expand Button */}
                <button
                  onClick={() => toggleExpand(report.sessionId)}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 cursor-pointer"
                >
                  {expanded === report.sessionId
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expanded === report.sessionId && (
              <div className="mt-6 space-y-8 border-t border-gray-200 pt-6">
                {/* USER INFO */}
                {report.userInfo && (
                  <div>
                    <h4 className="mb-4 text-md font-semibold text-gray-800">
                      User Information
                    </h4>

                    <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2 md:grid-cols-3">
                      <div>
                        <span className="font-medium text-gray-700">
                          Mobile:
                        </span>{" "}
                        {report.userInfo.mobile}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>{" "}
                        {report.userInfo.email || "-"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Age:</span>{" "}
                        {report.userInfo.age || "-"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Gender:
                        </span>{" "}
                        {report.userInfo.gender || "-"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Weight:
                        </span>{" "}
                        {report.userInfo.weight || "-"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Body Type:
                        </span>{" "}
                        {report.userInfo.bodyType || "-"}
                      </div>
                    </div>
                  </div>
                )}

                {/* GOALS */}
                <div>
                  <h4 className="mb-4 text-md font-semibold text-gray-800">
                    Goals Questions
                  </h4>

                  {report.goals.length === 0 ? (
                    <p className="text-sm text-gray-400">No data available</p>
                  ) : (
                    <div className="space-y-4">
                      {report.goals.map((q, index) => (
                        <div key={index} className="rounded-xl bg-gray-50 p-4">
                          <p className="font-medium text-gray-800">
                            {q.questionText}
                          </p>

                          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                            {q.answers.map((a, i) => (
                              <li key={i}>{a.label}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* LIFESTYLE */}
                <div>
                  <h4 className="mb-4 text-md font-semibold text-gray-800">
                    Lifestyle Questions
                  </h4>

                  {report.lifestyle.length === 0 ? (
                    <p className="text-sm text-gray-400">No data available</p>
                  ) : (
                    <div className="space-y-4">
                      {report.lifestyle.map((q, index) => (
                        <div key={index} className="rounded-xl bg-gray-50 p-4">
                          <p className="font-medium text-gray-800">
                            {q.questionText}
                          </p>

                          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                            {q.answers.map((a, i) => (
                              <li key={i}>{a.label}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

      {/* ================= PAGINATION ================= */}
      {pagination?.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
          {/* PREV */}
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => fetchReports(page - 1)}
            className={`px-3 py-2 rounded-lg border text-sm
              ${
                pagination.hasPrevPage
                  ? "hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => fetchReports(pageNumber)}
                className={`px-4 py-2 rounded-lg border text-sm
                  ${
                    page === pageNumber
                      ? "bg-dark-green text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* NEXT */}
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => fetchReports(page + 1)}
            className={`px-3 py-2 rounded-lg border text-sm
              ${
                pagination.hasNextPage
                  ? "hover:bg-gray-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizList;
