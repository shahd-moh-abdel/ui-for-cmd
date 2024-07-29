import React, { useState } from "react";

const CommandLineInterface = () => {
  const [command, setCommand] = useState("mkdir");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/execute-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command, input }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
        setIsError(false);
      } else {
        setOutput(data.error || "An unknown error occurred");
        setIsError(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setOutput(
        `An error occurred while executing the command: ${error.message}`
      );
      setIsError(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Command Line Interface</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="command"
            className="block text-sm font-medium text-gray-700"
          >
            Command
          </label>
          <select
            id="command"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="mkdir">mkdir</option>
            <option value="ls">ls</option>
            <option value="rm">rm</option>
            <option value="echo">echo</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="input"
            className="block text-sm font-medium text-gray-700"
          >
            {command === "mkdir"
              ? "Directory Name"
              : command === "ls"
              ? "Directory Path"
              : command === "rm"
              ? "File/Directory to Remove"
              : "Text to Echo"}
          </label>
          <input
            type="text"
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Execute Command
        </button>
      </form>
      {output && (
        <div
          className={`mt-4 p-4 rounded-md ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CommandLineInterface;
