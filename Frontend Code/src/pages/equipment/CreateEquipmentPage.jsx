import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useCreateEquipment } from "../../hooks/useEquipment";

/* ---------- design tokens (matches AnalyticsDashboard / InvoiceListPage) ---------- */

const tokens = {
    ink: "#16181d",
    sub: "#6b7280",
    line: "#e7e8ec",
    surface: "#ffffff",
    canvas: "#f6f7f9",
    accent: "#1a9e6f",
    accentSoft: "#e7f8f1",
    danger: "#c4451c",
};

const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    fontSize: "14px",
    color: tokens.ink,
    background: tokens.surface,
    border: `1px solid ${tokens.line}`,
    borderRadius: "10px",
    outline: "none",
    transition: "border-color .12s ease, box-shadow .12s ease",
};

const labelStyle = {
    display: "block",
    fontSize: "12.5px",
    fontWeight: 600,
    color: tokens.sub,
    marginBottom: "6px",
};


function Field({ label, span = "col-md-6", children }) {
    return (
        <div className={span}>
            <label style={labelStyle}>{label}</label>
            {children}
        </div>
    );
}

function Icon({ name }) {
    const common = { viewBox: "0 0 24 24", width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
    if (name === "check") {
        return (
            <svg {...common}>
                <path d="M5 12.5 9.5 17 19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    return (
        <svg {...common}>
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
    );
}

const CreateEquipmentPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    console.log(user);
    const createEquipment = useCreateEquipment();

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const isSaving = createEquipment.isPending ?? createEquipment.isLoading ?? false;
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]:
                e.target.type === "number"
                    ? Number(e.target.value)
                    : e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("----- FormData -----");

        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        if (image) {
            data.append("image", image);
        }

        // Debug
        console.log("----- FormData -----");
        for (const pair of data.entries()) {
            console.log(pair[0], pair[1]);
        }
        console.log("--------------------");

        createEquipment.mutate(data, {
            onSuccess: () => {
                navigate(-1);
            },
        });
    };

    const [formData, setFormData] = useState({
        institutionCode: "",
        labCode: "",
        equipmentName: "",
        equipmentCode: "",
        description: "",
        manufacturer: "",
        model: "",
        quantity: 1,
        hourlyRate: 0,
        status: "AVAILABLE",
    });

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                institutionCode: user.institutionCode,
            }));
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };


    return (
        <DashboardLayout>
            <style>{`
        @keyframes ceq-spin { to { transform: rotate(360deg); } }
        .ceq-input:focus, .ceq-select:focus, .ceq-textarea:focus {
          border-color: ${tokens.accent} !important;
          box-shadow: 0 0 0 3px ${tokens.accentSoft};
        }
      `}</style>
            <div style={{ background: tokens.canvas, minHeight: "100vh", padding: "28px 28px 40px" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>

                    <div style={{ marginBottom: "22px" }}>
                        <h2 style={{ fontWeight: 700, fontSize: "22px", color: tokens.ink, marginBottom: "4px" }}>
                            Add Equipment
                        </h2>
                        <p style={{ color: tokens.sub, fontSize: "14px", margin: 0 }}>
                            Register a new piece of equipment for booking.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                background: tokens.surface,
                                border: `1px solid ${tokens.line}`,
                                borderRadius: "16px",
                                overflow: "hidden",
                            }}
                        >
                            <div style={{ padding: "22px 24px" }}>
                                <div className="row g-3">

                                    <Field label="Institution Code">
                                        <input
                                            className="ceq-input"
                                            style={inputStyle}
                                            name="institutionCode"
                                            value={formData.institutionCode}
                                            onChange={handleChange}
                                            placeholder="e.g. KIT-VNS"
                                            required
                                        />
                                    </Field>

                                    <Field label="Lab Code">
                                        <input
                                            className="ceq-input"
                                            style={inputStyle}
                                            name="labCode"
                                            value={formData.labCode}
                                            onChange={handleChange}
                                            placeholder="e.g. LAB-04"
                                            required
                                        />
                                    </Field>

                                    <Field label="Equipment Name">
                                        <input
                                            className="ceq-input"
                                            style={inputStyle}
                                            name="equipmentName"
                                            value={formData.equipmentName}
                                            onChange={handleChange}
                                            placeholder="e.g. Digital Oscilloscope"
                                            required
                                        />
                                    </Field>

                                    <Field label="Equipment Code">
                                        <input
                                            className="ceq-input"
                                            style={inputStyle}
                                            name="equipmentCode"
                                            value={formData.equipmentCode}
                                            onChange={handleChange}
                                            placeholder="e.g. EQ-1042"
                                            required
                                        />
                                    </Field>



                                    <Field label="Description" span="col-12">
                                        <textarea
                                            rows="3"
                                            className="ceq-textarea"
                                            style={{ ...inputStyle, resize: "vertical" }}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Specs, condition, or usage notes"
                                        />
                                    </Field>

                                    <Field label="Manufacturer">
                                        <input
                                            className="ceq-input"
                                            style={inputStyle}
                                            name="manufacturer"
                                            value={formData.manufacturer}
                                            onChange={handleChange}
                                            placeholder="e.g. Dell"
                                            required
                                        />
                                    </Field>

                                    <Field label="Model">
                                        <input
                                            className="ceq-input"
                                            style={inputStyle}
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                            placeholder="e.g. Precision 5820"
                                            required
                                        />
                                    </Field>

                                    <Field label="Quantity" span="col-md-4">
                                        <input
                                            type="number"
                                            min="1"
                                            className="ceq-input"
                                            style={inputStyle}
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                        />
                                    </Field>

                                    <Field label="Price / Hour (₹)">
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            value={formData.hourlyRate}
                                            onChange={handleChange}
                                            className="ceq-input"
                                            required
                                        />
                                    </Field>

                                    <Field label="Equipment Image" span="col-md-12">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="ceq-input"
                                            onChange={handleImageChange}
                                        />
                                    </Field>

                                    {preview && (
                                        <div className="mt-3">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                style={{
                                                    width: "250px",
                                                    height: "180px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                    border: "1px solid #ddd",
                                                }}
                                            />
                                        </div>
                                    )}

                                    <Field label="Status" span="col-md-4">
                                        <select
                                            className="ceq-select"
                                            style={{ ...inputStyle, appearance: "auto" }}
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="AVAILABLE">Available</option>
                                            <option value="IN_USE">In Use</option>
                                            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                                            <option value="OUT_OF_SERVICE">Out of Service</option>
                                        </select>
                                    </Field>

                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "16px 24px",
                                    borderTop: `1px solid ${tokens.line}`,
                                    background: "#fbfbfc",
                                    display: "flex",
                                    gap: "10px",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={isSaving}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        padding: "9px 16px",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: tokens.ink,
                                        background: tokens.surface,
                                        border: `1px solid ${tokens.line}`,
                                        borderRadius: "10px",
                                        cursor: isSaving ? "not-allowed" : "pointer",
                                    }}
                                >
                                    <Icon name="x" />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "9px 18px",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "#ffffff",
                                        background: isSaving ? "#8fc9ae" : tokens.accent,
                                        border: "none",
                                        borderRadius: "10px",
                                        cursor: isSaving ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {isSaving ? (
                                        <>
                                            <span
                                                style={{
                                                    width: "14px",
                                                    height: "14px",
                                                    borderRadius: "999px",
                                                    border: "2px solid rgba(255,255,255,0.5)",
                                                    borderTopColor: "#fff",
                                                    animation: "ceq-spin .7s linear infinite",
                                                }}
                                            />
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="check" />
                                            Save Equipment
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateEquipmentPage;
