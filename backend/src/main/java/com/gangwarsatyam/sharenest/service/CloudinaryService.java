package com.gangwarsatyam.sharenest.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CloudinaryService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

    @Value("${app.debug:false}")
    private boolean debug;

    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.cloud_name}") String cloudName,
                             @Value("${cloudinary.api_key}") String apiKey,
                             @Value("${cloudinary.api_secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    /**
     * Uploads an image using byte array.
     */
    public String uploadImage(byte[] imageBytes, String folder) throws IOException {
        if (debug) logger.debug("Uploading image to Cloudinary folder: {}", folder);

        Map<String, Object> uploadResult = cloudinary.uploader()
                .upload(imageBytes, ObjectUtils.asMap("folder", folder));

        String url = uploadResult.get("secure_url").toString();
        if (debug) logger.debug("Image uploaded successfully: {}", url);

        return url;
    }

    /**
     * Uploads an image using MultipartFile (from HTTP request).
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be null or empty");
        }

        if (debug) logger.debug("Uploading file {} to Cloudinary folder: {}", file.getOriginalFilename(), folder);
        return uploadImage(file.getBytes(), folder);
    }

    /**
     * Deletes an image from Cloudinary by public ID.
     */
    public boolean deleteImage(String publicId) throws IOException {
        if (debug) logger.debug("Deleting image from Cloudinary with public ID: {}", publicId);

        Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

        boolean success = "ok".equals(result.get("result"));
        if (debug) logger.debug("Image deletion result for {}: {}", publicId, result.get("result"));

        return success;
    }
}
