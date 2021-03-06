$.validator.addMethod(  
  "date",  
  function(value, element) {  
       var check = false;  
       var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;  
       if( re.test(value)){  
            var adata = value.split('/');  
            var gg = parseInt(adata[0],10);  
            var mm = parseInt(adata[1],10);  
            var aaaa = parseInt(adata[2],10);  
            var xdata = new Date(aaaa,mm-1,gg);  
            if ( ( xdata.getFullYear() == aaaa ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == gg ) )  
                 check = true;  
            else  
                 check = false;  
       } else  
            check = false;  
       return this.optional(element) || check;  
  },  
  "Insira uma data válida"  
);  

$.validator.setDefaults({
	// Set validator to NOT ignore hidden selects
    ignore: ':not(select:hidden, input:visible, textarea:visible)',
    errorPlacement: function(error, element) {
        if (element.hasClass('select')){

          if (element.hasClass('error')){
            element.parent().find('.bootstrap-select').first().addClass('error');            
          }
          error.insertAfter(element.parent().find('.bootstrap-select').first());

          // Ativa evento para manipular validação na alteração do controle
          element.unbind('change.validation').on('change.validation', function(){
            if (!element.val()){
              element.parent().find('.bootstrap-select').first().addClass('error');
              error.insertAfter(element.parent().find('.bootstrap-select').first());
            }
            else{
              element.removeClass('error');
              element.parent().find('.bootstrap-select').first().removeClass('error');
              error.remove();
            }
          });
        }
        else if(element.parent('.input-group').length){
          error.insertAfter(element.parent('.input-group'));
        }
        else{
        	error.insertAfter(element);
        }
    }
});

$.extend($.validator.messages, {
	required: "Campo obrigatório.",
	remote: "Por favor, corrija este campo.",
	email: "Por favor, forne&ccedil;a um endere&ccedil;o de email v&aacute;lido.",
	url: "Por favor, forne&ccedil;a uma URL v&aacute;lida.",
	date: "Por favor, forne&ccedil;a uma data v&aacute;lida.",
	dateISO: "Por favor, forne&ccedil;a uma data v&aacute;lida (ISO).",
	number: "Por favor, forne&ccedil;a um n&uacute;mero v&aacute;lido.",
	digits: "Por favor, forne&ccedil;a somente d&iacute;gitos.",
	creditcard: "Por favor, forne&ccedil;a um cart&atilde;o de cr&eacute;dito v&aacute;lido.",
	equalTo: "Por favor, forne&ccedil;a o mesmo valor novamente.",
	extension: "Por favor, forne&ccedil;a um valor com uma extens&atilde;o v&aacute;lida.",
	maxlength: $.validator.format("Por favor, forne&ccedil;a n&atilde;o mais que {0} caracteres."),
	minlength: $.validator.format("Por favor, forne&ccedil;a ao menos {0} caracteres."),
	rangelength: $.validator.format("Por favor, forne&ccedil;a um valor entre {0} e {1} caracteres de comprimento."),
	range: $.validator.format("Por favor, forne&ccedil;a um valor entre {0} e {1}."),
	max: $.validator.format("Por favor, forne&ccedil;a um valor menor ou igual a {0}."),
	min: $.validator.format("Por favor, forne&ccedil;a um valor maior ou igual a {0}."),
	nifES: "Por favor, forne&ccedil;a um NIF v&aacute;lido.",
	nieES: "Por favor, forne&ccedil;a um NIE v&aacute;lido.",
	cifEE: "Por favor, forne&ccedil;a um CIF v&aacute;lido."
});