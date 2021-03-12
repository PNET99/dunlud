/**
* Originally by Hafizh & MhankBarBar
* Recoded by Lindow
**/
const {
   WAConnection,
   MessageType,
   MessageOptions,
   Mimetype,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
   processTime,
} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal")
const moment = require("moment-timezone")
const fs = require("fs")
const axios = require("axios")
const { color, bgcolor } = require('./lib/color')
const base64Img = require('base64-img')
const fetch = require('node-fetch')
const { fetchJson } = require('./lib/fetcher')
const { wait, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const apikey = 'Your-Apikey' // Get In api-lolhuman.xyz
prefix = ''
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")

const { exec } = require("child_process")

const lindow = new WAConnection()

lindow.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ${time} ] QR code is ready`)
})

lindow.on('credentials-updated', () => {
   const authInfo = lindow.base64EncodedAuthInfo()
   console.log(`credentials updated!`)
   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && lindow.loadAuthInfo('./session.json')

lindow.connect();

lindow.on('message-new', async (lin) => {
		try {
			if (!lin.message) return
			if (lin.key && lin.key.remoteJid == 'status@broadcast') return
			global.prefix
			const content = JSON.stringify(lin.message)
			const from = lin.key.remoteJid
			const type = Object.keys(lin.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			if (!lin.key.fromMe) return
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && lin.message.conversation.startsWith(prefix)) ? lin.message.conversation : (type == 'imageMessage') && lin.message.imageMessage.caption.startsWith(prefix) ? lin.message.imageMessage.caption : (type == 'videoMessage') && lin.message.videoMessage.caption.startsWith(prefix) ? lin.message.videoMessage.caption : (type == 'extendedTextMessage') && lin.message.extendedTextMessage.text.startsWith(prefix) ? lin.message.extendedTextMessage.text : ''
			var pes = (type === 'conversation' && lin.message.conversation) ? lin.message.conversation : (type == 'imageMessage') && lin.message.imageMessage.caption ? lin.message.imageMessage.caption : (type == 'videoMessage') && lin.message.videoMessage.caption ? lin.message.videoMessage.caption : (type == 'extendedTextMessage') && lin.message.extendedTextMessage.text ? lin.message.extendedTextMessage.text : ''
			const perintah = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const reply = (teks) => {
				lindow.sendMessage(from, teks, text, {quoted:lin})
			}
			colors = ['red','white','black','blue','yellow','green']
			const isCmd = body.startsWith(perintah)
			if (isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(perintah), 'args :', color(args.length))
			if (perintah.includes("https://youtu.be")) {
		    data = await fetchJson(`http://api.lolhuman.xyz/api/ytaudio?apikey=${apikey}&url=https://youtu.be/${body.slice(17)}`)
            if (Number(data.result.link[0].size.split(' MB')[0]) >= 30.00) return reply(`*Data Berhasil Didapatkan!*\n\n*Title :* ${data.result.title}\n*Uploader :* ${data.result.uploader}\n\n*Duration :* ${data.result.duration}\n*View :* ${data.result.view}\n*Like :* ${data.result.like}\n*Dislike :* ${data.result.dislike}\n\n*Filesize* : ${data.result.link[0].size}\n\n*Link* : ${data.result.link[0].link}\n\n_Untuk durasi lebih dari batas disajikan dalam bentuk link_`)
            teks = `[ *YTMP3 DOWNLOADER* ]\n\n*Title :* ${data.result.title}\n*Uploader :* ${data.result.uploader}\n\n*Duration :* ${data.result.duration}\n*View :* ${data.result.view}\n*Like :* ${data.result.like}\n*Dislike :* ${data.result.dislike}\n\n*Description :* ${data.result.description}\n\n*Bitrate :* ${data.result.link[0].bitrate}\n*Size :* ${data.result.link[0].size}\n\nWait a minute, sending audio..`
            thumb = await getBuffer(data.result.thumbnail)
            lindow.sendMessage(from, thumb, image, {quoted: lin, caption: teks})
            buff = await getBuffer(data.result.link[0].link)
            lindow.sendMessage(from, buff, audio, {mimetype: 'audio/mp4', filename: `${data.title}.mp3`, quoted: lin})
            }
            if (perintah.includes("play")) {
            reply('*_Wait for a few minutes_*')
            data = await fetchJson(`http://api.lolhuman.xyz/api/ytplay?apikey=${apikey}&query=${args[0]}`)
            if (Number(data.result.audio[0].size.split(' MB')[0]) >= 30.00) return reply(`*Data Berhasil Didapatkan!*\n\n*Title :* ${data.result.info.title}\n*Uploader :* ${data.result.info.uploader}\n\n*Duration :* ${data.result.info.duration}\n*View :* ${data.result.info.view}\n*Like :* ${data.result.info.like}\n*Dislike :* ${data.result.info.dislike}\n\n*Filesize* : ${data.result.audio[0].size}\n\n*Link* : ${data.result.audio[0].link}\n\n_Untuk durasi lebih dari batas disajikan dalam bentuk link_`)
            teks = `*[ *PLAY MP3* ]\n\n*Title :* ${data.result.info.title}\n*Uploader :* ${data.result.info.uploader}\n\n*Duration :* ${data.result.info.duration}\n*View :* ${data.result.info.view}\n*Like :* ${data.result.info.like}\n*Dislike :* ${data.result.info.dislike}\n\n*Description :* ${data.result.info.description}\n\n*Bitrate :* ${data.result.audio[0].bitrate}\n*Size :* ${data.result.audio[0].size}\n\nWait a minute, sending audio..`
            thumb = await getBuffer(data.result.info.thumbnail)
            lindow.sendMessage(from, thumb, image, {quoted: lin, caption: teks})
            buff = await getBuffer(data.result.audio[0].link)
            lindow.sendMessage(from, buff, audio, {mimetype: 'audio/mp4', filename: `${data.title}.mp3`, quoted: lin})
            }
            if (perintah.includes("mp4")) {
            reply('*_Wait for a few minutes_*')
            data = await fetchJson(`http://api.lolhuman.xyz/api/ytvideo?apikey=${apikey}&url=${args[0]}`)
            if (Number(data.result.link[0].size.split(' MB')[0]) >= 30.00) return reply(`*Data Berhasil Didapatkan!*\n\n*Title :* ${data.result.title}\n*Uploader :* ${data.result.uploader}\n\n*Duration :* ${data.result.duration}\n*View :* ${data.result.view}\n*Like :* ${data.result.like}\n*Dislike :* ${data.result.dislike}\n\n*Filesize* : ${data.result.link[0].size}\n\n*Link* : ${data.result.link[0].link}\n\n_Untuk durasi lebih dari batas disajikan dalam bentuk link_`)
            teks = `[ *YTMP4 DOWNLOADER* ]\n\n*Title :* ${data.result.title}\n*Uploader :* ${data.result.uploader}\n\n*Duration :* ${data.result.duration}\n*View :* ${data.result.view}\n*Like :* ${data.result.like}\n*Dislike :* ${data.result.dislike}\n\n*Description :* ${data.result.description}\n\n*Resolution :* ${data.result.link[0].resolution}\n*Size :* ${data.result.link[0].size}\n\nWait a minute, sending vidio...`
            get = await getBuffer(data.result.thumbnail)
            lindow.sendMessage(from, get, image, {qupted: lin, caption: teks})
            buff = await getBuffer(data.result.link[0].link)
            lindow.sendMessage(from, buff, video, {mimetype: 'video/mp4', filename: `${data.result.title}.mp4`, quoted: lin, caption: `${data.result.title}`})
	    }
            } catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
})
