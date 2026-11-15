const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** 1250 -> "১২৫০" */
export const toBn = (value: number | string): string =>
  String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

/** "০১৭০৪" -> "01704" (so Bangla-keyboard input still validates) */
export const toEn = (value: string): string =>
  value.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

/** 660 -> "৬৬০৳" */
export const formatTaka = (amount: number): string => `${toBn(amount)}৳`;

/** ISO date -> "২০ অক্টোবর, ২০২৩" */
export const formatBnDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
