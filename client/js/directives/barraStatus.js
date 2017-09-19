app.directive('barraStatus', function($location, loginService) {
	var ddo = {};

	ddo.restrict = "AE";
	ddo.transclude = true;

	ddo.scope = {
		usuario: '='
	};

	ddo.templateUrl = 'js/directives/templates/barraStatus.html';

	ddo.link = function(scope, element, attrs){
		var html_click_avail = true;
		$("html").on("click", function(){
        	if(html_click_avail)
            	$(".x-navigation-horizontal li,.x-navigation-minimized li").removeClass('active');        
    	});        

    	$(window).resize(function(){
		    x_navigation_onresize();
		    page_content_onresize();
		});

		x_navigation_onresize();    
		page_content_onresize();
		initX_navigation();

		initMessageBoxLogoutControl(scope);
	}


	var initMessageBoxLogoutControl = function(scope){
		$(".mb-control").on("click",function(){
	        var box = $($(this).data("box"));
	        if(box.length > 0){
	            box.toggleClass("open");
	        }        
	        return false;
	    });
	    $(".mb-control-logout").on("click",function(){
	    	loginService.logout();
	    	scope.$apply();
	       $(this).parents(".message-box").removeClass("open");
	       return false;
	    });
	    $(".mb-control-close").on("click",function(){
	       $(this).parents(".message-box").removeClass("open");
	       return false;
	    });
	}

	return ddo;
});