export default function checkAuth(req, res, next) {
  const { authorization: token } = req.headers;

  if (token && token.startsWith('Bearer')) {
    console.log('Sí tiene el token con Bearer');
  }

  const error = new Error('Token no válido o inexistente');
  res.status(403).json({ msg: error.message });

  next();
}
