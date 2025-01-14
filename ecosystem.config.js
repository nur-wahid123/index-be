module.exports = {
    apps: [
      {
        name: "index-be",
        script: "dist/src/main.js",    // Point to the compiled entry file
        instances: 2,          // Use all available CPU cores
        exec_mode: "cluster",      // Use cluster mode for load balancing
        watch: false,              // Set to true if you want auto-restart on changes
      },
    ],
  };
  