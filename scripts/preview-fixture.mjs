import http from 'node:http';
const user='11111111-1111-4111-8111-111111111111', child='22222222-2222-4222-8222-222222222222', invoice='33333333-3333-4333-8333-333333333333';
const items=[{id:'44444444-4444-4444-8444-444444444444',invoice_id:invoice,label:'October tuition',concept:'tuition',amount_cents:4200000,paid_cents:0},{id:'55555555-5555-4555-8555-555555555555',invoice_id:invoice,label:'School lunch',concept:'dining',amount_cents:850000,paid_cents:850000}];
const transfers=[];const files=new Map();
http.createServer(async(req,res)=>{res.setHeader('Access-Control-Allow-Origin','http://localhost:8081');res.setHeader('Access-Control-Allow-Headers','*');res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,OPTIONS');res.setHeader('Content-Type','application/json');if(req.method==='OPTIONS'){res.end();return;}let raw='';for await(const chunk of req)raw+=chunk;const url=new URL(req.url,'http://127.0.0.1');const send=(data,status=200)=>{res.statusCode=status;res.end(JSON.stringify(data));};
 if(url.pathname==='/auth/v1/token'){let body;try{body=JSON.parse(raw)}catch{return send({message:'Invalid body'},400)}if(body.email!=='family@example.test'||body.password!=='FixturePassword12!')return send({message:'Invalid fixture credentials'},400);return send({access_token:'fixture-token',refresh_token:'fixture-refresh',expires_in:3600,user:{id:user}});}
 if(url.pathname==='/auth/v1/recover')return send({});if(req.headers.authorization!=='Bearer fixture-token')return send({message:'Fixture authentication required'},401);
 if(url.pathname==='/auth/v1/logout'||url.pathname==='/auth/v1/user')return send({id:user});
 if(url.pathname==='/rest/v1/profiles')return send([{full_name:'Alex Martinez',role:'guardian',is_active:true,account_status:'active'}]);
 if(url.pathname==='/rest/v1/students')return send([{id:child,people:{first_name:'Sofia',last_name:'Martinez'}}]);
 if(url.pathname==='/rest/v1/invoices')return send([{id:invoice,student_id:child,period:'2026-10-01',due_date:'2026-10-10',invoice_items:items}]);
 if(url.pathname==='/rest/v1/transfer_submissions')return send(transfers);
 if(url.pathname==='/rest/v1/student_sport_enrollments')return send([{id:'sport-1',sport_groups:{name:'Year 3',sports:{name:'Volleyball'},sport_group_schedules:[{day_of_week:2,starts_at:'16:00:00',ends_at:'17:00:00'}]}}]);
 if(url.pathname==='/rest/v1/student_transport_enrollments')return send([{id:'route-1',transport_routes:{name:'North route',route_number:4}}]);
 if(url.pathname==='/rest/v1/student_dining_enrollments')return send([{id:'lunch-1',dining_services:{name:'Standard menu'}}]);
 if(url.pathname.startsWith('/storage/v1/object/transfer-receipts/')){files.set(url.pathname,raw);return send({Key:url.pathname});}
 if(url.pathname==='/rest/v1/rpc/submit_transfer'){const b=JSON.parse(raw);if(b.p_invoice!==invoice||!b.p_items?.length||b.p_amount<=0)return send({message:'Invalid transfer'},400);if(transfers.some(t=>t.reference===b.p_reference))return send({message:'Duplicate reference'},409);const id=crypto.randomUUID();transfers.push({id,invoice_id:invoice,reference:b.p_reference,amount_cents:b.p_amount,status:'pending',created_at:new Date().toISOString(),transfer_receipts:[{id:crypto.randomUUID(),filename:b.p_filename,storage_path:b.p_path}]});return send(id);}
 if(url.pathname==='/rest/v1/rpc/attach_transfer_receipt'){const b=JSON.parse(raw);const t=transfers.find(t=>t.id===b.p_submission);if(!t)return send({message:'Not found'},404);const id=crypto.randomUUID();t.transfer_receipts.push({id,filename:b.p_filename,storage_path:b.p_path});return send(id);}
 return send({message:'Fixture endpoint unavailable'},404);
}).listen(54329,'127.0.0.1',()=>console.log('Test-only fixture on 127.0.0.1:54329. Synthetic data; NOT database authorization evidence.'));
