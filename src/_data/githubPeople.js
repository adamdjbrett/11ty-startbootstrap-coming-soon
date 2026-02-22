import { execSync } from "node:child_process";

const parseGithubHandle = (email) => {
  if (!email) {
    return "";
  }

  const normalized = email.trim().toLowerCase();

  // Common noreply formats:
  // 12345+username@users.noreply.github.com
  // username@users.noreply.github.com
  const noreplyMatch = normalized.match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/);
  if (noreplyMatch) {
    return noreplyMatch[1];
  }

  return "";
};

const makePerson = (name, email) => {
  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();

  if (!cleanName && !cleanEmail) {
    return null;
  }

  const github = parseGithubHandle(cleanEmail);

  return {
    name: cleanName || cleanEmail,
    email: cleanEmail,
    github
  };
};

const uniquePeople = (people) => {
  const seen = new Set();
  const result = [];

  for (const person of people) {
    if (!person) {
      continue;
    }

    const key = `${person.name.toLowerCase()}|${person.email}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(person);
  }

  return result;
};

const runGit = (command) => {
  try {
    return execSync(command, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "";
  }
};

const parseNameEmailLines = (raw) => {
  if (!raw) {
    return [];
  }

  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.*?)\s*<([^>]+)>$/);
      if (match) {
        return makePerson(match[1], match[2]);
      }
      return makePerson(line, "");
    });
};

const parseCoAuthors = (raw) => {
  if (!raw) {
    return [];
  }

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^co-authored-by:/i.test(line));

  return lines.map((line) => {
    const value = line.replace(/^co-authored-by:\s*/i, "");
    const match = value.match(/^(.*?)\s*<([^>]+)>$/);
    if (match) {
      return makePerson(match[1], match[2]);
    }
    return makePerson(value, "");
  });
};

export default () => {
  const authorsRaw = runGit("git log --format='%aN <%aE>'");
  const contributorsRaw = runGit("git log --format='%cN <%cE>'");
  const coAuthorsRaw = runGit("git log --format='%B'");

  const authors = uniquePeople(parseNameEmailLines(authorsRaw));
  const contributors = uniquePeople(parseNameEmailLines(contributorsRaw));
  const coAuthors = uniquePeople(parseCoAuthors(coAuthorsRaw));

  return {
    authors,
    contributors,
    coAuthors
  };
};
