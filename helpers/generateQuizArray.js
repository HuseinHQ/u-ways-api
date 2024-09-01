const generateQuizArray = (currentSemester, currentPart, existingResults) => {
  const result = [];
  for (let semester = 1; semester <= currentSemester; semester++) {
    for (let part = 0; part <= 1; part++) {
      if (semester === currentSemester && part > currentPart) {
        break;
      }
      const exists = existingResults.some((res) => res.semester === semester && res.part === part);
      if (!exists) {
        result.push({ semester, part });
      }
    }
  }
  return result;
};

module.exports = generateQuizArray;
