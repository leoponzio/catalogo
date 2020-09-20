
(function () {
  "use strict";

  var treeviewMenu = $('.app-menu');

  // Toggle Sidebar
  $('[data-toggle="sidebar"]').click(function (event) {
    event.preventDefault();
    $('.app').toggleClass('sidenav-toggled');
  });

  // Activate sidebar treeview toggle
  $("[data-toggle='treeview']").click(function (event) {
    event.preventDefault();
    if (!$(this).parent().hasClass('is-expanded')) {
      treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
    }
    $(this).parent().toggleClass('is-expanded');
  });

  // Set initial active toggle
  $("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

  //Activate bootstrip tooltips
  $("[data-toggle='tooltip']").tooltip();

})();

///////////////// imagen producto
$("#ifoto").on("change", function () {
  var uploadFoto = document.getElementById("ifoto").value;
  var foto = document.getElementById("ifoto").files;
  var nav = window.URL || window.webkitURL;
  var contactAlert = document.getElementById('form_alert');

  if (uploadFoto != '') {
    var type = foto[0].type;
    var name = foto[0].name;
    if (type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png') {
      //contactAlert.innerHTML = '<p class="errorArchivo">El archivo no es válido.</p>';                        
      swal("Error!", "El archivo no es válido.", "error");
      $("#img").remove();
      $(".delPhoto").addClass('notBlock');
      $('#ifoto').val('');
      return false;
    } else {
      //contactAlert.innerHTML='';
      $("#img").remove();
      $(".delPhoto").removeClass('notBlock');
      var objeto_url = nav.createObjectURL(this.files[0]);
      $(".prevPhoto").append("<img id='img' src=" + objeto_url + ">");
      $(".upimg label").remove();
    }
  } else {
    alert("No selecciono foto");
    $("#img").remove();
  }
});

$('.delPhoto').click(function () {
  $('#ifoto').val('');
  $(".delPhoto").addClass('notBlock');
  $('#imgName').val('SinFoto.jpg');
  $("#img").remove();

  if ($("#foto_actual") && $("#foto_remove")) {
    $("#foto_remove").val('img_producto.png');
  }
});

///////////////////// datatables
$(document).ready(function () {

  tblProd = $('#tableProd').DataTable({
    aProcessing: true,
    aServerSide: true,

    language: {
      url: "../spanish.json"
    },

    ajax: {
      "url": " /productos/allprod",
      "method": "GET",
      "dataSrc": ""
    },

    columns: [

      { "data": "cod" },
      { "data": "des" },
      { "data": "detalle" },
      { "data": "preciod1" },
      { "data": "preciod2" },
      { "data": "precioy1" },
      { "data": "precioy2" },
      { "data": "option" }
    ],
    resonsieve: "true",
    bDestroy: true,
    iDisplayLength: 10
  });


  tblDpto = $('#tableDpto').DataTable({
    aProcessing: true,
    aServerSide: true,

    language: {
      url: "../spanish.json"
    },

    ajax: {
      "url": " /dpto/alldpto",
      "method": "GET",
      "dataSrc": ""
    },

    columns: [
      { "data": "dp_cod" },
      { "data": "dp_des" },
      { "data": "option" }
    ],
    resonsieve: "true",
    bDestroy: true,
    iDisplayLength: 10
  });

  ///////////////////// dptos

  //Abrir modal para crear dpto
  $('#addDpto').click(function () {

    if ($("#modalHeadDpto").hasClass("bg-info")) {
      $("#modalHeadDpto").removeClass("bg-info").addClass("bg-primary");
    } else {
      $("#modalHeadDpto").addClass("bg-primary");
    };

    $(".modal-title").text("Crear Departamento");
    $("#idDpto").val(0);
    $("#cod").prop("disabled", false);
    $("#cod").focus();
    $("#formDpto").trigger("reset");
    $('#modalFormDpto').modal('show');
  });

  //abrir modal con datos para Editar Dpto      
  $(document).on("click", ".fnEditDp", function () {

    var id = this.getAttribute('rl');

    $.ajax({
      url: "dpto/getDpto/" + id,
      type: "GET",
      datatype: "json",
      success: function (res) {

        var objData = JSON.parse(res);

        if ($("#modalHeadDpto").hasClass("bg-primary")) {
          $("#modalHeadDpto").removeClass("bg-primary").addClass("bg-info");
        } else {
          $("#modalHeadDpto").addClass("bg-info");
        };

        $("#idDpto").val(id);
        $("#cod").val(objData.dp_cod);
        $("#cod").prop("disabled", true);
        $("#des").focus();
        $("#des").val(objData.dp_des);
        $(".modal-title").text("Actualiza Departamento");
        $('#modalFormDpto').modal('show');
      }
    });
  });

  //  crear/editar dpto
  $('#formDpto').submit(function (e) {
    e.preventDefault();

    $("#cod").prop("disabled", false);
    var formData = new FormData(document.getElementById('formDpto'));

    $.ajax({

      url: "dpto/setDpto",
      type: "POST",
      datatype: "json",
      data: formData,
      contentType: false,
      processData: false,
      success: function (res) {

        var objData = JSON.parse(res);
        if (objData.status) {
          $('#tableDpto').DataTable().ajax.reload();
          swal("Guardado!", objData.msg, "success");
        } else {
          swal("Atencion!", objData.msg, "warning");
        }
      }
    });

    $('#modalFormDpto').modal('hide');

  });

  //  borrar dpto
  $(document).on("click", ".fnDelDp", function () {

    var id = this.getAttribute('rl');

    swal({
      title: "Borrar Registro?",
      text: "Seguro de borrar el Departamento",
      icon: "warning",
      dangerMode: true,
      buttons: ["No!,Cancelar!", "Si!,Eliminar"],

      closeOnConfirm: false,
      closeOnCancel: false
    }).then((isConfirm) => {
      if (isConfirm) {
        $.ajax({
          url: "dpto/delDpto/" + id,
          type: "DELETE",
          datatype: "json",
          success: function (res) {
            var objData = JSON.parse(res);
            console.log(objData);
            if (objData.status) {
              swal("Eliminado", objData.msg, "success");
              $('#tableDpto').DataTable().ajax.reload();
            } else {
              swal("Atencion!", objData.msg, "error");
            }
          }
        });
      } else {
        swal("Cancelado!", "Cancelado por Usuario", "error");
      }

    });
  });

  ///////////////////////////////// productos

  //Abrir modal para crear Producto
  $('#addProd').click(function () {

    if ($("#modalHeadProd").hasClass("bg-info")) {
      $("#modalHeadProd").removeClass("bg-info").addClass("bg-primary");

    } else {
      $("#modalHeadProd").addClass("bg-primary");

    };

    $(".modal-title").text("Crear Producto");
    $("#idProd").val(0);
    $("#cod").prop("disabled", false);
    $("#cod").focus();
    $("#img").remove();
    $("#activo").val("1").change();
    $("#formProd").trigger("reset");
    $('#modalFormProd').modal('show');
    $(".delPhoto").addClass("notBlock")
  });

  //abrir modal con datos para Editar Producto      
  $(document).on("click", ".fnEditProd", function () {

    var id = this.getAttribute('rl');

    $.ajax({
      url: "productos/getProd/" + id,
      type: "GET",
      datatype: "json",
      success: function (res) {

        var objData = JSON.parse(res);

        if ($("#modalHeadProd").hasClass("bg-primary")) {
          $("#modalHeadProd").removeClass("bg-primary").addClass("bg-info");

        } else {
          $("#modalHeadProd").addClass("bg-info");

        };

        $("#idProd").val(id);
        $("#cod").val(objData.cod);
        $("#cod").prop("disabled", true);
        $("#des").val(objData.des);
        $("#cdpto").val(objData.dpto).change();
        $("#activo").val(objData.activo).change();
        $("#det").val(objData.detalle);
        $("#imgName").val(objData.img);
        $(".delPhoto").removeClass("notBlock")
        $("#img").remove();
        $(".prevPhoto").append("<img id='img' src='/img/uploads/" + objData.img + "'>");
        $("#preciod1").val(objData.preciod1);
        $("#preciod2").val(objData.preciod2);
        $("#precioy1").val(objData.precioy1);
        $("#precioy2").val(objData.precioy2);
        $(".modal-title").text("Actualiza Producto");
        $("#des").focus();
        $('#modalFormProd').modal('show');

      }
    });
  });

  //crear editar producto
  $('#formProd').submit(function (e) {
    e.preventDefault();

    $("#cod").prop("disabled", false);
    var formData = new FormData(document.getElementById('formProd'));

    $.ajax({

      url: "productos/setProd",
      type: "POST",
      datatype: "json",
      data: formData,
      contentType: false,
      processData: false,
      success: function (res) {

        var objData = JSON.parse(res);
        if (objData.status) {
          $('#tableProd').DataTable().ajax.reload();
          swal("Guardado!", objData.msg, "success");
        } else {
          swal("Atencion!", objData.msg, "warning");
        }
      }
    });

    $('#modalFormProd').modal('hide');

  });

  //borrar Prod
  $(document).on("click", ".fnDelProd", function () {

    var id = this.getAttribute('rl');

    swal({
      title: "Borrar Registro?",
      text: "Seguro de borrar el Producto",
      icon: "warning",
      dangerMode: true,
      buttons: ["No!,Cancelar!", "Si!,Eliminar"],

      closeOnConfirm: false,
      closeOnCancel: false
    }).then((isConfirm) => {
      if (isConfirm) {
        $.ajax({
          url: "productos/delProd/" + id,
          type: "DELETE",
          datatype: "json",
          success: function (res) {
            var objData = JSON.parse(res);

            if (objData.status) {
              swal("Eliminado", objData.msg, "success");
              $('#tableProd').DataTable().ajax.reload();
            } else {
              swal("Atencion!", objData.msg, "error");
            }
          }
        });
      } else {
        swal("Cancelado!", "Cancelado por Usuario", "error");
      }

    });
  });

  //cambiar clave
  $('#formPass').submit(function (e) {
    e.preventDefault();

    var formData = new FormData(document.getElementById('formPass'));
   
    $.ajax({
      url: "pass",
      type: "PUT",
      datatype: "json",
      data: formData,
      contentType: false,
      processData: false,
      success: function (res) {
        var objData = JSON.parse(res);

        if (objData.status) {
          swal("Actualizado", objData.msg, "success");

        } else {
          swal("Atencion!", objData.msg, "error");
        }
      }
    });
    $('#modalFormPass').modal('hide');
  });

  //crear usuario
  $('#formReg').submit(function (e) {
    e.preventDefault();

    var formData = new FormData(document.getElementById('formReg'));

    $.ajax({
      url: "signup",
      type: "POST",
      datatype: "json",
      data: formData,
      contentType: false,
      processData: false,
      success: function (res) {
        var objData = JSON.parse(res);

        if (objData.status) {
          swal("Guardado!", objData.msg, "success");

        } else {
          swal("Atencion!", objData.msg, "error");
        }
      }
    });
    $('#modalFormReg').modal('hide');
  });

//////////// reset password
  //abrir form reset password
  $('#rst1').click(function () {

    $(".modal-title").text("Olvido su Clave");
    $("#formForgot").trigger("reset");
    $('#modalFormLog').modal('hide');
    $('#modalFormForgot').modal('show');


  });

  //abrir form login desde reset 
  $('#rst2').click(function () {

    $(".modal-title").text("Ingresar al Sistema");
    $("#formLog").trigger("reset");
    $('#modalFormForgot').modal('hide');
    $('#modalFormLog').modal('show');

  });

  
   //forgot password
   $('#formForgot').submit(function (e) {
    e.preventDefault();

    var formData = new FormData(document.getElementById('formForgot'));
    var token =$('#hidden').val();
    $.ajax({
      url: "/forgotpass",
      type: "POST",
      datatype: "json",
      data: formData,
      contentType: false,
      processData: false,
      success: function (res) {
        console.log(res);
        var objData = JSON.parse(res);

        if (objData.status) {
         
          swal("Enviado!", objData.msg, "success").then((value) => {
         
            window.location.href='/';
          });
         
        } else {
          swal("Error!", objData.msg, "error")
        }
      }
    });
    
  });

   //reset password
   $('#formReset').submit(function (e) {
    e.preventDefault();

    var formData = new FormData(document.getElementById('formReset'));
    var token =$('#hidden').val();
    $.ajax({
      url: "/resetpassword/"+token,
      type: "POST",
      datatype: "json",
      data: formData,
      contentType: false,
      processData: false,
      success: function (res) {
        console.log(res);
        var objData = JSON.parse(res);

        if (objData.status) {
         
          swal("Actualizado!", objData.msg, "success").then((value) => {
         
            window.location.href='/';
          });
         
        } else {
          swal("Error!", objData.msg, "error").then((value) => {
         
            window.location.href='/';
          });
        }
      }
    });
    
  });



});



function openModalLog() {

  $(".modal-title").text("Ingresar al Sistema");
  $("#username").focus();
  $("#formLog").trigger("reset");
  $('#modalFormLog').modal('show');
}

function openModalReg() {

  $(".modal-title").text("Registar Usuario");
  $("#fullname").focus();
  $("#formReg").trigger("reset");
  $('#modalFormReg').modal('show');
}

function openModalPass() {

  $(".modal-title").text("Cambiar Contraseña");
  $("#formPass").trigger("reset");
  $('#modalFormPass').modal('show');
}

function openModalWait() {

  $(".modal-title").text("Procesando");
  $('#modalFormWait').modal('show');
}