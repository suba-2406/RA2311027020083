const express = require("express");
const app = express();

const Log = require("../logging_middleware/logger");

app.use(express.json());


function scheduleTasks(tasks, totalHours) {
  Log("backend", "info", "service", "Scheduling started");

  tasks.forEach(task => {
    task.ratio = task.impact / task.duration;
  });

  tasks.sort((a, b) => b.ratio - a.ratio);

  let selected = [];
  let remainingHours = totalHours;
  let totalImpact = 0;

  for (let task of tasks) {
    if (task.duration <= remainingHours) {
      selected.push(task);
      remainingHours -= task.duration;
      totalImpact += task.impact;

      Log("backend", "info", "service", `Selected ${task.name}`);
    }
  }

  Log("backend", "info", "service", "Scheduling completed");

  return {
    selectedTasks: selected,
    totalImpact
  };
}



// Home
app.get("/", (req, res) => {
  Log("backend", "info", "route", "Home route accessed");
  res.send("Backend running");
});

// SCHEDULER API (POST)
app.post("/schedule", (req, res) => {
  Log("backend", "info", "controller", "Schedule API called");

  try {
    const { tasks, totalHours } = req.body;

    // Validation
    if (!tasks || !totalHours) {
      Log("backend", "error", "handler", "Missing input");
      return res.status(400).json({ error: "tasks and totalHours required" });
    }

    const result = scheduleTasks(tasks, totalHours);

    res.json(result);

  } catch (error) {
    Log("backend", "error", "handler", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/*SERVER*/

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});