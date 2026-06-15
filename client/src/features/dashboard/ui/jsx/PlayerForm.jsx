"use client";

import { useState } from "react";
import { uploadImage } from "../../api/dashboard.api";
import FormField from "./FormField";
import ImageUploadField from "./ImageUploadField";
import styles from "../css/Dashboard.module.css";

const roles = ["BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKET_KEEPER"];
const battingStyles = ["RIGHT_HAND", "LEFT_HAND"];
const bowlingStyles = [
    "RIGHT_ARM_FAST",
    "LEFT_ARM_FAST",
    "RIGHT_ARM_MEDIUM",
    "LEFT_ARM_MEDIUM",
    "RIGHT_ARM_SPIN",
    "LEFT_ARM_SPIN",
];

const formatLabel = (value) =>
    value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const emptyForm = {
    name: "",
    image: "",
    country: "",
    battingStyle: "RIGHT_HAND",
    bowlingStyle: "RIGHT_ARM_FAST",
    role: ["BATSMAN"],
};

const PlayerForm = ({ initialValues, onSubmit, isSubmitting }) => {
    const [form, setForm] = useState(initialValues ? { ...emptyForm, ...initialValues } : emptyForm);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const toggleRole = (role) => {
        setForm((current) => {
            const hasRole = current.role.includes(role);
            const nextRoles = hasRole
                ? current.role.filter((item) => item !== role)
                : [...current.role, role];
            return { ...current, role: nextRoles.length ? nextRoles : [role] };
        });
    };

    const submit = async (event) => {
        event.preventDefault();
        setUploading(true);
        const image = file ? await uploadImage(file, "/glpddp/players") : form.image;
        setUploading(false);
        onSubmit({ ...form, image });
        if (!initialValues) {
            setForm(emptyForm);
            setFile(null);
        }
    };

    return (
        <form className={`${styles.card} ${styles.form}`} onSubmit={submit}>
            <FormField label="Player Name">
                <input
                    className={styles.input}
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    required
                />
            </FormField>
            <FormField label="Country">
                <input
                    className={styles.input}
                    value={form.country}
                    onChange={(event) => update("country", event.target.value)}
                    required
                />
            </FormField>
            <FormField label="Batting Style">
                <select
                    className={styles.select}
                    value={form.battingStyle}
                    onChange={(event) => update("battingStyle", event.target.value)}
                >
                    {battingStyles.map((style) => (
                        <option key={style} value={style}>{formatLabel(style)}</option>
                    ))}
                </select>
            </FormField>
            <FormField label="Bowling Style">
                <select
                    className={styles.select}
                    value={form.bowlingStyle}
                    onChange={(event) => update("bowlingStyle", event.target.value)}
                >
                    {bowlingStyles.map((style) => (
                        <option key={style} value={style}>{formatLabel(style)}</option>
                    ))}
                </select>
            </FormField>
            <FormField label="Roles" full>
                <div className={styles.toolbar}>
                    {roles.map((role) => (
                        <button
                            className={`${styles.button} ${form.role.includes(role) ? styles.primary : ""}`}
                            key={role}
                            onClick={() => toggleRole(role)}
                            type="button"
                        >
                            {formatLabel(role)}
                        </button>
                    ))}
                </div>
            </FormField>
            <ImageUploadField
                label="Player Image"
                preview={file ? URL.createObjectURL(file) : form.image}
                onChange={setFile}
            />
            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.primary}`} disabled={isSubmitting || uploading}>
                    {uploading ? "Uploading..." : isSubmitting ? "Saving..." : "Save Player"}
                </button>
            </div>
        </form>
    );
};

export default PlayerForm;
