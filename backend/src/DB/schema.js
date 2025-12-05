import { pgTable , serial , text , timestamp ,integer, numeric,varchar,jsonb, decimal} from "drizzle-orm/pg-core";
export const diseaseReports = pgTable("disease_reports", {
    id: serial().primaryKey().notNull(),
    patientName: text("patient_name").notNull(),
    ageGroup: text("age_group").notNull(),
    latitude: numeric({ precision: 10, scale:  8 }),
    longitude: numeric({ precision: 11, scale:  8 }),
    locationAccuracy: numeric("location_accuracy", { precision: 10, scale:  2 }),
    symptoms: jsonb().notNull(),
    onsetDate: text("onset_date").notNull(),
    severity: text().notNull(),
    description: text(),
    waterSource: text("water_source").notNull(),
    reportedBy: text("reported_by"),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
    predictedDisease: varchar("predicted_disease"),
    state: text(),
    district: text(),
    village: text(),
    phoneNo: text("phone_no"),
});

