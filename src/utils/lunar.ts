/**
 * Utility functions for Lunar Calendar calculations (Can-Chi) and age deductions
 */

export function deductLunarCalendar(dobString: string): {
  lunarYear: string;
  lunarAge: number;
  solarAge: number;
} | null {
  if (!dobString) return null;

  // Find a 4-digit year in the string
  const yearMatch = dobString.match(/\d{4}/);
  if (!yearMatch) return null;

  const year = parseInt(yearMatch[0], 10);
  const currentYear = new Date().getFullYear();
  
  if (year < 1800 || year > currentYear) return null;

  // Can-Chi lunar stem-branch arrays (Vietnamese standard)
  const can = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"];
  const chi = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"];

  const canName = can[year % 10];
  const chiName = chi[year % 12];
  
  const solarAge = currentYear - year;
  const lunarAge = solarAge + 1; // Tuổi Ta (including gestation)

  return {
    lunarYear: `${canName} ${chiName}`,
    lunarAge,
    solarAge
  };
}
