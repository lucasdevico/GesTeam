app.directive('ngModelStatus', function($location, $rootScope, $route, statusService) {
    var ddo = {};
    
    ddo.restrict = "A";
    ddo.transclude = true;
    
    ddo.scope = {
		ngModelStatus: '='
    };

    ddo.replace = true;
    
    ddo.link = function(scope, element, attrs){  
        
        $(element).unbind('change').change(function(){
            var checked = $(element).prop('checked');
            statusService.listar('GENERICO').then(function(response){
                var lstStatus = response.data;

                scope.ngModelStatus = $.grep(lstStatus, function(x){
                    if (checked){
                        return (x.descricao == "Ativo");
                    }
                    else{
                        return (x.descricao == "Inativo");
                    }
                })[0];
            });
        });

    }

    return ddo;    
});