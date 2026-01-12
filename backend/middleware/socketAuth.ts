import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuth = (socket: Socket, next: (err?: any) => void) => {
  try {
    const token = socket.handshake.auth.token; // client sends token in handshake
    if (!token) throw new Error("No token");

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // attach user info to socket
    socket.data.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    next(err);
  }
};
