const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.post("/api/execute-command", (req, res) => {
  const { command, input } = req.body;

  if (!command || !input) {
    return res.status(400).json({ error: "Command and input are required" });
  }

  let cmd;
  let workingDir = path.join(process.cwd(), "public");
  switch (command) {
    case "mkdir":
      cmd = `mkdir -p "${path.join(workingDir, input)}"`;
      break;
    case "ls":
      cmd = `ls -la "${path.join(workingDir, input)}"`;
      break;
    case "rm":
      cmd = `rm -rf "${path.join(workingDir, input)}"`;
      break;
    case "echo":
      cmd = `echo "${input}"`;
      break;
    default:
      return res.status(400).json({ error: "Unsupported command" });
  }

  console.log(`Executing command: ${cmd}`);
  console.log(`Working directory: ${workingDir}`);

  exec(cmd, { cwd: workingDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res
        .status(500)
        .json({ error: `${error.message}\nStderr: ${stderr}` });
    }
    console.log(`Command output: ${stdout}`);
    res.json({ output: stdout || "Command executed successfully" });
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
