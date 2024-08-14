const moment = require('moment');

function getSemesterPart() {
  const currentMonth = moment().month(); // Mengambil bulan saat ini (0-11)

  if (currentMonth >= 1 && currentMonth <= 4) {
    return 0; // Februari - April (awal)
  } else if (currentMonth >= 5 && currentMonth <= 6) {
    return 1; // Mei - Juli (akhir)
  } else if (currentMonth >= 7 && currentMonth <= 10) {
    return 0; // Agustus - Oktober (awal)
  } else if (currentMonth === 11 || currentMonth === 0) {
    return 1; // November - Januari (akhir)
  } else {
    throw new Error('Invalid month');
  }
}

module.exports = getSemesterPart;
