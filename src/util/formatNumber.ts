export default function formatNumber(number: number | string): string {
  return number.toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}