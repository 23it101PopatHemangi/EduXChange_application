-- Insert specific resources into the resources table
INSERT INTO resources (user_id, name, description, type, url, file_name, file_size, mime_type, subject, course_code, is_public, tags)
VALUES
  ('user-1', 'DBMS', 'DBMS 02', 'pdf', NULL, 'DBMS.pdf', 2048, 'application/pdf', 'Database Management', 'DBMS101', TRUE, '{"dbms", "pdf"}'),
  ('user-1', 'Maths', 'Maths Notes', 'pdf', NULL, 'Maths.pdf', 1024, 'application/pdf', 'Mathematics', 'MATH101', TRUE, '{"maths", "notes"}'),
  ('user-1', 'Physics', 'Physics Notes', 'pdf', NULL, 'Physics.pdf', 512, 'application/pdf', 'Physics', 'PHYS101', TRUE, '{"physics", "notes"}');