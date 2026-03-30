

CREATE DATABASE IF NOT EXISTS jmra_db;
USE jmra_db;

-- ── USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)                  NOT NULL,
  email      VARCHAR(150)  UNIQUE          NOT NULL,
  password   VARCHAR(255)                  NOT NULL,
  role       ENUM('user','admin')          NOT NULL DEFAULT 'user',
  created_at TIMESTAMP                     DEFAULT CURRENT_TIMESTAMP
);

-- ── PROPERTIES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(150)    NOT NULL,
  price       VARCHAR(50)     NOT NULL,
  location    VARCHAR(100)    NOT NULL,
  type        VARCHAR(50)                  DEFAULT 'bungalow',
  description TEXT,
  image       VARCHAR(500),
  bedrooms    INT                          DEFAULT 3,
  bathrooms   INT                          DEFAULT 2,
  area_sqft   INT,
  created_at  TIMESTAMP                    DEFAULT CURRENT_TIMESTAMP
);

-- ── WISHLIST ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  property_id INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wish (user_id, property_id)
);

-- ── ENQUIRIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT,
  property_id INT,
  name        VARCHAR(100)    NOT NULL,
  email       VARCHAR(150)    NOT NULL,
  message     TEXT,
  viewing_date DATE,
  status      ENUM('pending','confirmed','rejected') DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE SET NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- ── SEED: default admin account ─────────────────────────────
INSERT IGNORE INTO users (name, email, password, role)
VALUES (
  'Admin',
  'admin@jmra.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
);

-- ── SEED: sample properties ──────────────────────────────────
INSERT IGNORE INTO properties (id, title, price, location, type, description, image, bedrooms, bathrooms, area_sqft) VALUES
(1, 'Bungalow 1',  '₹1.8 Cr',  'Pune',      'bungalow', 'Beautiful bungalow with modern amenities and spacious rooms.', 'assets/img/popular1.jpg', 3, 2, 2200),
(2, 'Bungalow 2',  '₹2.4 Cr',  'Mumbai',    'bungalow', 'Luxury apartment in prime location with city view.',           'assets/img/popular2.jpg', 4, 3, 2800),
(3, 'Bungalow 3',  '₹1.2 Cr',  'Goa',       'bungalow', 'Peaceful beach house perfect for vacation living.',            'assets/img/popular3.jpg', 3, 2, 1900),
(4, 'Villa 1',     '₹1.69 Cr', 'Bangalore', 'villa',     'Modern home in tech hub with great connectivity.',            'assets/img/popular4.jpg', 4, 3, 3100),
(5, 'Villa 2',     '₹1.9 Cr',  'Delhi',     'villa',     'Spacious property in capital with premium facilities.',        'assets/img/popular5.jpg', 5, 4, 3500);
