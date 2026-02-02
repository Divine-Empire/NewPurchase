"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

const QC_ENGINEERS = [
  "Rajesh Kumar",
  "Amit Sharma",
  "Priya Singh",
  "Vikram Patel",
  "Neha Gupta",
  "Suresh Yadav",
  "Anjali Verma",
  "Karan Mehta",
];

export default function Stage8() {
  const SHEET_API_URL = process.env.NEXT_PUBLIC_API_URI;
  const [open, setOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [sheetRecords, setSheetRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    qcBy: "",
    qcDate: "",
    qcStatus: "",
    rejectRemarks: "",
    rejectQty: "",
    returnStatus: "",
    qcRemarks: "",
    rejectPhoto: null as File | null,
  });

  const fetchData = async () => {
    if (!SHEET_API_URL) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${SHEET_API_URL}?sheet=RECEIVING-ACCOUNTS&action=getAll`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const rows = json.data.slice(6)
          .map((row: any, i: number) => ({ row, originalIndex: i + 7 }))
          .filter(({ row }: any) => row[1] && String(row[1]).trim() !== "")
          .map(({ row, originalIndex }: any) => {
            // Stage 8 Status Logic based on User Request:
            // Pending: Plan 7 (Index 40) exists AND Actual 7 (Index 41) does not exist
            // Completed: Plan 7 (Index 40) exists AND Actual 7 (Index 41) exists
            const hasPlan7 = !!row[34] && String(row[34]).trim() !== "" && String(row[34]).trim() !== "-";
            const hasActual7 = !!row[35] && String(row[35]).trim() !== "" && String(row[35]).trim() !== "-";

            const status = (hasPlan7 && hasActual7) ? "completed" : (hasPlan7 && !hasActual7 ? "pending" : "not_ready");

            return {
              id: row[1] || `row-${originalIndex}`,
              rowIndex: originalIndex,
              stage: 8,
              status,
              data: {
                indentNumber: row[1] || "",      // B: Indent Number
                liftNo: row[2] || "",            // C: Lift No.
                vendorName: row[3] || "",        // D: Vendor Name
                poNumber: row[4] || "",          // E: PO Number
                nextFollowUpDate: row[5] || "", // F: Next Follow-Up Date
                remarksStage6: row[6] || "",     // G: Remarks (Stage 6)
                itemName: row[7] || "",          // H: Item Name
                liftingQty: row[8] || "",        // I: Lifting Qty
                transporterName: row[9] || "",  // J: Transporter Name
                vehicleNo: row[10] || "",        // K: Vehicle No
                contactNo: row[11] || "",        // L: Contact No
                lrNo: row[12] || "",             // M: LR No
                dispatchDate: row[13] || "",     // N: Dispatch Date
                freightAmount: row[14] || "",    // O: Freight Amount
                advanceAmount: row[15] || "",    // P: Advance Amount
                paymentDate: row[16] || "",      // Q: Payment Date
                paymentStatus: row[17] || "",    // R: Payment Status
                biltyCopy: row[18] || "",        // S: Bilty Copy

                invoiceType: row[22] || "-",    // W
                invoiceDate: row[23] || "-",    // X
                invoiceNumber: row[24] || "-",  // Y
                receivedQty: row[25] || "-",     // Z
                receivedItemImage: row[26] || "",// AA
                srnNumber: row[27] || "-",       // AB
                qcRequirement: row[28] || "-",   // AC
                billAttachment: row[29] || "",   // AD
                paymentAmountHydra: row[30] || "", // AE
                paymentAmountLabour: row[31] || "",// AF
                paymentAmountHamali: row[32] || "",// AG
                remarksStage7: row[33] || "",      // AH

                // Stage 8 Data (Columns AI to AR)
                plan7: row[34],                  // AI: Planned QC
                actual7: row[35],                // AJ: Actual QC (Completes Status)
                qcBy: row[37],                   // AL: QC Done By (Updated)
                qcDate: row[38],                 // AM: QC Date (Updated)
                qcStatus: row[39],               // AN: QC Status (Updated)
                qcRemarks: row[40],              // AO: QC Remarks (Updated)
                // Remaining fields
                returnStatus: row[73],           // BV: Return Status
                rejectQty: row[41],              // AP (Updated)
                rejectPhoto: row[42],            // AQ (Updated)
                rejectRemarks: row[43],          // AR (Updated)
              }
            };
          });
        setSheetRecords(rows);
      }
    } catch (e) {
      console.error("Fetch error:", e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Column range helpers
  const B_TO_S = [
    { key: "indentNumber", label: "Indent #" },
    { key: "liftNo", label: "Lift No." },
    { key: "vendorName", label: "Vendor" },
    { key: "poNumber", label: "PO #" },
    { key: "nextFollowUpDate", label: "Next Follow-Up" },
    { key: "remarksStage6", label: "Remarks (S6)" },
    { key: "itemName", label: "Item" },
    { key: "liftingQty", label: "Lifting Qty" },
    { key: "transporterName", label: "Transporter" },
    { key: "vehicleNo", label: "Vehicle No" },
    { key: "contactNo", label: "Contact No" },
    { key: "lrNo", label: "LR No" },
    { key: "dispatchDate", label: "Dispatch Date" },
    { key: "freightAmount", label: "Freight Amt" },
    { key: "advanceAmount", label: "Advance Amt" },
    { key: "paymentDate", label: "Payment Date" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "biltyCopy", label: "Bilty Copy" },
  ];

  const W_TO_AH = [
    { key: "invoiceType", label: "Invoice Type" },
    { key: "invoiceDate", label: "Invoice Date" },
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "receivedQty", label: "Rec. Qty" },
    { key: "receivedItemImage", label: "Rec. Item Img" },
    { key: "srnNumber", label: "SRN #" },
    { key: "qcRequirement", label: "QC Requirement" },
    { key: "billAttachment", label: "Bill Attach" },
    { key: "paymentAmountHydra", label: "Hydra Amt" },
    { key: "paymentAmountLabour", label: "Labour Amt" },
    { key: "paymentAmountHamali", label: "Hamali Amt" },
    { key: "remarksStage7", label: "S7 Remarks" },
  ];

  const AL_TO_AR = [
    { key: "qcBy", label: "QC Done By" },
    { key: "qcDate", label: "QC Date" },
    { key: "qcStatus", label: "QC Status" },
    { key: "qcRemarks", label: "QC Remarks" },
    { key: "rejectQty", label: "Reject Qty" },
    { key: "rejectPhoto", label: "Reject Photo" },
    { key: "rejectRemarks", label: "Reject Remarks" },
  ];

  // Pending columns: B to S, W to AH, and AI (Plan 7)
  const pendingColumns = [
    ...B_TO_S,
    ...W_TO_AH,
    { key: "plan7", label: "QC Plan" },
  ];

  // History columns: B to S, W to AH, AL to AR (Skips AI, AJ, AK), and BV (Return Status)
  const historyColumns = [
    ...B_TO_S,
    ...W_TO_AH,
    ...AL_TO_AR,
    { key: "returnStatus", label: "Return Status" },
  ];

  const [selectedPendingColumns, setSelectedPendingColumns] = useState<
    string[]
  >(pendingColumns.map((col) => col.key));

  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<
    string[]
  >(historyColumns.map((col) => col.key));

  // Filtering
  const pending = sheetRecords.filter((r) => r.status === "pending");
  const completed = sheetRecords.filter((r) => r.status === "completed");

  const handleOpenForm = (recordId: string) => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedRecordId(recordId);
    setFormData({
      qcBy: "",
      qcDate: today,
      qcStatus: "",
      rejectRemarks: "",
      rejectQty: "",
      returnStatus: "",
      qcRemarks: "",
      rejectPhoto: null,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId || !SHEET_API_URL) return;

    const rec = sheetRecords.find((r) => r.id === selectedRecordId);
    if (!rec) return;

    setIsSubmitting(true);
    try {
      let photoUrl = "";
      if (formData.rejectPhoto instanceof File) {
        const uploadParams = new URLSearchParams();
        uploadParams.append("action", "uploadFile");
        uploadParams.append("base64Data", await toBase64(formData.rejectPhoto));
        uploadParams.append("fileName", formData.rejectPhoto.name);
        uploadParams.append("mimeType", formData.rejectPhoto.type);
        const folderId = process.env.NEXT_PUBLIC_IMAGE_FOLDER_ID || "1SihRrPrgbuPGm-09fuB180QJhdxq5Nxy";
        uploadParams.append("folderId", folderId);

        const res = await fetch(SHEET_API_URL, { method: "POST", body: uploadParams });
        const json = await res.json();
        if (json.success) photoUrl = json.fileUrl;
        else throw new Error("Photo upload failed");
      }

      // Prepare Date Strings in M/D/YYYY format strictly
      const now = new Date();
      const mDYYYY = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

      let qcDateFormatted = "";
      if (formData.qcDate) {
        const d = new Date(formData.qcDate);
        qcDateFormatted = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
      }

      // Sparse Row Update based on USER Request
      const rowArray = new Array(80).fill("");
      rowArray[35] = mDYYYY;                  // AJ: Actual QC Date (Status trigger)
      // AK (36) is skipped as requested
      rowArray[37] = formData.qcBy;           // AL: QC Done By
      rowArray[38] = qcDateFormatted;         // AM: QC Date
      rowArray[39] = formData.qcStatus;       // AN: QC Status
      rowArray[40] = formData.qcRemarks;      // AO: QC Remarks

      rowArray[73] = formData.returnStatus;   // BV: Return Status
      rowArray[41] = formData.rejectQty;      // AP: Reject Qty (Updated)
      rowArray[42] = photoUrl || "";          // AQ: Reject Photo (Updated)
      rowArray[43] = formData.rejectRemarks;  // AR: Reject Remarks (Updated)

      const params = new URLSearchParams();
      params.append("action", "update");
      params.append("sheetName", "RECEIVING-ACCOUNTS");
      params.append("rowIndex", rec.rowIndex.toString());
      params.append("rowData", JSON.stringify(rowArray));

      const updateRes = await fetch(SHEET_API_URL, { method: "POST", body: params });
      const updateJson = await updateRes.json();

      if (updateJson.success) {
        toast.success("QC Record updated successfully!");
        setOpen(false);
        fetchData();
      } else {
        throw new Error(updateJson.error || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const isFormValid =
    formData.qcBy &&
    formData.qcDate &&
    formData.qcStatus &&
    formData.returnStatus &&
    (formData.qcStatus === "approved" ||
      (formData.qcStatus === "rejected" &&
        formData.rejectQty &&
        formData.rejectRemarks));

  const formatDisplayDate = (d: any) => {
    if (!d || d === "" || d === "-" || d === "Invalid Date") return "-";
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-IN");
  };

  // Safe data access with lifting data support
  const safeValue = (record: any, key: string, isHistory = false) => {
    try {
      const data = record?.data;
      if (!data) return "-";

      // Handle file attachments with clickable links
      const fileFields = ["poCopy", "receivedItemImage", "billAttachment", "rejectPhoto"];
      if (fileFields.includes(key)) {
        const url = data[key];
        if (!url || String(url).trim() === "" || url === "-") return "-";
        return (
          <a
            href={String(url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate max-w-20">View</span>
          </a>
        );
      }

      // Handle QC Status mapping
      if (key === "qcStatus") {
        const status = data.qcStatus;
        if (!status || status === "-" || status === "") return "-";
        return status.charAt(0).toUpperCase() + status.slice(1);
      }

      // Handle currency columns
      if (["freightAmount", "advanceAmount", "basicValue", "totalWithTax", "ratePerQty", "paymentAmountHydra", "paymentAmountLabour", "paymentAmountHamali"].includes(key)) {
        const amount = data[key];
        return amount && amount !== "-" && amount !== "" ? `₹${amount}` : "-";
      }

      const val = data[key];
      const lowKey = key.toLowerCase();
      if (lowKey.includes("date") || lowKey.includes("plan") || lowKey.includes("actual")) {
        return formatDisplayDate(val);
      }

      if (val === undefined || val === null || String(val).trim() === "") return "-";
      return String(val);
    } catch (err) {
      return "-";
    }
  };



  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 8: Quality Control</h2>
            <p className="text-gray-600 mt-1">
              Inspect and approve/reject received materials
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <Select value="" onValueChange={() => { }}>
              <SelectTrigger className="w-64">
                <SelectValue
                  placeholder={
                    activeTab === "pending"
                      ? `${selectedPendingColumns.length} selected`
                      : `${selectedHistoryColumns.length} selected`
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-64 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                    <Checkbox
                      checked={
                        activeTab === "pending"
                          ? selectedPendingColumns.length ===
                          pendingColumns.length
                          : selectedHistoryColumns.length ===
                          historyColumns.length
                      }
                      onCheckedChange={(checked) => {
                        if (activeTab === "pending") {
                          setSelectedPendingColumns(
                            checked ? pendingColumns.map((c) => c.key) : []
                          );
                        } else {
                          setSelectedHistoryColumns(
                            checked ? historyColumns.map((c) => c.key) : []
                          );
                        }
                      }}
                    />
                    <Label className="text-sm font-medium">All</Label>
                  </div>
                  {(activeTab === "pending"
                    ? pendingColumns
                    : historyColumns
                  ).map((col) => (
                    <div
                      key={col.key}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        checked={
                          activeTab === "pending"
                            ? selectedPendingColumns.includes(col.key)
                            : selectedHistoryColumns.includes(col.key)
                        }
                        onCheckedChange={(checked) => {
                          if (activeTab === "pending") {
                            setSelectedPendingColumns(
                              checked
                                ? [...selectedPendingColumns, col.key]
                                : selectedPendingColumns.filter(
                                  (c) => c !== col.key
                                )
                            );
                          } else {
                            setSelectedHistoryColumns(
                              checked
                                ? [...selectedHistoryColumns, col.key]
                                : selectedHistoryColumns.filter(
                                  (c) => c !== col.key
                                )
                            );
                          }
                        }}
                      />
                      <Label className="text-sm">{col.label}</Label>
                    </div>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-black" />
          <p className="text-lg animate-pulse text-black font-medium">Loading records...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="history">
              History ({completed.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending */}
          <TabsContent value="pending" className="mt-6">
            {pending.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No pending QC checks</p>
                <p className="text-sm mt-1">All items are inspected!</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-white z-10">
                        ID
                      </TableHead>
                      <TableHead className="bg-white z-10">Actions</TableHead>
                      {pendingColumns
                        .filter((c) => selectedPendingColumns.includes(c.key))
                        .map((col) => (
                          <TableHead key={col.key}>{col.label}</TableHead>
                        ))}

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                          {record.id || "-"}
                        </TableCell>
                        <TableCell className="bg-white z-10">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenForm(record.id)}
                          >
                            Perform QC
                          </Button>
                        </TableCell>
                        {pendingColumns
                          .filter((c) => selectedPendingColumns.includes(c.key))
                          .map((col) => (
                            <TableCell key={col.key}>
                              {safeValue(record, col.key)}
                            </TableCell>
                          ))}

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="mt-6">
            {completed.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No QC history</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-white z-10">
                        ID
                      </TableHead>
                      {historyColumns
                        .filter((c) => selectedHistoryColumns.includes(c.key))
                        .map((col) => (
                          <TableHead key={col.key}>{col.label}</TableHead>
                        ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completed.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                          {record.id || "-"}
                        </TableCell>
                        {historyColumns
                          .filter((c) => selectedHistoryColumns.includes(c.key))
                          .map((col) => (
                            <TableCell key={col.key}>
                              {safeValue(record, col.key, true)}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Quality Control Inspection</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Planned QC Date</Label>
                  <Input
                    value={formatDisplayDate(sheetRecords.find(r => r.id === selectedRecordId)?.data?.plan7)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label>QC Done By *</Label>
                  <Select
                    value={formData.qcBy}
                    onValueChange={(v) => setFormData({ ...formData, qcBy: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      {QC_ENGINEERS.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>QC Date *</Label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.qcDate}
                    onChange={(e) =>
                      setFormData({ ...formData, qcDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>QC Status *</Label>
                  <Select
                    value={formData.qcStatus}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        qcStatus: v,
                        rejectQty: v === "approved" ? "" : formData.rejectQty,
                        rejectRemarks:
                          v === "approved" ? "" : formData.rejectRemarks,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Return Status *</Label>
                  <Select
                    value={formData.returnStatus}
                    onValueChange={(v) =>
                      setFormData({ ...formData, returnStatus: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="not return">Not Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.qcStatus === "rejected" && (
                <div className="p-4 border rounded bg-red-50 space-y-3">
                  <h3 className="font-semibold text-red-800">
                    Rejection Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Reject Qty *</Label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="0"
                        value={formData.rejectQty}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rejectQty: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Reject Photo</Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, rejectPhoto: file });
                          }
                        }}
                        className="hidden"
                        id="reject-photo"
                      />
                      <label
                        htmlFor="reject-photo"
                        className="flex items-center justify-center w-full p-2 border rounded cursor-pointer hover:bg-gray-50"
                      >
                        {formData.rejectPhoto ? (
                          <span className="text-green-600">
                            {" "}
                            Photo Selected
                          </span>
                        ) : (
                          <span> Upload Photo</span>
                        )}
                      </label>
                    </div>
                    <div className="col-span-2">
                      <Label>Reject Remarks *</Label>
                      <textarea
                        className="w-full px-3 py-2 border rounded resize-none"
                        rows={3}
                        value={formData.rejectRemarks}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rejectRemarks: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label>QC Remarks</Label>
                <textarea
                  className="w-full px-3 py-2 border rounded resize-none"
                  rows={3}
                  value={formData.qcRemarks}
                  onChange={(e) =>
                    setFormData({ ...formData, qcRemarks: e.target.value })
                  }
                />
              </div>
            </form>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Complete QC"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
