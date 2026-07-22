import React from "react";

const InvoiceModal = ({ bill, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    // Save current title
    const originalTitle = document.title;
    document.title = `Invoice_${bill.billId}_${bill.patient?.fullName || "Patient"}`;
    
    window.print();
    
    // Restore title
    document.title = originalTitle;
  };

  const lineItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #e2e8f0"
  };

  return (
    <div className="invoice-modal-backdrop" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.65)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: "20px"
    }}>
      {/* Modal Box */}
      <div className="invoice-modal-content print-container" style={{
        backgroundColor: "#ffffff",
        width: "100%",
        maxWidth: "650px",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Header - Hidden in Print or Styled Nicely */}
        <div className="no-print" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid #f1f5f9",
          background: "#f8fafc"
        }}>
          <h3 style={{ margin: 0, color: "#1e293b", fontWeight: "700" }}>🧾 Invoice & Receipt Viewer</h3>
          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#64748b"
            }}
          >
            ✕
          </button>
        </div>

        {/* Invoice Body */}
        <div id="printable-invoice-area" style={{
          padding: "40px",
          overflowY: "auto",
          color: "#334155"
        }}>
          {/* Hospital Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "24px", color: "#0f766e", fontWeight: "800" }}>🏥 METRO HEALTH HMS</h1>
              <p style={{ margin: "4px 0", fontSize: "12px", color: "#64748b" }}>
                Plot 12, Road 4, Sector 11, Uttara, Dhaka<br />
                Phone: +880-1234567890 | Email: billing@metrohealth.com
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#1e293b", letterSpacing: "1px" }}>INVOICE</h2>
              <span style={{ 
                display: "inline-block", 
                padding: "4px 12px", 
                borderRadius: "9999px", 
                fontSize: "11px", 
                fontWeight: "bold",
                backgroundColor: bill.paymentStatus === "Paid" ? "#dcfce7" : bill.paymentStatus === "Partial" ? "#fef3c7" : "#fee2e2",
                color: bill.paymentStatus === "Paid" ? "#15803d" : bill.paymentStatus === "Partial" ? "#b45309" : "#b91c1c",
                marginTop: "8px"
              }}>
                {bill.paymentStatus?.toUpperCase()}
              </span>
            </div>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #cbd5e1", marginBottom: "25px" }} />

          {/* Meta Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px", fontSize: "14px" }}>
            <div>
              <strong style={{ color: "#64748b", textTransform: "uppercase", fontSize: "11px" }}>Billed To:</strong>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginTop: "4px" }}>{bill.patient?.fullName || "Walk-in Patient"}</div>
              <div style={{ color: "#64748b", marginTop: "2px" }}>Age/Gender: {bill.patient?.age || "N/A"} / {bill.patient?.gender || "N/A"}</div>
              <div style={{ color: "#64748b" }}>Contact: {bill.patient?.contactNumber || "N/A"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong style={{ color: "#64748b", textTransform: "uppercase", fontSize: "11px" }}>Invoice Details:</strong>
              <div style={{ marginTop: "4px" }}><strong>Invoice ID:</strong> #{bill.billId}</div>
              <div><strong>Date:</strong> {new Date(bill.billDate).toLocaleDateString()}</div>
              <div><strong>Time:</strong> {new Date(bill.billDate).toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Charge Details Table */}
          <h4 style={{ color: "#1e293b", borderBottom: "2px solid #e2e8f0", paddingBottom: "6px", marginBottom: "12px" }}>Itemized Charges</h4>
          
          <div style={{ fontSize: "14px" }}>
            <div style={lineItemStyle}>
              <span>Consultation / Doctor Fee</span>
              <strong>{bill.consultationFee?.toFixed(2)} BDT</strong>
            </div>
            
            <div style={lineItemStyle}>
              <span>Room & Bed Charges</span>
              <strong>{bill.roomCharge?.toFixed(2)} BDT</strong>
            </div>

            <div style={lineItemStyle}>
              <span>Pharmacy & Medicine Charges</span>
              <strong>{bill.medicineCharge?.toFixed(2)} BDT</strong>
            </div>

            <div style={lineItemStyle}>
              <span>Other Administrative / Lab Charges</span>
              <strong>{bill.otherCharges?.toFixed(2)} BDT</strong>
            </div>
          </div>

          {/* Grand Total */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginTop: "25px", 
            padding: "16px", 
            backgroundColor: "#f8fafc", 
            borderRadius: "8px",
            border: "1px solid #e2e8f0"
          }}>
            <span style={{ fontSize: "16px", fontWeight: "bold", color: "#475569" }}>Grand Total:</span>
            <span style={{ fontSize: "22px", fontWeight: "800", color: "#0f766e" }}>
              {((bill.consultationFee || 0) + (bill.roomCharge || 0) + (bill.medicineCharge || 0) + (bill.otherCharges || 0)).toFixed(2)} BDT
            </span>
          </div>

          {/* Footer note */}
          <div style={{ textAlign: "center", marginTop: "40px", fontSize: "12px", color: "#94a3b8" }}>
            Thank you for choosing Metro Health Hospital.<br />
            This is a computer-generated invoice and requires no physical signature.
          </div>
        </div>

        {/* Action Controls - Hidden in Print */}
        <div className="no-print" style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          padding: "16px 24px",
          borderTop: "1px solid #f1f5f9",
          background: "#f8fafc"
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: "10px 16px",
              background: "#e2e8f0",
              color: "#475569",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Close
          </button>
          <button 
            onClick={handlePrint}
            style={{
              padding: "10px 20px",
              background: "#0f766e",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            🖨️ Print / Download PDF
          </button>
        </div>

      </div>

      {/* Embedded CSS style for printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice-area, #printable-invoice-area * {
            visibility: visible;
          }
          #printable-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          .invoice-modal-backdrop {
            background: none !important;
            backdrop-filter: none !important;
            position: absolute;
          }
          .invoice-modal-content {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceModal;
