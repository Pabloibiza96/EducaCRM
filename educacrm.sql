-- EducaCRM - Script de creación de base de datos 

-- 1) Base de datos
DROP DATABASE IF EXISTS educacrm;
CREATE DATABASE educacrm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE educacrm;

-- Ajustes generales (opcional)
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 2) Tablas maestras
CREATE TABLE departamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_departamentos_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE personas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dni VARCHAR(40) NOT NULL,   -- 🔧 Ajustado a VARCHAR(40)
  nombre VARCHAR(50) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion VARCHAR(150),
  UNIQUE KEY uq_personas_dni (dni),
  UNIQUE KEY uq_personas_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Cuentas de usuario y roles
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('alumno','profesor','jefatura','direccion','administrador') NOT NULL,
  persona_id INT NOT NULL,
  CONSTRAINT fk_usuarios_persona
    FOREIGN KEY (persona_id) REFERENCES personas(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_usuarios_username (username),
  KEY idx_usuarios_persona (persona_id),
  KEY idx_usuarios_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) Subtipos de personas
CREATE TABLE alumnos (
  id INT PRIMARY KEY, -- FK a personas.id
  nia VARCHAR(15) NOT NULL,
  fecha_alta DATE,
  CONSTRAINT fk_alumnos_persona
    FOREIGN KEY (id) REFERENCES personas(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_alumnos_nia (nia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE profesores (
  id INT PRIMARY KEY, -- FK a personas.id
  fecha_alta DATE,
  departamento_id INT,
  CONSTRAINT fk_profesores_persona
    FOREIGN KEY (id) REFERENCES personas(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_profesores_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  KEY idx_profesores_departamento (departamento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE personal (
  id INT PRIMARY KEY, -- FK a personas.id
  puesto VARCHAR(100),
  fecha_alta DATE,
  departamento_id INT,
  CONSTRAINT fk_personal_persona
    FOREIGN KEY (id) REFERENCES personas(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_personal_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  KEY idx_personal_departamento (departamento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) Estructura académica
CREATE TABLE grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  curso VARCHAR(20) NOT NULL,
  UNIQUE KEY uq_grupos_nombre_curso (nombre, curso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE asignaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  codigo VARCHAR(20) NOT NULL,
  curso VARCHAR(20),
  UNIQUE KEY uq_asignaturas_codigo (codigo),
  KEY idx_asignaturas_curso (curso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6) Relaciones N:M y calificaciones
CREATE TABLE matriculas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id INT NOT NULL,
  grupo_id INT NOT NULL,
  fecha DATE,
  CONSTRAINT fk_matriculas_alumno
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_matriculas_grupo
    FOREIGN KEY (grupo_id) REFERENCES grupos(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_matriculas_alumno_grupo (alumno_id, grupo_id),
  KEY idx_matriculas_grupo (grupo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE grupo_asignatura (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grupo_id INT NOT NULL,
  asignatura_id INT NOT NULL,
  profesor_id INT NOT NULL,
  CONSTRAINT fk_gru_asig_grupo
    FOREIGN KEY (grupo_id) REFERENCES grupos(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_gru_asig_asignatura
    FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_gru_asig_profesor
    FOREIGN KEY (profesor_id) REFERENCES profesores(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_gru_asig_grupo_asig (grupo_id, asignatura_id),
  KEY idx_gru_asig_profesor (profesor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE calificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id INT NOT NULL,
  asignatura_id INT NOT NULL,
  evaluacion ENUM('1ª','2ª','3ª','Final') NOT NULL,
  nota DECIMAL(4,2) CHECK (nota >= 0 AND nota <= 10),
  fecha DATE,
  CONSTRAINT fk_calif_alumno
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_calif_asignatura
    FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_calif_alumno_asig_eval (alumno_id, asignatura_id, evaluacion),
  KEY idx_calif_asignatura (asignatura_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7) Índices adicionales
CREATE INDEX idx_personas_apellidos ON personas(apellidos);
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_alumnos_nia ON alumnos(nia);
CREATE INDEX idx_profesores_dep ON profesores(departamento_id);
CREATE INDEX idx_matriculas_alumno ON matriculas(alumno_id);
CREATE INDEX idx_grupo_asignatura_grupo ON grupo_asignatura(grupo_id);
CREATE INDEX idx_calificaciones_alumno ON calificaciones(alumno_id);

-- 8) Datos de ejemplo
INSERT INTO departamentos (nombre) VALUES 
  ('Matemáticas'), ('Lengua'), ('Inglés'), ('Dirección'), ('Administración');

INSERT INTO personas (dni, nombre, apellidos, telefono, email, direccion)
VALUES ('00000000A','Admin','Centro','600000000','admin@centro.es','C/ Principal 1');
INSERT INTO usuarios (username, password_hash, rol, persona_id)
VALUES ('admin', '$2b$10$B/XDzjqEFf22GbI2ZsGHYu6zkL3cTmpRbDA9rX9HmtAjPl2EXJ7Lm', 'administrador', 1);

INSERT INTO personas (dni, nombre, apellidos, telefono, email, direccion)
VALUES ('11111111B','Ana','García','600000001','ana@centro.es','C/ Secundaria 2');
INSERT INTO profesores (id, fecha_alta, departamento_id) 
VALUES (2, CURDATE(), 1);
INSERT INTO usuarios (username, password_hash, rol, persona_id)
VALUES ('agarcia', '$2b$10$GgZC1SiVCteHWGTe.Cu2IeFKefYX512SbLxCU6NUyHP5HOXLd/o8m', 'profesor', 2);

INSERT INTO personas (dni, nombre, apellidos, telefono, email, direccion)
VALUES ('22222222C','Luis','Pérez','600000002','luis@alumno.es','Av. Escuela 3');
INSERT INTO alumnos (id, nia, fecha_alta) 
VALUES (3, 'ALU-0001', CURDATE());
INSERT INTO usuarios (username, password_hash, rol, persona_id)
VALUES ('lperez', '$2b$10$Sve7rmqYf84zLtg9JlxHsu7ZQQGMNn/NeNz/xNbmC/4nwionMR6la', 'alumno', 3);

INSERT INTO grupos (nombre, curso) VALUES ('1A', '1º ESO');
INSERT INTO asignaturas (nombre, codigo, curso) VALUES ('Matemáticas', 'MAT1', '1º ESO');

INSERT INTO matriculas (alumno_id, grupo_id, fecha) 
VALUES (3, 1, CURDATE());
INSERT INTO grupo_asignatura (grupo_id, asignatura_id, profesor_id) 
VALUES (1, 1, 2);

INSERT INTO calificaciones (alumno_id, asignatura_id, evaluacion, nota, fecha)
VALUES (3, 1, '1ª', 8.50, CURDATE());
