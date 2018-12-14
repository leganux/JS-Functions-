/*
* SupportFunctions.js ene 2018
* Autor: Angel Erick Cruz Olivera
* v. 3.0.0.1
* Dependencias : jQuery 3+, gbmx framework, pasosgobmx
*
**** Funciones creadas para estandarizacion de VU ****
* */


var GlobalJSONClient = {};
GlobalJSONClient._FingerPrint = null;


/*Despliega el modal de los terminos y condiciones */
function TerminosyCondiciones_() {
    $(_G_ID_ + "checkbox_acep_terms").prop("checked", false);
    $('#Modal_TerminosyCondicioones').modal('show')
}

/*valida en tiempo real el tipo de archivo */
function validaCampoFile(Nombre, ActualLement, espacio) {
    // errorIs = Array();
    $('#' + ActualLement + '_txt_' + Nombre).change(function () {
        resetCampo(Nombre, '#' + ActualLement);
        validaCampoFileInsave(Nombre, ActualLement, espacio);
        var OBJ_Campo = document.getElementById(ActualLement + '_txt_' + Nombre);
        if (OBJ_Campo.type == 'file') {

            var reader = new FileReader();
            reader.readAsDataURL(OBJ_Campo.files[0]);
            reader.onloadend = function () {
                allCamposB64[OBJ_Campo.name] = reader.result;

            };
        }

    });
}

/* * valida el tipo de archivo */
function validaCampoFileInsave(Nombre, ActualLement, espacio) {

    var ID = document.getElementById(ActualLement + '_txt_' + Nombre);
    var file = ID.files[0];
    var errorIs2 = false;
    var tipoArch = $('#' + ActualLement + '_txt_' + Nombre).attr('accept');
    var MaxTam = $('#' + ActualLement + '_txt_' + Nombre).attr('maxtam');
    var espacio = espacio !== undefined ? espacio : '_S_solicitud_datos';
    if (!MaxTam) {
        MaxTam = 10;
    }
    if (!tipoArch) {
        tipoArch = '.pdf';
    }
    var FilesAdded = new Array();
    var _G_ID_ = '#' + ActualLement;
    if (tipoArch.toUpperCase().includes('PDF')) {
        var reader = new FileReader(file);
        reader.onload = function (event) {
            var text = reader.result;
            var firstLine = text.split('\n').shift(); // first line
            if (!(firstLine.toString().toUpperCase().includes('PDF'))) {
                redLabel_Space(Nombre, 'El archivo es inválido o no es PDF', _G_ID_);
                errorIs2 = true;
            }
        }
        reader.readAsText(file, 'UTF-8');
    }
    if (file.size > (MaxTam * 1024 * 1024)) {
        redLabel_Space(Nombre, 'El archivo no debe superar los ' + MaxTam + ' MB', _G_ID_);
        errorIs2 = true;
    }
    if (!ValidateAlphanumeric((file.name).replace('.', ''))) {
        redLabel_Space(Nombre, 'El nombre del archivo no debe contener caracteres especiales', _G_ID_);
        errorIs2 = true;
    }
    $(_G_ID_ + espacio + ' input').each(function (i, item) {
        if (item.type === 'file' && item.value !== '') {
            if (FilesAdded.indexOf(item.value) !== -1) {
                redLabel_Space(item.name, 'El archivo ya se encuentra cargado en otro requisito', _G_ID_);
                errorIs2 = true;
            }
            FilesAdded.push(item.value);
        }
    });
    if (file.size <= (0)) {
        redLabel_Space(Nombre, 'El archivo no es valido', _G_ID_);
        errorIs2 = true;
    }


    var tipoAA = file.name;
    tipoAA = tipoAA.split('.');
    var tamtipoAA = tipoAA.length;
    tipoAA = tipoAA[tamtipoAA - 1];


    if (!(tipoAA).toUpperCase().replace('.', '').includes(tipoArch.replace('.', '').toUpperCase())) {
        redLabel_Space(Nombre, 'El archivo debe ser' + tipoArch.toUpperCase(), _G_ID_);
        errorIs2 = true;
    }
    setTimeout(function () {
        if (errorIs2) {
            ShowAlertM(_G_ID_, null, null, true);
        }
        errorIs[Nombre] = errorIs2;
        return errorIs2;
    }, 1000);
}

/* valida en tiempo real el tipo de Texto */
function validaCampoTexto(Nombre, longitud, ActualLement) {
    //errorIs = Array();
    LimitaTamCampo(Nombre, Number(longitud), '#' + ActualLement);
    $('#' + ActualLement + '_txt_' + Nombre).change(function () {
        resetCampo(Nombre, '#' + ActualLement);
        validaCampoTextoInSave(Nombre, '#' + ActualLement);
    });
}

/* valida el tipo de Texto */
function validaCampoTextoInSave(Nombre, _G_ID_) {
    var cValue = $(_G_ID_ + '_txt_' + Nombre).val();
    var TextErr = false;
    if (cValue !== null && cValue !== '') {
        if (Nombre.toUpperCase().includes('RFC')) {
            if (!(/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/.test(cValue))) {
                redLabel_Space(Nombre, 'Formato de RFC Incorrecto', _G_ID_);
                ShowAlertM(_G_ID_, null, null, true);
                TextErr = true;
            }
        }
        _regEx = new RegExp("^([0-9]|[a-zA-Z]|\.)+$");
        if (!_regEx.test(cValue)) {
            redLabel_Space(Nombre, 'Solo se permiten caracteres alfanumericos', _G_ID_);
            ShowAlertM(_G_ID_, null, null, true);
            TextErr = true;
        }
        if (TextErr) {
            errorIs[Nombre] = true;
        } else {
            errorIs[Nombre] = false;
        }
    }
}

