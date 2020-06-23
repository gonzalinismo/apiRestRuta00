import os
import json
from flask import Flask
from flask_mail import Mail,  Message
from flask import render_template
from flask import request, jsonify, flash, redirect
from flask import Response
import collections
from Model import create_connection, getViajes, logUser, registrarPago
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app)



@app.route('/', methods=['GET'])
@app.route('/consultaViajes', methods=['GET'])
@cross_origin()
def consultaViaje():
	if request.method == "GET":
		req_data= request.get_json()
		origen=request.args.get('origen')
		destino= request.args.get('destino')
		fecha= request.args.get('fecha')
		print(req_data)
		viajes= getViajes(origen, destino, fecha)
		print(viajes)
		return jsonify(viajes)


@app.route('/login', methods=['GET'])
@cross_origin()
def login():
	if request.method == "GET":
		req_data= request.get_json()
		print("holisss")
		user=request.args.get('usuario')
		passw=request.args.get('password')
		result=json.dumps(logUser(user, passw))
		print(result)
		if(result!='"[]"'):
			return ("1")
		else:
			return("0")	

@app.route('/cobroBoleto', methods=['GET'])
def cobroBoleto():
	if request.method == "GET":
		req_data= request.get_json()
		print("holitas")
		user=request.args.get('usuario')
		viaje=request.args.get('viaje')
		tarjeta=request.args.get('tarjeta')
		codigo=request.args.get('codigo')
		registrarPago(user, viaje)
		return("1")
		#En esta parte se podría conectar a un proveedor de servicios de pagos


# @app.route('/mutant', methods=['POST'])
# def mutant():
# 	conn = sqlite3.connect('example.db')	
# 	c= conn.cursor()
# 	if request.method == "POST":
# 		req_data= request.get_json()
# 		dna=req_data["dna"]
# 		if isMutant(dna):
# 			ins="".join(dna)
# 			c.execute('insert into dnas values(?,1)', [ins])
# 			conn.commit()
# 			conn.close()
# 			status_code = Response(status=200)
# 			return status_code
# 		else:
# 			ins="".join(dna)
# 			c.execute('insert into dnas values(?,0)', [ins])
# 			conn.commit()
# 			conn.close() 
# 			status_code = Response(status=403)	
# 			return status_code
