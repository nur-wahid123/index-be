module.exports = {
    apps: [
      {
        name: "my-app",
        script: "npm",
        args: "run start:prod",
        instances: 1,
        exec_mode: "fork",
      },
    ],
  };
  