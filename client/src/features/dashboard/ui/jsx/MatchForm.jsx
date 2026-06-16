"use client";

import { useState } from "react";
import FormField from "./FormField";
import styles from "../css/Dashboard.module.css";

const emptyForm = {
    seriesId: "",
    title: "",
    matchNumber: "",
    venue: "",
    city: "",
    country: "",
    startTime: "",
    matchType: "T20",
    team1: "",
    team2: "",
};

const formatLabel = (value) =>
    value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const toDateTimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
};

const prepareInitialValues = (initialValues) =>
    initialValues
        ? {
              ...emptyForm,
              ...initialValues,
              seriesId: initialValues.series?.id || initialValues.series?._id || initialValues.seriesId || "",
              team1: initialValues.team1?._id || initialValues.team1?.id || initialValues.team1 || "",
              team2: initialValues.team2?._id || initialValues.team2?.id || initialValues.team2 || "",
              startTime: toDateTimeLocal(initialValues.startTime),
          }
        : emptyForm;

const MatchForm = ({ initialValues, series = [], teams = [], onSubmit, isSubmitting }) => {
    const [form, setForm] = useState(prepareInitialValues(initialValues));

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submit = (event) => {
        event.preventDefault();
        const payload = {
            ...form,
            startTime: new Date(form.startTime).toISOString(),
        };
        onSubmit(payload);
        if (!initialValues) {
            setForm(emptyForm);
        }
    };

    return (
        <form className={`${styles.card} ${styles.form}`} onSubmit={submit}>
            <FormField label="Series">
                <select
                    className={styles.select}
                    value={form.seriesId}
                    onChange={(event) => update("seriesId", event.target.value)}
                    required
                >
                    <option value="">Select series</option>
                    {series.map((item) => (
                        <option key={item.id || item._id} value={item.id || item._id} title={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </FormField>
            <FormField label="Match Type">
                <select
                    className={styles.select}
                    value={form.matchType}
                    onChange={(event) => update("matchType", event.target.value)}
                >
                    {["ODI", "T20"].map((type) => (
                        <option key={type} value={type}>{formatLabel(type)}</option>
                    ))}
                </select>
            </FormField>
            <FormField label="Title">
                <input className={styles.input} value={form.title} onChange={(event) => update("title", event.target.value)} />
            </FormField>
            <FormField label="Match Number">
                <input className={styles.input} value={form.matchNumber} onChange={(event) => update("matchNumber", event.target.value)} />
            </FormField>
            <FormField label="Team 1">
                <select className={styles.select} value={form.team1} onChange={(event) => update("team1", event.target.value)} required>
                    <option value="">Select team</option>
                    {teams.map((team) => (
                        <option key={team.id || team._id} value={team.id || team._id} title={team.name}>{team.name}</option>
                    ))}
                </select>
            </FormField>
            <FormField label="Team 2">
                <select className={styles.select} value={form.team2} onChange={(event) => update("team2", event.target.value)} required>
                    <option value="">Select team</option>
                    {teams.map((team) => (
                        <option key={team.id || team._id} value={team.id || team._id} title={team.name}>{team.name}</option>
                    ))}
                </select>
            </FormField>
            <FormField label="Venue">
                <input className={styles.input} value={form.venue} onChange={(event) => update("venue", event.target.value)} required />
            </FormField>
            <FormField label="Start Time">
                <input className={styles.input} value={form.startTime} onChange={(event) => update("startTime", event.target.value)} required type="datetime-local" />
            </FormField>
            <FormField label="City">
                <input className={styles.input} value={form.city} onChange={(event) => update("city", event.target.value)} />
            </FormField>
            <FormField label="Country">
                <input className={styles.input} value={form.country} onChange={(event) => update("country", event.target.value)} />
            </FormField>
            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.primary}`} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Match"}
                </button>
            </div>
        </form>
    );
};

export default MatchForm;
