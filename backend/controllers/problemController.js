const pool = require('../config/db');

exports.getAllProblems = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    const userId = req.user ? req.user.id : null;

    let query = `
      SELECT p.id, p.title, p.difficulty, p.topic,
      CASE 
        WHEN s.status = 'accepted' THEN 'accepted'
        WHEN s.status = 'partial' THEN 'partial'
        WHEN s.status = 'wrong_answer' THEN 'wrong_answer'
        ELSE NULL
      END as status
      FROM problems p
      LEFT JOIN (
        SELECT DISTINCT ON (problem_id, user_id) problem_id, user_id, status
        FROM submissions
        WHERE user_id = $1
        ORDER BY problem_id, user_id, 
          CASE 
            WHEN status = 'accepted' THEN 1
            WHEN status = 'partial' THEN 2
            WHEN status = 'wrong_answer' THEN 3
            ELSE 4
          END ASC
      ) s ON s.problem_id = p.id
      WHERE 1=1
    `;
    const params = [userId];

    if (topic) {
      params.push(topic);
      query += ` AND p.topic = $${params.length}`;
    }
    if (difficulty) {
      params.push(difficulty);
      query += ` AND p.difficulty = $${params.length}`;
    }

    query += ' ORDER BY p.id ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.title, p.description, p.difficulty, p.topic,
       p.input_labels,
       json_agg(
         json_build_object('input', tc.input, 'expected_output', tc.expected_output)
       ) FILTER (WHERE tc.is_hidden = false) AS examples
       FROM problems p
       LEFT JOIN test_cases tc ON tc.problem_id = p.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};