import datetime
import sqlite3
from sqlite3 import Error
import json


def create_connection():    
    database = r"C:\sqlite\db\pythonsqlite.db"
    conn = None
    try:
        conn = sqlite3.connect(database)
        return conn
    except Error as e:
        print(e)

    return conn

def getViajes(origen, destino, fecha):
	queryConsultaViajes="SELECT * FROM Viaje, Empresa WHERE Viaje.idEmpresa=Empresa.idEmpresa AND origen='"+origen+"'AND destino='"+destino+"' AND fecha='"+fecha+"' AND totalPasajeros>boletosVendidos"
	print(queryConsultaViajes)
	conn=create_connection()
	try:
		c = conn.cursor()
		c.execute(queryConsultaViajes)
		r = [dict((c.description[i][0], value) for i, value in enumerate(row)) for row in c.fetchall()]
		c.connection.close()
		return json.dumps((r[0] if r else None) if False else r)
	except Error as e:
		print(e)

def logUser(user, password):
	queryConsultaLog="SELECT idUsuario FROM Usuario WHERE idUsuario='"+user+"' AND clave='"+password+"'"		
	print(queryConsultaLog)
	conn=create_connection()
	try:
		c = conn.cursor()
		res=c.execute(queryConsultaLog).fetchall()
		c.connection.close()
		return json.dumps(res)
	except Error as e:
		print(e)

def registrarPago(user, viaje):
	queryObtenerViaje="SELECT * FROM Viaje, Empresa WHERE Viaje.idEmpresa=Empresa.idEmpresa AND idViaje="+viaje
	print(queryObtenerViaje)
	conn=create_connection()
	try:
		c = conn.cursor()
		c.execute(queryObtenerViaje)
		r = [dict((c.description[i][0], value) for i, value in enumerate(row)) for row in c.fetchall()]
		empresa=r[0]['idEmpresa']
		boletosVendidos=r[0]['boletosVendidos']
		now = datetime.datetime.now()
		proxidPago=viaje+str(now.day)+str(now.month)+str(now.hour)+str(now.year)+str(now.minute)+str(now.second)
		queryCrearPago="INSERT INTO Pagos(idPago, idUsuarios, idViaje, idEmpresa) VALUES("+proxidPago+",'"+user+"',"+viaje+","+str(empresa)+")"
		print(queryCrearPago)
		c.execute(queryCrearPago)
		boletosVendidos+=1
		queryUpdateViaje="UPDATE Viaje SET boletosVendidos="+str(boletosVendidos)+" WHERE idViaje="+viaje
		print(queryUpdateViaje)
		c.execute(queryUpdateViaje)
		c.connection.commit()
		c.connection.close()
	except Error as e:
		print(e)
	pass