/* valida en tiempo real el tipo de Numero */
function validaCampoNumero(Nombre, longitud, ActualLement, rango, decimal) {
    //errorIs = Array();
    LimitaTamCampo(Nombre, Number(longitud), '#' + ActualLement);
    $('#' + ActualLement + '_txt_' + Nombre).change(function () {
        resetCampo(Nombre, '#' + ActualLement);
        validaCampoNumeroInSave(Nombre, ActualLement, rango, decimal);
    });
}

/* valida el tipo de Numero */
function validaCampoNumeroInSave(Nombre, ActualLement, rango, decimal) {
    var cValue = $('#' + ActualLement + '_txt_' + Nombre).val();
    var TextErr = false;

    if (cValue !== null && cValue !== '') {

        if (!decimal) {
            _regEx = new RegExp("^[0-9]+$");
            if (!_regEx.test(cValue)) {
                redLabel_Space(Nombre, 'Solo se permiten caracteres numéricos', '#' + ActualLement);
                ShowAlertM('#' + ActualLement, null, null, true);
                TextErr = true;
            }
        } else {
            if (!cValue.includes('.')) {
                redLabel_Space(Nombre, 'Solo se permiten decimales', '#' + ActualLement);
                ShowAlertM('#' + ActualLement, null, null, true);
                TextErr = true;
            }
        }

        if (rango !== undefined && Array.isArray(rango)) {
            if (cValue < rango[0]) {
                redLabel_Space(Nombre, 'El rango mínimo deber se de ' + rango[0], _G_ID_);
                ShowAlertM('#' + ActualLement, null, null, true);
                TextErr = true;
            } else {
                if (cValue > rango[1]) {
                    redLabel_Space(Nombre, 'El rango máximo deber se de ' + rango[1], _G_ID_);
                    ShowAlertM('#' + ActualLement, null, null, true);
                    TextErr = true;
                }
            }
        }


        if (TextErr) {
            errorIs[Nombre] = true;
        } else {
            errorIs[Nombre] = false;
        }
    }
}

/* Genera el archivo en base 64 */
function getBase64(file) {
    var reader = new FileReader();
    var algo = '';
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        algo = reader.result;
    };
}

/* Obtiene el valor de un parametro desde la url GET METHOD */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* Crea nueva alerta */
function ShowAlertM(_G_ID_, Msj, C_name, Deft) {

    if (Deft) {
        $(_G_ID_ + '_Alerta_S_').html('<div class="alert alert-danger" >' +
            '            <button type="button" class="close" onclick="javascript:HideAlertM(_G_ID_)" id="_btn_Closealert">x</button>' +
            '            <span id=""><b>¡Error de Registro!</b> Verifica la información que se solicita</span>' +
            '        </div>');
    } else {
        $(_G_ID_ + '_Alerta_S_').html('<div class="alert alert-' + C_name + '" >' +
            '            <button type="button" class="close" onclick="javascript:HideAlertM(_G_ID_)">x</button>' +
            '            <span id="">' + Msj + '</span>' +
            '        </div>');
    }
    $(_G_ID_ + '_btn_Closealert').click(function () {
        HideAlertM();
    });
    ScrollingTo(_G_ID_ + '_Alerta_S_');
}

/* Elimina alerta */
function HideAlertM(_G_ID_) {
    $(_G_ID_ + '_Alerta_S_').html('');
}

/*lleva el elemento hasta cierta poscicion en el documento para que sea visible*/
function ScrollingTo(ID_Elemento) {
    $('html, body').animate({
        scrollTop: ($(ID_Elemento).offset().top) - 200
    }, 10);
}

/*limpia campo validacion por nombre compuesto*/
function resetCampo(Nombre, _G_ID_) {
    $(_G_ID_ + 'ast_' + Nombre).removeClass('form-text-error');
    $(_G_ID_ + '_txt_' + Nombre).removeClass('form-control-error');
    $(_G_ID_ + 'miniText_' + Nombre).addClass('hidden');
    $(_G_ID_ + 'miniText_' + Nombre).html('');
}

/*Rojiza el campo */
function redLabel_Space(Nombre, message, _G_ID_) {
    $(_G_ID_ + 'ast_' + Nombre).addClass('form-text-error');
    $(_G_ID_ + '_txt_' + Nombre).addClass('form-control-error');
    $(_G_ID_ + 'miniText_' + Nombre).removeClass('hidden');
    $(_G_ID_ + 'miniText_' + Nombre).html(message);
}

/*validacion por nombre compuesto*/
function validaCampoVacio(Nombre, _G_ID_) {
    /* Es de tipo select */
    if ($(_G_ID_ + '_txt_' + Nombre).is('select')) {
        if ($(_G_ID_ + '_txt_' + Nombre).val() == -1) {
            redLabel_Space(Nombre, 'Este campo es obligatorio', _G_ID_);
            ShowAlertM(_G_ID_, null, null, true);
            return false;
        } else {
            return true;
        }
    } else /* de tipo input*/
    if ($(_G_ID_ + '_txt_' + Nombre).is('input')) {
        if ($(_G_ID_ + '_txt_' + Nombre).val() == '') {
            redLabel_Space(Nombre, 'Este campo es obligatorio', _G_ID_);
            ShowAlertM(_G_ID_, null, null, true);
            return false;
        } else {
            return true;
        }
    }
}

