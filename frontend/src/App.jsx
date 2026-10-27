
import { useEffect, useState } from "react";
import "./App.css";

const API = "/api/employees";

const emptyForm = {
  employeeId: "",
  fullName: "",
  gender: "Nam",
  dateOfBirth: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  hireDate: "",
  status: "Dang lam viec"
};

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function request(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Yeu cau that bai");
    }

    return data;
  }

  async function loadEmployees(keyword = "") {
    setLoading(true);
    setError("");

    try {
      const url = keyword
        ? `${API}?search=${encodeURIComponent(keyword)}`
        : API;

      const data = await request(url);
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditing(false);
  }

  function editEmployee(employee) {
    setForm({
      employeeId: employee.employeeId,
      fullName: employee.fullName || "",
      gender: employee.gender || "Nam",
      dateOfBirth: employee.dateOfBirth || "",
      department: employee.department || "",
      position: employee.position || "",
      email: employee.email || "",
      phone: employee.phone || "",
      hireDate: employee.hireDate || "",
      status: employee.status || "Dang lam viec"
    });

    setEditing(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.employeeId.trim() ||
        !form.fullName.trim() ||
        !form.email.trim()) {
      setError("Vui long nhap ma NV, ho ten va email");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const url = editing
        ? `${API}/${encodeURIComponent(form.employeeId)}`
        : API;

      const method = editing ? "PUT" : "POST";

      await request(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      setMessage(
        editing
          ? "Cap nhat nhan vien thanh cong!"
          : "Them nhan vien thanh cong!"
      );

      resetForm();
      await loadEmployees(search);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(employee) {
    const confirmed = window.confirm(
      `Ban co chac muon xoa ${employee.fullName}?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await request(
        `${API}/${encodeURIComponent(employee.employeeId)}`,
        { method: "DELETE" }
      );

      setMessage("Xoa nhan vien thanh cong!");
      await loadEmployees(search);
    } catch (err) {
      setError(err.message);
    }
  }

  async function viewEmployee(employeeId) {
    setError("");

    try {
      const data = await request(
        `${API}/${encodeURIComponent(employeeId)}`
      );
      setSelected(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>HỆ THỐNG QUẢN LÝ NHÂN SỰ</h1>
        <p>Ứng dụng quản lý nhân viên trên nền tảng Cloud</p>
        <span>Nguyễn Chí Bảo - 237957 - DH23TIN10</span>
      </header>

      <main className="container">
        <section className="card">
          <h2>
            {editing
              ? "Cập nhật thông tin nhân viên"
              : "Thêm nhân viên mới"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Mã nhân viên *
                <input
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  disabled={editing}
                  required
                />
              </label>

              <label>
                Họ tên *
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Giới tính
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option>Nam</option>
                  <option>Nu</option>
                  <option>Khac</option>
                </select>
              </label>

              <label>
                Ngày sinh
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />
              </label>

              <label>
                Phòng ban
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                />
              </label>

              <label>
                Chức vụ
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                />
              </label>

              <label>
                Email *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Số điện thoại
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>

              <label>
                Ngày vào làm
                <input
                  type="date"
                  name="hireDate"
                  value={form.hireDate}
                  onChange={handleChange}
                />
              </label>

              <label>
                Trạng thái
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Dang lam viec">
                    Đang làm việc
                  </option>
                  <option value="Tam nghi">
                    Tạm nghỉ
                  </option>
                  <option value="Da nghi viec">
                    Đã nghỉ việc
                  </option>
                </select>
              </label>
            </div>

            <div className="actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Đang lưu..."
                  : editing
                    ? "Lưu cập nhật"
                    : "Thêm nhân viên"}
              </button>

              <button
                type="button"
                className="secondary"
                onClick={resetForm}
              >
                Làm mới
              </button>
            </div>
          </form>
        </section>

        {message && (
          <div className="alert success">{message}</div>
        )}

        {error && (
          <div className="alert error">{error}</div>
        )}

        <section className="card">
          <div className="section-heading">
            <h2>Danh sách nhân viên ({employees.length})</h2>

            <div className="search">
              <input
                placeholder="Tìm theo mã hoặc họ tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    loadEmployees(search);
                  }
                }}
              />

              <button onClick={() => loadEmployees(search)}>
                Tìm kiếm
              </button>

              <button
                className="secondary"
                onClick={() => {
                  setSearch("");
                  loadEmployees("");
                }}
              >
                Tất cả
              </button>
            </div>
          </div>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Mã NV</th>
                    <th>Họ tên</th>
                    <th>Phòng ban</th>
                    <th>Chức vụ</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.employeeId}>
                      <td>{employee.employeeId}</td>
                      <td>{employee.fullName}</td>
                      <td>{employee.department}</td>
                      <td>{employee.position}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.status}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() =>
                              viewEmployee(employee.employeeId)
                            }
                          >
                            Xem
                          </button>

                          <button
                            className="edit"
                            onClick={() => editEmployee(employee)}
                          >
                            Sửa
                          </button>

                          <button
                            className="danger"
                            onClick={() => deleteEmployee(employee)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {employees.length === 0 && (
                <p className="empty">
                  Không tìm thấy nhân viên nào.
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Thông tin nhân viên</h2>

            {Object.entries({
              "Mã nhân viên": selected.employeeId,
              "Họ tên": selected.fullName,
              "Giới tính": selected.gender,
              "Ngày sinh": selected.dateOfBirth,
              "Phòng ban": selected.department,
              "Chức vụ": selected.position,
              "Email": selected.email,
              "Điện thoại": selected.phone,
              "Ngày vào làm": selected.hireDate,
              "Trạng thái": selected.status
            }).map(([label, value]) => (
              <p key={label}>
                <strong>{label}:</strong> {value || "Chưa có"}
              </p>
            ))}

            <button onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
