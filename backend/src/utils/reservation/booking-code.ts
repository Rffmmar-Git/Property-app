
export function generateBookingCode(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const date = `${year}${month}${day}`;

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let random = "";

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * characters.length);
    random += characters[index];
  }

  return `BK-${date}-${random}`;
}