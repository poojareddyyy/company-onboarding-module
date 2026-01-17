const pool = require("../db");

exports.saveCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { company_name, industry, company_size } = req.body;

    if (!company_name || !industry || !company_size) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1",
      [userId]
    );

    let result;

    if (existing.rows.length > 0) {
      
      result = await pool.query(
        `UPDATE company_profiles
         SET company_name = $1, industry = $2, company_size = $3
         WHERE user_id = $4
         RETURNING *`,
        [company_name, industry, company_size, userId]
      );
    } else {
      
      result = await pool.query(
        `INSERT INTO company_profiles (user_id, company_name, industry, company_size)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, company_name, industry, company_size]
      );
    }

    res.status(200).json({
      success: true,
      message: "Company profile saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Company profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
