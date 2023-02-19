export const launchPinger = () => {
  setInterval(() => {
    fetch("https://women-health-server.onrender.com/graphql")
  }, 15 * 60 * 1000)
}
