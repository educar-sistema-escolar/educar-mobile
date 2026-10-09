import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, ScreenShell } from '@/components/screen-shell';
import { ChildSelector } from '@/components/child-selector';
import { request } from '@/lib/api';
import { useFamily } from '@/lib/family';
import { useAuth } from '@/lib/auth';
import { scopedValue } from '@/lib/data-scope.mjs';
type Entry = {
    id: string;
    sport_groups?: {
        name: string;
        sports: {
            name: string;
        };
        sport_group_schedules: {
            day_of_week: number;
            starts_at: string;
            ends_at: string;
        }[];
    };
    transport_routes?: {
        name: string;
        route_number: number;
    };
    dining_services?: {
        name: string;
    };
};
export default function Services() {
    const { childId } = useFamily();
    const {session}=useAuth();
    const [scope,setScope]=useState<{session:typeof session;childId:string}|null>(null);
    const [groups, setGroups] = useState<{
        title: string;
        entries: Entry[];
    }[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [revision, setRevision] = useState(0);
    useEffect(() => { let active = true; Promise.resolve().then(() => { if (!active)
        return; setGroups([]); setError(''); setLoading(!!childId); if (!childId)
        return; return Promise.all([request<Entry[]>(`/rest/v1/student_sport_enrollments?student_id=eq.${childId}&is_active=eq.true&select=id,sport_groups(name,sports(name),sport_group_schedules(day_of_week,starts_at,ends_at))`), request<Entry[]>(`/rest/v1/student_transport_enrollments?student_id=eq.${childId}&is_active=eq.true&select=id,transport_routes(name,route_number)`), request<Entry[]>(`/rest/v1/student_dining_enrollments?student_id=eq.${childId}&is_active=eq.true&select=id,dining_services(name)`)]).then(([sports, transport, dining]) => { if (active) {
        setScope({session,childId});
        setGroups([{ title: 'Sports', entries: sports }, { title: 'Transport', entries: transport }, { title: 'School lunch', entries: dining }]);
        setError('');
    } }).catch(() => { if (active)
        {setScope({session,childId});setError('Services could not be loaded.');} }).finally(() => { if (active)
        setLoading(false); }); }); return () => { active = false; }; }, [childId, session, revision]);
    const visibleGroups=scopedValue(scope && {...scope,value:groups},session,childId,[]);
    const visibleError=scopedValue(scope && {...scope,value:error},session,childId,'');
    const isLoading=!!childId && (scope?.session!==session || scope?.childId!==childId || loading);
    return <ScreenShell><Text style={{ fontSize: 30, fontWeight: '700' }}>Services</Text><Text style={{ color: '#777' }}>Current school enrollments.</Text><ChildSelector />{isLoading ? <Text>Loading services…</Text> : null}{visibleError ? <Pressable onPress={() => setRevision(n => n + 1)}><Text accessibilityRole="alert">{visibleError} Tap to retry.</Text></Pressable> : null}{visibleGroups.map(group => <View key={group.title} style={{ gap: 12 }}><Text style={{ fontWeight: '600', fontSize: 16 }}>{group.title}</Text>{!group.entries.length ? <Card><Text style={{ color: '#777' }}>No active enrollment.</Text></Card> : group.entries.map(entry => <Card key={entry.id}><Text style={{ fontWeight: '600' }}>{entry.sport_groups?.sports.name ?? entry.transport_routes?.name ?? entry.dining_services?.name}</Text>{entry.sport_groups ? <Text style={{ color: '#777', marginTop: 6 }}>{entry.sport_groups.name} · {entry.sport_groups.sport_group_schedules.map(s => `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][s.day_of_week]} ${s.starts_at.slice(0, 5)}`).join(', ')}</Text> : null}{entry.transport_routes ? <Text style={{ color: '#777', marginTop: 6 }}>Route {entry.transport_routes.route_number}</Text> : null}</Card>)}</View>)}<Text style={{ color: '#777', fontSize: 12 }}>Enrollment changes are managed by the school.</Text></ScreenShell>;
}
