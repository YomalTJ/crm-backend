SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

INSERT INTO gnd (zone_id, id, gnd_name, status, gnd_id) VALUES
('3', '1-1-09-03-160', 'Kalapaluwawa/කලපළුවාව/கலபலுவாவ', 1, '160'),
('3', '1-1-09-03-170', 'Subhoothipura/සුභූතිපුර/சுபூதிபுர', 1, '170'),
('3', '1-1-09-03-185', 'Batapotha/බටපොත/படபொத', 1, '185'),
('3', '1-1-09-03-245', 'Aruppitiya/අරුප්පිටිය/அருப்பிட்டிய', 1, '245'),
('3', '1-1-09-03-265', 'Pahalawela/පහළවෙල/பகலவெல', 1, '265')
ON DUPLICATE KEY UPDATE 
    gnd_name = VALUES(gnd_name), 
    status = VALUES(status);