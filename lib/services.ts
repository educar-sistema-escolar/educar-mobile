import { request } from './api';

export type Schedule = { day_of_week: number; starts_at: string; ends_at: string; is_active: boolean };
export type SportOption = { id: string; name: string; sport_name: string; level_name: string | null; teacher_first_name: string | null; teacher_last_name: string | null; schedules: Schedule[] };
export type Route = { id: string; name: string; route_number: number; stops: {id: string; name: string; stop_order: number; is_active: boolean}[] };
export type Availability = { service_type: string; service_id: string; available: number };
export type ServiceRequest = { id: string; service_type: string; status: string; review_note: string | null; created_at: string; sport_group: {name: string} | null; route: {name: string} | null; stop: {name: string} | null };
export type SportEnrollment = { id: string; is_active: boolean; sport_groups: { id: string; name: string; sports: {name: string}; educational_levels: {name: string} | null; teachers: {people: {first_name: string; last_name: string}} | null; sport_group_schedules: Schedule[] } };
export type TransportEnrollment = {id: string; is_active: boolean; transport_routes: Route; transport_stops: {name: string} | null};
export type DiningEnrollment = {id: string; is_active: boolean; dining_services: {name: string}; dining_usage: {service_date: string; used: boolean}[]};
export type AcademicEnrollment = {id: string; courses: {name: string; educational_levels: {name: string}}};

export async function loadServices(studentId: string, year: number, family: boolean) {
  if (!studentId || !Number.isInteger(year) || year < 1900 || year > 2200) throw new Error('Seleccioná alumno y ciclo válido.');
  const filter = `student_id=eq.${encodeURIComponent(studentId)}&academic_year=eq.${year}`;
  const [sports, transport, dining, academic, requests, options, routes, availability] = await Promise.all([
    request<SportEnrollment[]>(`/rest/v1/student_sport_enrollments?${filter}&select=id,is_active,sport_groups(id,name,sports(name),educational_levels(name),teachers(people(first_name,last_name)),sport_group_schedules(day_of_week,starts_at,ends_at,is_active))`),
    request<TransportEnrollment[]>(`/rest/v1/student_transport_enrollments?${filter}&select=id,is_active,transport_routes(id,name,route_number,stops:transport_stops(id,name,stop_order,is_active)),transport_stops(name)`),
    request<DiningEnrollment[]>(`/rest/v1/student_dining_enrollments?${filter}&select=id,is_active,dining_services(name),dining_usage(service_date,used)`),
    request<AcademicEnrollment[]>(`/rest/v1/student_enrollments?${filter}&is_active=eq.true&select=id,courses(name,educational_levels(name))`),
    family ? request<ServiceRequest[]>(`/rest/v1/student_service_requests?${filter}&select=id,service_type,status,review_note,created_at,sport_group:sport_groups(name),route:transport_routes(name),stop:transport_stops(name)&order=created_at.desc`) : Promise.resolve([]),
    request<SportOption[]>('/rest/v1/rpc/list_sport_request_options', {method:'POST',body:JSON.stringify({p_student_id:studentId,p_academic_year:year})}),
    family ? request<Route[]>('/rest/v1/transport_routes?is_active=eq.true&select=id,name,route_number,stops:transport_stops(id,name,stop_order,is_active)&order=route_number') : Promise.resolve([]),
    family ? request<Availability[]>('/rest/v1/rpc/list_service_enrollment_availability', {method:'POST',body:JSON.stringify({p_academic_year:year})}) : Promise.resolve([]),
  ]);
  for (const entry of sports) {
    const option=options.find(item=>item.id===entry.sport_groups?.id);
    if (option && entry.sport_groups && (option.teacher_first_name || option.teacher_last_name)) entry.sport_groups.teachers={people:{first_name:option.teacher_first_name ?? '',last_name:option.teacher_last_name ?? ''}};
  }
  return {sports,transport,dining,academic,requests,options,routes,availability};
}
export async function submitServiceRequest(studentId: string, year: number, type: 'sport' | 'transport', serviceId: string, stopId?: string) {
  if (!studentId || !serviceId || !Number.isInteger(year) || year < 1900 || year > 2200) throw new Error('Seleccioná alumno, ciclo y servicio.');
  return request<{id: string; status: string}>('/rest/v1/rpc/submit_student_service_request', {method:'POST',body:JSON.stringify({p_student_id:studentId,p_service_type:type,p_academic_year:year,p_sport_group_id:type==='sport'?serviceId:null,p_route_id:type==='transport'?serviceId:null,p_stop_id:type==='transport'?stopId || null:null})});
}
