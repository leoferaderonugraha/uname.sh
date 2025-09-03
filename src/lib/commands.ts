export function help(): string {
  return "Available commands:\n" +
         "help        - Show this help message\n" +
         "whoami      - Display information about me\n" +
         "contacts    - Show my contact information\n" +
         "uname       - Display system information (use -a for all info)\n" +
         "clear       - Clear the terminal screen\n" +
         "date        - Show the current date and time\n" +
         "history     - Show command history\n";
}

export function whoami(): string {
  return "Leo Feradero Nugraha\n" +
         "Software Engineer | Full-Stack Developer\n" +
         "Passionate about building scalable web applications and exploring new technologies.";
}

export function date(): string {
  return new Date().toString();
}

export function history(commandHistory: string[]): string {
  if (commandHistory.length === 0) {
    return "No commands in history.";
  }
  return commandHistory.map((cmd, idx) => `${idx + 1}  ${
    cmd
  }`).join('\n');
}

export function contacts(): string {
  const email = "Email: <a href='mailto:leoferaderonugraha@gmail.com' target='_blank'><u>leoferaderonugraha@gmail.com</u></a>";
  const linkedin = "LinkedIn: <a href='https://www.linkedin.com/in/leo-feradero-nugraha/' target='_blank'><u>https://www.linkedin.com/in/leo-feradero-nugraha/</u></a>";
  const github = "GitHub: <a href='https://github.com/leoferaderonugraha' target='_blank'><u>https://github.com/leoferaderonugraha</u></a>";

  return "Contact Information:\n" +
          email + "\n" +
          linkedin + "\n" +
          github;
}

export function uname(option?: string): Array<string> {
  if (!option) {
    return ["TerminalEmulator", "output"];
  } else if (option === '-a') {
    return ["TerminalEmulator v1.0.0", "output"];
  } else {
    return [
      `uname: invalid option -- '${option}'\nTry 'uname -a' for more information.`,
      "error"
    ];
  }
}
