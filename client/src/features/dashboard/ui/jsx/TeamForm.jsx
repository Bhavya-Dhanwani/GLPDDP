"use client";

import { useMemo, useState } from "react";
import { uploadImage } from "../../api/dashboard.api";
import FormField from "./FormField";
import ImageUploadField from "./ImageUploadField";
import styles from "../css/Dashboard.module.css";

const emptyForm = {
    name: "",
    shortName: "",
    logo: "",
    primaryColor: "#00843d",
    squadPlayers: [],
};

const idOf = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (value.$oid) return String(value.$oid);
    if (value.id) return idOf(value.id);
    if (value._id) return idOf(value._id);
    return "";
};

const normalizeInitialValues = (initialValues) =>
    initialValues
        ? {
              ...emptyForm,
              ...initialValues,
              squadPlayers: (initialValues.squadPlayers || []).map(idOf).filter(Boolean),
          }
        : emptyForm;

const TeamForm = ({ initialValues, players = [], onSubmit, isSubmitting }) => {
    const [form, setForm] = useState(normalizeInitialValues(initialValues));
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const selectedPlayers = useMemo(() => new Set(form.squadPlayers), [form.squadPlayers]);

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const togglePlayer = (playerId) => {
        setForm((current) => {
            const hasPlayer = current.squadPlayers.includes(playerId);
            const squadPlayers = hasPlayer
                ? current.squadPlayers.filter((id) => id !== playerId)
                : [...current.squadPlayers, playerId];
            return { ...current, squadPlayers };
        });
    };

    const submit = async (event) => {
        event.preventDefault();
        if (form.squadPlayers.length < 11 || form.squadPlayers.length > 15) return;

        setUploading(true);
        const logo = file ? await uploadImage(file, "/glpddp/teams") : form.logo;
        setUploading(false);
        onSubmit({ ...form, logo });

        if (!initialValues) {
            setForm(emptyForm);
            setFile(null);
        }
    };

    return (
        <form className={`${styles.card} ${styles.form}`} onSubmit={submit}>
            <FormField label="Team Name">
                <input
                    className={styles.input}
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    required
                />
            </FormField>
            <FormField label="Short Name">
                <input
                    className={styles.input}
                    maxLength="10"
                    value={form.shortName}
                    onChange={(event) => update("shortName", event.target.value)}
                    required
                />
            </FormField>
            <FormField label="Primary Color">
                <input
                    className={styles.input}
                    type="color"
                    value={form.primaryColor}
                    onChange={(event) => update("primaryColor", event.target.value)}
                />
            </FormField>
            <ImageUploadField
                label="Team Logo"
                preview={file ? URL.createObjectURL(file) : form.logo}
                onChange={setFile}
            />
            <FormField label={`Squad Players (${form.squadPlayers.length}/15)`} full>
                <div className={styles.pickGrid}>
                    {players.map((player) => {
                        const playerId = idOf(player);
                        const active = selectedPlayers.has(playerId);
                        return (
                            <button
                                className={`${styles.pickCard} ${active ? styles.pickCardActive : ""}`}
                                key={playerId}
                                onClick={() => togglePlayer(playerId)}
                                type="button"
                            >
                                <strong>{player.name}</strong>
                                <span>{(player.role || []).join(", ") || player.country || "Player"}</span>
                            </button>
                        );
                    })}
                    {!players.length && <div className={styles.empty}>Create players before creating teams.</div>}
                </div>
                <p className={styles.muted}>Select 11 to 15 players for the team squad.</p>
            </FormField>
            <div className={styles.actions}>
                <button
                    className={`${styles.button} ${styles.primary}`}
                    disabled={isSubmitting || uploading || form.squadPlayers.length < 11 || form.squadPlayers.length > 15}
                >
                    {uploading ? "Uploading..." : isSubmitting ? "Saving..." : "Save Team"}
                </button>
            </div>
        </form>
    );
};

export default TeamForm;
