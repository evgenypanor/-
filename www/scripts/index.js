// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var myApp;
var calendarInline;
var $$;
var mainView;
var globalSelectedDate = new Date();

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );
    

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
  

        // Initialize your app
        myApp = new Framework7();

        // Export selectors engine
        $$ = Dom7;

        //jq = jQuery.noConflict();

        mainView = myApp.addView('.view-main', {
            // Because we use fixed-through navbar we can enable dynamic navbar
            dynamicNavbar: true,
            animateNavBackIcon: true
        });

        //mainView.router.reloadPage("Pages/mainPage.html");
        //currentItemId = page.query.itmId;

        myApp.onPageInit('mainPage', function (page) {
            mainView.showToolbar();
            //alert(page.query.selectedDate);
            GetDutyBySelectedDate(globalSelectedDate.toJSON());
            var curDate = globalSelectedDate;
            
            document.getElementById("dutyDate").innerText = formatDate(new Date(curDate.setDate(curDate.getDate() - 1)));
            document.getElementById("dutyDateTitle").innerText = document.getElementById("dutyDate").innerText;
            document.getElementById("calLink").href = document.getElementById("calLink").href + "?selectedDate=" + globalSelectedDate.toJSON();
        });

        globalSelectedDate = new Date();
        GetDutyBySelectedDate(globalSelectedDate.toJSON());
        document.getElementById("dutyDate").innerText = formatDate(globalSelectedDate);// {  today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear();
        document.getElementById("dutyDateTitle").innerText = formatDate(globalSelectedDate);

        myApp.onPageInit('dateChooserPage', function (page) {
            mainView.hideToolbar();

            var monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
            //var dateToSelect;

            //if (globalSelectedDate == null) {
            //    dateToSelect = new Date();
            //}
            //else {
            //    var curDate = globalSelectedDate;
            //    dateToSelect = new Date(curDate.setDate(curDate.getDate() - 1));
            //}
            calendarInline = myApp.calendar({
                container: '#calendar-inline-container',
                //input: "#calendar-date-format",
                //closeOnSelect: true,
                value: [globalSelectedDate],
                weekHeader: true,
                firstDay: 0,
                dateFormat: "dd/MM/yyyy",
                onChange: function (p, values, displayValues) {
                    //var d = new Date(p.
                    //GetDutyBySelectedDate(new Date(p.value[0]).toJSON());
                    var d = new Date(p.value[0]);
                    globalSelectedDate = d;
                    d.setDate(d.getDate() + 1);

                    mainView.router.back(
                        {
                            url: "index.html?selectedDate=" + d.toJSON(),
                            force: true,
                        });
                    //alert('aaa');
                },
                weekendDays: [5, 6],
                dayNames: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
                dayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
                //onlyOnPopover: true,
                toolbarTemplate:
                    '<div class="toolbar calendar-custom-toolbar">' +
                        '<div class="toolbar-inner">' +
                            '<div class="left">' +
                                '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
                            '</div>' +
                            '<div class="center"></div>' +
                            '<div class="right">' +
                                '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
                onOpen: function (p) {
                    $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                    $$('.calendar-custom-toolbar .left .link').on('click', function () {
                        calendarInline.prevMonth();
                    });
                    $$('.calendar-custom-toolbar .right .link').on('click', function () {
                        calendarInline.nextMonth();
                    });
                },
                onMonthYearChangeStart: function (p) {
                    $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                }
            });
        });






        //device back button support
        document.addEventListener("backbutton", function (e) {
            var page = myApp.getCurrentView().activePage;
            myApp.hidePreloader();
            if (page.name == "mainPage") {
                if (!confirm("Do you want to Exit?")) {
                    e.preventDefault();
                }
                else {
                    navigator.app.exitApp();
                }
            }
            else {
                mainView.router.back();
                mainView.showToolbar();
            }
        }, false);



    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();


function formatDate(date) {
    return date.toLocaleDateString("he-IL").replace('.', '/').replace('.', '/');
    //var localDate = new Date(date.toLocaleDateString("he-IL"));
    //var formattedDate;
    ////today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear();
    //if (localDate.getDay() < 10) {
    //    formattedDate = "0" + localDate.getDay();
    //}
    //else {
    //    formattedDate = localDate.getDay();
    //}

    //formattedDate += "/";

    //if (localDate.getMonth() < 10) {
    //    formattedDate += "0" + localDate.getMonth();
    //}
    //else {
    //    formattedDate += localDate.getMonth();
    //}

    //formattedDate += "/" + localDate.getFullYear();

    //return formattedDate;
}

