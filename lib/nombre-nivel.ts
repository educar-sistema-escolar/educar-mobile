export function nombreNivel(value: string | null | undefined) {
  if (!value) return 'Nivel no informado';
  const nombres: Record<string,string> = {initial:'Inicial', inicial:'Inicial', primary:'Primaria', primario:'Primaria', primaria:'Primaria', secondary:'Secundaria', secundario:'Secundaria', secundaria:'Secundaria'};
  return nombres[value.trim().toLowerCase()] ?? value;
}
