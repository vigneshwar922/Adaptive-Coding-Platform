const pool = require('../config/db');

exports.getCollections = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Query collections owned by user, shared with user, or public
    const result = await pool.query(
      `SELECT DISTINCT c.id, c.name, c.is_public, c.user_id, u.name as owner_name,
       (SELECT count(*) FROM wishlist_items WHERE collection_id = c.id) as item_count
       FROM wishlist_collections c
       JOIN users u ON c.user_id = u.id
       LEFT JOIN wishlist_shares s ON c.id = s.collection_id
       WHERE c.user_id = $1 
          OR s.shared_with_user_id = $1
          OR c.is_public = true
       ORDER BY c.name ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const { name, is_public } = req.body;
    const userId = req.user.id;
    const result = await pool.query(
      `INSERT INTO wishlist_collections (user_id, name, is_public) 
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, name, is_public || false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { collection_id, problem_id } = req.body;
    await pool.query(
      `INSERT INTO wishlist_items (collection_id, problem_id) 
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [collection_id, problem_id]
    );
    res.json({ message: 'Item added' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.shareCollection = async (req, res) => {
  try {
    const { collection_id, username } = req.body;
    const userResult = await pool.query('SELECT id FROM users WHERE name = $1', [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const sharedUserId = userResult.rows[0].id;
    await pool.query(
      `INSERT INTO wishlist_shares (collection_id, shared_with_user_id) 
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [collection_id, sharedUserId]
    );
    res.json({ message: 'Collection shared' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
