import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../services/api";
import { FiCheckCircle, FiAlertCircle, FiClock, FiUpload, FiFileText, FiUserCheck } from "react-icons/fi";

export default function KycPage() {
  const [kycRecord, setKycRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      documentType: "passport",
      documentNumber: "",
    },
  });

  const selectedFile = watch("document");

  const fetchKycStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/kyc");
      // Response returns { success: true, message: "...", data: { kyc } }
      // If no record exists, data has { status: 'unsubmitted' }
      if (response.data.data.kyc) {
        setKycRecord(response.data.data.kyc);
      } else {
        setKycRecord({ status: "unsubmitted" });
      }
    } catch (err) {
      toast.error("Could not load KYC status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const onSubmit = async (data) => {
    if (!data.document || data.document.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("documentType", data.documentType);
    formData.append("documentNumber", data.documentNumber);
    formData.append("document", data.document[0]);

    try {
      const response = await api.post("/api/kyc/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("KYC documents submitted successfully!");
      setKycRecord(response.data.data.kyc);
    } catch (err) {
      // Axios handler toasts error messages
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400">Loading compliance data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#15231D] flex items-center gap-3 font-outfit">
          <FiUserCheck className="text-[#18A66A]" />
          KYC Compliance Verification
        </h2>
        <p className="text-sm text-[#60736A]">
          Verify your identity to unlock all wallet features, limits, and portfolios.
        </p>
      </div>

      {kycRecord.status === "approved" && (
        <div className="p-6 rounded-3xl border border-[#18A66A]/30 bg-[#E3F5ED]/40 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-2xl bg-[#E3F5ED] text-[#18A66A] border border-[#18A66A]/30">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#15231D]">Identity Verified</h3>
            <p className="text-[#60736A] text-sm mt-1">
              Your KYC documents were reviewed and approved on{" "}
              {new Date(kycRecord.updatedAt).toLocaleDateString()}. Your account is fully unlocked.
            </p>
            <div className="mt-4 flex gap-4 text-xs font-mono text-[#8A9A92]">
              <span>Type: {kycRecord.documentType.toUpperCase()}</span>
              <span>Doc No: {kycRecord.documentNumber}</span>
            </div>
          </div>
        </div>
      )}

      {kycRecord.status === "pending" && (
        <div className="p-6 rounded-3xl border border-amber-200 bg-amber-50 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
            <FiClock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#15231D]">Verification Pending</h3>
            <p className="text-[#60736A] text-sm mt-1">
              Your files have been received and are undergoing review by our compliance desk.
              Reviews are typically completed within 24 hours.
            </p>
            <div className="mt-4 flex gap-4 text-xs font-mono text-[#8A9A92]">
              <span>Type: {kycRecord.documentType.toUpperCase()}</span>
              <span>Doc No: {kycRecord.documentNumber}</span>
            </div>
          </div>
        </div>
      )}

      {(kycRecord.status === "unsubmitted" || kycRecord.status === "rejected") && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {kycRecord.status === "rejected" && (
              <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50 flex items-start gap-4 mb-6 shadow-sm">
                <div className="p-3 rounded-2xl bg-rose-100 text-rose-600">
                  <FiAlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-900">Verification Rejected</h3>
                  <p className="text-rose-700 text-sm mt-1">
                    {kycRecord.rejectionReason || "The uploaded document was unreadable or expired."}
                  </p>
                  <p className="text-[#60736A] text-xs mt-2">
                    Please submit a new valid document below to re-verify your identity.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 rounded-3xl border border-[#D7E2DC] bg-white shadow-sm">
              <h3 className="text-xl font-bold text-[#15231D] font-outfit">Upload New Identity Document</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#60736A] mb-1.5">
                    Document Type
                  </label>
                  <select
                    {...register("documentType")}
                    className="block w-full px-3 py-2.5 bg-white border border-[#D7E2DC] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] cursor-pointer"
                  >
                    <option value="passport">Passport</option>
                    <option value="national_id">Aadhaar Card</option>
                    <option value="driver_license">PAN Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#60736A] mb-1.5">
                    Document Number
                  </label>
                  <input
                    type="text"
                    {...register("documentNumber", {
                      required: "Document ID number is required",
                    })}
                    placeholder="e.g. DL129302"
                    className={`block w-full px-3 py-2.5 bg-white border ${errors.documentNumber ? "border-rose-500" : "border-[#D7E2DC]"
                      } placeholder-[#8A9A92] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] transition-all`}
                  />
                  {errors.documentNumber && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">
                      {errors.documentNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#60736A] mb-2">
                  Document Attachment (PDF, JPG, PNG - Max 5MB)
                </label>
                <div className="relative border-2 border-dashed border-[#D7E2DC] hover:border-[#18A66A] rounded-2xl p-8 flex flex-col items-center justify-center transition-all bg-[#F5F7F2]">
                  <input
                    type="file"
                    {...register("document", {
                      required: "Identity document attachment is required",
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FiUpload className="w-8 h-8 text-[#18A66A] mb-3" />
                  <span className="text-sm text-[#15231D] font-medium">
                    {selectedFile && selectedFile.length > 0
                      ? selectedFile[0].name
                      : "Drag & drop files or click to choose"}
                  </span>
                  <span className="text-xs text-[#8A9A92] mt-1">
                    Accepts JPEG, PNG, or PDF formats up to 5MB.
                  </span>
                </div>
                {errors.document && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">
                    {errors.document.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#18A66A] hover:bg-[#159A63] shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading documents...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Verification Request</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-[#D7E2DC] bg-white shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-[#15231D] uppercase tracking-wider">
                Verification Guidelines
              </h4>
              <ul className="text-xs text-[#60736A] space-y-3 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-[#18A66A] font-bold">•</span>
                  Ensure your name matches the details in your profile settings.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#18A66A] font-bold">•</span>
                  Double check that photos are in focus and text is readable.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#18A66A] font-bold">•</span>
                  Provide files containing both the front and back of ID cards.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#18A66A] font-bold">•</span>
                  Attach the original file rather than taking screen captures.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
