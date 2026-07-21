import { useEffect, useState } from "react";
import {
    getInventoryItems,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
} from "../services/inventoryService";
import "./SharedList.css";

const CATEGORIES = [
    "Medical Supplies", "Surgical Equipment", "Drugs & Medicines",
    "PPE", "Laboratory", "Radiology", "Diagnostic", "Office Supplies", "Other"
];
const UNITS = ["pcs", "box", "pack", "kg", "gram", "litre", "ml", "roll", "pair", "set"];

const emptyForm = {
    itemName: "",
    category: "Medical Supplies",
    unit: "pcs",
    quantityInStock: 0,
    minimumStockLevel: 10,
    unitPrice: 0,
    supplier: "",
    expiryDate: "",
    location: "",
    status: "In Stock",
};

function InventoryList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [adjustId, setAdjustId] = useState(null);
    const [adjustQty, setAdjustQty] = useState(0);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getInventoryItems();
            setItems(data || []);
        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const showMsg = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddForm = () => {
        setEditingItem(null);
        setFormData(emptyForm);
        setShowForm(true);
        setAdjustId(null);
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setFormData({
            itemName: item.itemName,
            category: item.category,
            unit: item.unit,
            quantityInStock: item.quantityInStock,
            minimumStockLevel: item.minimumStockLevel,
            unitPrice: item.unitPrice,
            supplier: item.supplier || "",
            expiryDate: item.expiryDate ? item.expiryDate.split("T")[0] : "",
            location: item.location || "",
            status: item.status,
        });
        setShowForm(true);
        setAdjustId(null);
    };

    const cancelForm = () => {
        setEditingItem(null);
        setFormData(emptyForm);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                quantityInStock: parseInt(formData.quantityInStock),
                minimumStockLevel: parseInt(formData.minimumStockLevel),
                unitPrice: parseFloat(formData.unitPrice),
                expiryDate: formData.expiryDate || null,
            };
            if (editingItem) {
                const id = editingItem.inventoryItemId ?? editingItem.id;
                await updateInventoryItem(id, payload);
                showMsg("✅ Item updated successfully");
            } else {
                await createInventoryItem(payload);
                showMsg("✅ Item added successfully");
            }
            cancelForm();
            load();
        } catch (err) {
            console.error(err);
            showMsg("❌ Operation failed. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this inventory item?")) return;
        try {
            await deleteInventoryItem(id);
            showMsg("✅ Item deleted successfully");
            load();
        } catch {
            showMsg("❌ Failed to delete item");
        }
    };

    const handleAdjust = async (id) => {
        try {
            await adjustStock(id, parseInt(adjustQty));
            showMsg(`✅ Stock adjusted by ${adjustQty > 0 ? "+" : ""}${adjustQty}`);
            setAdjustId(null);
            setAdjustQty(0);
            load();
        } catch {
            showMsg("❌ Stock adjustment failed");
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            "In Stock": "badge-success",
            "Low Stock": "badge-warning",
            "Out of Stock": "badge-danger",
        };
        return map[status] || "badge-secondary";
    };

    const allCategories = ["All", ...new Set(items.map(i => i.category).filter(Boolean))];

    const filtered = items.filter((item) => {
        const q = search.toLowerCase();
        const matchSearch =
            item.itemName?.toLowerCase().includes(q) ||
            item.supplier?.toLowerCase().includes(q) ||
            item.location?.toLowerCase().includes(q) ||
            item.category?.toLowerCase().includes(q);
        const matchCategory = filterCategory === "All" || item.category === filterCategory;
        const matchStatus = filterStatus === "All" || item.status === filterStatus;
        return matchSearch && matchCategory && matchStatus;
    });

    const totalValue = filtered.reduce((sum, i) => sum + (i.quantityInStock * i.unitPrice), 0);
    const lowStockCount = items.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").length;

    return (
        <div className="shared-list-page">
            {/* Header */}
            <div className="list-header">
                <div className="list-header-left">
                    <h2>📦 Inventory Management</h2>
                    <p>Track stock levels, suppliers, and expiry dates</p>
                </div>
                <button className="btn-add" onClick={openAddForm}>
                    + Add New Item
                </button>
            </div>

            {/* Alert Banner */}
            {lowStockCount > 0 && (
                <div className="alert-message" style={{ background: "#fff3cd", color: "#856404", border: "1px solid #ffc107" }}>
                    ⚠️ {lowStockCount} item(s) have low or zero stock — please restock soon!
                </div>
            )}

            {/* Message */}
            {message && <div className="alert-message">{message}</div>}

            {/* Summary Cards */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
                <div className="form-card" style={{ flex: "1", minWidth: "140px", padding: "12px 18px", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#0d6efd" }}>{items.length}</div>
                    <div style={{ fontSize: "12px", color: "#6c757d" }}>Total Items</div>
                </div>
                <div className="form-card" style={{ flex: "1", minWidth: "140px", padding: "12px 18px", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#198754" }}>
                        {items.filter(i => i.status === "In Stock").length}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6c757d" }}>In Stock</div>
                </div>
                <div className="form-card" style={{ flex: "1", minWidth: "140px", padding: "12px 18px", textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#dc3545" }}>{lowStockCount}</div>
                    <div style={{ fontSize: "12px", color: "#6c757d" }}>Low / Out of Stock</div>
                </div>
                <div className="form-card" style={{ flex: "1", minWidth: "160px", padding: "12px 18px", textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#6f42c1" }}>
                        ৳{totalValue.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6c757d" }}>Total Stock Value</div>
                </div>
            </div>

            {/* Filters */}
            <div className="list-controls" style={{ flexWrap: "wrap", gap: "8px" }}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Search by name, supplier, category or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: "1", minWidth: "200px" }}
                />
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #dee2e6" }}
                >
                    {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #dee2e6" }}
                >
                    <option value="All">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
                <span className="record-count">Showing: {filtered.length} record(s)</span>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="form-card">
                    <h3>{editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}</h3>
                    <form onSubmit={handleSubmit} className="shared-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Item Name *</label>
                                <input type="text" name="itemName" value={formData.itemName}
                                    onChange={handleChange} required placeholder="e.g. Surgical Gloves" />
                            </div>
                            <div className="form-group">
                                <label>Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange} required>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Unit *</label>
                                <select name="unit" value={formData.unit} onChange={handleChange} required>
                                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Unit Price (৳) *</label>
                                <input type="number" name="unitPrice" value={formData.unitPrice}
                                    onChange={handleChange} required min="0" step="0.01" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Quantity In Stock *</label>
                                <input type="number" name="quantityInStock" value={formData.quantityInStock}
                                    onChange={handleChange} required min="0" />
                            </div>
                            <div className="form-group">
                                <label>Minimum Stock Level *</label>
                                <input type="number" name="minimumStockLevel" value={formData.minimumStockLevel}
                                    onChange={handleChange} required min="0" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Supplier</label>
                                <input type="text" name="supplier" value={formData.supplier}
                                    onChange={handleChange} placeholder="e.g. MedLine Corp" />
                            </div>
                            <div className="form-group">
                                <label>Storage Location</label>
                                <input type="text" name="location" value={formData.location}
                                    onChange={handleChange} placeholder="e.g. Store Room A" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input type="date" name="expiryDate" value={formData.expiryDate}
                                    onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save">
                                {editingItem ? "Update Item" : "Add Item"}
                            </button>
                            <button type="button" className="btn-cancel" onClick={cancelForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Adjust Stock Modal */}
            {adjustId && (
                <div className="form-card" style={{ maxWidth: "380px" }}>
                    <h3>Adjust Stock</h3>
                    <p style={{ color: "#6c757d", marginBottom: "12px" }}>
                        Enter a positive number to add stock, or negative to reduce stock.
                    </p>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Adjustment Quantity</label>
                            <input
                                type="number"
                                value={adjustQty}
                                onChange={(e) => setAdjustQty(e.target.value)}
                                placeholder="e.g. +50 or -10"
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="btn-save" onClick={() => handleAdjust(adjustId)}>Apply</button>
                        <button className="btn-cancel" onClick={() => { setAdjustId(null); setAdjustQty(0); }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="loading-spinner">⏳ Loading...</div>
            ) : (
                <div className="table-wrapper">
                    <table className="shared-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Unit</th>
                                <th>Unit Price</th>
                                <th>Total Value</th>
                                <th>Supplier</th>
                                <th>Expiry</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="no-data">No inventory items found</td>
                                </tr>
                            ) : (
                                filtered.map((item, idx) => {
                                    const id = item.inventoryItemId ?? item.id;
                                    const isExpiringSoon = item.expiryDate &&
                                        new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                                    return (
                                        <tr key={id} style={item.status === "Out of Stock" ? { background: "#fff5f5" } : {}}>
                                            <td>{idx + 1}</td>
                                            <td><strong>{item.itemName}</strong></td>
                                            <td><span className="badge-type">{item.category}</span></td>
                                            <td>
                                                <div style={{ fontWeight: "700", color: item.status !== "In Stock" ? "#dc3545" : "#198754" }}>
                                                    {item.quantityInStock}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#999" }}>
                                                    Min: {item.minimumStockLevel}
                                                </div>
                                            </td>
                                            <td>{item.unit}</td>
                                            <td>৳{parseFloat(item.unitPrice).toFixed(2)}</td>
                                            <td>৳{(item.quantityInStock * item.unitPrice).toLocaleString("en-BD", { minimumFractionDigits: 2 })}</td>
                                            <td>{item.supplier || <span className="text-muted">—</span>}</td>
                                            <td style={{ color: isExpiringSoon ? "#dc3545" : "inherit" }}>
                                                {item.expiryDate
                                                    ? new Date(item.expiryDate).toLocaleDateString("en-GB")
                                                    : <span className="text-muted">—</span>}
                                                {isExpiringSoon && <span title="Expiring soon"> ⚠️</span>}
                                            </td>
                                            <td>{item.location || <span className="text-muted">—</span>}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-edit"
                                                        title="Adjust Stock"
                                                        onClick={() => { setAdjustId(id); setAdjustQty(0); setShowForm(false); }}
                                                        style={{ background: "#0d6efd", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", marginRight: "4px" }}
                                                    >
                                                        ±
                                                    </button>
                                                    <button className="btn-edit" onClick={() => startEdit(item)} title="Edit">✏️</button>
                                                    <button className="btn-delete" onClick={() => handleDelete(id)} title="Delete">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default InventoryList;
