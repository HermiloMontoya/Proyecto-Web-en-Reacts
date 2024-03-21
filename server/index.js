const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Crear una conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mensajes"
});

// Verificar la conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Manejar la solicitud POST para crear un nuevo mensaje
app.post("/create", (req, res) => {
  const { nombre, telefono, correo, mensaje } = req.body;

  // Validar los datos recibidos
  if (!nombre || !telefono || !correo || !mensaje) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Validar que el nombre solo contenga letras
  if (!/^[a-zA-Z\s]+$/.test(nombre)) {
    return res.status(400).json({ error: "El nombre debe contener solo letras" });
  }

  // Validar la longitud del número de teléfono
  if (telefono.length !== 10 || !/^\d+$/.test(telefono)) {
    return res.status(400).json({ error: "Número de teléfono inválido. Debe tener 10 dígitos" });
  }

  // Insertar el mensaje en la base de datos
  db.query('INSERT INTO mensajes (nombre, telefono, correo, mensaje) VALUES (?, ?, ?, ?)',
    [nombre, telefono, correo, mensaje],
    (err, result) => {
      if (err) {
        console.error('Error al insertar el mensaje en la base de datos:', err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
      console.log('Mensaje insertado correctamente en la base de datos');
      res.status(200).json({ message: "Mensaje enviado con éxito" });
    }
  );
});

// Iniciar el servidor en el puerto 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});