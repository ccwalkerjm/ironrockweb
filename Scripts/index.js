var g_ironrock_service; // = new ironrockcloudservice()


var _$message;

//manage query strings
function getQueryStringParams(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}


//loader
function setLoadingState(loadingState) {
    if (loadingState)
        $("body").addClass("loading");
    else
        $("body").removeClass("loading");
}

//convert to json without error
function ConvertToJson(r) {
    try {
        while (true) {
            r = JSON.parse(r);
        }
    } catch (e) {
        // not json
    }
    return r;
}

//convert form to json///
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


//display message
function display(message, err) {
    _$message.removeAttr('class');
    if (err) {
        _$message.addClass('alert alert-warning');
        message = '<strong>Error:</strong>' + message;
    } else {
        _$message.addClass('alert alert-info');
        message = '<strong>Message:</strong>' + message;
    }
    _$message.html(message).fadeIn().delay(10000).fadeOut();
}

function initPage(callback) {
    //set message
    _$message = $(document).find('.message');

    //spinning loader
    $(document).on({
        ajaxStart: function() {
            $("body").addClass("loading");
        },
        ajaxStop: function() {
            $("body").removeClass("loading");
        }
    });
    setLoadingState(true);


    g_ironrock_service = new ironrockcloudservice(function(err, $this) {
        setLoadingState(false);
        if (err) {
            g_ironrock_service.signoff();
            location.assign('/index.html');
            return;
        }
        var sideBarAnchor = $("<div/>").addClass('page-sidebar navbar-collapse collapse');
        var sideBarMenu = $('<ul/>').addClass('page-sidebar-menu');
        var sidebarmenuToggler = $('<li/>').addClass('sidebar-toggler-wrapper').html('<div class="sidebar-toggler hidden-phone"></div>');
        sidebarmenuToggler.appendTo(sideBarMenu);
        var HomeMenuOption = $('<li/>').addClass('start');
        var HomeMenoOptionLink = $('<a/>').html('<i class="fa fa-home"></i>');
        var HomeMenuTitle = $('<span/>').addClass('title');
        //
        var UserMenuOption = $('<li/>');
        var UserMenoOptionLink = $('<a/>').attr('href', '#').html('<i class="fa fa-user"></i>');
        var UserMenuTitle = $('<span/>').addClass('title');
        var UserSubMenu = $('<ul/>').addClass('sub-menu');
        //
        var quoteMenuOption = $('<li/>');
        var quoteMenuOptionLink = $('<a/>').attr('href', '#').html('<i class="fa fa-briefcase"></i>');
        var quoteMenuTitle = $('<span/>').addClass('title').text('Quotes');
        //
        var policyMenuOption = $('<li/>');
        var policyMenuOptionLink = $('<a/>').attr('href', '#').html('<i class="fa fa-briefcase"></i>');
        var policyMenuTitle = $('<span/>').addClass('title').text('Policies');
        //
        var adminMenuOption = $('<li/>');
        var adminMenoOptionLink = $('<a/>').attr('href', '#').html('<i class="fa fa-cogs"></i>');
        var adminMenuTitle = $('<span/>').addClass('title').text('Admin');
        var adminSubMenu = $('<ul/>').addClass('sub-menu').html('' +
            '<li><a href="/Admin/manage_sources.html">Sources</a></li>' +
            '<li><a href="/Admin/manage_brokers.html">Brokers</a></li>' +
            '<li><a href="/Admin/manage_notifications.html">Notifications</a></li>' +
            '<li><a href="/Admin/manage_users.html">Agents</a></li>');

        var valid_page = false;
        if ($this.getUsername()) {
            valid_page = true;

            //Home Option
            HomeMenoOptionLink.attr('href', '/dashboard.html');
            HomeMenuTitle.text('Dashboard').appendTo(HomeMenoOptionLink);
            HomeMenoOptionLink.appendTo(HomeMenuOption);

            sideBarMenu.append(HomeMenuOption);


            //Quotes Option
            quoteMenuOptionLink.append(quoteMenuTitle).append('<span class="arrow "></span>');
            quoteMenuOption.append(quoteMenuOptionLink);
            quoteMenuOption.append('<ul class="sub-menu">' +
                '<li><a href="/Insurance/quotes.html?section=createQuote">Prepare Quote</a></li>' +
                '<li><a href="/Insurance/quotes.html">Find Quotes</a></li></ul>');
            sideBarMenu.append(quoteMenuOption);
            //Quotes Option
            policyMenuOptionLink.append(policyMenuTitle).append('<span class="arrow "></span>');
            policyMenuOption.append(policyMenuOptionLink);
            policyMenuOption.append('<ul class="sub-menu">' +
                '<li><a href="/Insurance/policies.html">Policies</a></li></ul>');
            sideBarMenu.append(policyMenuOption);


            //User
            UserMenuTitle.text($this.getUsername());
            UserSubMenu.html('<li><a href="/profile.html">View Profile</a></li><li><a href="/changePassword.html">Change Password</a></li><li><a href="#"id="logout">Logout</a></li>');

            UserMenoOptionLink.append(UserMenuTitle).append('<span class="arrow "></span>');
            UserMenuOption.append(UserMenoOptionLink).append(UserSubMenu);

            sideBarMenu.append(UserMenuOption);

            var profile = $this.getProfile();

            //admin and set broker logo
            if (profile.role == 'Admin' || profile.role == 'Staff') {
                adminMenoOptionLink.append(adminMenuTitle).append('<span class="arrow "></span>');
                adminMenuOption.append(adminMenoOptionLink).append(adminSubMenu);
                sideBarMenu.append(adminMenuOption);
            }
            var logo = $('#logo');
            if (profile.brokerDetails && profile.brokerDetails.logo) {
                logo.attr('src', profile.brokerDetails.logo);
                logo.attr("style", "margin-top:-20px");
                logo.height(60);
                logo.parent().after('<div class="pull-right">Powered By<img src="/assets/img/logo.png" alt="" class="img-responsive" /></div>');
            } else {
                logo.attr('src', "/images/IronRockLogo.png");
                logo.attr("style", "margin-top:-10px");
                logo.height(50);
            }
        } else if (location.pathname == '/index.html' ||
            location.pathname == '/login.html' ||
            location.pathname == '/forgotPassword.html' ||
            location.pathname == '/confirmAccount.html') {

            valid_page = true;
            //Home Option
            HomeMenoOptionLink.attr('href', '/index.html');
            HomeMenuTitle.text('Home').appendTo(HomeMenoOptionLink);
            HomeMenoOptionLink.appendTo(HomeMenuOption);

            sideBarMenu.append(HomeMenuOption);
            //User
            UserSubMenu.html('<li><a href="/login.html">Login</a><li><a href="/forgotPassword.html">Forgot Password</a>');

            UserMenoOptionLink.append(UserMenuTitle.text('User Login')).append('<span class="arrow "></span>');
            UserMenuOption.append(UserMenoOptionLink).append(UserSubMenu);

            sideBarMenu.append(UserMenuOption);
        }
        if (valid_page === true) {
            $('#sidebar').append(sideBarAnchor.append(sideBarMenu));
            App.init();
            if (callback && typeof callback == "function") {
                callback(null, $this);
            }
        } else {
            location.assign('/index.html');
        }
    });


    $('#sidebar').on('click', '#logout', function() {
        g_ironrock_service.signoff();
        location.assign('/index.html');
    });

}
