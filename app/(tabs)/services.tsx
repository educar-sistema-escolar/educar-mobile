import { demoEnabled } from '@/lib/demo';
import { DemoServices } from '@/components/demo-screens';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, ScreenShell } from '@/components/screen-shell';
import { ChildSelector } from '@/components/child-selector';
import { useFamily } from '@/lib/family';
import { useAuth } from '@/lib/auth';
import { loadServices, submitServiceRequest, type Schedule } from '@/lib/services';
import { schoolDate } from '@/lib/date.mjs';
import { palette } from '@/constants/palette';
import { mensajeError } from '@/lib/mensaje-error';
import { nombreNivel } from '@/lib/nombre-nivel';

const scheduleText = (rows: Schedule[]) => rows.filter(s=>s.is_active).map(s=>`${['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][s.day_of_week]} ${s.starts_at.slice(0,5)}–${s.ends_at.slice(0,5)}`).join(', ') || 'Horario por confirmar';
const statusText = (status:string) => ({pending:'Pendiente',approved:'Aprobada',rejected:'Rechazada'}[status] ?? status);
export default function ScreenEntry() { return demoEnabled ? <DemoServices /> : <Services />; }
function Services() {
  const {childId}=useFamily(); const {session}=useAuth();
  // Un cambio de identidad o alumno descarta inmediatamente el borrador anterior.
  return <ServiceDetails key={`${session?.user.id}/${session?.role}/${childId}`} />;
}
function ServiceDetails() {
  const {childId}=useFamily(); const {session}=useAuth(); const family=!!session && session.role!=='student';
  const [year,setYear]=useState(Number(schoolDate(new Date().toISOString()).slice(0,4)));
  const [yearInput,setYearInput]=useState(String(year)); const [revision,setRevision]=useState(0);
  const [data,setData]=useState<Awaited<ReturnType<typeof loadServices>>|null>(null);
  const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const [message,setMessage]=useState('');
  const [route,setRoute]=useState(''); const [stop,setStop]=useState(''); const [busy,setBusy]=useState(false);
  const lock=useRef(false); const generation=useRef(0);
  useEffect(()=>{let active=true; const expected=++generation.current; Promise.resolve().then(async()=>{
    if(!active)return;setData(null);setError('');setRoute('');setStop('');setLoading(!!childId);
    if(!childId)return;
    try {const result=await loadServices(childId,year,family);if(active)setData(result);}
    catch(e){if(active)setError(mensajeError(e,'No se pudieron cargar los servicios. Intentá nuevamente.'));}
    finally{if(active)setLoading(false);}
  });return ()=>{active=false;generation.current=expected+1;};},[childId, session, year, revision, family]);
  async function send(type:'sport'|'transport',id:string) {
    if(lock.current)return; lock.current=true;setBusy(true);setError('');setMessage(''); const expected=generation.current;
    try{await submitServiceRequest(childId,year,type,id,stop);if(expected===generation.current){setRevision(n=>n+1);setMessage('Solicitud registrada como pendiente. Administración debe revisarla.');}}
    catch(e){if(expected===generation.current)setError(mensajeError(e,'No se pudo registrar la solicitud. Consultá su estado antes de reintentar.'));}
    finally{lock.current=false;setBusy(false);}
  }
  const available=(type:string,id:string)=>data?.availability.find(a=>a.service_type===type && a.service_id===id)?.available ?? 0;
  return <ScreenShell><Text style={s.title}>Servicios y cursado</Text><ChildSelector />
    <Card><Text>Ciclo lectivo</Text><View style={s.row}><TextInput accessibilityLabel="Ciclo lectivo" keyboardType="number-pad" maxLength={4} editable={!busy} value={yearInput} onChangeText={setYearInput} style={s.input}/><Pressable accessibilityRole="button" disabled={busy} style={s.button} onPress={()=>{const value=Number(yearInput);if(!/^\d{4}$/.test(yearInput)||value<1900||value>2200){setError('Ingresá un ciclo entre 1900 y 2200.');return;}setYear(value);setRevision(n=>n+1);}}><Text style={s.white}>Consultar</Text></Pressable></View></Card>
    {loading?<Text>Cargando servicios…</Text>:null}{error?<Text accessibilityRole="alert">{error}</Text>:null}{message?<Text accessibilityRole="alert">{message}</Text>:null}
    <Pressable accessibilityRole="button" style={s.secondary} disabled={busy||loading} onPress={()=>setRevision(n=>n+1)}><Text>Actualizar datos</Text></Pressable>
    {data?<><Card><Text style={s.heading}>Información académica</Text>{data.academic.length?data.academic.map(a=><Text key={a.id}>{nombreNivel(a.courses?.educational_levels?.name)} · {a.courses?.name} · {year}</Text>):<Text>Sin cursado activo en este ciclo.</Text>}</Card>
      <Text style={s.heading}>Deportes</Text>{!data.sports.length?<Card><Text>Sin inscripciones en este ciclo.</Text></Card>:data.sports.map(e=><Card key={e.id}><Text style={s.heading}>{e.sport_groups?.sports?.name} · {e.is_active?'Activo':'Inactivo'}</Text><Text>{e.sport_groups?.name} · {nombreNivel(e.sport_groups?.educational_levels?.name)}</Text><Text>Profesor: {e.sport_groups?.teachers?.people ? `${e.sport_groups.teachers.people.first_name} ${e.sport_groups.teachers.people.last_name}`:'Por confirmar'}</Text><Text>{scheduleText(e.sport_groups?.sport_group_schedules ?? [])}</Text></Card>)}
      <Text style={s.heading}>Transporte</Text>{!data.transport.length?<Card><Text>Sin transporte en este ciclo.</Text></Card>:data.transport.map(e=><Card key={e.id}><Text style={s.heading}>Recorrido {e.transport_routes?.route_number} · {e.transport_routes?.name}</Text><Text>{e.is_active?'Inscripción activa':'Inscripción inactiva'} · Parada: {e.transport_stops?.name ?? 'Por asignar'}</Text><Text>Recorrido: {e.transport_routes?.stops?.filter(p=>p.is_active).sort((a,b)=>a.stop_order-b.stop_order).map(p=>p.name).join(' → ') || 'Consultar en Administración'}</Text></Card>)}
      <Text style={s.note}>El ciclo muestra las inscripciones registradas. Los importes y recorridos facturados de cada mes se consultan en Cuotas. No se ofrece GPS en tiempo real.</Text>
      <Text style={s.heading}>Comedor</Text>{!data.dining.length?<Card><Text>Sin inscripción en este ciclo.</Text></Card>:data.dining.map(e=><Card key={e.id}><Text style={s.heading}>{e.dining_services?.name} · {e.is_active?'Activo':'Inactivo'}</Text><Text>Usos registrados</Text>{e.dining_usage?.length?e.dining_usage.slice().sort((a,b)=>b.service_date.localeCompare(a.service_date)).slice(0,31).map(u=><Text key={u.service_date}>{u.service_date} · {u.used?'Utilizado':'No utilizado'}</Text>):<Text>Sin usos informados.</Text>}</Card>)}
      {family?<><Card><Text style={s.heading}>Solicitar deporte</Text><Text style={s.note}>Máximo dos deportes. El sistema verifica cupos, duplicados y horarios. La solicitud requiere aprobación.</Text>{!data.options.length?<Text>Sin opciones disponibles para este alumno y ciclo.</Text>:data.options.map(o=><View key={o.id} style={s.option}><Text>{o.sport_name} · {o.name} · {nombreNivel(o.level_name)}</Text><Text>Profesor: {[o.teacher_first_name,o.teacher_last_name].filter(Boolean).join(' ') || 'Por confirmar'}</Text><Text>{scheduleText(o.schedules ?? [])} · Cupos: {available('sport',o.id)}</Text><Pressable accessibilityRole="button" disabled={busy||available('sport',o.id)<=0} accessibilityState={{disabled:busy||available('sport',o.id)<=0}} style={[s.button,(busy||available('sport',o.id)<=0)&&s.disabled]} onPress={()=>send('sport',o.id)}><Text style={s.white}>Solicitar {o.sport_name}</Text></Pressable></View>)}</Card>
      <Card><Text style={s.heading}>Solicitar transporte</Text>{data.routes.map(r=><Pressable key={r.id} accessibilityRole="radio" accessibilityState={{checked:route===r.id,disabled:busy}} disabled={busy} style={s.secondary} onPress={()=>{setRoute(r.id);setStop('');}}><Text>{route===r.id?'●':'○'} {r.route_number} · {r.name} · Cupos {available('transport',r.id)}</Text></Pressable>)}{route?<><Text>Parada solicitada</Text><Pressable accessibilityRole="radio" accessibilityState={{checked:!stop}} disabled={busy} style={s.secondary} onPress={()=>setStop('')}><Text>{!stop?'●':'○'} A definir por Administración</Text></Pressable>{data.routes.find(r=>r.id===route)?.stops.filter(p=>p.is_active).sort((a,b)=>a.stop_order-b.stop_order).map(p=><Pressable key={p.id} accessibilityRole="radio" accessibilityState={{checked:stop===p.id}} disabled={busy} style={s.secondary} onPress={()=>setStop(p.id)}><Text>{stop===p.id?'●':'○'} {p.name}</Text></Pressable>)}</>:null}<Pressable accessibilityRole="button" disabled={busy||!route||available('transport',route)<=0} style={[s.button,(busy||!route||available('transport',route)<=0)&&s.disabled]} onPress={()=>send('transport',route)}><Text style={s.white}>{busy?'Enviando…':'Enviar solicitud de transporte'}</Text></Pressable></Card>
      <Text style={s.heading}>Estado de solicitudes</Text>{!data.requests.length?<Text>Sin solicitudes.</Text>:data.requests.map(r=><Card key={r.id}><Text>{r.sport_group?.name ?? r.route?.name} · {statusText(r.status)}</Text><Text>{schoolDate(r.created_at)}{r.stop?` · ${r.stop.name}`:''}</Text>{r.review_note?<Text>{r.review_note}</Text>:null}</Card>)}</>:null}
      <Text style={s.note}>Comedor y cambios de inscripciones se gestionan con Administración mediante los procesos institucionales existentes.</Text>
    </>:null}</ScreenShell>;
}
const s=StyleSheet.create({title:{fontSize:28,fontWeight:'700',color:palette.ink},heading:{fontSize:17,fontWeight:'600',color:palette.ink},row:{flexDirection:'row',gap:12,alignItems:'center'},input:{flex:1,minWidth:0,width:0,flexBasis:0,borderWidth:1,borderColor:palette.line,borderRadius:12,padding:14,fontSize:16},button:{minHeight:48,backgroundColor:palette.primary,borderRadius:12,padding:14,justifyContent:'center',marginTop:8},white:{color:'#fff',fontWeight:'600',textAlign:'center'},secondary:{minHeight:48,padding:12,borderWidth:1,borderColor:palette.line,borderRadius:12,justifyContent:'center',marginVertical:4},note:{fontSize:14,color:palette.muted,lineHeight:21},option:{gap:6,marginTop:16},disabled:{opacity:0.45}});