/*valida si cumple con la exprecion regular  dada una cadena [A-Z , 0-9]*/
function ValidateAlphanumeric(alphanumeric) {
    var myRegEx = /[^a-z\d]/i;
    var isValid = !(myRegEx.test(alphanumeric));
    return isValid;
}

/*function que activa boton de envio de datos*/
function ActivaEnvioCert() {
    var valid = true;
    if (!Firmado['certificado']) {
        valid = false;
    }
    if (!Firmado['key']) {
        valid = false;
    }
    if (!$('#checkbox_acep_terms').is(':checked')) {
        valid = false;
    }
    if ($('#_txt_pwd').val() == '') {
        valid = false;
    }
    if (valid) {
        $("#_btn_aceptar_firma").prop("disabled", false);
    } else {
        $("#_btn_aceptar_firma").prop("disabled", true);
    }
}

/*funcion que limita tamaño de campo*/
function LimitaTamCampo(Nombre, limite, _G_ID_) {

    if (!limite) {
        limite = 10;
    }

    ActualLement = _G_ID_.replace('#', '');

    $(_G_ID_ + '_txt_' + Nombre).keyup(function () {

        var Data = $(_G_ID_ + '_txt_' + Nombre).val();
        var tam = Data.length;
        if (tam > limite) {
            Data = Data.substr(0, Number(limite));
        }


        $(_G_ID_ + '_txt_' + Nombre).val(Data);

    });
}

/*Funcion que muestra el documento anteriormente subido */
function fShowDocto(cValor, cNumSol, iEjer) {
    var noDocto;
    if (cValor.substring(0, 4) == 'DOC-') {
        noDocto = cValor.substring(4);
        if (!iEjer) {
            window.open('DownloadINTDOCDIG?ICVEVEHDOCDIG=' + noDocto + '&cNumSol=' + cNumSol, 'width=800,height=600,status=yes,resizable=yes,top=200,left=200,titlebar=0,toolbar=0,menubar=0');
        } else {
            window.open('DownloadINTDOCDIG?ICVEVEHDOCDIG=' + noDocto + '&cNumSol=' + cNumSol + '&iEjercicio=' + iEjer, 'width=800,height=600,status=yes,resizable=yes,top=200,left=200,titlebar=0,toolbar=0,menubar=0');

        }
    } else {
        window.open('DownloadINTDOCDIG?ICVEVEHDOCDIG=' + cValor + '&cNumSol=' + cNumSol + '&iEjercicio=' + iEjer, 'width=800,height=600,status=yes,resizable=yes,top=200,left=200,titlebar=0,toolbar=0,menubar=0');
    }
}

/*Funcion que genera el link anteriormente subido */
function Genera_link_mail(cValor, cNumSol) {
    var noDocto;
    var url = window.location.href;
    var pos = url.search(Context);
    var start = url.substring(pos, 0);

    if (cValor.substring(0, 4) == 'DOC-') {
        noDocto = cValor.substring(4);
        url = start + '/' + Context + '/DownloadINTDOCDIG?ICVEVEHDOCDIG=' + noDocto + '&cNumSol=' + cNumSol;
        url = '<a target="_blank" href="' + url + '">' + url + '</a>';
    } else {
        url = 'Error -- No encontrado';
    }
    return url;
}

/*Funciones que codifican y decodifican el UTF8*/
function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

/*funcion que divide cadena  en varias HTML*/
function HtmlPlaceString(cad, longMax) {
    if (!longMax) {
        longMax = 50;
    }
    if (cad.length > longMax) {
        arr = splitString(cad, longMax);
        cad = '';
        $.each(arr, function (i, item) {
            cad = cad + item + '<br>';
        });
    }
    return cad;
}

/*Parte en arrrays de mismo tamaño de string en base al tamaño dado*/
function splitString(string, size) {
    var re = new RegExp('.{1,' + size + '}', 'g');
    return string.match(re);
}

/*funcion que remueve el tipo de objeto al B64 de cadena*/
function remueveOBJ_b64(cadena) {
    if (cadena) {
        var pos = cadena.indexOf(',');
        return cadena.substring(pos + 1);
    } else {
        return null;
    }

}

