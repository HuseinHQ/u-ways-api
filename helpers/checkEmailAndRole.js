const checkEmailAndRole = (email) => {
  const studentDomain = '@student.upnjatim.ac.id';
  const lecturerDomain = '@lecturer.upnjatim.ac.id';

  if (email.endsWith(studentDomain)) {
    return 'mahasiswa';
  } else if (email.endsWith(lecturerDomain)) {
    return 'dosen';
  } else {
    return false; // or any other indication that the email is not valid
  }
};

module.exports = checkEmailAndRole;
