export function formatearDuracion(minutos) {
  const total = Math.round(Number(minutos));
  if (!Number.isFinite(total) || total <= 0) return "";

  const horas = Math.floor(total / 60);
  const resto = total % 60;

  if (horas === 0) return `${resto} min`;
  if (resto === 0) return `${horas} h`;
  return `${horas} h ${resto} min`;
}