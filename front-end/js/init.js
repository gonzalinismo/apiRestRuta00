(function($) {
  $(function() {

    $('.sidenav').sidenav();
    document.getElementById("mytable").style.display = "none";
  }); // end of document ready
})(jQuery); // end of jQuery name space



$(function() {
  $('#botonEnviar').bind('click', function() {
    var consulta = {
      origen: document.getElementById("origen").value,
      destino: $("#destino").val(),
      fecha: $("#fecha").val().toString().substring(8, 10)
        + "/" + $("#fecha").val().toString().substring(5, 7)
        + "/" + $("#fecha").val().toString().substring(0, 4)

    }

    $.ajax({
      url: 'http://localhost:5000/consultaViajes',
      type: 'get',
      dataType: 'json',
      crossDomain: true,
      data: consulta,
      success: function(data) {
        var datos = jQuery.parseJSON(data);
        console.log(datos);
        var eleDiv = document.getElementById("mytable");
        if (eleDiv.style.display == "none" && datos.length > 0) {
          eleDiv.style.display = "";
        } else {
          if (datos.length == 0) {
            Swal.fire('No hay resultados para su busqueda :(');
            eleDiv.style.display = "none";

          }
        }

        $("#mytable > tbody").html("");
        var trHTML = '';
        for (i = 0; i < datos.length; i++) {
          trHTML +=
            '<tr><td>'
            + datos[i].nombreEmpresa
            + '</td><td>'
            + datos[i].origen
            + '</td><td>'
            + datos[i].destino
            + '</td><td>'
            + datos[i].fecha
            + '</td><td>'
            + datos[i].valor
            + '</td><td>'
            + (datos[i].totalPasajeros - datos[i].boletosVendidos)
            + '</td><td>'
            + '<a class="btn-large waves-effect waves-light light-blue"  id="botonComprar" name="botonComprar" onClick="compra(' + datos[i].idViaje + ','+datos[i].valor +')" ><i class="material-icons ">shopping_cart</i></a>'
            + '</td><td style="display:none;">'
            + (datos[i].idViaje)
            + '</td></tr>';
        }

        $('#tBody').append(trHTML);
      },
      error: function() {
        Swal.fire('No hay resultados para su busqueda :(');
        eleDiv.style.display = "none";
      }
    });
  });
});


function compra(idViaje, valor) {
  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '->']
  }).queue([
    {
      title: 'ingrese su id de Usuario',
    },
    {
      title: 'ingrese su contraseña',
      input: 'password'
    }
  ]).then((result) => {
    if (result.value) {
      const answers = JSON.stringify(result.value);
      logueo=login(result.value[0], result.value[1]);
      if (logueo==true) {
        Swal.fire({
          title: 'Bienvenido!',
          html: `
                  ${result.value[0]} 
                `,
          confirmButtonText: 'Tremendo!'
        });
        console.log("holaaa");
        pagar(result.value[0], idViaje, valor);

      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Tu usuario o contraseña son incorrectos!',
        })
      }
    }
  })

}

function login(user, pass) {
  var consulta = {
    usuario: user,
    password: pass
  };
  output = false;
  $.ajax({
    async: false,
    url: 'http://localhost:5000/login',
    type: 'get',
    dataType: 'json',
    crossDomain: true,
    data: consulta,
    success: function(data) {
      if (data==1) {
        output= true;
      }
      else {
        output= false;
      }
    },
    error: function(){output= false; },
  });
  console.log(output);
  return output;
}



function pagar(username, idViaje, valor){
  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['3', '4']
  }).queue([
    {
      title: 'ingrese su nro de Tarjeta',
    },
    {
      title: 'ingrese su clave de seguridad',
      input: 'password'
    }
  ]).then((result) => {
    if (result.value) {
      const answers = JSON.stringify(result.value);
      boletoPagado=registrarPago(username, idViaje, valor,result.value[0], result.value[1]);
      if (true) {
        Swal.fire(
          'Tremendo!',
          'Ya pagaste tu viaje',
          'success'
        )
    }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Tu usuario o contraseña son incorrectos!',
        })
      }
    }
  })
}

function registrarPago(username, idViaje, valor, nroTarjeta, codigoTarjeta){
  var registroDePago = {
    usuario: username,
    viaje: idViaje,
    tarjeta: nroTarjeta,
    codigo: codigoTarjeta
  };
  output = false;
  $.ajax({
    async: false,
    url: 'http://localhost:5000/cobroBoleto',
    type: 'get',
    dataType: 'json',
    crossDomain: true,
    data: registroDePago,
    success: function(data) {
      if (data==1) {
        output= true;
      }
      else {
        output= false;
      }
    },
    error: function(){output= false; },
  });
  console.log(output);
  return output;
}
