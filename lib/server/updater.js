/* Server Updater
 * Code sourced from Stanford CS193X 
 *
 * Works in conjuction with client updater to provides an "auto refresh" 
 * functionality on the frontend during development so the page automatically 
 * reloads whenever you save your HTML/JS.
*/

import chokidar from "chokidar";
import { Server } from "socket.io";

export default (server, publicPath) => {
  const io = new Server(server);

  chokidar.watch(publicPath, {
    cwd: publicPath, ignoreInitial: true
  }).on("all", (type, path) => {
    if (type.endsWith("Dir")) return;
    if (path.endsWith(".css")) {
      io.emit("cssChange", path);
    } else {
      io.emit("reload");
    }
  });
};