/*Funcion que limpia la cadena del body del mail a enviar */
function limpiaBody(body) {
    body = body.replace(/\*\*(.*?)\*\*/g, '');
    body = body.replace(/"/g, '\'');
    return body;
}

/*Funcion que Muestra alguna pantalla */
function MuestraPantalla(NombreEspacio, NombrePantalla) {
    $.each(PANTALLAS_, function (i, item) {
        $('#_Pantalla_' + item).hide();
        if (PANTALLAS_.length == (i + 1)) {
            $('#_Pantalla_' + NombrePantalla).show();
            ScrollingTo('#_Pantalla_' + NombrePantalla);
            HideAlertM(NombreEspacio);
        }
    });

    $.each(ESPACIOS_, function (i, item) {
        $('#Espacio_P_' + item).hide();
        $('#Footer_S_' + item).hide();
        if (ESPACIOS_.length == (i + 1)) {
            $('#Espacio_P_' + NombreEspacio).show();
            $('#Footer_S_' + NombreEspacio).show();
            HideAlertM(NombreEspacio);
        }
    });

}

/*Funcion que llena combo desplegable */
function Llena_Combo_d_(ID_element, data, f) {
    $(ID_element).html('<option value="-1">Seleccione...</option>');
    $.each(data, function (i, item) {
        $(ID_element).append('<option value="' + item.id + '">' + item.value + '</option>');
        if (data.length == i + 1) {
            if (f && $.isFunction(f)) {
                f();
            }
        }
    });
}

//Función para validar cadena rfc
function validaRfc(stringRFC) {
    return /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/.test(stringRFC);
}

//Función para validar cadena rfc
function validaCurp(stringRFC) {
    return /^([a-z]{4})([0-9]{6})([a-z]{6})([0-9]{2})$/i.test(stringRFC);
}

/*Funcion que dibuja campos en determinado espacio y asigna las validaciones */
function DibujaCamposEspacio_(ID_Espacio, data, _G_ID_, f) {
    var el = '';
    var ValidarFile = new Array();
    var ValidarNumber = new Array();
    var ValidarTexto = new Array();
    var longitudMaxTexto = new Array();
    $(ID_Espacio).html('');
    var ActualLement = _G_ID_.replace('#', '');

    $.each(data, function (i, item) {
        var Ast = '';
        if (item.lMandatorio) {
            Mandatorios.push(item.cCampo);
            Ast = '<span id="' + ActualLement + 'ast_' + item.cCampo + '" class="form-text">*</span>';
        }
        switch (item.iCvetipoCampo) {
            case 7 : // Campo de Tipo Archivo
                var formatoFile = item.cTipoArchivo;
                var tamArchivo = item.iTamArchivo;

                if (!formatoFile || formatoFile === 0 || formatoFile === '') {
                    formatoFile = '.pdf';
                }
                if (!tamArchivo || tamArchivo === 0 || formatoFile === '') {
                    tamArchivo = 10;
                }

                el = '<label style="text-align: justify" class="control-label ">' + item.cEtiqueta + Ast + ':</label>' +
                    '<input maxtam="' + tamArchivo + '"  autocomplete="off" name="' + item.cCampo + '" placeholder="Seleccione archivo..." type="file" id="' + ActualLement + '_txt_' + item.cCampo + '" class="form-control ns_" accept="' + formatoFile + '">' +
                    '<small id="' + ActualLement + 'miniText_' + item.cCampo + '" class="form-text form-text-error hidden"></small><br>';
                ValidarFile.push(item.cCampo);
                break;
            case 1 : // Campo de Tipo Numerico
                el = '<label style="text-align: justify" class="control-label ">' + item.cEtiqueta + Ast + ':</label>' +
                    '<input autocomplete="off" name="' + item.cCampo + '"  type="number" id="' + ActualLement + '_txt_' + item.cCampo + '" class="form-control ns_" >' +
                    '<small id="' + ActualLement + 'miniText_' + item.cCampo + '" class="form-text form-text-error hidden"></small><br>';
                ValidarNumber.push(item.cCampo);
                longitudMaxTexto[item.cCampo] = item.iLargo;
                break;
            case 2: // Campo de Tipo Texto
                el = '<label style="text-align: justify" class="control-label ">' + item.cEtiqueta + Ast + ':</label>' +
                    '<input autocomplete="off"  type="text" name="' + item.cCampo + '"   id="' + ActualLement + '_txt_' + item.cCampo + '" class="form-control ns_" >' +
                    '<small id="' + ActualLement + 'miniText_' + item.cCampo + '" class="form-text form-text-error hidden"></small> <br>';
                ValidarTexto.push(item.cCampo);
                longitudMaxTexto[item.cCampo] = item.iLargo;
                break;
            case 0: // Label
                el = ('<hr>' +
                    '<h4 class="control-label"> ' + item.cEtiqueta + '</h4>' +
                    '<hr>');
                break;
            default:
                el = '';
                break;
        }
        $(ID_Espacio).append(el);
        if ((i + 1) == data.length) {
            $.each(ValidarFile, function (i, item) {
                validaCampoFile(item, ActualLement);
            });
            $.each(ValidarTexto, function (j, jtem) {
                validaCampoTexto(jtem, longitudMaxTexto[jtem], ActualLement);
            });
            $.each(ValidarNumber, function (k, ktem) {
                validaCampoNumero(ktem, longitudMaxTexto[ktem], ActualLement);
            });
            if (f && $.isFunction(f)) {
                f();
            }
        }
    });
}

/*Funcion que valida  contraseña */
function ValidaContrasena(nombre, _G_ID_) {
    var p = $(_G_ID_ + '_txt_' + nombre).val();
    var errors = [];

    if (p.search(/[a-z]/i) < 0) {
        errors.push('Menor');
        redLabel_Space(nombre, 'La contraseña debe contener por lo menos 1 letra', _G_ID_);
    }
    if (p.search(/[0-9]/) < 0) {
        errors.push('Menor');
        redLabel_Space(nombre, 'La contraseña debe contener por lo menos 1 numero', _G_ID_);
    }
    if (p.search(/[._!+@#$%{}:;><^&*/]/) < 0) {
        errors.push('Menor');
        redLabel_Space(nombre, 'La contraseña debe contener por lo menos 1 caracter especial  ._!+@#$%{}:;><^&*/ ', _G_ID_);
    }
    if (p.length < 8) {
        errors.push('Menor');
        redLabel_Space(nombre, 'La contraseña debe contener por lo menos 8 caracteres de longitud', _G_ID_);
    }
    if (errors.length > 0) {
        return false;

    }
    return true;
}

/*Funcion que valida correo*/
function ValidaCorreo(nombre, _G_ID_) {
    var p = $(_G_ID_ + '_txt_' + nombre).val();
    var errors = [];
    if (!p.includes('.')) {
        errors.push('Menor');
        redLabel_Space(nombre, 'El correo es incorrecto', _G_ID_);
    }
    if (!p.includes('@')) {
        errors.push('Menor');
        redLabel_Space(nombre, 'El correo es incorrecto', _G_ID_);
    }
    if (errors.length > 0) {
        return false;
    }
    return true;
}

/*funcion que redirige a la pagina sin activacion*/
function ReturnNoAct() {
    var url = location.href.replace("#", "");
    localStorage.clear();
    if (url.includes('&Act')) {
        var arr = url.split('&Act');
        //localStorage.clear();
        location.href = arr[0];
    } else {
        var arr = url.split('?Act');
        //localStorage.clear();
        location.href = arr[0];
    }
}

//*Funcion que  valida el token del usuario y expulsa  de la sesion al mismo en caso de ser nesesario*//
function AuthVF() {
    var ID = code(Context, Context);
    var Token = localStorage.getItem(ID + 'Auth' + ID);
    if (!Token) {
        ReturnNoAct();
        return 0;
    }
    var OBJJson = decode('SCT-' + Psw, Token);
    OBJJson = JSON.parse(OBJJson);
    var DateTimeToken = moment(OBJJson.valid_until.fecha + ' ' + OBJJson.valid_until.hora);
    var actual = moment(moment().toISOString(), "YYYY-MM-DD HH:mm");
    var diff = DateTimeToken.diff(actual);
    if (diff <= 0) {
        ReturnNoAct();
        return 0;
    } else {
        localStorage.setItem(ID + 'id_user' + ID, code('SCT-' + Psw, OBJJson.id_user));
        localStorage.setItem(ID + 'nombre_completo' + ID, code('SCT-' + Psw, OBJJson.nombre_completo));
        localStorage.setItem(ID + 'usuario' + ID, code('SCT-' + Psw, OBJJson.usuario));
        localStorage.setItem(ID + 'tipo' + ID, code('SCT-' + Psw, OBJJson.tipo));
    }
}

/*Funcion que setea el token de autenticacion en el local Storage*/
function SetAuth(Token) {
    var ID = code(Context, Context);
    localStorage.setItem(ID + 'Auth' + ID, Token);
}

/*Obtiene un valor de la funcion por nombre */
function getelementSessionbyname(nombre) {
    var ID = code(Context, Context);
    var item = localStorage.getItem(ID + nombre + ID);
    return decode('SCT-' + Psw, item);
}

/*Carga un script Externo*/
function LoadExternalScript(url) {
    if (!url) {
        return false;
    }
    $.getScript(url, function () {
        return true;
    }).fail(function () {
        return false;
    });
}

/*Disable HtmlElement*/
function DisableHtmlEl(ID_EL) {
    $(ID_EL).prop('disabled', true);
}

/*Enable HtmlElement*/
function EnableHtmlEl(ID_EL) {
    $(ID_EL).prop('disabled', false);
}

/* ajusta tamaño nombre tramites*/
function ajustamanoTitulo(cad) {
    var dd = '';
    if ((cad).length < 50) {
        dd = '<h1><b>' + cad + '</b></h1>';
    } else if ((cad).length < 100) {
        dd = '<h2><b>' + cad + '</b></h2>';
    } else if ((cad).length < 150) {
        dd = '<h3><b>' + cad + '</b></h3>';
    } else {
        dd = '<h4><b>' + cad + '</b></h4>';
    }
    return dd;
}

function Activaterminosycondic() {
    $(_G_ID_ + 'checkbox_acep_terms').prop('checked', true);
}

function isNumeric(Nombre, _G_ID_) {
    var value = $(_G_ID_ + '_txt_' + Nombre).val();
    if (!$.isNumeric(value) && Math.floor(value) == value) {
        redLabel_Space(Nombre, 'Solo se permiten caracteres numéricos', _G_ID_);
        ShowAlertM(_G_ID_, null, null, true);
        return false;
    } else {
        return true;
    }
}

//función para aplicar funciones validadoras
function validaciones(campos, callback, _G_ID_, param) {
    bandera = true;
    $.each(campos, function (i, v) {
        if (!callback(i, _G_ID_, $.isFunction(param) ? $.map(v, param) : ''))
            bandera = false;
    });
    return bandera;
}

//función para validar el tamaño de archivo
function validaTamArchivo(file, Nombre, ActualLement) {

    var MaxTam = $('#' + ActualLement + '_txt_' + Nombre).attr('maxtam');
    var val = $('#' + ActualLement + '_txt_' + Nombre).val();
    if (val && val !== '') {
        if (file.size <= 0) {
            redLabel_Space(Nombre, 'El archivo no es valido', _G_ID_);
            return false;
        } else if (file.size > (MaxTam * 1024 * 1024)) {
            redLabel_Space(Nombre, 'El archivo no debe superar los ' + MaxTam + ' MB', _G_ID_);
            return false;
        }
    }

    return true;
}

//función para validar el nombre del archivo
function validaNombreArchivo(file, _G_ID_, Nombre) {
    var val = $('#' + ActualLement + '_txt_' + Nombre).val();
    if (val && val !== '') {
        if (!ValidateAlphanumeric((file.name).replace('.', ''))) {
            redLabel_Space(Nombre, 'El nombre del archivo no debe contener caracteres especiales', _G_ID_);
            return false;
        }
    }
    return true;
}

//función para validar archvos mismo nombre
function validaCargaArchivos(_G_ID_, espacio) {
    var FilesAdded = new Array();
    bandera = true;
    $(_G_ID_ + espacio + ' input').each(function (i, item) {
        if (item.type === 'file' && item.value !== '') {
            if (FilesAdded.indexOf(item.value) !== -1) {
                redLabel_Space(item.name, 'El archivo ya se encuentra cargado en otro requisito', _G_ID_);
                bandera = false;
            }
            FilesAdded.push(item.value);
        }
    });
    return bandera;
}

//función para validar la extensión del archivo
function validaExtensionArchivo(file, Nombre, ActualLement) {
    var val = $('#' + ActualLement + '_txt_' + Nombre).val();
    if (val && val !== '') {
        var tipoArch = $('#' + ActualLement + '_txt_' + Nombre).attr('accept');
        var tipoAA = file.name;
        tipoAA = tipoAA.split('.');
        var tamtipoAA = tipoAA.length;
        tipoAA = tipoAA[tamtipoAA - 1];


        if (!(tipoAA).toUpperCase().replace('.', '').includes(tipoArch.replace('.', '').toUpperCase())) {
            redLabel_Space(Nombre, 'El archivo debe ser' + tipoArch.toUpperCase(), _G_ID_);
            return false;
        }
    }
    return true;
}

//función que valida el límite de un campo númerico
function validaRango(Nombre, _G_ID_, rango) {
    value = $('#' + ActualLement + '_txt_' + Nombre).val();
    if (value < rango[0]) {
        redLabel_Space(Nombre, 'El rango mínimo deber se de ' + rango[0], _G_ID_);
        ShowAlertM(_G_ID_, null, null, true);
        return false;
    } else {
        if (value > rango[1]) {
            redLabel_Space(Nombre, 'El rango máximo deber se de ' + rango[1], _G_ID_);
            ShowAlertM(_G_ID_, null, null, true);
            return false;
        }
    }
    return true;
}

function validaDecimal(Nombre, _G_ID_) {

    cValue = $('#' + ActualLement + '_txt_' + Nombre).val();
    if (!cValue.includes('.')) {
        redLabel_Space(Nombre, 'Solo se permiten números decimales', _G_ID_);

        return false;
    }
    return true;
}

function DisableCopyPaste(element) {
    $(element).on("cut copy paste", function (e) {
        var message = "No se permite copiar y pegar contenido en este campo";
        ShowAlertM(_G_ID_, message, 'danger', false);
        e.preventDefault();
    });
}

function SetTooltip(_G_ID_, name, message) {
    $(_G_ID_ + 'tooltip_' + name).attr('title', message);

    // $('[data-toggle="tooltip"]').tooltip();
    $(_G_ID_ + 'tooltip_' + name).tooltip();
}

function arr_diff(a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

/*valida en tiempo real el tipo de archivo */
function validaCampoFilePrev(Nombre, ActualLement, espacio) {
    // errorIs = Array();

    $('#' + ActualLement + '_txt_' + Nombre).change(function () {

        resetCampo(Nombre, '#' + ActualLement);
        validaCampoFileInsavePrev(Nombre, ActualLement, espacio);
        var OBJ_Campo = document.getElementById(ActualLement + '_txt_' + Nombre);
        if (OBJ_Campo.type == 'file') {

            var reader = new FileReader();
            reader.readAsDataURL(OBJ_Campo.files[0]);
            reader.onloadend = function () {
                allCamposB64[OBJ_Campo.name] = reader.result;

            };
        }

    });
}

/* * valida el tipo de archivo prevencion*/
function validaCampoFileInsavePrev(Nombre, ActualLement, espacio) {
    var ID = document.getElementById(ActualLement + '_txt_' + Nombre);
    var file = ID.files[0];
    var errorIs2 = false;
    var tipoArch = $('#' + ActualLement + '_txt_' + Nombre).attr('accept');
    var MaxTam = $('#' + ActualLement + '_txt_' + Nombre).attr('maxtam');
    var espacio = espacio !== undefined ? espacio : '_S_solicitud_datos';
    if (!MaxTam) {
        MaxTam = 10;
    }
    if (!tipoArch) {
        tipoArch = '.pdf';
    }
    var FilesAdded = new Array();
    var _G_ID_ = '#' + ActualLement;
    if (tipoArch.toUpperCase().includes('PDF')) {
        var reader = new FileReader(file);
        reader.onload = function (event) {
            var text = reader.result;
            var firstLine = text.split('\n').shift(); // first line
            if (!(firstLine.toString().toUpperCase().includes('PDF'))) {
                redLabel_Space(Nombre, 'El archivo es invalido o no es PDF', _G_ID_);
                errorIs2 = true;
            }
        }
        reader.readAsText(file, 'UTF-8');
    }
    if (file.size > (MaxTam * 1024 * 1024)) {
        redLabel_Space(Nombre, 'El archivo no debe superar los ' + MaxTam + ' MB', _G_ID_);
        errorIs2 = true;
    }
    if (!ValidateAlphanumeric((file.name).replace('.', ''))) {
        redLabel_Space(Nombre, 'El nombre del archivo no debe contener caracteres especiales', _G_ID_);
        errorIs2 = true;
    }
    $(_G_ID_ + espacio + ' input').each(function (i, item) {
        if (item.type === 'file' && item.value !== '') {
            if (FilesAdded.indexOf(item.value) !== -1) {
                redLabel_Space(item.name, 'El archivo ya se encuentra cargado en otro requisito', _G_ID_);
                errorIs2 = true;
            }
            FilesAdded.push(item.value);
        }
    });
    if (file.size <= (0)) {
        redLabel_Space(Nombre, 'El archivo no es valido', _G_ID_);
        errorIs2 = true;
    }


    var tipoAA = file.name;
    tipoAA = tipoAA.split('.');
    var tamtipoAA = tipoAA.length;
    tipoAA = tipoAA[tamtipoAA - 1];


    if (!(tipoAA).toUpperCase().replace('.', '').includes(tipoArch.replace('.', '').toUpperCase())) {
        redLabel_Space(Nombre, 'El archivo debe ser' + tipoArch.toUpperCase(), _G_ID_);
        errorIs2 = true;
    }
    setTimeout(function () {
        if (errorIs2) {
            ShowAlertMPrev(_G_ID_, null, null, true);
        }
        errorIs[Nombre] = errorIs2;
        return errorIs2;
    }, 1000);
}

/* Crea nueva alerta prevencion */
function ShowAlertMPrev(_G_ID_, Msj, C_name, Deft) {

    if (Deft) {
        $(_G_ID_ + 'Alerta_S_prev').html('<div class="alert alert-danger" >' +
            '            <button type="button" class="close" onclick="javascript:HideAlertMPrev(_G_ID_)" id="_btn_Closealertprev">x</button>' +
            '            <span id=""><b>¡Error de Registro!</b> Verifica la información que se solicita</span>' +
            '        </div>');
    } else {
        $(_G_ID_ + 'Alerta_S_prev').html('<div class="alert alert-' + C_name + '" >' +
            '            <button type="button" class="close" onclick="javascript:HideAlertMPrev(_G_ID_)">x</button>' +
            '            <span id="">' + Msj + '</span>' +
            '        </div>');
    }
    $(_G_ID_ + '_btn_Closealertprev').click(function () {
        HideAlertMPrev();
    });
    ScrollingTo(_G_ID_ + 'Alerta_S_prev');
    HideAlertM();
    $('#modalPrev').animate({scrollTop: 0}, 'slow');
}

/* Elimina alerta  prevencion */
function HideAlertMPrev(_G_ID_) {
    $(_G_ID_ + 'Alerta_S_prev').html('');
}

function TodayNow() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

function GetUbicationMap(Arreglo) {

    var lat_deg = Number(Arreglo[2]);
    var lat_min = Number(Arreglo[3]);
    var lat_sec = Number(Arreglo[4]);
    var lat_dir = 'N';

    var long_deg = Number(Arreglo[5]);
    var long_min = Number(Arreglo[6]);
    var long_sec = Number(Arreglo[7]);
    var longituddir = 'W';
    var latitude_sign = -1;
    if (lat_dir === "N") {
        latitude_sign = 1;
    }

    var latitude = (lat_deg + (lat_min / 60.0) + (lat_sec / 60.0 / 60.0)) * latitude_sign;
    var longitude_sign = -1;
    if (longituddir === "E") {
        longitude_sign = 1;
    }
    var longitude = (long_deg + (long_min / 60.0) + (long_sec / 60.0 / 60.0)) * longitude_sign;
    window.open(href = "http://maps.google.com/?q=" + latitude + ',' + longitude);

}

function InfiniteTRYCATCH(F_, Count) {

    if (F_ && $.isFunction(F_)) {
        if (!Count) {
            Count = 1;
        }
        setTimeout(function () {
            try {
                F_();
            } catch (e) {
                console.warn('Infinite TRYCATCH intent ' + Count, e);
                Count++;
                InfiniteTRYCATCH(F_, Count);
            }
        }, 500);
    } else {
        console.warn('No try catch function');
        return false;
    }
}

function SetStepProgress(X) {

    $('#Step_Progresss').html(' <div class="progress-bar  bg-info progress-bar-animated " role="progressbar"' +
        '                         style="width: ' + X + '%;"' +
        '                         aria-valuenow="' + X + '"' +
        '                         aria-valuemin="0"' +
        '                         aria-valuemax="100">' + X + '%' +
        '                    </div>');

}

var transformUTF2HTML = function (TXT) {
    TXT = TXT.replace(/ó/g, '&oacute;');
    TXT = TXT.replace(/á/g, '&aacute;');
    TXT = TXT.replace(/é/g, '&eacute;');
    TXT = TXT.replace(/í/g, '&iacute;');
    TXT = TXT.replace(/ú/g, '&uacute;');
    TXT = TXT.replace(/Á/g, '&Aacute;');
    TXT = TXT.replace(/É/g, '&Eacute;');
    TXT = TXT.replace(/Í/g, '&Iacute;');
    TXT = TXT.replace(/Ó/g, '&Oacute;');
    TXT = TXT.replace(/Ú/g, '&Uacute;');
    TXT = TXT.replace(/ñ/g, '&ntilde;');
    TXT = TXT.replace(/Ñ/g, '&Ntilde;');
    TXT = TXT.replace(/¡/g, '&iexcl;');
    return TXT;
};

function getUserIP(onNewIP) {
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function () {
        },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function (reason) {
        console.warn('reason', reason);
    });

    //listen for candidate events
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

function getLocalIP() {
    return new Promise(function (resolve, reject) {
        // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
        var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

        if (!RTCPeerConnection) {
            reject('Your browser does not support this API');
        }

        var rtc = new RTCPeerConnection({iceServers: []});
        var addrs = {};
        addrs["0.0.0.0"] = false;

        function grepSDP(sdp) {
            var hosts = [];
            var finalIP = '';
            sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                    var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                        addr = parts[4],
                        type = parts[7];
                    if (type === 'host') {
                        finalIP = addr;
                    }
                } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                    var parts = line.split(' '),
                        addr = parts[2];
                    finalIP = addr;
                }
            });
            return finalIP;
        }

        if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
            rtc.createDataChannel('', {reliable: false});
        }
        ;

        rtc.onicecandidate = function (evt) {
            // convert the candidate to SDP so we can run it through our general parser
            // see https://twitter.com/lancestout/status/525796175425720320 for details
            if (evt.candidate) {
                var addr = grepSDP("a=" + evt.candidate.candidate);
                resolve(addr);
            }
        };
        rtc.createOffer(function (offerDesc) {
            rtc.setLocalDescription(offerDesc);
        }, function (e) {
            console.warn("offer failed", e);
        });
    });
}

