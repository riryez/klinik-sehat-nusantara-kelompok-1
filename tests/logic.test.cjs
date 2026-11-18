const fs = require('fs'); const vm = require('vm'); const assert = require('node:assert/strict');
const root = require('node:path').join(__dirname, '..');
const saved = new Map();
const context = vm.createContext({Date,Math,JSON,Number,String,Array,Object,RegExp,Error,localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},window:{dispatchEvent:()=>{}},Event:class Event{}, crypto:require('crypto').webcrypto});
for(const f of ['data','validation','storage','app','admin'])vm.runInContext(fs.readFileSync(`${root}/js/${f}.js`,'utf8'),context);
const run = expr=>vm.runInContext(expr,context);
const validate=run('klinikValidation');const docs=run('klinikDoctors');const storage=run('klinikStorage');
const now=new Date();const today=validate.localDate(now); const last =validate.localDate(new Date(now.getFullYear(),now.getMonth(),now.getDate()+14));
const nextMonday=(()=>{let d=new Date(now);d.setDate(d.getDate()+((8-d.getDay())%7||7));return validate.localDate(d);})();
const valid={nama:'Bunga Melati',nik:'1234567890123456',tanggalLahir:'2000-01-15',jenisKelamin:'Perempuan',hp:'081234567890',email:'bunga@example.org',penjamin:'Mandiri',noBpjs:'',poliklinik:'Poli Umum',dokter:'dr. Arka Mahardika',tanggalKunjungan:nextMonday<=last?nextMonday:today,keluhan:'Demam',setuju:true};
assert.equal(Object.keys(validate.fieldErrors||{}).length,0); // use validateAll interface
function errs(obj){ return run('klinikValidation.validateAll').call({form:{...valid,...obj},doctors:docs,errors:{}}) }
assert.equal(errs({}),true,'valid form');
for(const change of [{nama:'Ai'},{nik:'1234'},{tanggalLahir:'2999-01-01'},{jenisKelamin:''},{hp:'07123456789'},{email:'bad-email'},{poliklinik:''},{dokter:'drg. Kirana Maharani'},{tanggalKunjungan:'2020-01-01'},{keluhan:''},{setuju:false},{penjamin:'BPJS',noBpjs:'123'}]) assert.equal(errs(change),false,JSON.stringify(change));
assert.equal(validate.calculateAge('2999-01-01'),null);
const item1=storage.save({...valid,usia:26,jenis:'Pendaftaran pasien'});const item2=storage.save({...valid,usia:26,jenis:'Pendaftaran pasien'});
assert.equal(item1.noAntrean,'UMUM-001');assert.equal(item2.noAntrean,'UMUM-002');assert.equal(storage.all().length,2);
assert.equal(storage.save({...valid,poliklinik:'Poli Gigi'}).noAntrean,'GIGI-001');
storage.updateStatus(item1.id,'Selesai');assert.equal(storage.all()[0].status,'Selesai');
const app=run('klinikApp()');assert.equal(app.availableDoctorsForForm.length,0);app.form.poliklinik='Poli KIA';assert.equal(app.availableDoctorsForForm[0].name,'Bdn. Larasati Pertiwi');
assert.ok(['pagi','siang','sore','malam'].some(t=>app.greeting.includes(t)));
console.log('PASS validation negatives, age, doctor filter, greeting, queue increments, persistence, admin status');
