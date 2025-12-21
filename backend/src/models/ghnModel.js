import db from "../config/db.js";

export const insertGhnDonHang = async ({
  madonhang,
  ghn_order_code,
  phiship = 0,
  trans_type = null,
  service_type_id = null,
  to_province_id = null,
  to_district_id = null,
  to_ward_code = null,
  status = "created",
  raw_response = null,
}) => {
  const [result] = await db.query(
    `
    INSERT INTO ghn_donhang
      (madonhang, ghn_order_code, phiship, trans_type, service_type_id,
       to_province_id, to_district_id, to_ward_code, status, raw_response)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      ghn_order_code = VALUES(ghn_order_code),
      phiship = VALUES(phiship),
      trans_type = VALUES(trans_type),
      service_type_id = VALUES(service_type_id),
      to_province_id = VALUES(to_province_id),
      to_district_id = VALUES(to_district_id),
      to_ward_code = VALUES(to_ward_code),
      status = VALUES(status),
      raw_response = VALUES(raw_response),
      updated_at = CURRENT_TIMESTAMP
    `,
    [
      madonhang,
      ghn_order_code,
      phiship,
      trans_type,
      service_type_id,
      to_province_id,
      to_district_id,
      to_ward_code,
      status,
      raw_response ? JSON.stringify(raw_response) : null,
    ]
  );

  return result;
};

export const getAllGhnDonHangForAdmin = async () => {
  const [rows] = await db.query(`
    SELECT
      g.id,
      g.madonhang,
      g.ghn_order_code,
      g.phiship,
      g.status AS ghn_status,
      g.created_at AS ghn_created_at
    FROM ghn_donhang g
    ORDER BY g.id DESC
  `);
  return rows;
};

export const getGhnByMadonhang = async (madonhang) => {
  const [rows] = await db.query(
    `SELECT * FROM ghn_donhang WHERE madonhang = ? LIMIT 1`,
    [madonhang]
  );
  return rows[0] || null;
};
