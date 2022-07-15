const { Client } = require('whatsapp-web.js');
var qrcode = require('qrcode-terminal');
const fs = require('fs')

const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);

    qrcode.generate(qr, {small: true}, function (qrcode) {
    console.log(qrcode)
});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    const get_pesan = msg.body;
    let pesan = get_pesan.toLowerCase();

    if (pesan == '#info') {
        msg.reply('├─ *⌜BOT FITUR⌟*\n├ _Mendeteksi Kata Kasar_\n├ _Menambah Kata Baru_\n├ _Jadwal Adzan_\n├ _Al-Quran_\n\n\n├─ *⌜KeyWord⌟*\n├ #info\n├ #add (kata baru)\n├ #solat\n├ #alquran');
    }

    if (pesan == '#alquran') {
        msg.reply('*⌜AL-QURAN ONLINE⌟*\n\nLink : https://alquran-online.herokuapp.com/');
    }

    if (pesan == '#solat') {
        const tahun = new Date().getFullYear();
        const bulan = new Date().getMonth() + 1;
        const tanggal = new Date().getDate();
        const request = require("request");
        request({
            url: "https://api.myquran.com/v1/sholat/jadwal/1203/"+tahun+"/"+bulan+"/"+tanggal+"",
            json: true    
        }, (err, response, body) => {
            var lokasi = JSON.stringify(body.data.lokasi).replace('"','').replace('"','');
            var tanggal = JSON.stringify(body.data.jadwal.tanggal).replace('"','').replace('"','');
            var imsak = JSON.stringify(body.data.jadwal.imsak).replace('"','').replace('"','');
            var subuh = JSON.stringify(body.data.jadwal.subuh).replace('"','').replace('"','');
            var dzuhur = JSON.stringify(body.data.jadwal.dzuhur).replace('"','').replace('"','');
            var ashar = JSON.stringify(body.data.jadwal.ashar).replace('"','').replace('"','');
            var maghrib = JSON.stringify(body.data.jadwal.maghrib).replace('"','').replace('"','');
            var isya = JSON.stringify(body.data.jadwal.isya).replace('"','').replace('"','');
            let jadwal = "*[JADWAL SOLAT "+lokasi+"]*\n_"+tanggal+"_\n\nIMSAK : "+imsak+"WIB\nSUBUH : "+subuh+"WIB\nDZUHUR : "+dzuhur+"WIB\nASHAR : "+ashar+"WIB\nMAGHRIB : "+maghrib+"WIB\nISYA : "+isya+"WIB";
            msg.reply(jadwal);
        });
    }


    // KOREKSI KATA
    fs.readFile('kata.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
    
        let arrKata = [];
        // parse JSON object
        let kata = JSON.parse(data.toString());
        kata.forEach(x => {
            arrKata.push(x);
        });
    
        function koreksi(input){
            var input = input.split(" ");
            var hasill = 0;
        
            input.forEach(e => {
                if (arrKata.includes(e)){
                    hasill += 1;
                }
            });
        
            if (hasill > 0){
                return "kasar";
            }
        }
        
        kasar = koreksi(pesan);
        if (kasar == 'kasar') {
            msg.reply('*❌[ Terdeteksi Kata Kasar ]❌*');
        }
    });


    // MENAMBAH KATA KASAR
    const key = '#add';
    let pesan_ = pesan.toLowerCase();
    pesan_.toLowerCase();
    pesan_ = pesan_.split(" ");
    function Tambah(pesan_){
        var hasil_ = 0;
        pesan_.forEach(e => {
            if (key === e){
                hasil_ += 1;
            }
        });
        if (hasil_ > 0){
            return "#add";
        }
    }    
    addkata = Tambah(pesan_);
    if (addkata === '#add'){
        kataUtama = pesan_[1];
        
        var count = 0;
        // read JSON object from file
        fs.readFile('kata.json', 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }
    
            let newKata = [];
            // parse JSON object
            let kata = JSON.parse(data.toString());
            
            kata.forEach(function(e, i){
                if (kataUtama === e){
                    const tahun = new Date().getFullYear();
                    const bulan = new Date().getMonth() + 1;
                    const tanggal = new Date().getDate();
                    var today = new Date();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    msg.reply("*[ ❌GAGAL❌ ]*\n\n• Kata : *"+kataUtama+"*\n• Time : "+tanggal+"/"+bulan+"/"+tahun+" "+time+"\n\nKata Ini Sudah Terdaftar 🙏🏻 Terimakasih...");
                    count = 0;
                } else{
                    count = 1;
                }
            })
            if (count > 0){
                kata.push(kataUtama);
                kata.forEach(x => {
                    newKata.push(x);
                });
                // convert JSON object to string
                let val = JSON.stringify(newKata);
                // write JSON string to a file
                fs.writeFile('kata.json', val, (err) => {
                    if (err) {
                        throw err;
                    }
                    const tahun = new Date().getFullYear();
                    const bulan = new Date().getMonth() + 1;
                    const tanggal = new Date().getDate();
                    var today = new Date();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    msg.reply("*[ Menambah Kata Baru ]*\n\n• Kata : *"+kataUtama+"*\n• Time : "+tanggal+"/"+bulan+"/"+tahun+" "+time+"\n\n✅BERHASIL 🙏🏻 Terimakasih...");
                });
            }
        });
    }

    // HAPUS KATA
    const key_ = '#del';
    let pesanHapus = pesan.toLowerCase();
    pesanHapus.toLowerCase();
    pesanHapus = pesanHapus.split(" ");
    function hapus(pesanHapus){
        var hasill_ = 0;
        pesanHapus.forEach(e => {
            if (key_ === e){
                hasill_ += 1;
            }
        });
        if (hasill_ > 0){
            return "#del";
        }
    }    
    addkata = hapus(pesanHapus);
    if (addkata === '#del'){
        kataUtama = pesanHapus[1];
    
        function aksi(i){
            // read JSON object from file
            fs.readFile('kata.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
                let newKata = [];
                // parse JSON object
                let kata = JSON.parse(data.toString());
                kata.forEach(x => {
                    newKata.push(x);
                });
    
                newKata.splice(i, 1);
                // convert JSON object to string
                let val_ = JSON.stringify(newKata);
                // write JSON string to a file
                fs.writeFile('kata.json', val_, (err) => {
                    if (err) {
                        throw err;
                    }
                    const tahun = new Date().getFullYear();
                    const bulan = new Date().getMonth() + 1;
                    const tanggal = new Date().getDate();
                    var today = new Date();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    msg.reply("*[ Menghapus Kata Kasar ]*\n\n• Kata : *"+kataUtama+"*\n• Time : "+tanggal+"/"+bulan+"/"+tahun+" "+time+"\n\n✅BERHASIL Terhapus 🙏🏻 Terimakasih...");
                });
            });
        }
        
        // read JSON object from file
        fs.readFile('kata.json', 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }
            
            var count_ = 0;
            // parse JSON object
            let kata = JSON.parse(data.toString());
            
            kata.forEach(function(e, i){
                if (kataUtama === e){
                    aksi(i);
                    count_ = 0;
                } else{
                    count_ = 1;
                }
            })
            if (count_ > 0){
                const tahun = new Date().getFullYear();
                const bulan = new Date().getMonth() + 1;
                const tanggal = new Date().getDate();
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                msg.reply("*[ ❌GAGAL❌ ]*\n\n• Kata : *"+kataUtama+"*\n• Time : "+tanggal+"/"+bulan+"/"+tahun+" "+time+"\n\nKata ini Belum Terdaftar 🙏🏻 Terimakasih...");
            }
        });
    }

    // CEK LIST KATA
    if (pesan == '#listkata') {
        fs.readFile('kata.json', 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }
            // parse JSON object
            let kata = JSON.stringify(data.toString());
            msg.reply(kata);
        });
    }
});

client.initialize();