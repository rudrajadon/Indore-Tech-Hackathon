import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  TablePagination, TextField, Select, MenuItem, Button, IconButton, InputAdornment, Tooltip,
  Box, Typography, Container, Dialog
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ImageIcon from "@mui/icons-material/Image";
import MapIcon from "@mui/icons-material/Map";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import MapDisplay from "./MapDisplay";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Removed "verified" from status options and colors
const statusColors = {
  pending: "#ffb300",
  resolved: "#43a047",
  closed: "#888",
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function AdminDashboard({ onBack }) {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [mapDialog, setMapDialog] = useState(null);
  const [feedbackDialog, setFeedbackDialog] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchReports() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(BACKEND_URL + "/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      setError("Failed to fetch reports");
    }
  }

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, []);

  function handleEdit(report) {
    setEditId(report._id);
    setEditStatus(report.status);
    setEditRemarks(report.adminRemarks || "");
  }
  function handleCancelEdit() {
    setEditId(null);
    setEditStatus("");
    setEditRemarks("");
  }

  async function handleSave(report) {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        BACKEND_URL + `/api/reports/${report._id}`,
        { status: editStatus, adminRemarks: editRemarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prev) =>
        prev.map((r) => (r._id === report._id ? res.data.report : r))
      );
      handleCancelEdit();
    } catch (err) {
      setError("Failed to update report");
    } finally {
      setSaving(false);
    }
  }

  // Filtering and sorting
  const filteredReports = useMemo(() => {
    let data = reports;
    if (statusFilter) {
      data = data.filter((r) => r.status === statusFilter);
    }
    if (filter) {
      const f = filter.toLowerCase();
      data = data.filter(
        (r) =>
          r.description?.toLowerCase().includes(f) ||
          r.address?.toLowerCase().includes(f) ||
          r.user?.email?.toLowerCase().includes(f)
      );
    }
    return [...data].sort(getComparator(order, orderBy));
  }, [reports, filter, statusFilter, order, orderBy]);

  // Pagination
  const paginatedReports = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredReports.slice(start, start + rowsPerPage);
  }, [filteredReports, page, rowsPerPage]);

  function handleRequestSort(property) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  // Click to view detail
  function handleViewDetail(reportId) {
    navigate(`/admin/report/${reportId}`);
  }

  return (
    <Box sx={{ mt: 2, width: "100vw", position: "relative", left: "50%", right: "50%", ml: "-50vw", mr: "-50vw", bgcolor: "#f7fafd", minHeight: "100vh", px: 0, py: 3 }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Button onClick={onBack} variant="outlined" color="secondary">
              Back
            </Button> */}
            <TextField
              size="small"
              variant="outlined"
              label="Search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 180, bgcolor: "#fff" }}
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              sx={{ minWidth: 120, bgcolor: "#fff" }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </Box>
          <Typography sx={{ alignSelf: "center", color: "#888" }}>
            Total: {filteredReports.length}
          </Typography>
        </Box>
        {error && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: "#ffeaea", color: "#b71c1c" }}>
            {error}
          </Paper>
        )}
        <TableContainer component={Paper} elevation={3} sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleRequestSort("createdAt")}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "user"}
                    direction={orderBy === "user" ? order : "asc"}
                    onClick={() => handleRequestSort("user")}
                  >
                    User
                  </TableSortLabel>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Photo</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Admin Remarks</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReports.map((r) => (
                <TableRow
                  key={r._id}
                  hover
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewDetail(r._id)}
                >
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{r.user?.email || "N/A"}</TableCell>
                  <TableCell>
                    <Tooltip title={r.description || ""} arrow>
                      <span>
                        {r.description?.length > 30
                          ? r.description.slice(0, 30) + "..."
                          : r.description}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={r.address || ""} arrow>
                      <span>
                        {r.address?.length > 25
                          ? r.address.slice(0, 25) + "..."
                          : r.address}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {r.location?.lat && r.location?.lng ? (
                      <Tooltip title="Preview Map">
                        <IconButton
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            setMapDialog(r);
                          }}
                        >
                          <MapIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {r.photo ? (
                      <Tooltip title="Preview Photo">
                        <IconButton
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedPhoto(r.photo);
                          }}
                        >
                          <ImageIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === r._id ? (
                      <Select
                        size="small"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        sx={{
                          bgcolor: statusColors[editStatus] || "#eee",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: 2,
                          minWidth: 100,
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    ) : (
                      <span
                        style={{
                          background: statusColors[r.status] || "#bbb",
                          color: "#fff",
                          padding: "2px 12px",
                          borderRadius: "12px",
                          fontWeight: 600,
                          fontSize: 13,
                          display: "inline-block",
                        }}
                      >
                        {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === r._id ? (
                      <TextField
                        size="small"
                        value={editRemarks}
                        onChange={(e) => setEditRemarks(e.target.value)}
                        sx={{ minWidth: 120, bgcolor: "#fff" }}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span style={{ fontSize: 14 }}>
                        {r.adminRemarks || "-"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.feedback ? (
                      <Tooltip title={r.feedback} arrow>
                        <IconButton
                          onClick={e => {
                            e.stopPropagation();
                            setFeedbackDialog(r);
                          }}
                        >
                          <FeedbackIcon color="success" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    {editId === r._id ? (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleSave(r)}
                          disabled={saving}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={handleCancelEdit}
                          disabled={saving}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(r)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetail(r._id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ color: "#888" }}>
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredReports.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 8, 12, 20]}
          />
        </TableContainer>

        {/* Photo Dialog */}
        <Dialog open={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} maxWidth="sm" fullWidth>
          <Box sx={{ position: "relative" }}>
            <CloseIcon
              onClick={() => setSelectedPhoto(null)}
              sx={{ position: "absolute", right: 8, top: 8, cursor: "pointer", zIndex: 1 }}
            />
            <Box sx={{ textAlign: "center", p: 3 }}>
              <img
                src={selectedPhoto}
                alt="Report"
                style={{
                  maxWidth: "100%",
                  maxHeight: 400,
                  borderRadius: 10,
                  margin: "auto",
                }}
              />
            </Box>
          </Box>
        </Dialog>

        {/* Map Dialog */}
        <Dialog open={!!mapDialog} onClose={() => setMapDialog(null)} maxWidth="sm" fullWidth>
          <Box sx={{ position: "relative" }}>
            <CloseIcon
              onClick={() => setMapDialog(null)}
              sx={{ position: "absolute", right: 8, top: 8, cursor: "pointer", zIndex: 1 }}
            />
            <Box sx={{ p: 2 }}>
              {mapDialog && mapDialog.location && (
                <MapDisplay lat={mapDialog.location.lat} lng={mapDialog.location.lng} />
              )}
            </Box>
          </Box>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={!!feedbackDialog} onClose={() => setFeedbackDialog(null)} maxWidth="sm" fullWidth>
          <Box sx={{ position: "relative" }}>
            <CloseIcon
              onClick={() => setFeedbackDialog(null)}
              sx={{ position: "absolute", right: 8, top: 8, cursor: "pointer", zIndex: 1 }}
            />
            <Box sx={{ p: 2 }}>
              {feedbackDialog && (
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {feedbackDialog.feedback}
                </Typography>
              )}
            </Box>
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
}