import {
  listMessagesBetweenUsers,
  createMessage,
} from "../utils/messageStore.js";
import { listUsersByRole, findUserById } from "../utils/authStore.js";
import { sendSuccess } from "../utils/responseHelper.js";
import CustomError from "../utils/customError.js";

export const getAdvisoryContacts = async (req, res, next) => {
  try {
    const role = req.user.role;
    let contacts = [];

    if (role === "investor") {
      // Investors can message Advisors
      contacts = await listUsersByRole("advisor");
    } else if (role === "advisor") {
      // Advisors can message Investors
      contacts = await listUsersByRole("investor");
    } else {
      // Admins can see all contacts
      const [investors, advisors] = await Promise.all([
        listUsersByRole("investor"),
        listUsersByRole("advisor"),
      ]);
      contacts = [...investors, ...advisors];
    }

    sendSuccess(res, "Contacts retrieved successfully", { contacts });
  } catch (error) {
    next(error);
  }
};

export const getMessageThread = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    const thread = await listMessagesBetweenUsers(req.user.id, targetUserId);

    // Fetch details of contact for UI header convenience
    const contact = await findUserById(targetUserId);

    sendSuccess(res, "Message thread retrieved", {
      thread,
      contact: contact
        ? {
            id: contact._id || contact.id,
            name: contact.name,
            role: contact.role,
            email: contact.email,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    if (!recipientId || !content || !content.trim()) {
      throw new CustomError("Recipient ID and content are required", 400);
    }

    const recipient = await findUserById(recipientId);
    if (!recipient) {
      throw new CustomError("Recipient user not found", 404);
    }

    const created = await createMessage(req.user.id, recipientId, content);
    sendSuccess(res, "Message sent successfully", { message: created }, 201);
  } catch (error) {
    next(error);
  }
};
