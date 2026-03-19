const multer = require("multer");

const cloudinary = require("../../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const getUploadErrorMessage = (error) => {
  const rawMessage = error?.message || "";
  const message = rawMessage.toLowerCase();

  if (
    message.includes("must supply api_key") ||
    message.includes("must supply cloud_name") ||
    message.includes("must supply api_secret")
  ) {
    return "Thiếu cấu hình Cloudinary trên môi trường deploy";
  }

  if (
    message.includes("invalid signature") ||
    message.includes("unknown api_key") ||
    message.includes("authorization required")
  ) {
    return "Thông tin Cloudinary không đúng, vui lòng kiểm tra lại biến môi trường";
  }

  if (message.includes("cloud_name is disabled")) {
    return "Cloudinary báo cloud_name đang bị disabled hoặc bộ credential không cùng một account";
  }

  if (
    message.includes("file size too large") ||
    message.includes("request entity too large") ||
    message.includes("payload too large")
  ) {
    return "Ảnh tải lên quá lớn, vui lòng chọn ảnh nhỏ hơn";
  }

  if (message.includes("timeout")) {
    return "Upload ảnh bị timeout, vui lòng thử lại";
  }

  return "Lỗi khi upload ảnh lên Cloudinary";
};

module.exports.single = (fieldName) => upload.single(fieldName);

module.exports.uploadImage = ({
  fieldName,
  folder,
  resourceType = "image",
  buildErrorRedirect
}) => {
  return async (req, res, next) => {
    if (!req.file || !req.file.buffer) {
      return next();
    }

    if (fieldName && req.file.fieldname !== fieldName) {
      return next();
    }

    try {
      const uploadResult = await cloudinary.uploadBuffer(req.file.buffer, {
        folder,
        resource_type: resourceType
      });

      req.cloudinaryFile = {
        fieldName: req.file.fieldname,
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      };

      return next();
    } catch (error) {
      console.error("cloudinary upload middleware error:", error);

      if (typeof buildErrorRedirect === "function") {
        const redirectPath = buildErrorRedirect(req, getUploadErrorMessage(error));
        if (redirectPath) {
          return res.redirect(redirectPath);
        }
      }

      return res.status(500).send("Upload Error");
    }
  };
};

module.exports.getUploadErrorMessage = getUploadErrorMessage;
