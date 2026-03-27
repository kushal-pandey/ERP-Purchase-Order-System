-- =========================
-- ERP DATABASE
-- =========================

DROP TABLE IF EXISTS po_items;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS vendors;

-- Vendors
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    contact VARCHAR NOT NULL,
    rating FLOAT NOT NULL CHECK (rating >= 0 AND rating <= 5)
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    sku VARCHAR NOT NULL UNIQUE,
    unit_price FLOAT NOT NULL CHECK (unit_price > 0),
    stock_level INTEGER NOT NULL CHECK (stock_level >= 0)
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR,
    vendor_id INTEGER REFERENCES vendors(id),
    total_amount FLOAT,
    status VARCHAR DEFAULT 'Pending'
);

-- PO Items
CREATE TABLE po_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES purchase_orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    price FLOAT
);

-- Sample Vendors
INSERT INTO vendors (name, contact, rating) VALUES
('ABC Suppliers', 'abc@gmail.com', 4.5),
('XYZ Traders', 'xyz@gmail.com', 4.2);

-- Sample Products
INSERT INTO products (name, sku, unit_price, stock_level) VALUES
('Laptop', 'LAP123', 50000, 10),
('Mouse', 'MOU123', 500, 50),
('Keyboard', 'KEY123', 1000, 30),
('Monitor', 'MON123', 8000, 20);