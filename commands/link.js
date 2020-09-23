const Discord = require('discord.js');
const data = require('quick.db');
const moment = require('moment');
const kontrol = require('node-fetch');
const checker = require('site-checker');
moment.locale('tr');

exports.run = async (client, message, args) => {
let argümanlar = ['ekle', 'sil', 'liste'];
if(!args[0]) return message.channel.send('Bir argüman belirtmelisin: '+argümanlar.join(', '))
if(!argümanlar.includes(args[0].toLowerCase())) return message.channel.send('Geçersiz argüman girdin.\nBu komut için geçerli argümanlar: '+argümanlar.join(', '))

if(args[0].toLowerCase() === 'ekle') {

if(!args[1]) return message.channel.send('Bir link belirtmelisin.');
if(!args[1].startsWith('https://')) return message.channel.send(`\`${args[1]}\`, geçersiz bir link.\n**HTTPS** ile başlamasına özen göster.`)
const linkler = await data.fetch('chimped');
if(linkler) {
if(linkler.find(a => a.site === args[1])) return message.channel.send(`\`${linkler.length}\` link arasında senin yazdığın \`${args[1]}\` linkide var. Aynı linki tekrar ekleyemem.`);
}
data.push('chimped', { site: args[1], sahipID: message.author.id, sahipTag: message.author.tag, sahipName: message.author.username, eklenmeTarihi: moment(Date.now()).format('DD/MM/YYYY HH:mm') })
message.channel.send(`\`${args[1]}\` linki için \`Uptime\` başladı. Hizmetimizi kullandığınız için teşekkürler!`);


}

if(args[0].toLowerCase() === 'sil') {
const linkler = await data.fetch('chimped');
if(!linkler) return message.channel.send('Daha önce hiç link eklenmemiş.');
if(!args[1]) return message.channel.send('Bir link belirtmelisin.');
if(!args[1].startsWith('https://')) return message.channel.send(`\`${args[1]}\`, geçersiz bir link.\n**HTTPS** ile başlamasına özen göster.`)
if(!linkler.filter(a => a.sahipID === message.author.id).find(c => c.site === args[1])) return message.channel.send(`Veri tabanımızda sana ait olan \`${linkler.filter(c => c.sahipID === message.author.id).length}\` link arasında \`${args[1]}\` linkini bulamadık.`)
if(!linkler.find(a => a.site === args[1])) return message.channel.send(`Görünüşe göre veritabanımızda \`${linkler.length}\` link içerisinde \`${args[1]}\` linkide bulunmuyor.`);

if(linkler.length == 1) {
data.delete('chimped');
return message.channel.send(`\`${args[1]}\` linki \`${linkler.length}\` link arasından bulundu ve silindi.`)
} else {
let ex = [];
linkler.forEach(db => {
if(db.site === args[1]) return;
ex.push(db)
data.set('chimped', ex)
})
message.channel.send(`\`${args[1]}\` linki \`${linkler.length}\` link arasından bulundu ve silindi. Şu anda senin: \`${linkler.filter(c => c.sahipID === message.author.id).length-1}\` linkin aktif durumda.`)
}

}

if(args[0].toLowerCase() === 'liste') {
const linkler = await data.fetch('chimped');
if(!linkler) return message.channel.send('Daha önce hiç link eklenmemiş.');
if(!linkler.filter(a => a.sahipID === message.author.id)) return message.channel.send('Daha önce hiç link eklememişsin.');
if(args[1]) {
if(args[1].toLowerCase() === 'hepsi') {
let a = [];
linkler.forEach(s => a.push(`${s.site} ~ Ekleyen: ${s.sahipTag} ~ Eklenme tarihi: ${s.eklenmeTarihi}`));
message.channel.send('```'+a.join('\n')+'```')
}
} else {
  
const embed = new Discord.MessageEmbed().setColor('GREEN').setAuthor(message.author.username, message.author.avatarURL());
linkler.filter(a => a.sahipID === message.author.id).forEach(s => {
embed.addField(s.site, `• Eklenme tarihi: ${s.eklenmeTarihi}`);
})
message.channel.send(embed.setDescription(`Toplamda **${linkler.length}** link bulundu. Bunlardan **${linkler.filter(a => a.sahipID === message.author.id).length}** tanesi senin. Tüm linklere bakmak için: ${client.ayarlar.prefix}link liste hepsi`).setFooter('Can°B#1308 Tarafından discord.gg/codare için yapıldı.'));
}
}

};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'link'
};
