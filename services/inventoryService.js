const pool = require('../config/db');

exports.getLowStockItems = async () => {
  const [rows] = await pool.execute(
    'SELECT * FROM inventory WHERE quantity < threshold'
  );
  return rows;
};

exports.getLowStockCount = async () => {
  const [[{ count }]] = await pool.execute(
    'SELECT COUNT(*) as count FROM inventory WHERE quantity < threshold'
  );
  return count;
};
