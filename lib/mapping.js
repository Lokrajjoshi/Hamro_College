// camelCase (JS) <-> snake_case (Postgres) field mapping for the colleges table.
const FIELDS = {
  slug: "slug", name: "name", shortName: "short_name", tier: "tier", country: "country", city: "city",
  affiliation: "affiliation", accreditation: "accreditation", established: "established",
  description: "description", lat: "lat", lng: "lng", currency: "currency",
  tuitionAnnual: "tuition_annual", oneTimeFees: "one_time_fees", durationYears: "duration_years",
  avgPackage: "avg_package", nepaliStudents: "nepali_students", nepaliAlumni: "nepali_alumni",
  safetyIndex: "safety_index", hostelCapacity: "hostel_capacity", mandatoryPg: "mandatory_pg",
  installments: "installments", distanceKm: "distance_km", connectivity: "connectivity",
  workHoursPerWeek: "work_hours_per_week", postStudyVisaYears: "post_study_visa_years",
  minGpa: "min_gpa", englishTest: "english_test", courses: "courses", highlights: "highlights",
};

export function collegeToRow(college) {
  const row = {};
  for (const [js, db] of Object.entries(FIELDS)) row[db] = college[js] ?? null;
  return row;
}

export function rowToCollege(row) {
  const college = {};
  for (const [js, db] of Object.entries(FIELDS)) college[js] = row[db];
  // numeric columns come back as strings from Postgres `numeric`
  for (const k of ["tuitionAnnual", "oneTimeFees", "durationYears", "avgPackage", "safetyIndex", "minGpa", "lat", "lng", "postStudyVisaYears", "workHoursPerWeek", "distanceKm"]) {
    if (college[k] != null) college[k] = Number(college[k]);
  }
  college.courses = college.courses || [];
  college.highlights = college.highlights || [];
  return college;
}

export function rowToReview(row) {
  return {
    id: row.id,
    collegeSlug: row.college_slug,
    author: row.author_name,
    verification: row.verification_type,
    verified: row.verified,
    academic: row.academic_rating,
    housing: row.housing_rating,
    placement: row.placement_rating,
    text: row.review_text,
    date: row.created_at?.slice(0, 10),
  };
}
