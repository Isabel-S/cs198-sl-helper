/* Client Updater
 * Code sourced from Stanford CS193X 
 *
 * Works in conjuction with server updater to provides an "auto refresh" 
 * functionality on the frontend during development so the page automatically 
 * reloads whenever you save your HTML/JS.
*/

window.updateSocket = io();

updateSocket.on("cssChange", path => {
  let timestamp = `${new Date().getTime()}`;
  let links = document.querySelectorAll("link[rel=stylesheet]");
  for (const link of links) {
    let url = new URL(link.href);
    if (!url.host.includes("localhost")) continue;
    url.searchParams.delete("_ts");
    url.searchParams.append("_ts", timestamp);
    link.href = url.href;
  }
});

updateSocket.on("reload", () => {
  window.location.reload();
});
