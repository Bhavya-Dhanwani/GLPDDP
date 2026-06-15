"use client";

import { UploadCloud } from "lucide-react";
import styles from "../css/Dashboard.module.css";

const ImageUploadField = ({ label, preview, onChange }) => (
    <label className={styles.field}>
        <span className={styles.label}>{label}</span>
        <span className={styles.upload}>
            {preview ? (
                <img src={preview} alt={label} className={styles.preview} />
            ) : (
                <span>
                    <UploadCloud size={28} />
                    <br />
                    Click to upload image
                </span>
            )}
            <input
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => onChange(event.target.files?.[0] || null)}
                type="file"
            />
        </span>
    </label>
);

export default ImageUploadField;
