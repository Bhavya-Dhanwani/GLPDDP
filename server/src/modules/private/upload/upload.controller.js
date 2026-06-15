import crypto from "crypto";
import envs from "../../../shared/config/env.config.js";
import ApiResponse from "../../../shared/utils/ApiResponse.utils.js";

class UploadController {
    imageKitAuth = async (req, res) => {
        if (!envs.IMAGEKIT_PUBLIC_KEY || !envs.IMAGEKIT_PRIVATE_KEY) {
            return ApiResponse(res, 500, "ImageKit is not configured");
        }

        const token = crypto.randomBytes(16).toString("hex");
        const expire = Math.floor(Date.now() / 1000) + 15 * 60;
        const signature = crypto
            .createHmac("sha1", envs.IMAGEKIT_PRIVATE_KEY)
            .update(token + expire)
            .digest("hex");

        return ApiResponse(res, 200, "ImageKit auth generated", {
            token,
            expire,
            signature,
            publicKey: envs.IMAGEKIT_PUBLIC_KEY,
            uploadUrl: "https://upload.imagekit.io/api/v1/files/upload",
        });
    };
}

export default UploadController;
