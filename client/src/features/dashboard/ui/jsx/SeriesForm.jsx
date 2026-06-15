"use client";

import { useState } from "react";
import { uploadImage } from "../../api/dashboard.api";
import FormField from "./FormField";
import ImageUploadField from "./ImageUploadField";
import styles from "../css/Dashboard.module.css";

const emptyForm = {
    name: "",
    shortName: "",
    season: "",
    status: "UPCOMING",
    logo: "",
};

const SeriesForm = ({ initialValues, onSubmit, isSubmitting }) => {
    const [form, setForm] = useState(initialValues ? { ...emptyForm, ...initialValues } : emptyForm);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setUploading(true);
        const logo = file ? await uploadImage(file, "/glpddp/series") : form.logo;
        setUploading(false);
        onSubmit({ ...form, logo });
        if (!initialValues) {
            setForm(emptyForm);
            setFile(null);
        }
    };

    return (
        <form className={`${styles.card} ${styles.form}`} onSubmit={submit}>
            <FormField label="Series Name">
                <input
                    className={styles.input}
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="ICC T20 World Cup 2024"
                    required
                />
            </FormField>
            <FormField label="Short Name">
                <input
                    className={styles.input}
                    value={form.shortName}
                    onChange={(event) => update("shortName", event.target.value)}
                    placeholder="T20 World Cup"
                    required
                />
            </FormField>
            <FormField label="Season">
                <input
                    className={styles.input}
                    value={form.season}
                    onChange={(event) => update("season", event.target.value)}
                    placeholder="2024"
                    required
                />
            </FormField>
            <FormField label="Status">
                <select
                    className={styles.select}
                    value={form.status}
                    onChange={(event) => update("status", event.target.value)}
                >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </FormField>
            <ImageUploadField
                label="Logo"
                preview={file ? URL.createObjectURL(file) : form.logo}
                onChange={setFile}
            />
            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.primary}`} disabled={isSubmitting || uploading}>
                    {uploading ? "Uploading..." : isSubmitting ? "Saving..." : "Save Series"}
                </button>
            </div>
        </form>
    );
};

export default SeriesForm;
