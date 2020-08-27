const SocketServer = require('websocket').server
const http = require('http')
const server = http.createServer((req,res)=>{})

server.listen(8000,()=>{
	console.log("listening on port 8000...")
})

websocketServer= new SocketServer({httpServer:server})

const connections =[]

websocketServer.on('request',(req)=>{
	const connection = req.accept()
	console.log('new connection')
	connections.push(connection)

	connection.on('message',(mes)=>{
		connections.forEach(element =>{
			if(element != connection)
				element.sendUTF(mes.utf8Data)
		})
	})

	connection.on('close',(resCode,des)=>{
		console.log('connection closed')
		connections.splice(connections.indexOf(connection),1)
	})

})
var express = require('express')
var app = express()

var mongoClient =  require('mongodb').MongoClient
var url = "mongodb://aakarsh-chat:8CXK8916J3Raf8nHvLolFavVWXyXOhxtMPDJ3w9BlZopvwk3GFgkmOk3QS6wLS7WXmdJdrhr0GDe1VjT1a9y3g%3D%3D@aakarsh-chat.documents.azure.com:10255/?ssl=true"
app.use(express.json())

mongoClient.connect(url,(err,db)=>{
	if(err){
		console.log("Error while connecting mongo client...")
	}else{
		var myDb=db.db('myDb')
		var collection =myDb.collection('myTable')

		app.post('/signup',(req,res)=>{

			const newUser ={
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			}

			const query ={ email:newUser.email}
			collection.findOne(query,(err,result)=>{
				if(result==null){
					collection.insertOne(newUser,(err,result)=>{
						res.status(200).send()
					})
				}else{
					res.status(400).send()
				}

			})
		})

		app.post('/login',(req,res)=>{
			const query = {
				email: req.body.email,
				password: req.body.password
			}

			collection.findOne(query,(err,result)=>{
				if (result==null){
					res.status(404).send()
				}else{
					const obj={
						name:result.name,
						email:result.email
					}
					res.status(200).send(JSON.stringify(obj))
				}
			})
		})
	}
})
app.listen(3000,() => {
	console.log("Listening on port 3000...")
})