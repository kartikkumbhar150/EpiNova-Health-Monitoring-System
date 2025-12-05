import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { db } from './config/db.js';
import { diseaseReports as diseaseReportsTable } from './DB/schema.js';
import job from './config/cron.js';
import diseaseReportsRoutes from './routes/addFormData.js';
import dns from 'node:dns';
import { URL } from 'url';

const app = express();
const PORT = process.env.PORT || ENV.PORT || 3000;

if  (ENV.NODE_ENV === "production") job.start();

// Enable CORS - environment-specific configuration
if (ENV.NODE_ENV === 'production') {
  // Production: Specific origins for security
  app.use(cors({
    origin: [
      // Add your production web app URLs here when you deploy
      'https://nativeapp-a2hg.onrender.com',
      'https://your-expo-web-app.netlify.app',
      // For Expo development/testing (optional)
      /^https:\/\/.*\.expo\.dev$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
} else {
  // Development: Allow all origins for testing
  app.use(cors());
}

app.use(express.json()); //without this req.body is undefined


app.get("/api/health", async (req,res)=>{
    try {
        // Test database connection
        const testQuery = await db.select().from(diseaseReportsTable).limit(1);
        res.status(200).json({
            success: true,
            database: "connected",
            env: ENV.NODE_ENV,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("❌ Health check failed:", error);
        res.status(500).json({
            success: false,
            database: "disconnected",
            error: error.message,
            env: ENV.NODE_ENV
        });
    }
})

// Disease Reports API Endpoints

app.post("/api/disease-reports", async(req,res) =>{
    try {
        console.log('📥 Received disease report data:', req.body);
        
        // Log environment info for debugging
        console.log('🔍 Environment check:', {
            NODE_ENV: ENV.NODE_ENV,
            DATABASE_URL_EXISTS: !!ENV.DATABASE_URL,
            DATABASE_URL_PREFIX: ENV.DATABASE_URL ? ENV.DATABASE_URL.substring(0, 20) + '...' : 'MISSING'
        });
        
        const{
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
            reported_by_name
        } = req.body;

        // Validate required fields
        if(!patient_name || !age_group || !symptoms || !onset_date || !severity || !water_source || !reported_by){
            console.log('❌ Validation failed - missing required fields:', {
                patient_name: !!patient_name,
                age_group: !!age_group,
                symptoms: !!symptoms,
                onset_date: !!onset_date,
                severity: !!severity,
                water_source: !!water_source,
                reported_by: !!reported_by
            });
            return res.status(400).json({error:"Required fields are missing"})
        }

        console.log('✅ Validation passed, attempting database insert...');

        // If DATABASE_URL is present, try a DNS preflight to resolve the DB hostname
        // This helps avoid immediate getaddrinfo ENOTFOUND errors by waiting until
        // the hostname resolves before calling Drizzle/Postgres client.
        async function dnsResolveWithBackoff(hostname, attempts = 4, baseDelayMs = 250) {
            let a = 0;
            while (a < attempts) {
                a += 1;
                try {
                    // Use promises API for lookup
                    await dns.promises.lookup(hostname);
                    console.log(`✅ DNS resolved for ${hostname} (attempt ${a})`);
                    return true;
                } catch (err) {
                    console.warn(`⚠️ DNS lookup attempt ${a} failed for ${hostname}: ${err.code || err.message}`);
                    if (a >= attempts) return false;
                    const delay = baseDelayMs * Math.pow(2, a - 1);
                    // eslint-disable-next-line no-await-in-loop
                    await new Promise((r) => setTimeout(r, delay));
                }
            }
            return false;
        }

        // Try to extract hostname from DATABASE_URL and perform DNS preflight
        try {
            if (ENV.DATABASE_URL) {
                try {
                    const parsed = new URL(ENV.DATABASE_URL);
                    const host = parsed.hostname;
                    if (host) {
                        const resolved = await dnsResolveWithBackoff(host, 5, 300);
                        if (!resolved) {
                            console.warn(`DNS preflight did not resolve ${host} after retries; proceeding to DB insert which will also retry.`);
                        }
                    }
                } catch (parseErr) {
                    console.warn('Could not parse DATABASE_URL for DNS preflight:', parseErr?.message || parseErr);
                }
            }
        } catch (e) {
            // Non-fatal; continue to insert and rely on existing insert retry logic
            console.warn('Unexpected error during DNS preflight:', e?.message || e);
        }

        // Retry/backoff loop to handle transient DNS/network issues (Drizzle-level failures)
        const maxAttempts = 6; // increase attempts to improve chance of success
        let attempt = 0;
        let inserted = null;
        const baseDelay = 300; // ms

        while (attempt < maxAttempts) {
            attempt += 1;
            try {
                console.log(`Attempt ${attempt} to insert disease report`);
                const newDiseaseReport = await db.insert(diseaseReportsTable).values({
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
                    reportedBy: reported_by
                }).returning();

                inserted = newDiseaseReport[0];
                console.log('Disease report added:', inserted);
                res.status(201).json({
                    success: true,
                    message: 'Disease report submitted successfully',
                    data: inserted
                });
                break; // success
            } catch (err) {
                const causeCode = err?.cause?.code || err?.code || '';
                const isTransient = /ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ECONNRESET/.test(causeCode) || /ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ECONNRESET/.test(err?.message || '');
                console.error(`Insert attempt ${attempt} failed:`, err?.message || err);
                if (!isTransient || attempt >= maxAttempts) {
                    console.error('❌ Final failure inserting disease report after retries:', err);
                    return res.status(500).json({
                        error: 'Internal server error',
                        details: process.env.NODE_ENV === 'development' ? err.message : undefined
                    });
                }

                const delay = baseDelay * Math.pow(2, attempt - 1);
                console.log(`⏳ Transient error detected, retrying in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);
                // eslint-disable-next-line no-await-in-loop
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

    } catch (error) {
        console.error("❌ Error adding disease report:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
})

app.get("/api/disease-reports",async(req,res)=>{
    try {
        const allReports = await db.select().from(diseaseReportsTable);
        res.status(200).json(allReports);
        
    } catch (error) {
        console.log("Error fetching disease reports",error);
        res.status(500).json({error:"Internal server error"});    
    }
})

app.get("/api/disease-reports/:workerId",async(req,res)=>{
    try {
        const {workerId} = req.params;

        const workerReports = await db.select().from(diseaseReportsTable).where(
            eq(diseaseReportsTable.reportedBy, workerId)
        )

        res.status(200).json(workerReports);
        
    } catch (error) {
        console.log("Error fetching worker reports",error);
        res.status(500).json({error:"Internal server error"});    
    }
})

app.get("/api/v1/environmental-factors/westSiang", async (req, res) => {
  try {
    const factors =  await db
      .select()
      .from(environmentalFactors)
      .where(eq(environmentalFactors.district, "West Siang"));

    res.json(factors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch environmental factors" });
  }
});




app.listen(PORT, ()=>{
    console.log("server started on the port "+PORT);
})
app.use(express.json());
app.use(cors());

// Mount the disease reports routes
app.use("/api/disease-reports", diseaseReportsRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true });
});

app.listen(PORT, () => {
    console.log("server started on port " + PORT);
});