function GetDutyBySelectedDate(dateVal) {
    try {
        handleLoadStarted();
        var viewModel;
        var eventsModel;

        $$.getJSON('https://www5.tel-aviv.gov.il/TlvServices/TLVDutyService/TLVDutyService.svc/getdatabydate?dateValue=' + dateVal, {}, function (data, status, xhr) {
        //$$.getJSON('http://localhost/TLVDutyService/TLVDutyService.svc/getdatabydate?dateValue=' + dateVal, {}, function (data, status, xhr) {
            if (status == '200') {
                viewModel = data.GetDataByDateResult;
                eventsModel = viewModel.Details;
                if (eventsModel.length == 0) {
                    eventsModel = [{
                        Description: 'אין נתונים להצגה',
                        Details: ''
                    }];
                }
                document.getElementById('manager').innerText = viewModel.EventManager;
                var managerPh = PhoneGrabber(viewModel.EventManagerPhone);
                if (managerPh != null) {
                    document.getElementById('managerPhone').innerHTML = viewModel.EventManagerPhone.replace(managerPh, '<a onClick=\"MakePhoneCall(\'' + managerPh + '\');\">' + managerPh + '</a>');
                }
                else {
                    document.getElementById('managerPhone').innerText = viewModel.EventManagerPhone;
                }
                //$$('.manager').html('חיחליח');
                var myList = myApp.virtualList('.duty-items-list', {
                    // Array with items data
                    items: eventsModel,
                    //height: function (item) {
                    //    return 60;
                    //},
                    renderItem: function (index, item) {
                        return '<li><a class="item-content item-link" onClick=\"ShowFullDetails(\'' + item.Description + '\', \'' + item.Details + '\');\"">' +
                                      '<div class="item-inner" >' +
                                        //'<div class="item-title-row">' +
                                            '<div class="item-title">' + item.Description + '</div>' +
                                        //'</div>' +
                                        '<div class="item-title">' + item.Details + '</div>' +
                                      //'<div class="item-title"><a onClick=\"MakePhoneCall(\'' + item.PhoneNumber + '\');\">' + item.PhoneNumber + '</a></div>' +
                                      '</div>' +
                               '</a></li>';
                    },
                    searchAll: function (query, items) {
                        var foundItems = [];
                        for (var i = 0; i < items.length; i++) {
                            // Check if title contains query string
                            if (items[i].Description.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 ||
                                items[i].Details.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0) {
                                foundItems.push(i);
                            }
                        }
                        // Return array with indexes of matched items
                        return foundItems;
                    }
                });

                var mySearchbar = myApp.searchbar('.searchbar', {
                    searchList: '.request-items-list',
                    searchIn: '.item-title-serachable'
                });
                //mylist.params.height = 50;
                //myList.update();
            }
            else {
                alert('Error loading data');
            }
            handleLoadFinished();
        });
    }
    catch (err) {
        handleLoadFinished();
        alert('error ' + err.message);
    }
}

function PhoneGrabber(inputString) {
    var ret;
    var arr;
    arr = inputString.match(/\d+/);

    if (arr == null)
        return null;
    else
        return arr[0];

    //return inputString;
}

var modalDeatils;

function ShowFullDetails(desc, details) {
    var phoneNum = PhoneGrabber(details);
    if (phoneNum != null) {
        details = details.replace(phoneNum, '<a onClick=\"MakePhoneCall(\'' + phoneNum + '\');\">' + phoneNum + '</a>');
    }
    modalDeatils = myApp.modal(
        {
            title: desc,
            text: details,
            buttons:
                [{
                    text: 'סגור',
                    onClick: function () {
                        //myApp.alert('You clicked first button!')
                    }
                }]
        });
                    
    //myApp.alert(details, desc);
}

function MakePhoneCall(phoneNum) {
    myApp.closeModal(modalDeatils);
    myApp.confirm('לחייג ל ' + phoneNum, 'חיוג לכונן',
      function () {
          
          window.plugins.CallNumber.callNumber(function success() { }, function onError(err) { alert(err); }, phoneNum, true);
      },
      function () {
         
      }
    );
}

function handleLoadStarted() {
    myApp.showPreloader();
}

function handleLoadFinished() {
    myApp.hidePreloader();
}
