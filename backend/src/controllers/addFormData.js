import { db } from '../config/db.js';
import { diseaseReports } from '../DB/schema.js';
import { eq } from 'drizzle-orm';
import { sendSms } from '../utils/twilio/sendFormData.js';
import { objectToString } from '../utils/objectToString.js';

/**
 * Get all disease reports
 */
export const getAllReports = async (req, res) => {
  try {
    const allReports = await db.select().from(diseaseReports);
    res.status(200).json(allReports);
  } catch (error) {
    console.log("❌ Error fetching disease reports", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Add a new disease report
 */
export const addReport = async (req, res) => {
  try {
    console.log('📥 Received disease report data:', req.body);

    const {
      patient_name,
      age_group,
      latitude,
      longitude,
      location_accuracy,
      symptoms,
      onset_date,
      severity,
      description,
      water_source,
      reported_by,
      predicted_disease,
      state,
      district,
      village,
      phone_no
    } = req.body;

    // ✅ Validate required fields
    if (!patient_name || !phone_no || !age_group || !symptoms || !onset_date || !severity || !water_source || !reported_by) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // ✅ Insert into DB
    const newDiseaseReport = await db.insert(diseaseReports).values({
      patientName: patient_name,
      ageGroup: age_group,
      latitude,
      longitude,
      locationAccuracy: location_accuracy,
      symptoms,
      onsetDate: onset_date,
      severity,
      description: description || '',
      waterSource: water_source,
      reportedBy: reported_by,
      predictedDisease: predicted_disease || null,
      state: state || null,
      district: district || null,
      village: village || null,
      phoneNo: phone_no
      // createdAt will default automatically
    }).returning();

    // ✅ Send SMS notification
    await sendSms(objectToString(req.body));

    console.log('✅ Disease report added:', newDiseaseReport[0]);

    res.status(201).json({
      success: true,
      message: 'Disease report submitted successfully',
      data: newDiseaseReport[0]
    });

  } catch (error) {
    console.log("❌ Error adding disease report", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get reports by worker ID
 */
export const getReportsByWorkerId = async (req, res) => {
  try {
    const { workerId } = req.params;

    const workerReports = await db
      .select()
      .from(diseaseReports)
      .where(eq(diseaseReports.reportedBy, workerId));

    res.status(200).json(workerReports);
  } catch (error) {
    console.log("❌ Error fetching worker reports", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a disease report
 */
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await db
      .update(diseaseReports)
      .set({
        patientName: updateData.patient_name,
        ageGroup: updateData.age_group,
        latitude: updateData.latitude,
        longitude: updateData.longitude,
        locationAccuracy: updateData.location_accuracy,
        symptoms: updateData.symptoms,
        onsetDate: updateData.onset_date,
        severity: updateData.severity,
        description: updateData.description,
        waterSource: updateData.water_source,
        reportedBy: updateData.reported_by,
        predictedDisease: updateData.predicted_disease,
        state: updateData.state,
        district: updateData.district,
        village: updateData.village,
        phoneNo: updateData.phone_no
      })
      .where(eq(diseaseReports.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: updated[0]
    });

  } catch (error) {
    console.log("❌ Error updating report", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a disease report
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(diseaseReports)
      .where(eq(diseaseReports.id, id))
      .returning();

    if (!deleted.length) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
      data: deleted[0]
    });

  } catch (error) {
    console.log("❌ Error deleting report", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
