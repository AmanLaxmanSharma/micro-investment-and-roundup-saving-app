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
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <FiUserCheck className="text-brand-500" />
          KYC Compliance Verification
        </h2>
        <p className="text-slate-400">
          Verify your identity to unlock all wallet features, limits, and portfolios.
        </p>
      </div>

      {kycRecord.status === "approved" && (
        <div className="p-6 rounded-2xl border border-green-900/50 bg-green-950/20 backdrop-blur-md flex items-start gap-4">
          <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Identity Verified</h3>
            <p className="text-slate-400 text-sm mt-1">
              Your KYC documents were reviewed and approved on{" "}
              {new Date(kycRecord.updatedAt).toLocaleDateString()}. Your account is fully unlocked.
            </p>
            <div className="mt-4 flex gap-4 text-xs font-mono text-slate-500">
              <span>Type: {kycRecord.documentType.toUpperCase()}</span>
              <span>Doc No: {kycRecord.documentNumber}</span>
            </div>
          </div>
        </div>
      )}

      {kycRecord.status === "pending" && (
        <div className="p-6 rounded-2xl border border-yellow-950 bg-yellow-950/10 backdrop-blur-md flex items-start gap-4">
          <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
            <FiClock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Verification Pending</h3>
            <p className="text-slate-400 text-sm mt-1">
              Your files have been received and are undergoing review by our compliance desk.
              Reviews are typically completed within 24 hours.
            </p>
            <div className="mt-4 flex gap-4 text-xs font-mono text-slate-500">
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
              <div className="p-6 rounded-2xl border border-rose-900/50 bg-rose-950/20 backdrop-blur-md flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                  <FiAlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Verification Rejected</h3>
                  <p className="text-rose-400 text-sm mt-1">
                    {kycRecord.rejectionReason || "The uploaded document was unreadable or expired."}
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Please submit a new valid document below to re-verify your identity.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 rounded-2xl border border-slate-900 bg-slate-950/50">
              <h3 className="text-xl font-bold text-white">Upload New Identity Document</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Document Type
                  </label>
                  <select
                    {...register("documentType")}
                    className="block w-full px-3 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  >
                    <option value="passport">Passport</option>
                    <option value="national_id">Adhar Card</option>
                    <option value="driver_license">PAN Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Document Number
                  </label>
                  <input
                    type="text"
                    {...register("documentNumber", {
                      required: "Document ID number is required",
                    })}
                    placeholder="e.g. DL129302"
                    className={`block w-full px-3 py-2.5 bg-slate-900 border ${errors.documentNumber ? "border-rose-500" : "border-slate-800"
                      } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all`}
                  />
                  {errors.documentNumber && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">
                      {errors.documentNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Document Attachment (PDF, JPG, PNG - Max 5MB)
                </label>
                <div className="relative border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center transition-all bg-slate-900/30">
                  <input
                    type="file"
                    {...register("document", {
                      required: "Identity document attachment is required",
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FiUpload className="w-8 h-8 text-slate-500 mb-3" />
                  <span className="text-sm text-slate-300 font-medium">
                    {selectedFile && selectedFile.length > 0
                      ? selectedFile[0].name
                      : "Drag & drop files or click to choose"}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    Accepts JPEG, PNG, or PDF formats up to 5MB.
                  </span>
                </div>
                {errors.document && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">
                    {errors.document.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading documents...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Verification request</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-slate-500">
                Verification Guidelines
              </h4>
              <ul className="text-xs text-slate-400 space-y-3 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  Ensure your name matches the details in your profile settings.
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  Double check that photos are in focus and text is readable.
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  Provide files containing both the front and back of ID cards.
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-500 font-bold">•</span>
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
