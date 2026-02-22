import getGithubPeople from "./_data/githubPeople.js";

export default function () {
  return {
    gitPeople: getGithubPeople()
  };
}
