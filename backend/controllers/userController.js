const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../dbusuarios.json');

// Leer usuarios desde db.json
const leerUsuarios = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  const jsonData = JSON.parse(data);
  return jsonData.usuarios || [];

};

// Guardar usuarios en db.json
const guardarUsuarios = (usuarios) => {
  const jsonData = { usuarios };
  fs.writeFileSync(dbPath, JSON.stringify(jsonData, null, 2));
  console.log("✅ Usuarios guardados en:", dbPath);
};


exports.registerUser = (req, res) => {
  console.log("📥 Llego al backend con:", req.body);

  let usuarios = leerUsuarios();
  console.log("📋 Usuarios actuales:", usuarios);

  const existe = usuarios.some((u) => u.email === req.body.email);
  if (existe) {
    console.log("❌ Ya existe un usuario con ese email");
    return res.status(400).json({ mensaje: 'El usuario ya existe' });
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    ...req.body
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  console.log("✅ Usuario registrado:", nuevoUsuario);

  res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: nuevoUsuario });
};


exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  let usuarios = leerUsuarios();

  const usuario = usuarios.find((u) => u.email === email && u.password === password);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
  }

  res.json({ mensaje: 'Login exitoso', usuario });
};

