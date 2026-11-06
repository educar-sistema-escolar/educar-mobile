import { demoEnabled } from '@/lib/demo';
import { DemoHome } from '@/components/demo-screens';
import { schoolDate } from '@/lib/date.mjs';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, ScreenShell } from '@/components/screen-shell';
import { ChildSelector } from '@/components/child-selector';
import { useInvoices, useFamily, money } from '@/lib/family';
import { useAuth } from '@/lib/auth';
import { colors as c } from '@/constants/palette';
export default function ScreenEntry() { return demoEnabled ? <DemoHome /> : <Home />; }
function Home() {
 const { session } = useAuth(); const { childId, children } = useFamily();
 const { invoices, transfers, error, loading, reload } = useInvoices();
 const student = session?.role === 'student';
 const child = children.find(item => item.id === childId);
 const name = session?.name?.trim() || (student ? child?.people.first_name : '') || '';
 const debt = invoices.flatMap(i => i.invoice_items).reduce((n,i) => n + i.amount_cents - i.paid_cents,0);
 const next = invoices.filter(i => i.invoice_items.some(item => item.amount_cents > item.paid_cents)).sort((a,b)=>a.due_date.localeCompare(b.due_date))[0];
 return <ScreenShell>
  <View style={s.header}><View style={s.brand}><Ionicons name="school-outline" size={28} color={c.deep}/><Text style={s.wordmark}>educar<Text style={s.brandDot}>.</Text></Text></View><Pressable accessibilityRole="button" accessibilityLabel="Abrir mi cuenta" onPress={()=>router.push('/account')} style={({pressed})=>[s.avatar,pressed&&s.pressed]}><Ionicons name="person-outline" size={22} color={c.ink}/></Pressable></View>
  <View style={s.intro}><Text style={s.context}>{student ? 'Tu espacio de estudiante' : 'Tu comunidad educativa'}</Text><Text accessibilityRole="header" style={s.title}>{student ? `Hola${name ? ', '+name.split(' ')[0] : ''}.` : 'Acompañar cada paso.'}</Text><Text style={s.body}>{student ? 'Tus actividades y tu escuela, siempre cerca.' : 'Un lugar para seguir su recorrido en la escuela.'}</Text></View>
  <ChildSelector />
  {!student && !!childId && !loading && !error ? <View style={s.ledger}>
   <View style={s.ledgerTop}><Ionicons name="wallet-outline" size={22} color="#FFF"/><Text style={s.ledgerLabel}>Cuenta de {child?.people.first_name}</Text></View>
   <View style={s.ledgerBody}><Text style={s.context}>Saldo pendiente</Text><Text accessibilityLabel={`Saldo pendiente: ${money(debt)}`} style={s.amount}>{money(debt)}</Text><View style={s.rule}/><View style={s.detail}><Ionicons name="calendar-outline" size={18} color={c.deep}/><Text style={s.body}>{next ? `Primer vencimiento pendiente: ${next.due_date.split('-').reverse().join('/')}` : 'Tus cuotas están al día.'}</Text></View><Pressable accessibilityRole="button" onPress={()=>router.push('/(tabs)/payments')} style={({pressed})=>[s.cta,pressed&&s.pressed]}><Text style={s.ctaText}>Ver cuotas y pagos</Text><Ionicons name="arrow-forward" size={22} color="#FFF"/></Pressable><Text style={s.footnote}>Los pagos se acreditan después de su aprobación.</Text></View>
  </View> : null}
  {loading && !student ? <View style={s.detail}><ActivityIndicator color={c.deep}/><Text style={s.body}>Cargando tus cuotas…</Text></View> : null}
  {error && !student ? <Pressable accessibilityRole="button" onPress={reload} style={s.notice}><Text accessibilityRole="alert" style={s.body}>{error} Tocá para reintentar.</Text></Pressable> : null}
  <Pressable accessibilityRole="button" accessibilityLabel="Consultar deportes, transporte y comedor" onPress={()=>router.push('/(tabs)/services')} style={({pressed})=>[s.services,pressed&&s.pressed]}>
   <View style={s.serviceIcons}>{(['basketball-outline','bus-outline','restaurant-outline'] as const).map(icon=><View key={icon} style={s.iconTile}><Ionicons name={icon} size={24} color={c.deep}/></View>)}</View><View style={s.serviceBottom}><View style={{flex:1,gap:5}}><Text style={s.section}>Servicios escolares</Text><Text style={s.body}>Deportes, transporte y comedor</Text></View><Ionicons name="arrow-forward-circle-outline" size={32} color={c.deep}/></View>
  </Pressable>
  {!student ? <><View style={s.sectionRow}><Text accessibilityRole="header" style={s.section}>Últimos movimientos</Text><Ionicons name="receipt-outline" size={21} color={c.muted}/></View>{!!childId && !loading && !error && !transfers.length ? <Card><Text style={s.body}>Cuando informes una transferencia, vas a poder seguir su estado acá.</Text></Card> : null}{transfers.slice(0,3).map(t=><Card key={t.id}><View style={s.movement}><View style={[s.statusIcon,{backgroundColor:t.status==='approved'?c.successBg:t.status==='rejected'?c.dangerBg:c.warningBg}]}><Ionicons name={t.status==='approved'?'checkmark':t.status==='rejected'?'close':'time-outline'} size={22} color={t.status==='approved'?c.green:t.status==='rejected'?c.red:c.amber}/></View><View style={{flex:1,gap:4}}><Text style={s.section}>{money(t.amount_cents)}</Text><Text style={s.body}>{({pending:'En revisión',approved:'Aprobada',rejected:'Rechazada'} as Record<string,string>)[t.status]}</Text></View><Text style={s.footnote}>{schoolDate(t.created_at).split('-').reverse().join('/')}</Text></View><Text style={s.reference}>{t.reference}</Text></Card>)}</> : null}
  <View style={s.signature}><View style={s.signatureLine}/><Text style={s.footnote}>Educar para transformar</Text><View style={s.signatureLine}/></View>
 </ScreenShell>;
}
const s=StyleSheet.create({
 header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},brand:{flexDirection:'row',alignItems:'center',gap:10},wordmark:{fontSize:30,fontWeight:'800',letterSpacing:-1.4,color:c.ink},brandDot:{color:c.deep},avatar:{minWidth:48,minHeight:48,borderRadius:18,backgroundColor:c.card,borderWidth:1,borderColor:c.line,alignItems:'center',justifyContent:'center'},pressed:{opacity:.78,transform:[{scale:.985}]},intro:{gap:8,paddingVertical:8},context:{fontSize:13,lineHeight:20,color:c.muted,fontWeight:'600'},title:{fontSize:34,lineHeight:39,letterSpacing:-1.3,fontWeight:'800',color:c.ink},body:{fontSize:14,lineHeight:22,color:c.muted},ledger:{borderRadius:24,backgroundColor:c.deep,padding:6,boxShadow:'0px 12px 32px rgba(36,95,198,.12)'},ledgerTop:{flexDirection:'row',alignItems:'center',gap:10,padding:16},ledgerLabel:{fontSize:15,color:'#FFF',fontWeight:'600',flex:1},ledgerBody:{backgroundColor:'#FFF',borderRadius:19,padding:20,gap:12},amount:{fontSize:34,lineHeight:42,fontWeight:'800',letterSpacing:-1.3,color:c.ink,fontVariant:['tabular-nums']},rule:{height:1,backgroundColor:c.line},detail:{flexDirection:'row',alignItems:'center',gap:8,flexWrap:'wrap'},cta:{backgroundColor:c.deep,borderRadius:14,padding:16,minHeight:52,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},ctaText:{color:'#FFF',fontSize:16,fontWeight:'700',flexShrink:1},footnote:{fontSize:12,lineHeight:18,color:c.muted},services:{backgroundColor:c.sky,borderRadius:22,padding:20,gap:22,borderWidth:1,borderColor:'#D5E5FF'},serviceIcons:{flexDirection:'row',gap:10},iconTile:{width:48,height:48,borderRadius:16,backgroundColor:'#FFF',alignItems:'center',justifyContent:'center'},serviceBottom:{flexDirection:'row',alignItems:'center',gap:12},section:{fontSize:18,lineHeight:24,fontWeight:'700',color:c.ink},sectionRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10,marginTop:6},movement:{flexDirection:'row',alignItems:'center',gap:12,flexWrap:'wrap'},statusIcon:{width:44,height:44,borderRadius:15,alignItems:'center',justifyContent:'center'},reference:{fontSize:12,lineHeight:18,color:c.muted,paddingTop:10,borderTopWidth:1,borderColor:c.line},notice:{padding:18,backgroundColor:c.dangerBg,borderRadius:16},signature:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12},signatureLine:{flex:1,height:1,backgroundColor:c.line}
});
