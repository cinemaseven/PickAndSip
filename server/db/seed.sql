-- Pick & Sip development seed data.
TRUNCATE TABLE profiles, cafes, visits, orders RESTART IDENTITY CASCADE;

INSERT INTO profiles (id, username)
VALUES (1, 'Ella');

INSERT INTO cafes (
  id,
  name,
  location,
  latitude,
  longitude,
  price_range,
  rating,
  tags,
  notes
)
VALUES
  (
    1,
    'Café MMs',
    'Santa Rita, Pampanga',
    NULL,
    NULL,
    'P',
    5.0,
    ARRAY['Study', 'Hangout'],
    ARRAY['Good place to study and catch up with friends.']
  ),
  (
    2,
    'Café Athalia',
    'Santa Rita, Pampanga',
    NULL,
    NULL,
    'P',
    3.1,
    ARRAY['Hangout', 'Aesthetic'],
    ARRAY['Nice for casual visits.']
  ),
  (
    3,
    'Centro',
    'Angeles City, Pampanga',
    NULL,
    NULL,
    'P',
    4.6,
    ARRAY['Study', 'Quiet'],
    ARRAY['Comfortable seating and quiet corners.']
  ),
  (
    4,
    'Myoc',
    'Angeles City, Pampanga',
    NULL,
    NULL,
    'PP',
    2.3,
    ARRAY['Hangout'],
    ARRAY['Good for a quick stop.']
  ),
  (
    5,
    'Singku',
    'Angeles City, Pampanga',
    NULL,
    NULL,
    'PP',
    4.7,
    ARRAY['Hangout', 'Aesthetic'],
    ARRAY['Good ambiance for longer conversations.']
  ),
  (
    6,
    'Café Dia',
    'Clark Freeport, Angeles, Pampanga',
    NULL,
    NULL,
    'P',
    4.8,
    ARRAY['Hangout', 'Aesthetic'],
    ARRAY['Aesthetic space with good drinks.']
  );

INSERT INTO visits (id, cafe_id, visit_date, notes)
VALUES
  (101, 1, '2026-09-17', 'Quiet afternoon.'),
  (102, 1, '2026-09-13', ''),
  (103, 1, '2026-09-07', ''),
  (201, 2, '2026-09-11', ''),
  (301, 3, '2026-08-26', ''),
  (401, 4, '2026-08-10', ''),
  (501, 5, '2026-08-04', ''),
  (601, 6, '2026-07-30', '');

INSERT INTO orders (id, visit_id, item, price, rating)
VALUES
  (1001, 101, 'Iced Seasalt Latte', 170, 5.0),
  (1002, 101, 'Charlie Chan Pasta', 190, 5.0),
  (1003, 102, 'Iced Seasalt Latte', 170, 5.0),
  (1004, 103, 'Iced Seasalt Latte', 170, 5.0),
  (1005, 103, 'Chicken ala king', 180, 5.0),
  (2001, 201, 'Spanish Latte', 180, 3.1),
  (3001, 301, 'Latte', 180, 4.6),
  (4001, 401, 'Iced Coffee', 210, 2.3),
  (5001, 501, 'Spanish Latte', 210, 4.7),
  (6001, 601, 'Caramel Latte', 190, 4.8);

SELECT setval(pg_get_serial_sequence('profiles', 'id'), COALESCE(MAX(id), 1)) FROM profiles;
SELECT setval(pg_get_serial_sequence('cafes', 'id'), COALESCE(MAX(id), 1)) FROM cafes;
SELECT setval(pg_get_serial_sequence('visits', 'id'), COALESCE(MAX(id), 1)) FROM visits;
SELECT setval(pg_get_serial_sequence('orders', 'id'), COALESCE(MAX(id), 1)) FROM orders;
