import { createOrUpdateKyc, findKycByUserId, listPendingKycDocuments, updateKycStatus } from "../utils/kycStore.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const getKycStatus = async (req, res, next) => {
  try {
    const kyc = await findKycByUserId(req.user.id);
    if (!kyc) {
      return sendSuccess(res, "No KYC record found", { status: "unsubmitted" });
    }
    sendSuccess(res, "KYC status retrieved successfully", { kyc });
  } catch (error) {
    next(error);
  }
};

export const submitKyc = async (req, res, next) => {
  try {
    const { documentType, documentNumber } = req.body;

    if (!req.file) {
      throw new CustomError("Document file is required", 400);
    }

    if (!documentType || !documentNumber) {
      throw new CustomError("Document type and number are required", 400);
    }

    const allowedTypes = ["passport", "national_id", "driver_license"];
    if (!allowedTypes.includes(documentType)) {
      throw new CustomError(
        "Invalid document type. Allowed: passport, national_id, driver_license",
        400,
      );
    }

    const documentUrl = `/src/uploads/${req.file.filename}`;

    const kyc = await createOrUpdateKyc({
      userId: req.user.id,
      documentType,
      documentNumber,
      documentUrl,
      status: "pending",
    });

    sendSuccess(res, "KYC documents submitted successfully", { kyc }, 201);
  } catch (error) {
    next(error);
  }
};

export const getPendingKycList = async (req, res, next) => {
  try {
    const list = await listPendingKycDocuments();
    sendSuccess(res, "Pending KYC documents list retrieved", { list });
  } catch (error) {
    next(error);
  }
};

export const reviewKycDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!status || !["approved", "rejected"].includes(status)) {
      throw new CustomError("Status must be approved or rejected", 400);
    }

    const updated = await updateKycStatus(id, { status, rejectionReason });
    if (!updated) {
      throw new CustomError("KYC record not found", 404);
    }

    sendSuccess(res, `KYC document has been successfully ${status}`, { kyc: updated });
  } catch (error) {
    next(error);
  }
};
