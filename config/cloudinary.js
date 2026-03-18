const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

module.exports.destroy = (publicId) => {
  if (!publicId) return Promise.resolve(null);
  return cloudinary.uploader.destroy(publicId);
};

module.exports.getDebugInfo = async () => {
  const maskApiKey = (value) => {
    if (!value) return null;
    if (value.length <= 4) return "****";
    return `${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
  };

  const envInfo = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
    apiKeyMasked: maskApiKey(process.env.CLOUDINARY_API_KEY || ""),
    hasApiSecret: Boolean(process.env.CLOUDINARY_API_SECRET)
  };

  const configured = cloudinary.config();
  const configInfo = {
    cloudName: configured.cloud_name || null,
    apiKeyMasked: maskApiKey(configured.api_key || ""),
    hasApiSecret: Boolean(configured.api_secret)
  };

  try {
    const pingResult = await cloudinary.api.ping();
    return {
      ok: true,
      env: envInfo,
      config: configInfo,
      ping: pingResult
    };
  } catch (error) {
    return {
      ok: false,
      env: envInfo,
      config: configInfo,
      error: {
        message: error?.message || "Unknown error",
        name: error?.name || "Error",
        http_code: error?.http_code || null
      }
    };
  }
};