function debug() {
    console.log("entrado a debug");
}

function CutDecimal(number, decimals) {
    if (!decimals) {
        decimals = 2;
    }

    if (number.toString().includes('.')) {

        var cad = number.toString();
        var Arr = cad.split('.');

        if (Arr[1].length > decimals) {
            cad = Arr[1].substr(0, decimals)

            return (Arr[0] + '.' + cad).toString();
        } else {

            cad = Arr[1].toString();
            var F = decimals - Arr[1].length;

            for (var i = 0; i < F; i++) {
                cad = cad + '0';
            }
            return (Arr[0] + '.' + cad).toString();
        }
    } else {
        if (Number(decimals) === 0) {

            var X = Math.trunc(Number(number));
            return X.toString();
        } else {

            var cad = number.toString();
            cad = cad + '.';
            for (var i = 0; i < decimals; i++) {
                cad = cad + '0';
            }
            return (cad).toString();
        }
    }
}

function LlenaGlobalJsonUsr() {

    getLocalIP().then(function (ip) {
        GlobalJSONClient.LocalIp = ip;
    }).catch(function (err) {
        GlobalJSONClient.LocalIp = '127.0.0.1';
    });

    $.getJSON('http://ipinfo.io', function (data) {
        GlobalJSONClient.RemoteIp = data.ip;
        GlobalJSONClient.City = data.city;
        GlobalJSONClient.Country = data.country;
        GlobalJSONClient.LocationIP = data.loc.split(',');
        GlobalJSONClient.ISP = data.org;
        GlobalJSONClient.CP = data.postal;
        GlobalJSONClient.Region = data.region;

    });


    GlobalJSONClient.UserAgent = client.getUserAgent().replace(/,/g, '');
    GlobalJSONClient.Browser = client.getBrowser();
    GlobalJSONClient.BrowserVersion = client.getBrowserVersion();
    GlobalJSONClient.Engine = client.getEngine();
    GlobalJSONClient.OS = client.getOS();
    GlobalJSONClient.OSVersion = client.getOSVersion();
    GlobalJSONClient.CPU = client.getCPU();
    GlobalJSONClient.TimeZone = client.getTimeZone();
    GlobalJSONClient.Lang = client.getLanguage();


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            GlobalJSONClient.UserLat = position.coords.latitude;
            GlobalJSONClient.UserLong = position.coords.longitude;
        });
    }
}


function GetGlobalJsonUsr(screen, call) {
    var LaFecha = new Date();
    var diasemana = LaFecha.getDay();
    var FechaCompleta = "";
    var NumeroDeMes = "";
    var hora = LaFecha.getHours()
    var minuto = LaFecha.getMinutes()
    var segundo = LaFecha.getSeconds()

    NumeroDeMes = LaFecha.getMonth();
    FechaCompleta = "__" + LaFecha.getDate() + "__" + hora + "_" + minuto + "_" + segundo;


    GlobalJSONClient.Screen = screen;
    GlobalJSONClient.Request = call;
    GlobalJSONClient._FingerPrint = client.getFingerprint() + FechaCompleta;

    if (showCtrlKey) {
        return JSON.stringify(GlobalJSONClient);
    } else {
        return 'SCT_key_DATA_';
    }
}
