/*
DON'T USE THIS!!!!
 */



/**
 * jQuery SHA1 hash algorithm function
 *
 *      <code>
 *              Calculate the sha1 hash of a String
 *              String $.sha1 ( String str )
 *      </code>
 *
 * Calculates the sha1 hash of str using the US Secure Hash Algorithm 1.
 * SHA-1 the Secure Hash Algorithm (SHA) was developed by NIST and is specified in the Secure Hash Standard (SHS, FIPS 180).
 * This script is used to process variable length message into a fixed-length output using the SHA-1 algorithm. It is fully compatible with UTF-8 encoding.
 * If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag).
 * This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
 *
 * Example.
 *      Code
 *              <code>
 *                      $.sha1("I'm Persian.");
 *              </code>
 *      Result
 *              <code>
 *                      "1d302f9dc925d62fc859055999d2052e274513ed"
 *              </code>
 *
 * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
 * @link http://www.semnanweb.com/jquery-plugin/sha1.html
 * @see http://www.webtoolkit.info/
 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
 * @param {jQuery} {sha1:function(string))
 * @return string
 */

(function($){
    var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    var lsbHex = function(value) {
        var string = "";
        var i;
        var vh;
        var vl;
        for(i = 0;i <= 6;i += 2) {
            vh = (value>>>(i * 4 + 4))&0x0f;
            vl = (value>>>(i*4))&0x0f;
            string += vh.toString(16) + vl.toString(16);
        }
        return string;
    };

    var cvtHex = function(value) {
        var string = "";
        var i;
        var v;
        for(i = 7;i >= 0;i--) {
            v = (value>>>(i * 4))&0x0f;
            string += v.toString(16);
        }
        return string;
    };

    var uTF8Encode = function(string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    $.extend({
        sha1: function(string) {
            var blockstart;
            var i, j;
            var W = new Array(80);
            var H0 = 0x67452301;
            var H1 = 0xEFCDAB89;
            var H2 = 0x98BADCFE;
            var H3 = 0x10325476;
            var H4 = 0xC3D2E1F0;
            var A, B, C, D, E;
            var tempValue;
            string = uTF8Encode(string);
            var stringLength = string.length;
            var wordArray = new Array();
            for(i = 0;i < stringLength - 3;i += 4) {
                j = string.charCodeAt(i)<<24 | string.charCodeAt(i + 1)<<16 | string.charCodeAt(i + 2)<<8 | string.charCodeAt(i + 3);
                wordArray.push(j);
            }
            switch(stringLength % 4) {
                case 0:
                    i = 0x080000000;
                    break;
                case 1:
                    i = string.charCodeAt(stringLength - 1)<<24 | 0x0800000;
                    break;
                case 2:
                    i = string.charCodeAt(stringLength - 2)<<24 | string.charCodeAt(stringLength - 1)<<16 | 0x08000;
                    break;
                case 3:
                    i = string.charCodeAt(stringLength - 3)<<24 | string.charCodeAt(stringLength - 2)<<16 | string.charCodeAt(stringLength - 1)<<8 | 0x80;
                    break;
            }
            wordArray.push(i);
            while((wordArray.length % 16) != 14 ) wordArray.push(0);
            wordArray.push(stringLength>>>29);
            wordArray.push((stringLength<<3)&0x0ffffffff);
            for(blockstart = 0;blockstart < wordArray.length;blockstart += 16) {
                for(i = 0;i < 16;i++) W[i] = wordArray[blockstart+i];
                for(i = 16;i <= 79;i++) W[i] = rotateLeft(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
                A = H0;
                B = H1;
                C = H2;
                D = H3;
                E = H4;
                for(i = 0;i <= 19;i++) {
                    tempValue = (rotateLeft(A, 5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotateLeft(B, 30);
                    B = A;
                    A = tempValue;
                }
                for(i = 20;i <= 39;i++) {
                    tempValue = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotateLeft(B, 30);
                    B = A;
                    A = tempValue;
                }
                for(i = 40;i <= 59;i++) {
                    tempValue = (rotateLeft(A, 5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotateLeft(B, 30);
                    B = A;
                    A = tempValue;
                }
                for(i = 60;i <= 79;i++) {
                    tempValue = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotateLeft(B, 30);
                    B = A;
                    A = tempValue;
                }
                H0 = (H0 + A) & 0x0ffffffff;
                H1 = (H1 + B) & 0x0ffffffff;
                H2 = (H2 + C) & 0x0ffffffff;
                H3 = (H3 + D) & 0x0ffffffff;
                H4 = (H4 + E) & 0x0ffffffff;
            }
            var tempValue = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);
            return tempValue.toLowerCase();
        }
    });
})(jQuery);








(function (apputils, $, undefined)
{
    apputils.appname = "<b>my.</b>eskwela";

    function remtail(str, chr, padding)
    {
        chr= typeof chr !== 'undefined' ? chr : " ";
        padding = typeof padding !== 'undefined' ? padding : " ";
        f = str.split(chr);
        res = "";
        for (i=0; i < f.length - 1; i++)
        {
            res += f[i] + padding;
        }

        return res;
    }

    apputils.exremtail = function(str, chr)
    {
        str = str.split(chr);
        garb = str.pop();
        str = str.join(chr);
        return str;
    }

    function fixtail(str, chr)
    {
        chr= typeof chr !== 'undefined' ? chr : " ";
        f = str.split(chr);
        res = f[0];
        for (i=1; i < f.length - 1; i++)
        {
            res += chr + f[i];
        }

        return res;
    }

    apputils.geticon = function (iconcolor)
    {
        return remtail(iconcolor);
    }

    // apputils.mnudisplayexamoptions = {
    //     ico:"fa fa-pencil",
    //     label: "Exams",
    //     id:"mnudisplayexamoptions"
    // };

        apputils.mnutakeexam = {
        ico:"fa fa-pencil",
        label: "Exams",
        id:"mnutakeexam"
    };

    apputils.mnuenroll = {
        ico:"fa fa-registered",
        label:"Enroll",
        id: "mnuEnroll"
    };

    apputils.mnuregister = {
        ico:"fa fa-pencil",
        label: "Register",
        id:"mnuRegister"
    };

    apputils.mnuswitchsection = {
        ico:"fa fa-arrows-h",
        label: "Switch Section",
        id:"mnuswitchsxn"
    };

    apputils.mnusclasslist = {
        ico:"fa fa-group",
        label: "Class List",
        id:"mnuclasslist"
    };

    apputils.mnussubjects = {
        ico:"fa fa-book",
        label: "Subjects",
        id:"mnusubjects"
    };
    
    apputils.mnureports = {
        ico:"fa",
        label: "Reports",
        id:"mnureports"
    };

    apputils.mnutimeline = {
        ico:"fa fa-clock-o",
        label: "Timeline",
        id:"mnutimeline"
    };

    apputils.mnucalendar = {
        ico: "fa fa-calendar",
        label:"Calendar",
        id:"mnucalendar"
    }

    apputils.mnuchangepass = {
        ico: "fa fa-key",
        label:"Change Password",
        id:"mnuchangepass"
    }


    apputils.mnuuploadpic = {
        ico: "fa fa-camera-retro",
        label: "Upload Image",
        id: "mnuuploadpic"
    }

    apputils.mnuactivate = {
        ico:"fa fa-user-plus",
        label:"Activate Account",
        id: "mnuActivate"
    };

    apputils.mnuclasscard = {
        ico:"fa fa-bolt",
        label:"Class Record",
        id:"mnuclassrecord"
    }


    apputils.mnumykids = {
        ico:"fa fa-odnoklassniki",
        label:"My Student(s)",
        id:"mnumykids"

    }

    apputils.mnuchangesem = {
        ico:"fa  fa-graduation-cap",
        label: "Change School Year",
        id:"mnuchangesemester"
    }

    function isCookie(cname)
    {
        return $.cookie(cname) != undefined && $.cookie(cname).length > 0 &&
            $.cookie(cname) != 'null';
    }


    apputils.islogin = function ()
    {
        return isCookie("username");
    }

    apputils.login = function ()
    {
        username = $("#username").val();
        password = $("#password").val();
        model.verify(username,$.sha1(password));
    }

    apputils.rest = "https://myeskwela-api.herokuapp.com/";


    apputils.dashset = function (data)
    {
        $("#main").html("");
        view.fillinfo(data.userdetails);
        view.compose(data, init);
        view.setprofimg($(data.imgsrc).attr('src'));
    }

    apputils.company = {};

    apputils.customer = {};

    apputils.hauler = {};

    apputils.truck_assignment = {};


    apputils.getAge = function (dateString) {
        //code originally from http://stackoverflow.com/a/10119380

        var yearnow = new Date();

        if (yearnow.getMonth() <= 6)
        {
            var now = new Date(yearnow.getFullYear(), 6, 1);
        }
        else
        {
            var now = yearnow;
        }

        var yearNow = now.getYear();
        var monthNow = now.getMonth();
        var dateNow = now.getDate();

        var dob = new Date(dateString.substring(6,10),
            dateString.substring(0,2)-1,
            dateString.substring(3,5)
        );

        var yearDob = dob.getYear();
        var monthDob = dob.getMonth();
        var dateDob = dob.getDate();

        var yearAge = yearNow - yearDob;

        if (monthNow >= monthDob)
            var monthAge = monthNow - monthDob;
        else {
            yearAge--;
            var monthAge = 12 + monthNow -monthDob;
        }

        if (dateNow >= dateDob)
            var dateAge = dateNow - dateDob;
        else {
            monthAge--;
            var dateAge = 31 + dateNow - dateDob;

            if (monthAge < 0) {
                monthAge = 11;
                yearAge--;
            }
        }

        return yearAge;
    }

    apputils.initboxfields = function (id)
    {
        columns = $($($("#"+id).children()[1]).children()[0]).children();

        for (i=0; i < columns.length; i++)
        {
            colfields = $(columns[i]).children();
            for (j = 0; j < colfields.length; j++)
            {
                $($(colfields[j]).children()[1]).val("");
            }
        }
        $("#sex").change();
        $("#stureligion").change();
    }

    apputils.composeboxfields = function (id)
    {
        columns = $($($("#"+id).children()[1]).children()[0]).children();
        c = '';
        for (i=0; i < columns.length; i++)
        {
            colfields = $(columns[i]).children();
            for (j = 0; j < colfields.length; j++)
            {
                c += $($(colfields[j]).children()[1]).val() + "*";
            }
        }
        return fixtail(c, "*");
    }

    apputils.sex = function (scut)
    {
        if (scut.toUpperCase() == 'M')
        {
            return 'Male';
        }
        else
        {
            return 'Female';
        }

    }

    apputils.formattedDate = function (date) {
        //from http://stackoverflow.com/posts/13460045/revisions
        var d = new Date(date || Date.now()),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [month, day, year].join('-');
    }

    apputils.defaultareaopt =  {
        //Boolean - If we should show the scale at all
        showScale: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve: true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.3,
        //Boolean - Whether to show a dot for each point
        pointDot: false,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a color
        datasetFill: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true
    };


    apputils.defaultbaropt = {
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - If there is a stroke on each bar
        barShowStroke: true,
        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,
        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,
        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        //Boolean - whether to make the chart responsive
        responsive: true,
        maintainAspectRatio: true,
        datasetFill: false
    };

    apputils.linechart = function (id, areaoptions,
                                   data)
    {
        /*

         var data = {
         labels: ["January", "February", "March", "April", "May", "June", "July"],
         datasets: [
         {
         label: "Electronics",
         fillColor: "rgba(210, 214, 222, 1)",
         strokeColor: "rgba(210, 214, 222, 1)",
         pointColor: "rgba(210, 214, 222, 1)",
         pointStrokeColor: "#c1c7d1",
         pointHighlightFill: "#fff",
         pointHighlightStroke: "rgba(220,220,220,1)",
         data: [65, 59, 80, 81, 56, 55, 40]
         },
         {
         label: "Digital Goods",
         fillColor: "rgba(60,141,188,0.9)",
         strokeColor: "rgba(60,141,188,0.8)",
         pointColor: "#3b8bba",
         pointStrokeColor: "rgba(60,141,188,1)",
         pointHighlightFill: "#fff",
         pointHighlightStroke: "rgba(60,141,188,1)",
         data: [28, 48, 40, 19, 86, 27, 90]
         }
         ]
         };

         */
        var lineChartCanvas = $("#" + id).get(0)
            .getContext("2d");
        var lineChart = new Chart(lineChartCanvas);
        var lineChartOptions = areaoptions;
        lineChartOptions.datasetFill = false;
        lineChart.Line(data, lineChartOptions);

    };

    apputils.defaultpieopt =  {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",
        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect
        animationEasing: "easeOutBounce",
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };

    apputils.donutchart = function (id, pieoptions,
                                    data)
    {
        /*
         var PieData = [
         {
         value: 700,
         color: "#f56954",
         highlight: "#f56954",
         label: "Chrome"
         },
         {
         value: 500,
         color: "#00a65a",
         highlight: "#00a65a",
         label: "IE"
         },
         {
         value: 400,
         color: "#f39c12",
         highlight: "#f39c12",
         label: "FireFox"
         },
         {
         value: 600,
         color: "#00c0ef",
         highlight: "#00c0ef",
         label: "Safari"
         },
         {
         value: 300,
         color: "#3c8dbc",
         highlight: "#3c8dbc",
         label: "Opera"
         },
         {
         value: 100,
         color: "#d2d6de",
         highlight: "#d2d6de",
         label: "Navigator"
         }
         ];
         */
        var pieChartCanvas = $("#" + id).get(0).getContext("2d");
        var pieChart = new Chart(pieChartCanvas);
        pieChart.Doughnut(data, pieoptions);
    };

    apputils.barchart = function (id, baroptions,
                                  data, opts)
    {
        /*
         opts = {
         fillColor:"#00a65a",
         strokeColor:"#00a65a",
         pointColor:"#00a65a",
         datasetFill:false
         }
         */
        var barChartCanvas = $("#" + id).get(0).getContext("2d");
        var barChart = new Chart(barChartCanvas);
        var barChartData = data;
        /*
         barChartData.datasets[1].fillColor = "#00a65a";
         barChartData.datasets[1].strokeColor = "#00a65a";
         barChartData.datasets[1].pointColor = "#00a65a";
         */
        barChartData.datasets[0].fillColor = opts.fillColor;
        barChartData.datasets[0].strokeColor = opts.strokeColor;
        barChartData.datasets[0].pointColor = opts.pointColor;
        barChart.Bar(barChartData, baroptions);
    }

    apputils.kto0 = function (par_val)
    {
        grade = 0;
        par_val = par_val.toString();
        if (par_val.toUpperCase().replace(/ /g,"") != 'KINDER')
        {
            grade = par_val;
        }
        return grade;
    }

    apputils.ztok = function (par_val)
    {
        grade = par_val;
        if (par_val==0)
        {
            grade = 'Kinder';
        }
        return grade;
    }

    apputils.switchsection = function (par_section,par_grade)
    {
        $("#name-rightbadge").data("grade", apputils.kto0(
            par_grade
        ));
        $("#name-rightbadge").data("section", par_section);
        if (par_grade == 0)
        {
            par_grade = 'Kinder';
        }
        $("#name-userops").html(
            view.bslabel("info", "Grade " + par_grade) +
            "-" + view.bslabel("info", par_section));

    }

    apputils.publicity = {
        private:0,
        semirestricted:1,
        restricted:2,
        public_:3
    }

    apputils.now = function()
    {
        /*
         CREDIT:
         http://stackoverflow.com/a/12409344
         */
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        return mm+'-'+dd+'-'+yyyy;
    }

    apputils.noww = function ()
    {
        /*
         CREDIT:
         http://stackoverflow.com/a/12409344
         */
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        return yyyy + '/' +mm+'/'+dd;
    }

    apputils.ifundefined = function (var_, defvalue, nullvalue)
    {
        var_ = typeof var_ !== 'undefined' ? defvalue : nullvalue;
        return var_;
    }

    apputils.ifNaN = function (var_, defvalue, nullvalue)
    {
        if (isNaN(var_))
        {
            return nullvalue;
        }

        return defvalue;
    }

    apputils.strtrim = function (x)
    {
        //http://www.w3schools.com/jsref/jsref_trim_string.asp
        return x.replace(/^\s+|\s+$/gm,'');
    }

    apputils.ifstrempy = function(var_, defvalue, nullvalue)
    {
        if (apputils.strtrim(var_).length == 0)
        {
            return nullvalue;
        }
        return defvalue;
    }

    apputils.strtrimta = function (x)
    {
        return apputils.strtrim(x.replace(/&nbsp;/gi,'')
            .replace(/<p>/gi,'')
            .replace(/<\/p>/gi,'')
            .replace(/<br>/gi,''));
    }

    apputils.getcurrentsubjectbuttonprops = function ()
    {
        currentsubject = $("#name-rightbadge").data("sectionid");
        subjects = $("#name-rightbadge").data("subjects");
        for (i in subjects)
        {
            if (subjects[i].sectionid == currentsubject)
            {
                return subjects[i];
            }
        }
        return '';
    }

    apputils.isSubject = function (par_subject)
    {
        try {
            subjects = $("#name-rightbadge").data("subjects");
            for (i in subjects) {
                if (subjects[i].value.toUpperCase() == par_subject.toUpperCase()) {
                    return true;
                }
            }
        }
        catch (e)
        {
            return false;
        }
        return false;
    }

    apputils.getSubjectNo = function (par_subject)
    {
        subjects = $("#name-rightbadge").data("subjects");
        for (i in subjects)
        {
            if (subjects[i].value.toUpperCase() == par_subject.toUpperCase())
            {
                return subjects[i].label.toUpperCase();
            }
        }
        return '';
    }

    apputils.getSubjectNofromOffID = function (par_sectionid)
    {
        subjects = $("#name-rightbadge").data("subjects");
        for (i in subjects)
        {
            if (subjects[i].sectionid.toUpperCase() == par_sectionid.toUpperCase())
            {
                return subjects[i].label.toUpperCase();
            }
        }
        return '';
    }



    apputils.getSectionID = function (par_subject)
    {
        subjects = $("#name-rightbadge").data("subjects");
        for (i in subjects)
        {
            if (subjects[i].value.toUpperCase() == par_subject.toUpperCase())
            {
                return subjects[i].sectionid;
            }
        }
        return '';
    }

    apputils.getNextKey = function(key) {
        //http://stackoverflow.com/a/31540111
        if (/^z+$/.test(key)) {
            // If all z's, replace all with a's
            key = key.replace(/z/g, 'a') + 'a';
        } else {
            // (take till last char) append with (increment last char)
            key = key.slice(0, -1) + String.fromCharCode(key.slice(-1).charCodeAt() + 1);
        }
        return key;
    };

    function to_api(workbook) {
        var result = {};
        categoryscores = [];


        $("#excelresults").html("");
        /*loc_body = '<table id="tblerresults" class="table table-striped"> <tbody>';
         loc_body += '<tr><td>LRN</td><td>Name</td><td>Subject</td><td>Category</td><td>Entry No.</td><td>Result</td></tr>';
         loc_body += '</tbody></table>'*/
        $("#excelresults").append(
            view.simplebox({
                boxtype:"primary",
                title: "Upload found error on the following entry(ies)",
                body: view.table({
                    id:"tblerresults",
                    class:"table-striped",
                    tbodyclass:'',
                    cols: ["LRN", "Name","Subject", "Category","Entry No.", "Result"]
                }),
                footer:''
            })
        );


        workbook.SheetNames.forEach(function(sheetName) {
            var worksheet = workbook.Sheets[sheetName];
            var desiredcell = worksheet['AG7'];
            counter = 1;

            if (typeof desiredcell !== 'undefined')
            {
                categories = [
                    {
                        category:'WRITTEN WORKS',
                        maxitem:10,
                        cellstart: 'f',
                        cellend:'p'
                    },
                    {
                        category:'PERFORMANCE TASKS',
                        maxitem:10,
                        cellstart:'s',
                        cellend:'ac'
                    },
                    {
                        category: 'QUARTERLY ASSESSMENT',
                        maxitem:1,
                        cellstart:'af',
                        cellend:'ag'
                    }];
                if  (apputils.isSubject(desiredcell.v))
                {
                    sectionid = apputils.getSectionID(desiredcell.v);
                    subjectno = apputils.getSubjectNo(desiredcell.v);
                    for (var i = 0; i < categories.length; i++)
                    {
                        var category = categories[i].category;
                        f = function(somevar, undefval)
                        {
                            if (typeof somevar !== 'undefined')
                            {
                                return somevar.v;
                            }
                            return undefval;
                        }

                        entrycount = 0;
                        details = [];
                        for (var j = categories[i].cellstart; j != categories[i].cellend; j = apputils.getNextKey(j)) {
                            var maxscore = f(worksheet[j.toUpperCase() + '10'], 0.00);
                            entrycount++;

                            if (maxscore > 0.0) {
                                for (var k = 12; k < 112; k++) {
                                    student = f(worksheet['B' + k.toString()], '');
                                    score = f(worksheet[j.toUpperCase() + k.toString()], 0.00);
                                    $("#progressmessage").html("Accessing " + sheetName +
                                        " for " + desiredcell.v);
                                    if (student.toString().indexOf('FEMALE') == -1 &&
                                        typeof student == 'string' && student.length > 0) {
                                        details.push({
                                            entrycount:entrycount,
                                            maxscore: maxscore.toString(),
                                            student: student,
                                            score: score.toString()
                                        });


                                    }
                                }

                            }
                        }

                        if (details.length > 0) {
                            categoryscores.push({
                                sectionid: sectionid,
                                category: category,
                                subjectno:subjectno,
                                details: details
                            });
                        }
                    }
                    //apputils.echo(categoryscores);
                    if (categoryscores.length >0)
                    {

                        model.sendexcelcontents({
                            semid:$.cookie("semid"),
                            schoolid: $.cookie("schoolid"),
                            quarter: $.cookie("quarter"),
                            grade: $("#name-rightbadge").data("grade"),
                            section:$("#name-rightbadge").data("section"),
                            records:categoryscores});
                        categoryscores = [];
                    }
                }

            }


            //var desiredvalue = desiredcell.v;
            //
            //apputils.echo(desiredcell);
        });

        $("#progressmessage").html("Done.");
        return result;
    }

    function fixdata(data) {
        var o = "", l = 0, w = 10240;
        for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
        o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
        return o;
    }

    function process_wb(wb) {
        var output = "";
        output = JSON.stringify(to_api(wb), 2, 2);
        return output;
    }

    apputils.readxlsx = function (e)
    {
        var files = e.target.files;

        $("#progressmessage").html("Processing Spreadsheet.");
        $("#xlsuploadicon").removeClass('fa-upload').addClass('fa-refresh fa-spin');


        var f = files[0];
        {
            var reader = new FileReader();
            var name = f.name;
            if (f.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                f.type != "application/vnd.ms-excel")
            {
                $("#progressmessage").html("Unsupported File Type");
                $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                return;
            }
            reader.onload = function (e)
            {

                var data = e.target.result;
                var arr = fixdata(data);
                wb  = XLSX.read(btoa(arr), {type:'base64'});
                try {
                    x = process_wb(wb);
                }
                catch (e)
                {

                    $("#progressmessage").html("Error Occured");
                    $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                }
            }
            reader.readAsArrayBuffer(f);
        }
    }

    apputils.tabtoexcel = function (tableid, fname)
    {

        $("#" + tableid).tableExport({
            type:'excel',
            fileName: fname});
    }

    apputils.drop = function ()
    {
        return 'fa fa-eraser bg-red';
    }

    apputils.reassign = function()
    {
        return 'fa fa-external-link-square bg-fuchsia';
    }

    apputils.enroll = function () {
        return "fa fa-edit bg-aqua";
    }

    apputils.register = function ()
    {
        return "fa fa-street-view bg-green";
    }

    apputils.attendance = function ()
    {
        return "fa fa-child bg-lime";
    }

    apputils.grade = function ()
    {
        return "fa fa-line-chart bg-blue-active";
    }

    apputils.announcement = function ()
    {
        return "fa fa-bullhorn bg-light-blue-gradient";
    }

    apputils.privatemsg = function ()
    {
        return "fa fa-bell bg-gray";
    }

    apputils.assignment = function()
    {
        return "fa fa-book bg-yellow";
    }

    apputils.bulletinboard = function ()
    {
        return "fa fa-quote-left bg-aqua";
    }

    apputils.transfer = function ()
    {
        return  "fa fa-plane bg-green-active";
    }

    apputils.event = function () {
        return "fa fa-calendar-check-o bg-gray"
    }

    apputils.collaborate = function () {
        return "fa fa-code-fork bg-blue";
    }

    apputils.debug = false;

    apputils.echo = function (msg)
    {
        if (apputils.debug)
        {
            console.log(msg);
        }
    }

    apputils.getbutton = function(timelinetype)
    {
        switch (timelinetype) {
            case "Bulletin Board":
                return this.bulletinboard();
            case "drop":
                return this.drop();
            case  "re-assign":
                return this.reassign();
            case "enroll":
                return this.enroll();
            case "register":
                return this.register();
            case "attendance":
                return this.attendance();
            case "grade":
                return this.grade();
            case "announcement":
                return this.announcement();
            case "pm":
                return this.privatemsg();
            case "assignment":
                return this.assignment();
            case "transfer":
                return this.transfer();
            case "event":
                return this.event();
            case "collaborate":
                return this.collaborate();
        }
    }

    apputils.filltimeline = function() {
        view.inittimeline();
        $("#name-rightbadge").data("offset", 0);
        $("#name-rightbadge").data("dow", "");
        model.gettimeline();
    }

    apputils.unscramble = function(par_squabledmessage)
    {
        var decrypted = CryptoJS.AES.decrypt(
            par_squabledmessage,
            $.cookie("msgkey"), {mode:CryptoJS.mode.CFB});
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    apputils.scramble = function(par_unsquabledmessage)
    {
        var encrypted = CryptoJS.AES.encrypt(par_unsquabledmessage,
            $.cookie("msgkey"), {mode:CryptoJS.mode.CFB});
        return encrypted.toString()
    }

    apputils.unscramble2 = function (par_squabledmessage)
    {
        /*
         source: http://stackoverflow.com/a/30990692
         */

        var ciphertext = CryptoJS.enc.Base64.parse(par_squabledmessage);
        // split iv and ciphertext
        var iv = ciphertext.clone();
        iv.sigBytes = 16; //iv = initialization vector
        iv.clamp();
        ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
        ciphertext.sigBytes -= 16;

        var key = CryptoJS.enc.Utf8.parse($.cookie("msgkey"));

        // decryption
        var decrypted = CryptoJS.AES.decrypt({ciphertext: ciphertext}, key, {
            iv: iv,
            mode: CryptoJS.mode.CFB
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    apputils.removehtmltags = function(par_str)
    {

        return $("<div/>").html(par_str).text();
    }



    apputils.checkPassword = function (passwordtext)
    {
        var validated =  true;
        var mistake = '';
        $("#" + passwordtext ).each(function () {

            if(this.value.length < 8)
            {
                validated = false;
                mistake += " Must be at least 8 characters.";
            }
            if(!/\d/.test(this.value))
            {
                validated = false;
                mistake += " Must contain at least 1 digit.";
            }
            if(!/[a-z]/.test(this.value))
            {
                validated = false;
                mistake += " Must contain at least one small character."
            }
            if(!/[A-Z]/.test(this.value))
            {
                validated = false;
                mistake += " Must contain at least one capital character."
            }
            if(/[^0-9a-zA-Z]/.test(this.value))
            {
                validated = false;
                mistake += " Must be a alphanumeric."
            }


        });
        return mistake;
    }

    apputils.maketablerow = function (count, contents)
    {
        tabrow = '<tr>';
        for (var i = 0; i < count; i++)
        {
            tabrow += '<td>' +
                contents[i] +
                '</td>';

        }
        tabrow += '</tr>';
        return tabrow;
    }

    apputils.initarray = function (length, content)
    {
        f = Array(length);
        for (var i=0; i < length; i++)
        {
            f[i] = content;
        }
        return f;
    }

    apputils.makearray = function (length)
    {
        f = Array(length)
        for (var i = 0; i < length; i++)
        {
            f[i] = (i+1);
        }
        return f;
    }

    apputils.maketablehead = function (count, contents)
    {
        tabrow = '<tr>';
        for (var i = 0; i < count; i++)
        {
            tabrow += '<th>' +
                contents[i] +
                '</th>';

        }
        tabrow += '</tr>';
        return tabrow;
    }

    apputils.blankto0 = function (val)
    {
        if (val == '')
        {
            return 0;
        }
        return parseFloat(val);
    }

    apputils.isadviser = function () {
        return $("#name-rightbadge").data("section") != 'none' &&
            $("#name-rightbadge").data("grade") != 'none';
    }


    apputils.getSubjectLevelSection = function (par_offeringid)
    {
        subjects = $("#name-rightbadge").data("subjects");
        for (i in subjects)
        {
            if (subjects[i].sectionid.toUpperCase() == par_offeringid.toUpperCase())
            {
                return subjects[i].level + "-" + subjects[i].section;
            }
        }
        return '';
    }

    apputils.newline = function ()
    {
        return "<br />";
    }

    apputils.space = function (n)
    {
        space = '';
        for (var i=0; i< n; i++)
        {
            space += '&nbsp;';
        }
        return space;
    }

    apputils.poperror = function (par_message)
    {
        new PNotify({
            title: "Info  Access",
            text:par_message,
            type:'error'
        });
    }

    apputils.getCoTeacher = function (par_offeringid)
    {
        subjects = $("#name-rightbadge").data("subjects");
        for (i in subjects)
        {
            if (subjects[i].sectionid.toUpperCase() == par_offeringid.toUpperCase())
            {
                return subjects[i].coteachers;
            }
        }
        return [];
    }

    apputils.soonpath = function (par_picname)
    {
        if (par_picname == 'soon.png')
        {
            return 'dist/img/soon.jpg';
        }
        else
        {
            return par_picname;
        }
    }

    apputils.getIndexID = function (par_offeringid)
    {
        subjects = $("#name-rightbadge").data("subjects");
        for (i in subjects)
        {
            if (subjects[i].sectionid.toUpperCase() == par_offeringid.toUpperCase())
            {
                return i;
            }
        }
        return -1;
    }

    apputils.getIndexOfCollab = function (par_index, par_personnumid)
    {

        coteachers = $("#name-rightbadge")
            .data("subjects")[par_index]
            .coteachers;

        for (var i=0; i < coteachers.length; i++)
        {
            if (coteachers[i].idnum == par_personnumid)
            {
                return i;
            }
        }
      return -1;
    }


    apputils.getSectionID2 = function (par_subject)
    {
        subjects = $("#name-rightbadge").data("subjects");
        for (i in subjects)
        {
            if (subjects[i].label.toUpperCase() + ' ' +
                subjects[i].section.toUpperCase()
                == par_subject.toUpperCase())
            {
                return subjects[i].sectionid;
            }
        }
        return '';
    }


    //apputils.last

} ( window.apputils = window.apputils || {}, jQuery ));

(function (model, $, undefined)
{
    model.loadtimeline = function ()
    {
        data = {
            usertype:"admin",
            userdetails: {name:"Juan Dela Cruz", position: "Manager"},
            imgsrc: "dist/img/user2-160x160.jpg",
            date:"17 September 2015",
            items: [
                {type:"client",timestamp:"11:34", description:"no?"},
                {type:"product",timestamp:"11:35", description:"yes?"},
                {type:"driver",timestamp:"11:36", description:"drive na"}
            ],
            sys: "Error Login"
        }; //data model
        $("#nexttimes").unbind("click");
        $("#user-timeline li:last").remove();
        view.compose(data, false);

    }


    model.updatepassword = function (par_btnid)
    {

        p1stat = apputils.checkPassword("newpassword");
        p2stat = apputils.checkPassword("repeatpassword")

        function checkequal()
        {
            var e = '';

            if ($("#newpassword").val() != $("#repeatpassword").val())
            {
                e = " Password do not match."
            }
            return e;
        }


        if (p1stat.length > 0)
        {
            $("#lblErrorPass").html(view
                .colortext("danger",
                    p1stat +
                    checkequal()));
            return;
        }


        if (p2stat.length > 0)
        {
            $("#lblErrorPass").html(view
                .colortext("danger",
                    p2stat +
                    checkequal()));

            return;
        }

        $.ajax({
            url: apputils.rest + '/auth',
            type:"PUT",
            dataType: "json",
            data: JSON.stringify(
                {
                    password1:$("#newpassword").val(),
                    password2:$("#repeatpassword").val()
                }),
            contentType: 'application/json; charset=utf-8',
            success: function(resp) {
                apputils.echo(resp);
                view.stopspin(par_btnid, "OK");

                if (resp.status == "OK")
                {
                    $.cookie("key", $.sha1($("#newpassword").val()));
                    $("#lblErrorPass").html(view
                        .colortext("info", "Password Updated successfully."));
                    return;
                }
                $("#lblErrorPass").html(view
                    .colortext("danger", resp.message));

                //apputils.echo(resp);
            },
            error: function (e) {
                view.stopspin(par_btnid, "OK");
                $("#lblErrorPass").html(view
                    .colortext("danger", "Something Went Wrong"));
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        }); // ajax
    }

    model.activateacct = function (par_btnid)
    {
        $.ajax({
            url: apputils.rest + '/auth',
            type:"POST",
            dataType: "json",
            data: JSON.stringify(
                {
                    lrn: $("#activatepid").val(),
                    semid: $.cookie("semid"),
                    lastname: $("#activateplname").val(),
                    firstname:  $("#activatepfname").val(),
                    middlename:  $("#activatepfmname").val(),
                    group: $.cookie("usertype")
                }),
            contentType: 'application/json; charset=utf-8',
            success: function(resp) {
                apputils.echo(resp);
                view.stopspin(par_btnid, "Activate");


                if (resp.status == "OK")
                {
                    //
                    if (resp.credentials.username.length > 0)
                    {
                        $("#lblactivate").html(view
                            .colortext("success", "<b>Username:</b>" + resp.credentials.username + "<br/> "+
                                "<b>Password:</b>" + resp.credentials.password +
                                " <br /> Please inform immediately for " +
                                "<u>password and username</u> are <strong>irrecoverable</strong>."));
                        return;
                    }

                    $("#lblactivate").html(view.colortext("success",
                        "Account Created Successfully"));

                    return;
                }
                $("#lblactivate").html(view
                    .colortext("danger", resp.message));

                //apputils.echo(resp);
            },
            error: function (e) {
                view.stopspin(par_btnid, "OK");
                $("#lblactivate").html(view
                    .colortext("danger", "Something Went Wrong"));
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        }); // ajax
    }


    model.sysout = function ()
    {
        var keys = Object.keys($.cookie());
        for (var i=0; i < keys.length; i++)
        {
            var key = keys[i];
            $.cookie(key,null);
        }

        var keys = Object.keys($("#name-rightbadge").data());
        for(var i=0; i < keys.length; i++)
        {
            var key = keys[i];
            $("#name-rightbadge").removeData(key);
        }

        $.ajax({
            url: apputils.rest + '/exit',
            type:"GET",
            dataType: "json",
            success: function(resp) {
                /* if (resp.status  == 'ok') {


                 } else
                 {
                 //$("#errlog").html(view.alertbox("danger", resp.message));
                 }*/
            },
            error: function (e) {
                //$("#errlog").html(view.alertbox("danger", "Something Went Wrong!"));
                //view.logout();
            },
            beforeSend: function (xhrObj){
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") +
                        ":" + $.cookie("key")));
            }
        }); // ajax
    }


    model.verify = function (username, password)
    {

        $.ajax({
            url: apputils.rest + '/auth',
            type:"GET",
            dataType: "json",
            success: function(resp) {
                apputils.echo(resp);
                $("#btnlogin").html("Sign In");
                if (resp.status  == 'ok') {
                    $.cookie("usertype", resp.usertype);
                    $.cookie("token", resp.token);
                    $.cookie("username", username);
                    $.cookie("key", password);
                    $.cookie("tracker", "home");
                    $.cookie("schoolid",resp.userschool.id);
                    $("#schoolname").html(resp.userschool.name);
                    $.cookie("semid", resp.semid);
                    $.cookie("freeid", resp.freeid);
                    $.cookie("quarter", resp.quarter);
                    $("#name-rightbadge").data("mystu", resp.mystu);
                    if (resp.usertype == "students")
                    { $.cookie("lrn", resp.lrn); }
                    $("#name-rightbadge").data("religions", resp.religions);
                    view.mainloading();
                    $("#name-rightbadge").data("nstatus", resp.nstatus);

                    $("#name-rightbadge").data("subjects", []);
                    if (resp.load.length > 0) {


                        load = [];
                        for (var i = 0; i < resp.load.length; i++) {
                            load.push({
                                icon: "fa " + resp.load[i][3],
                                label: resp.load[i][0],
                                value: resp.load[i][1],
                                sectionid: resp.load[i][4],
                                level: resp.load[i][6],
                                section: resp.load[i][5],
                                coteachers: resp.load[i][7].coteachers
                            });
                        }
                        $("#name-rightbadge").data("subjects", load);
                    }


                    apputils.dashset(resp);
                    if (resp.usertype == "parents")
                    {
                        view.mykids();
                    }

                    //btn btn-primary btn-large btn-block btn-flat
                    //$("#btnlogin").removeClass("fa fa-refresh fa-spin");
                    if (typeof resp.designated[0] !== 'undefined') {

                        $("#name-rightbadge").data("sections",resp.designated);
                        $("#name-userops").html(
                            view.bslabel("info", "Grade " + resp.designated[0].grade) +
                            "-" + view.bslabel("info", resp.designated[0].section));
                        $("#name-rightbadge").data("grade", apputils.kto0(
                            grade = resp.designated[0].grade
                        ));
                        $("#name-rightbadge").data("section", resp.designated[0].section);
                    }
                    else
                    {
                        $("#name-rightbadge").data("grade", "none");
                        $("#name-rightbadge").data("section", "none");
                    }
                    $("#logineffects").html("");
                    view.sidemenu(resp.usertype);
                    $("#name-rightbadge").data("offset", 0);

                    //view.sidemenu(resp.usertype);
                } else
                {
                    view.stopspin("btnlogin", "Sign In");
                    $("#errlog").html(view.bslabel("danger", resp.message));
                    //$("#btnlogin").removeClass("fa fa-refresh fa-spin");
                    $("#logineffects").html("");
                }
            },
            error: function (e) {
                apputils.echo(e);
                view.stopspin("btnlogin", "Sign In");
                $("#errlog").html(view.bslabel("danger", "Something Went Wrong!"));
                //$("#btnlogin").removeClass("fa fa-refresh fa-spin");
                $("#logineffects").html("");
            },
            beforeSend: function (xhrObj){
                //$("#btnlogin").addClass("fa fa-refresh fa-spin");
                $("#btnlogin").html(view.spin() + " Pls Wait..");
                //$("#logineffects").html(view.spinner());
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa(username + ":" + password));
            }
        }); // ajax

    }

    function deliveryinputsane(o,attr, ext)
    {
        for (key in o)
        {
            //apputils.echo("#"+o[key]+ext);
            if (o[key] == 'Empty')
            {
                $("#"+key+ext).addClass(attr);
            }
            else
            {
                $("#"+key+ext).removeClass(attr);
            }
        }
    }

    model.getstudetails = function (lrn, schoolid)
    {
        /*
         assumption register student form is displayed.
         */

        $.ajax({
            url: apputils.rest + '/student/' + lrn + '/' + schoolid,
            type:"GET",
            dataType: "json",
            success: function(resp) {
                view.stopspin("ajxstudetails", "Get");
                if (resp.status == "ok")
                {
                    $("#name-rightbadge").data("oldlrn", $("#lrn").val());
                    $("#msglabel").html("");
                    $("#stulastname").val(resp.student.lname);
                    $("#stufirstname").val(resp.student.fname);
                    $("#stumiddlename").val(resp.student.mi);
                    $("#sex").val(apputils.sex(resp.sex));
                    $("#sex").change();
                    $("#stubdate").val(apputils.formattedDate(resp.birthdate));
                    $("#stuage").val(apputils.getAge($("#stubdate").val()));
                    $("#stumothertongue").val(resp.tongue);
                    $("#stuip").val(resp.ip);
                    $("#stureligion").val(resp.religion);
                    $("#stureligion").change();
                    $("#stuhouseno").val(resp.address.streetno);
                    $("#stubrgy").val(resp.address.brgy);
                    $("#stumun").val(resp.address.city);
                    $("#stuprovince").val(resp.address.state);
                    $("#stuzip").val(resp.address.zip);
                    $("#stuflname").val(resp.father.lname);
                    $("#stuffname").val(resp.father.fname);
                    $("#stufmname").val(resp.father.mi);
                    $("#stumlname").val(resp.mother.lname);
                    $("#stumfname").val(resp.mother.fname);
                    $("#stummname").val(resp.mother.mi);
                    $("#stuglname").val(resp.guardian.lname);
                    $("#stugfname").val(resp.guardian.fname);
                    $("#stugmname").val(resp.guardian.mi);
                    $("#fourps").val(resp.moreinfo.conditionalcashtransfer);
                    $("#fourps").change();
                    $("#stunutritionalstatus").val(resp.moreinfo.nutritionalstatus);
                    $("#stunutritionalstatus").change();
                    $("#studisabilities").val(resp.moreinfo.disabilities);
                }
                else
                {
                    apputils.initboxfields("enrollbox");
                    $("#msglabel").html(view.bslabel("danger", resp.message));
                    //apputils.echo(resp.message);
                }

            },
            error: function (e) {
                view.stopspin("ajxstudetails", "Get");
                $("#msglabel").html(view.bslabel("danger", "Error Occured!"));
                apputils.initboxfields("enrollbox");
            },
            beforeSend: function (xhrObj){
                //$("#btnlogin").addClass("fa fa-refresh fa-spin");
                view.setspin("ajxstudetails");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }


        }); // ajax


    }

    model.enrollid = function (par_lrn)
    {
        $("#name-rightbadge")
            .data("enrlrn",
                par_lrn);
        $("#name-rightbadge").data("enrlbtn", 'btn' + par_lrn);
        doEnrolAjx();
    }

    model.enrollsearch = function (par_lrnonly)
    {

        par_lrnonly = typeof par_lrnonly !== "object";

        $.ajax({
            url: apputils.rest + '/student/' +
            $("#enrollsearch").val(),
            type:"GET",
            dataType: "json",
            success: function(resp) {
                view.stopspin("btnerlsearch", "Search");
                $("#enrolerrmessage").html("");
                $("#erlsearchtab tbody").html("");
                $("#erlsearchtab tbody")
                    .append("<tr>" +
                        "<th> LRN No </th>" +
                        "<th> Name </th>" +
                        "</tr>");
                if (resp.status != "ok")
                {
                    $("#enrolerrmessage")
                        .html(view.bslabel("danger",
                            "Something went wrong!")
                        );
                    return;
                }

                if (resp.size == 0)
                {
                    $("#enrolerrmessage")
                        .html(view.bslabel("default",
                            "No Results")
                        );

                    return;
                }

                for (i=0; i < resp.size; i++)
                {
                    loc_row = '<tr>' +
                        '<td>' +
                        function(switch_, resp, i) {
                            apputils.echo(switch_);
                            if (!switch_) {
                                widgt = view.buttonact(
                                        "success btn-xs",
                                        "Enroll",
                                        "model.enrollid('" +
                                        resp.list[i].lrn
                                        + "','btn" +
                                        resp.list[i].lrn +
                                        "'" +
                                        ")"
                                    ) + "&nbsp;" +
                                    view.buttonact(
                                        "info btn-xs",
                                        "Profile",
                                        "model.profile('" +
                                        resp.list[i].lrn
                                        + "','btnsrch" +
                                        resp.list[i].lrn +
                                        "'" +
                                        ")"
                                    );}
                            else
                            {
                                widgt = view.buttonact(
                                    "success btn-xs",
                                    "SET",
                                    "" +
                                    "$('#imguploadlrn').val('"+ resp.list[i].lrn +"');"+
                                    ""
                                );
                            }
                            return widgt;
                        }(par_lrnonly, resp, i) +

                        '</td>' +
                        '<td>' +
                        resp.list[i].fullname +
                        '</td>' +
                        '</tr>';
                    $("#erlsearchtab tbody").append(loc_row);
                }
            },
            error: function (e) {
                view.stopspin("btnerlsearch", "Search");
                $("#enrolerrmessage").html(view.bslabel("danger", "Error Occured!"));
                apputils.initboxfields("enrollbox");
            },
            beforeSend: function (xhrObj){
                //$("#btnlogin").addClass("fa fa-refresh fa-spin");
                view.setspin("btnerlsearch");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }


        });
    }



    model.getstu = function ()
    {
        model.getstudetails($("#lrn").val(), $.cookie("schoolid"));
    }

    function setlrn()
    {
        fields = apputils.composeboxfields("enrollbox").split("*");
        fields.shift();
        fields[0] = $("#lrn").val();
        fields.push($("#name-rightbadge").data("grade"));
        fields.push($("#name-rightbadge").data("section"));
        return fields.join("*");
    }

    model.registerstu = function ()
    {
        if ($("#advisegrade").html() == "none")
        {

            $("#savemsg").html(view.bslabel("danger", "Only advisers can enroll."));
            return;
        }


        $.ajax({
            url: apputils.rest + '/student/'+
            setlrn() + "/" +
            $.cookie("schoolid"),
            type:"POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                oldlrn:$("#name-rightbadge").data("oldlrn")
            }),
            dataType: "json",
            success: function(resp) {
                apputils.echo(resp);
                view.stopspin("saveenroll", "Save");
                $("#savemsg").html("");
                if (resp.status.toUpperCase() == "ERROR")
                {
                    $("#savemsg").html(
                        view.bslabel("danger", "Error:Cannot Process Current request."));
                }
                else {

                    if ($("#name-rightbadge")
                            .data("enrlrn") == "")
                    {
                        apputils.initboxfields("enrollbox");
                        $.cookie("freeid", resp.freeid);
                        $("#lrn").val(resp.freeid);

                        return;
                    }
                    //if request from lrn not found in search last name
                    $("#name-rightbadge")
                        .data("enrlrn",
                            $("#lrn").val());
                    $("#name-rightbadge")
                        .data("enrlbtn",
                            "saveenroll");
                    $("#saveajx").html("");
                    apputils.initboxfields("enrollbox");
                    $("#savemsg").html("");
                    view.cleanregdetail();
                    view.enroll();
                    doEnrolAjx();
                }
                //view.bslabel("danger", "Error Occured!");
                //$("#msglabel").html(resp);
            },
            error: function (e) {
                view.stopspin("saveenroll", "Save");
                $("#saveajx").html("");
                $("#savemsg").html(view.bslabel("danger", "Error Occured!"));
                //$("#msglabel").html("Error Occured!");
                //alert("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin("saveenroll");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }
    /*
     model.getenrolledstuds());
     $("#btnenroll").click(model.enrolllrn);
     $("#btnerlsearch").click(model.enrollsearch);
     */

    model.getenrolledstuds = function()
    {
        eventerid = "umnu" + apputils.
                mnuenroll
                .id;

        $.ajax({
            url: apputils.rest + '/classlist/' +
            $.cookie("schoolid") + "/" +
            $.cookie("semid") + "/" +
            $("#name-rightbadge").data("grade") + "/" +
            $("#name-rightbadge").data("section")
            ,
            type: "GET",
            success: function (resp)
            {
                view.stopspin(eventerid,
                    view.
                    menuentry(apputils.
                        mnuenroll));
                apputils.echo(resp);
                if (resp.status == 'ok') {

                    $("#main")
                        .html(
                            view.schoolyearbanner() +
                            view.enrollform(resp) +
                            view.badgify(resp)
                        );

                    $("#btnenroll")
                        .click(model.enrolllrn);

                    $("#btnerlsearch")
                        .click(model.enrollsearch);
                }
                else
                {
                    apputils.echo(resp);
                }
            },
            error: function (e) {
                view.stopspin(eventerid,
                    view.
                    menuentry(apputils.
                        mnuenroll));
            },
            beforeSend: function (xhrObj) {
                view.setspin(eventerid,view
                    .mnuspinner());
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") +
                        ":" + $.cookie("key")));
            }
        });
    }

    function doEnrolAjx()
    {
        btnid = $("#name-rightbadge").data("enrlbtn");
        $.ajax({
            ///classlist/<string:schoolid>/<string:semid>/
            // <string:level>/<string:section>/<string:lrn>
            url: apputils.rest + '/classlist/' +
            $.cookie("schoolid") + "/" +
            $.cookie("semid") + "/" +
            $("#name-rightbadge").data("grade") + "/" +
            $("#name-rightbadge").data("section") + "/" +
            $("#name-rightbadge").data("enrlrn"),
            type: "POST",
            success: function (resp)
            {
                view.stopspin(btnid, "Enroll");
                //$("#erlajx").html("");

                if (resp.status == 'ok') {
                    model.getenrolledstuds();
                }
                else
                {
                    if (resp
                            .message
                            .search("LRN NOT FO") != -1)
                    {
                        $("#enrolerrmessage")
                            .html(
                                view
                                    .bslabel("danger",
                                        resp.message) +
                                '&nbsp;&nbsp;' +
                                '<button ' +
                                ' class="btn btn-warning btn-xs" ' +
                                ' onclick="view.regdetail();">' +
                                'Click to Register</button>');

                        /*
                         $("#enrolerrmessage")
                         .html(resp.message +
                         '&nbsp;&nbsp;' +
                         '<button ' +
                         ' class="btn btn-warning btn-xs" ' +
                         ' onclick="view.regdetail();">' +
                         'Click to Register</button>');
                         */
                    }
                    else
                    {
                        $("#enrolerrmessage")
                            .html(view.bslabel("danger",
                                resp.message));
                    }
                    //apputils.echo(resp);
                }
            },
            error: function (e) {
                // $("#erlajx").html("");
                view.stopspin(btnid, "Enroll");
            },
            beforeSend: function (xhrObj) {
                view.setspin(btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") +
                        ":" + $.cookie("key")));
            }
        });
    }

    model.enrolllrn = function () {
        $("#name-rightbadge")
            .data("enrlrn",
                $("#enrolllrn").val());
        $("#name-rightbadge").data("enrlbtn", "btnenroll");
        doEnrolAjx();
    }

    model.enroll = function (par_lrn, eventer)
    {
        $("#name-rightbadge")
            .data("enrlrn",
                par_lrn);
        $("#name-rightbadge").data("enrlbtn", eventer);
        doEnrolAjx();
    }

    model.profile = function (stuid, eventerid, eventername)
    {

        function spinalot(stat)
        {
            if (stat == "start")
            {
                if ($.cookie("usertype") == "students")
                {
                    view.setspin("umnu" + apputils.mnuclasscard.id,
                        view .mnuspinner());
                }
                else
                {
                    view.setspin(eventerid);
                }
            }
            else
            {
                if ($.cookie("usertype") == "students")
                {
                    view.stopspin("umnu" + apputils.mnuclasscard.id,
                        view. menuentry(apputils. mnuclasscard));
                }
                else
                {
                    view.stopspin(eventerid, eventername);
                }

            }
        }


        $.ajax({
            url: apputils.rest + '/profile/' +
            stuid + "/" +
            $.cookie("schoolid") + "/" +
            $.cookie("semid"),
            type: "GET",
            success: function (resp)
            {

                spinalot('stop');
                //$("#erlajx").html("");
                apputils.echo(resp);
                $("#name-rightbadge").data("profileload", resp.subjectload);
                if (resp.status == 'ok') {
                    view.profile(resp);
                }
                else
                {
                    new PNotify({
                        title: "Info  Access",
                        text:resp.message,
                        type:'error'
                    });
                }
            },
            error: function (e) {
                // $("#erlajx").html("");
                spinalot('stop');
            },
            beforeSend: function (xhrObj) {
                spinalot('start');
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") +
                        ":" + $.cookie("key")));
            }
        });

    }

    model.removestu = function (par_stuid, eventerid)
    {
        $.ajax({
            url:  apputils.rest + '/classlist/'+
            par_stuid + '/' + $.cookie("schoolid") + "/" +
            $.cookie("semid") + "/" + $("#name-rightbadge").data("grade") +
            "/" + $("#name-rightbadge").data("section"),
            type:"DELETE",
            dataType: "json",
            success: function(resp) {
                view.stopspin(eventerid, "");
                model.getenrolledstuds();
            },
            error: function (e) {
                //alert("error pre");
                view.stopspin(eventerid, "");
            },
            beforeSend: function (xhrObj){
                view.setspin(eventerid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie('key')));
            }
        });
    }

    model.classlist = function (eventerid)
    {
        //apputils.mnusclasslist


        $.ajax({
            url:  apputils.rest + '/classlist/'+
            $.cookie("schoolid") + "/" +
            $.cookie("semid") + "/" + $("#name-rightbadge").data("grade") +
            "/" + $("#name-rightbadge").data("section"),
            type:"GET",
            dataType: "json",
            success: function(resp) {
                apputils.echo(resp);
                if (resp.size == 0)
                {
                    $("#main").html(view.excolumn(12,view
                        .simplebox({
                            boxtype:"info",
                            title:"Enrollment Status",
                            body:"<h1>NO ENROLLED STUDENTS!<h1>",
                            footer:""
                        })));
                    view.stopspin(eventerid, view
                        .menuentry(apputils
                            .mnusclasslist));
                    return;
                }
                view.stopspin(eventerid, view
                    .menuentry(apputils
                        .mnusclasslist));
                $("#main").html(
                    view.rowdify(resp.list,view.boxembodiement,
                        function (clistentry) {
                            color = clistentry.color.split("-");
                            waste = color.shift(); //remove bg-
                            accordparent = "accord" + clistentry.id;
                            return {
                                name:clistentry.name,
                                idno:clistentry.id,
                                embodiement: view.accordion({
                                    parent:accordparent,
                                    title:"",
                                    elements:[
                                        {
                                            parent: accordparent, //parent id
                                            href: accordparent + "0", //parent href
                                            accordtitle: "Re-Assign",
                                            body:view.simplebox(
                                                {
                                                    title: "Re-assign Student",
                                                    body: view.exformgroup(view.exinputtext(
                                                        "Grade", "text",
                                                        "txtToGrade" + accordparent,
                                                        "")) +
                                                    view.exformgroup(view.exinputtext(
                                                        "Section", "text",
                                                        "txtToSection" + accordparent,
                                                        "")) +
                                                    view.exformgroup(view.textarea(
                                                        {
                                                            id:"txtToReason" + accordparent,
                                                            rows:4,
                                                            placeholder:"Reason(s) for "+
                                                            "the transfer."
                                                        })),
                                                    footer:
                                                    view.labelel("lblErrorreassign" + accordparent,"") +
                                                    view.buttonact("success pull-right",
                                                        "Re-assign",
                                                        "model.reassignstudent('" + clistentry.id + "','" +
                                                        "btnreassign" + accordparent + "'," +
                                                        "'Re-assign'," +
                                                        "'lblErrorreassign" + accordparent + "','" +
                                                        "txtToGrade" + accordparent + "','" +
                                                        "txtToSection" + accordparent + "','" +
                                                        "txtToReason" + accordparent + "')",
                                                        "btnreassign" + accordparent)
                                                }),
                                            boxtype:"success"
                                        },
                                        {
                                            parent: accordparent, //parent id
                                            href: accordparent + "1", //parent href
                                            accordtitle: "Transfer",
                                            body:view.simplebox(
                                                {
                                                    title: "Transfer Details",
                                                    body:
                                                    view.exformgroup(
                                                        view.exinputtext(
                                                            "School", "text",
                                                            "txtToschool" + accordparent,
                                                            ""
                                                        )
                                                    ) +
                                                    view.exformgroup(
                                                        view.textarea(
                                                            {
                                                                id: "txaReason" + accordparent,
                                                                rows:4,
                                                                placeholder:"Reason(s) for transferring"
                                                            }
                                                        )
                                                    ),
                                                    footer:  view.labelel("lblErrortransfer" + accordparent,"") +
                                                    view.buttonact("success pull-right",
                                                        "Transfer", "model.transferstudent(" +
                                                        "'" + clistentry.id + "','"  +
                                                        "btntransfer" + accordparent + "','" +
                                                        "Transfer','" +
                                                        "lblErrortransfer" + accordparent + "'," +
                                                        "'txtToschool" + accordparent +"'," +
                                                        "'txaReason" + accordparent + "')",
                                                        "btntransfer" + accordparent)

                                                }
                                            ),
                                            boxtype:"warning"
                                        },
                                        {
                                            parent: accordparent, //parent id
                                            href: accordparent + "2", //parent href
                                            accordtitle: "Drop",
                                            body:view.simplebox(
                                                {  title:"Drop Student",
                                                    body: view.exformgroup(
                                                        view.textarea(
                                                            {
                                                                id: "txadrpReason" + accordparent,
                                                                rows: 4,
                                                                placeholder: "Reason(s) for Dropping"
                                                            }
                                                        )
                                                    ),
                                                    footer:view.labelel("lblErrordrop" + accordparent,"") +
                                                    view.buttonact("danger pull-right",
                                                        "Drop", "model.dropstudent(" +
                                                        "'" + clistentry.id + "','"  +
                                                        "txadrpReason" + accordparent + "','" +
                                                        "btndrop" + accordparent + "','" +
                                                        "Drop','" +
                                                        "lblErrordrop" + accordparent + "')",
                                                        "btndrop" + accordparent)
                                                }),
                                            boxtype:"danger"
                                        }]

                                }),
                                boxcolor: color.join("-"),
                                picsrc: clistentry.imgsrc
                            }

                        },
                        "Class List"));

            },
            error: function (e) {
                //alert("error pre");
                view.stopspin(eventerid, view
                    .menuentry(apputils
                        .mnusclasslist));
            },
            beforeSend: function (xhrObj){
                view.stopspin(eventerid, view
                    .mnuspinner());

                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie('key')));
            }
        });
    }

    model.clistop = function (par_object)
    {
        /*
         url,
         type,
         btnid,
         btnlabel,
         errorid
         */
        //@app.route("/classlist/<string:idnum>/<string:schoolid>/<string:semid>/<int:level>/<string:section>/<string:reason>", methods=['DELETE'])
        $.ajax({
            url: par_object.url,
            type:par_object.type,
            dataType: "json",
            success: function(resp) {
                apputils.echo(resp);
                view.stopspin(par_object.btnid, par_object.btnlabel);

                if (resp.status.toUpperCase() == "ERROR")
                {
                    $("#" + par_object.errorid)
                        .html(view
                            .bslabel("danger",
                                "Error:Cannot Process Current request."));
                }
                else {
                    model.classlist(par_object.btnid);
                    $("#" + par_object.errorid).html('');
                }
            },
            error: function (e) {
                view.stopspin(par_object.btnid, par_object.btnlabel);

                $("#" + par_object.errorid).html(view.bslabel("danger", "Error Occured!"));
            },
            beforeSend: function (xhrObj){
                view.setspin(par_object.btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.dropstudent = function(par_idnum, par_textid,par_btnid, par_btnlabel, par_errorid)
    {
        model.clistop({
            url: apputils.rest + '/classlist/'+
            par_idnum + "/" +
            $.cookie("schoolid") + "/" +
            $.cookie("semid")+  "/" +
            apputils.kto0($("#name-rightbadge").data("grade")) + "/" +
            $("#name-rightbadge").data("section") + "/" +
            $("#" + par_textid).val(),
            type: "DELETE",
            btnid:par_btnid,
            btnlabel: par_btnlabel,
            errorid: par_errorid
        });
    }

    model.reassignstudent = function (par_idnum, par_btnid,
                                      par_btnlabel, par_errorid,
                                      par_tolevelid, par_tosectionid,
                                      par_reasonid)
    {
        ///classlist/<string:idnum>/<string:schoolid>/<string:semid>/
        // <int:fromlevel>/<string:fromsection>/<int:tolevel>/<string:tosection>/<string:reason>", methods=['PUT'])

        model.clistop({
            url: apputils.rest + '/classlist/'+
            par_idnum + "/" +
            $.cookie("schoolid") + "/" +
            $.cookie("semid")+  "/" +
            apputils.kto0($("#name-rightbadge").data("grade")) + "/" +
            $("#name-rightbadge").data("section") + "/" +
            apputils.kto0(
                $("#" + par_tolevelid).val()) + "/" + $("#" + par_tosectionid).val() + "/" +
            $("#" + par_reasonid).val(),
            type: "PUT",
            btnid:par_btnid,
            btnlabel: par_btnlabel,
            errorid: par_errorid
        });


    }

    model.transferstudent = function (par_idnum, par_btnid,
                                      par_btnlabel, par_errorid, par_toschoolid,
                                      par_reasonid)
    {
        ///classlist/<string:idnum>/<string:schoolid>/<string:semid>/
        // <int:level>/<string:section>/<string:toschool>/<string:reason>",
        // methods=['PUT'])
        model.clistop({
            url: apputils.rest + '/classlist/'+
            par_idnum + "/" +
            $.cookie("schoolid") + "/" +
            $.cookie("semid")+  "/" +
            apputils.kto0($("#name-rightbadge").data("grade")) + "/" +
            $("#name-rightbadge").data("section") + "/" +
            $("#" + par_toschoolid).val()  + "/" +
            $("#" + par_reasonid).val(),
            type: "PUT",
            btnid:par_btnid,
            btnlabel: par_btnlabel,
            errorid: par_errorid
        });
    }

    model.getuserload = function ()
    {
        eventerid = "umnu" + apputils.
                mnussubjects
                .id;

        $.ajax({
            url: apputils.rest + '/load/' +
            $.cookie("quarter") + "/" +
            $.cookie("schoolid") + "/" +
            $.cookie("semid"),
            type:"GET",
            dataType: "json",
            success: function(resp) {
                apputils.echo(resp);
                view.stopspin(eventerid,
                    view.
                    menuentry(apputils.
                        mnussubjects));
                $.cookie("quarter", resp.quarter);
                $("#name-rightbadge").data("thislistmale", resp.listmale);
                $("#name-rightbadge").data("thislistfemale", resp.listfemale);
                $("#name-rightbadge").data("listmale", resp.listmale);
                $("#name-rightbadge").data("listfemale", resp.listfemale);
                if (resp.size == 0)
                {
                    $("#main").html(view.excolumn(12,view
                        .simplebox({
                            boxtype:"info",
                            title:"Subject Loading",
                            body:"<h1>NO ASSIGNED SUBJECTS!<h1>",
                            footer:"Please consult proper authority."
                        })));
                }
                $("#name-rightbadge").data("subjects", []);
                $("#main").html(
                    view.exrow(
                        view.quarterize()
                    )+
                    view.rowdify(
                        resp.load,
                        view.boxnoprogress,
                        function(resp)
                        {
                            objectified = (function (x) {
                                return {
                                    icon:"fa " + x[3],
                                    label: x[0],
                                    value: x[1],
                                    sectionid: x[4],
                                    level: x[6],
                                    section: x[5],
                                    coteachers: x[7].coteachers
                                }
                            })(resp);

                            $("#name-rightbadge")
                                .data("subjects")
                                    .push(objectified);

                            return {
                                boxid: 'box' + resp[0],
                                color: resp[2],
                                icon: "fa " + resp[3],
                                idh:"hdr" + resp[2],
                                header: resp[1] ,
                                idh2: "hdr2" + resp[0],
                                text2: resp[1],
                                content: view.buttonact("gray",
                                    "Manage" + ' ' + resp[5],
                                    "view.subjectmanagement("+
                                    (function (x) {
                                        return '{' +
                                            "icon:'fa " + x[3] + "'," +
                                            "label:'" +  x[0] + "'," +
                                            "value:'" + x[1] + "'," +
                                            "sectionid:'" + x[4] + "'" +
                                            '}'
                                    })(resp)
                                    +
                                    ",'btnmngclass"+ resp[4].replace(" ","").replace('&','W') +
                                    "','Manage" + ' ' + resp[5] + "')",
                                    "btnmngclass" + resp[4].replace(" ","").replace('&','W') + "")
                            }

                        },
                        "Subject Load"
                    )
                );



            },
            error: function (e) {
                view.stopspin("btnerlsearch", "Search");
                //$("#enrolerrmessage").html(view.bslabel("danger", "Error Occured!"));
                //apputils.initboxfields("enrollbox");
            },
            beforeSend: function (xhrObj){
                //$("#btnlogin").addClass("fa fa-refresh fa-spin");
                view.setspin(eventerid,view
                    .mnuspinner());
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }


        });
    }

    model.changequarter = function (var_quarter)
    {
        eventerid = "umnu" + apputils.
                mnussubjects
                .id;

        $.ajax({
            url: apputils.rest + '/quarter/' +
            $("#name-rightbadge").data("section") + '/' +
            $("#name-rightbadge").data("grade") + '/' +
            var_quarter + "/" +
            $.cookie("schoolid") + "/" +
            $.cookie("semid"),
            type:"POST",
            dataType: "json",
            success: function(resp) {
                apputils.echo(resp);
                $.cookie("quarter", resp.quarter);
                view.stopspin(eventerid,
                    view.
                    menuentry(apputils.
                        mnussubjects));
                model.getuserload();


            },
            error: function (e) {
                view.stopspin("btnerlsearch", "Search");
                //$("#enrolerrmessage").html(view.bslabel("danger", "Error Occured!"));
                //apputils.initboxfields("enrollbox");
            },
            beforeSend: function (xhrObj){
                //$("#btnlogin").addClass("fa fa-refresh fa-spin");
                view.setspin(eventerid,view
                    .mnuspinner());
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }


        });

    }

    function setstuscores(par_val, par_prefix)
    {
        par_prefix = typeof par_prefix !== 'undefined' ? par_prefix : "score";
        for (var i=0; i < $("#name-rightbadge").data("listfemale").length; i++)
        {
            $("#" + par_prefix +$("#name-rightbadge").data("listfemale")[i].id).val(par_val);
            $("#error"+$("#name-rightbadge").data("listfemale")[i].id).html("");
        }

        for (var i=0; i < $("#name-rightbadge").data("listmale").length; i++)
        {
            $("#" + par_prefix +$("#name-rightbadge").data("listmale")[i].id).val(par_val);
            $("#error"+$("#name-rightbadge").data("listmale")[i].id).html("");
        }

    }
    
    model.getreports = function(par_entryid){
        
        $.ajax({
            url: apputils.rest + '/feeling/' + par_entryid +
                            '/' + $.cookie("username"),
            type: 'GET',
            dataType:'json',
            success: function(resp) {
                apputils.echo(resp);
                
               $("#chart").empty();
                
                reportcanvas = /*'<div class="col-md-6"> '+
                    '<div class="box box-success">'+
                    '<div class="box-header with-border">'+
                  '<h3 class="box-title">Mood Meter</h3>'+
                  '<div class="box-tools pull-right">'+
                    '<button type="button" class="btn btn-box-tool" data-widget="collapse">'+
                    '<i class="fa fa-minus"></i></button>'+
                    '<button type="button" class="btn btn-box-tool" data-widget="remove">'+
                    '<i class="fa fa-times"></i></button>'+
                  '</div>'+
                '</div>'+*/
                '<div class="box-body" id="chart">'+
                  '<div class="chart" >'+
                    '<canvas id="barChart" style="height:230px"></canvas>'+
                  '</div>'+
                '</div>'+
              '</div>'; //+  '</div>';
              
              $("#chart").append(reportcanvas);
              view.reports(resp);
            }
        });
    }
    
    model.savegradeentry = function (par_btnid)
    {
        var totalscore = apputils.ifstrempy($("#txtTotScore").val(),$("#txtTotScore").val(), "9999");

        $.ajax({
            url: apputils.rest + '/gradebook/' +
            $("#name-rightbadge").data("sectionid") + "/" +
            $("#cbogradecount").val() + "/" +
            parseFloat(totalscore).toFixed(2) + "/" +
            $.cookie("semid") + "/" +
            $.cookie("quarter") + "/" +
            $('#cbogradecategories').val(),
            type:"POST",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_btnid, "Set");
                apputils.echo(resp);
                $("#txtTotScore").val(resp.maxscore);

                setstuscores("");

                for (var i = 0; i < resp.entries.length; i++)
                {
                    $("#score"+resp.entries[i][0]).val(resp.entries[i][1])
                }

                $("#name-rightbadge").data("entryid", resp.entryid);
                
                model.getreports(resp.entryid);

            },
            error: function (e) {
                view.stopspin(par_btnid, "Set");
                apputils.echo("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" +
                        $.cookie("key")));
            }
        });

    }

    function composeaddgradereqt()
    {
        lvlsxn = apputils
            .getSubjectLevelSection(
                $("#name-rightbadge")
                    .data("sectionid")
            );

        level = section = '';

        if (lvlsxn != '')
        {
            level = lvlsxn.split("-")[0];
            section = lvlsxn.split("-")[1];
        }

        return section + "*" +
            level + "*" +
            $.cookie("quarter") + "*" +
            $.cookie("semid") + "*" +
            $.cookie("schoolid") + "*" +
            $('#cbogradecategories').val() + "*" +
            apputils.getSubjectNofromOffID($("#name-rightbadge").data("sectionid"));

    }

    model.savestudentscore = function (par_btnid, par_idno)
    {
        ///gradebook/<string:par_studentid/<string:par_entryid>/<float:par_score>/<float:par_mult>/

        /*
         par_section text,
         par_level int,
         par_quarter_ text,
         par_semid text,
         par_schoolid text,
         par_categoryid text,
         par_subject text
         */

        lvlsxn = apputils
            .getSubjectLevelSection(
                $("#name-rightbadge")
                    .data("sectionid")
            );

        level = section = '';

        if (lvlsxn != '')
        {
            level = lvlsxn.split("-")[0];
            section = lvlsxn.split("-")[1];
        }

        $.ajax({
            url: apputils.rest + '/gradebook/' +
            par_idno + "/" +
            $("#name-rightbadge").data("entryid")  + "/" +
            parseFloat($("#score"+par_idno).val()).toFixed(2) + "/1.00/" +
            composeaddgradereqt(),
            type:"POST",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_btnid, "");
                apputils.echo(resp);
                response = resp.item[0];
                if (response == "OK")
                {
                    color = "green";
                }
                else
                {
                    color = "red";
                }

                $("#error" + par_idno).html(view.smallbadge(color, response));

            },
            error: function (e) {
                view.stopspin(par_btnid, "");
                alert("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.savequarterstugrade = function (par_btnid, par_idno)
    {
        /* "/gradebook/<string:par_studentid>/<string:par_subject>/<string:par_section>/" +
         "<int:par_level>/<string:par_semid>/<string:par_schoolid>/<float:par_grade>/" +
         "<string:par_quarter_>"
         */

        $.ajax({
            url: apputils.rest + '/gradebook/' +
            par_idno + "/" +
            apputils.getSubjectNofromOffID($("#name-rightbadge").data("sectionid"))  + "/" +
            $("#name-rightbadge").data("section") + "/"+
            $("#name-rightbadge").data("grade")+"/" +
            $.cookie("semid") + "/" +
            $.cookie("schoolid") + "/" +
            parseFloat($("#score" + par_idno).val()).toFixed(2) + "/" +
            $.cookie("quarter"),
            type:"POST",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_btnid, "");
                apputils.echo(resp);
                response = resp.item[0];
                if (response == "OK")
                {
                    color = "green";
                }
                else
                {
                    color = "red";
                }

                $("#error" + par_idno).html(view.smallbadge(color, response));

            },
            error: function (e) {
                view.stopspin(par_btnid, "");
                alert("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }


    model.savequartergroupgrade = function (par_btnid)
    {
        /* "/gradebook/<string:par_studentid>/<string:par_subject>/<string:par_section>/" +
         "<int:par_level>/<string:par_semid>/<string:par_schoolid>/<float:par_grade>/" +
         "<string:par_quarter_>"
         */

        $.ajax({
            url: apputils.rest + '/gradebook/' +
            apputils.getSubjectNofromOffID($("#name-rightbadge").data("sectionid"))  + "/" +
            $("#name-rightbadge").data("section") + "/" +
            $("#name-rightbadge").data("grade")+"/" +
            $.cookie("semid") + "/" +
            $.cookie("schoolid") + "/" +
            $.cookie("quarter") + "/" +
            apputils.exremtail(getscores("male") + getscores("female"), "@") + "/" +
            $("#name-rightbadge").data("sectionid"),
            type:"POST",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_btnid, "Submit");
                apputils.echo(resp);
                for (var i = 0; i < resp.results.length; i++)
                {
                    if (resp.results[i].result.toUpperCase() == "OK")
                    {
                        echo = view.smallbadge("green",
                            resp.results[i].result);
                    }
                    else
                    {
                        echo = view.smallbadge("red",
                            resp.results[i].result);
                    }

                    $("#error" + resp.results[i].lrn).html(echo);
                }

            },
            error: function (e) {
                view.stopspin(par_btnid, "Submit");
                alert("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }



    function getscores(gender){
        batch = '';
        for (var i=0; i < $("#name-rightbadge").data("list" + gender).length; i++)
        {
            id = $("#name-rightbadge").data("list" + gender)[i].id;
            score = parseFloat($("#score"+id).val()).toFixed(2).toString();
            batch += id + "*" + score + "@";
        }
        return batch;
    }

    function getattendance(gender)
    {
        batch = '';
        for (var i=0; i < $("#name-rightbadge").data("list" + gender).length; i++)
        {
            id = $("#name-rightbadge").data("list" + gender)[i].id;
            status = $("#status"+id).val();
            if (status == "PRESENT")
            {
                points = $("#cboattendancepoints").val();
            } else if (status == 'LATE')
            {
                points = $("#attendanclate").val();
            } else if (status == 'EXCUSED')
            {
                points = $("#attendancexcuse").val();
            }
            else
            {
                points = "0.00";
            }
            batch += id + "*" + status +
                "*" + points + "*" +
                $("#attendancedaypart").val() + "@";
        }
        return batch;
    }

    model.batchsaveattendance = function(par_btnid)
    {
        batch = getattendance("female") + getattendance("male");
        batch = apputils.exremtail(batch, "@");
        lvlsxn = apputils
            .getSubjectLevelSection(
                $("#name-rightbadge").data("sectionid"));

        level = section = '';

        if (lvlsxn != '')
        {
            level = lvlsxn.split("-")[0];
            section = lvlsxn.split("-")[1];
        }

        $.ajax({
            url: apputils.rest + '/attendance/' +
            batch + "/" +
            section + "/" +
            level + "/" +
            $.cookie("schoolid") + "/" +
            $.cookie("semid") + "/" +
            $("#attendancedate").val()
            ,
            type:"POST",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_btnid, "Save All");
                apputils.echo(resp);
                for (var i = 0; i < resp.results.length; i++)
                {
                    if (resp.results[i].result == "OK")
                    {
                        echo = view.smallbadge("green",
                            resp.results[i].result);
                    }
                    else
                    {
                        echo = view.smallbadge("red",
                            resp.results[i].result);
                    }

                    $("#error" + resp.results[i].lrn).html(echo);
                }

            },
            error: function (e) {
                view.stopspin(par_btnid, "Save All");
                apputils.echo("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" +
                        $.cookie("key")));
            }
        });

    }

    model.batchsavescores = function(par_btnid)
    {
        batch = getscores("female") + getscores("male");
        batch = apputils.exremtail(batch, "@");

        $.ajax({
            url: apputils.rest + '/gradebook/' +
            batch + "/" +
            $("#name-rightbadge").data("entryid") + "/" +
            composeaddgradereqt(),
            type:"POST",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_btnid, "Save All");
                apputils.echo(resp);
                for (var i = 0; i < resp.results.length; i++)
                {
                    if (resp.results[i].result == "OK")
                    {
                        echo = view.smallbadge("green",
                            resp.results[i].result);
                    }
                    else
                    {
                        echo = view.smallbadge("red",
                            resp.results[i].result);
                    }

                    $("#error" + resp.results[i].lrn).html(echo);
                }

            },
            error: function (e) {
                view.stopspin(par_btnid, "Save All");
                apputils.echo("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" +
                        $.cookie("key")));
            }
        });

    }

    model.recordattendance = function (par_btnid, par_studentid)
    {
        /*  "/attendance/<string:par_studentid>/<string:par_semid>/<string:par_status>/" +
         "<string:par_att_date>/<float:par_points>/<string:par_daypart>/" +
         "<string:par_schoolid>/<string:par_section>/<int:par_level>"
         */

        /*
         to do:
         attendancedaypart
         */

        par_status = $("#status"+par_studentid).val();

        if (par_status == "LATE")
        {
            loc_points = parseFloat($("#attendanclate").val()).toFixed(2).toString();
        } else if (par_status == "EXCUSED")
        {
            loc_points = parseFloat($("#attendancexcuse").val()).toFixed(2).toString();
        }
        else
        {
            loc_points = parseFloat($("#cboattendancepoints").val()).toFixed(2).toString();
        }

        $.ajax({
            url: apputils.rest + '/attendance/' + par_studentid + "/" +
            $.cookie("semid") + "/" + par_status + "/" +
            $("#attendancedate").val() + "/" +
            loc_points + "/" +
            $("#attendancedaypart").val() + "/" + $.cookie("schoolid") + "/" +
            $("#name-rightbadge").data("section") + "/" +
            $("#name-rightbadge").data("grade"),
            type:"POST",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_btnid, "");
                if (resp.item[0] == 'OK')
                {
                    color = "green";
                }
                else
                {
                    color = "red";
                }
                $("#error" + par_studentid).html(view.smallbadge(color, resp.item[0]));
                $("#status" + par_studentid).val(par_status);
            },
            error: function (e) {
                view.stopspin(par_btnid, "");
                alert("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin(par_btnid);
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.retrieveattendance = function(par_btnid)
    {


        lvlsxn = apputils
            .getSubjectLevelSection(
                $("#name-rightbadge")
                    .data("sectionid")
            );

        level = section = '';

        if (lvlsxn != '')
        {
            level = lvlsxn.split("-")[0];
            section = lvlsxn.split("-")[1];
        }

        $.ajax({
            url: apputils.rest + '/attendance/' + section + "/" +
            level + "/" + $.cookie("schoolid") + "/" +
            $.cookie("semid") + "/" + $("#attendancedate").val() + "/" +
            $("#attendancedaypart").val(),
            type:"GET",
            dataType: "json",
            success: function(resp) {
                setstuscores("", "status");
                if (resp.status != 'ok')
                {

                    return;
                }
                for (var i =0; i < resp.items.length; i++)
                {
                    $("#status"+resp.items[i].id).val(resp.items[i].status);
                }
            },
            error: function (e) {
                view.stopspin("ajxstudetails", "Get");
                alert("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin("ajxstudetails");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.retrievegrades = function(par_btnid)
    {
        view.forgradesubmission();
        $.ajax({
            url: apputils.rest + '/gradebook/' + apputils.getSubjectNofromOffID($("#name-rightbadge").data("sectionid")) + "/" +
            $.cookie("schoolid") + "/" + $.cookie("semid") + "/" + $.cookie("quarter") + "/" +
            $("#name-rightbadge").data("section") + "/" +
            $("#name-rightbadge").data("grade"),
            type:"GET",
            dataType: "json",
            success: function(resp) {
                view.stopspin("btnviewgradesubmission", "View Grades");
                apputils.echo(resp);
                for (var i =0; i < resp.grades.length; i++)
                {
                    $("#score"+ resp.grades[i].lrn).val(resp.grades[i].grade);
                }
            },
            error: function (e) {
                view.stopspin("btnviewgradesubmission", "View Grades");
                alert("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin("btnviewgradesubmission");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });

    }

    model.sendexcelcontents = function (par_details)
    {
        $.ajax({
            url: apputils.rest + '/gradebook',
            type:"POST",
            data: JSON.stringify(par_details),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(resp) {

                $("#progressmessage").html("Receiving data from Server");
                apputils.echo(resp);//process
                $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                $("#progressmessage").html("Done.");

                for (var i = 0; i < resp.result.length; i++)
                {

                    if (resp.result[i].scoreentry.toUpperCase() != 'OK') {
                        loc_body = '<tr>';
                        var loc_subject = resp.result[i].sectionid.split(" ")[0];
                        loc_body += '<td>'+ resp.result[i].lrn +'</td>';
                        loc_body += '<td>'+ resp.result[i].studentname +'</td>';
                        loc_body += '<td>'+ loc_subject +'</td>';
                        loc_body += '<td>'+ resp.result[i].category +'</td>';
                        loc_body += '<td>'+ resp.result[i].entrycount +'</td>';
                        loc_body += '<td>'+ resp.result[i].scoreentry.split("CONTEXT:")[0] +'</td>';
                        loc_body += '</tr>';
                        $("#tblerresults > tbody").append(loc_body);
                    }




                }


            },
            error: function (e) {
                $("#progressmessage").html("Error Occured");
                apputils.echo(e);
                $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
            },
            beforeSend: function (xhrObj){
                $("#xlsuploadicon").removeClass('fa-upload').addClass('fa-refresh fa-spin');
                $("#progressmessage").html("Sending to Server");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }


    model.getclassrecorddata = function (par_this)
    {
        lvlsxn = apputils
            .getSubjectLevelSection(
                $("#name-rightbadge")
                   .data("sectionid"));

        level = section = '';

        if (lvlsxn != '')
        {
            level = lvlsxn.split("-")[0];
            section = lvlsxn.split("-")[1];
        }

        $.ajax({
            url: apputils.rest + '/gradebook/' + $("#name-rightbadge").data("sectionid"),
            type:"GET",
            data: {
                semid:$.cookie("semid"),
                schoolid: $.cookie("schoolid"),
                quarter: $.cookie("quarter"),
                grade: level,
                section:section,
                subject:apputils.getSubjectNofromOffID($("#name-rightbadge").data("sectionid"))
            },
            dataType: "json",
            success: function(resp) {
                apputils.echo(resp);
                $(par_this).html("Class Record");
                $("#tabclassrecord").bootstrapTable('removeAll');
                $("#tabclassrecord").bootstrapTable('append', resp.classrecord);

            },
            error: function (e) {
                $(par_this).html("Class Record");
                apputils.echo(e);
            },
            beforeSend: function (xhrObj){
                $(par_this).html(view.spin() + " Pls Wait..")
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.getcard = function (par_lrn, par_all, par_this, par_tabid)
    {
        prevtext = $(par_this).text();
        if (par_all)
        {
            sem = '*';
        }
        else
        {
            sem = $.cookie("semid");
        }
        $.ajax({
            url: apputils.rest + '/card/' + par_lrn + '/' + sem,
            type:"GET",
            data: {
                "schoolid": $.cookie("schoolid")
            },
            dataType: "json",
            success: function(resp) {
                //view.stopspin("ajxstudetails", "Get");
                apputils.echo(resp);
                $(par_this).html(prevtext);
                if (resp.size == 0)
                {
                    return;
                }

                apputils.echo(typeof resp.classcard[0][0]);
                if (typeof resp.classcard[0][0] == 'undefined')
                {
                    return;
                }

                function getsubjectgrade(subject, subjects)
                {

                    for (var k=0; k < subjects.length; k ++)
                    {
                        if (subjects[k].subject == subject)
                        {
                            return subjects[k].grade;
                        }
                    }
                    return 0;
                }
                periodentries = resp.classcard[0];
                subjects = periodentries[3].subjectgrade;
                tabentries = [];
                classcard = resp.classcard[0];

                if (sem == "*")
                {
                    tabentries.push({
                        la:resp.classcard[0][0].subjectgrade[0].subject + " " +
                        resp.classcard[0][0].subjectgrade[0].grade,
                        q1:'',
                        q2:'',
                        q3:'',
                        q4:'',
                        fr1:'',
                        rem1:''
                    });
                    resp.classcard[0].shift();
                }


                function remarks(par_val)
                {

                    if (par_val == 0)
                    {
                        return '';
                    }

                    if (par_val >= 75)
                    {
                        return 'PASSED';
                    }
                    return 'FAILED';
                }

                for (var j = 0; j < subjects.length; j++)
                {

                    var ent;

                    ent = {
                        la:subjects[j].subject,
                        q1: getsubjectgrade(subjects[j].subject,
                            classcard[0].subjectgrade),
                        q2:getsubjectgrade(subjects[j].subject,
                            classcard[1].subjectgrade),
                        q3:getsubjectgrade(subjects[j].subject,
                            classcard[2].subjectgrade),
                        q4:getsubjectgrade(subjects[j].subject,
                            classcard[3].subjectgrade),
                        fr1: getsubjectgrade(subjects[j].subject,
                            classcard[4].subjectgrade),
                        rem1: remarks(getsubjectgrade(subjects[j].subject,
                            classcard[4].subjectgrade))
                    };

                    tabentries.push(ent)
                }
                $("#" + par_tabid).bootstrapTable('removeAll');
                $("#" + par_tabid).bootstrapTable('append', tabentries)

            },
            error: function (e) {
                //view.stopspin("ajxstudetails", "Get");
                $(par_this).html(prevtext);
                //alert("error pre");
            },
            beforeSend: function (xhrObj){
                $(par_this).html(view.spin() + " Pls Wait..")
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.getcalentries = function ()
    {
        $.ajax({
            url: apputils.rest + '/calendar',
            data: {
                lrn:$("#name-rightbadge").data("timelrn")
            },
            type:"GET",
            success: function(resp) {
                //view.stopspin("ajxstudetails", "Get");
                //apputils.removehtmltags();
                view.stopspin("umnu" + apputils.mnucalendar.id,
                    view. menuentry(apputils. mnucalendar));
                apputils.echo(resp);
                for (var i=0; i< resp.size; i++)
                {
                    resp.items[i].title = apputils
                        .removehtmltags(resp.items[i].title);
                    $('#calendar').fullCalendar('renderEvent',
                        resp.items[i], true);
                }

                $(".fc-content").click(
                    function () {
                        new PNotify({
                            title:"Calendar Entry",
                            text: $($(this).children()[0]).html(),
                            type:"info"
                        });
                    }
                );

            },
            error: function (e) {
                view.stopspin("umnu" + apputils.mnucalendar.id,
                    view. menuentry(apputils. mnucalendar));
                //view.stopspin("ajxstudetails", "Get");
                //$(par_this).html(prevtext);
                //alert("error pre");
            },
            beforeSend: function (xhrObj){
                view.setspin("umnu" + apputils.mnucalendar.id,
                    view .mnuspinner());
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.gettimeline = function()
    {
        //apputils.ifundefined(var_, defvalue, nullvalue)
        offset = apputils.ifundefined($("#name-rightbadge").data("offset"),
            $("#name-rightbadge").data("offset"), 0);

        lrn = apputils.ifundefined($("#name-rightbadge").data("timelrn"),
            $("#name-rightbadge").data("timelrn"), '');

        $.ajax({
            url: apputils.rest + '/timeline',
            type:"GET",
            data: {
                offset: offset,
                lrn:lrn
            },
            dataType: "json",
            success: function(resp) {
                //view.stopspin("ajxstudetails", "Get");
                apputils.echo(resp);
                $("#nexttimes").removeClass('fa-refresh fa-spin');
                $("#nexttimes").addClass('fa-sort-amount-asc');
                if (resp.status != 'ok')
                {
                    return;
                }

                if (resp.size == 0  && $("#name-rightbadge").data("offset") == 0)
                {
                    $("#user-timeline").html(view.timelineitem(
                        {btnicolor:'fa fa-remove',
                            theader:'No Activity Yet'}, '',
                        'You will see impt activities here soon.',
                        '...')
                    );
                    return;
                }

                if (resp.size > 0)
                { offset = offset + 5;}
                $("#name-rightbadge").data("offset", offset);

                $("#nexttimes").unbind("click");
                $("#user-timeline li:last").remove();


                for (var i=0; i < resp.size; i++)
                {
                    var ts = resp.timelines[i].tstamp;
                    var weekDay = new Array(7);
                    weekDay[0] = "Sunday";
                    weekDay[1] = "Monday";
                    weekDay[2] = "Tuesday";
                    weekDay[3] = "Wednesday";
                    weekDay[4] = "Thursday";
                    weekDay[5] = "Friday";
                    weekDay[6] = "Saturday";
                    var months = new Array("January", "February", "March",
                        "April", "May", "June", "July", "August",
                        "September", "October", "November", "December");

                    dispDate = ts;

                    if ($("#name-rightbadge").data("dow") != dispDate)
                    {
                        $("#user-timeline").append(view.labeldate(dispDate));
                        $("#name-rightbadge").data("dow", dispDate);
                    }
                    
                    /*apputils.echo(resp.timelines[i].feelings);*/
                    
                    var pbox = view.postbox(
                        {
                            btnicolor: apputils.getbutton(resp.timelines[i].tltype),
                            theader: resp.timelines[i].owner,
                            imgsrc: $(resp.timelines[i].pic).attr('src')
                        },
                        resp.timelines[i].tstamp,
                        resp.timelines[i].body,
                        //resp.timelines[i].feelings,
                        //resp.timelines[i].recentfeeling,
                        resp.timelines[i].tltype
                        //resp.timelines[i].recordentryid
                     );

                    
                    $("#user-timeline").append(
                        pbox
                    );
                }

                $("#user-timeline").append(view.timenext())
                $("#nexttimes").click(model.gettimeline);

                $('img').error(function () {
                    $(this).attr('src', 'dist/img/soon.jpg');
                })


            },
            error: function (e) {
                //view.stopspin("ajxstudetails", "Get");
                $("#nexttimes").removeClass('fa-refresh fa-spin');
                $("#nexttimes").addClass('fa-sort-amount-asc');
                //$(par_this).html(prevtext);
                //alert("error pre");
            },
            beforeSend: function (xhrObj){
                //$(par_this).html(view.spin() + " Pls Wait..")
                $("#nexttimes").removeClass('fa-sort-amount-asc');
                $("#nexttimes").addClass('fa-refresh fa-spin');
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });

    }
    
    
    model.savefeeling = function(btnid, tlid, feelingid)
    {
        $.ajax({
            url:apputils.rest + '/feeling/' + 
                    tlid + '/' + feelingid + '/' + $.cookie('username'),
            type: "POST",
            contentType:"application/json; charset=utf-8",
            dataType: "json",
            success: function(resp){
                apputils.echo(resp)
               // $("#result"+tlid).html(resp);
                if (feelingid == 1){
                    view.stopspin(btnid, 'Angry');
                } else if (feelingid == 2){
                    view.stopspin(btnid, 'Sad');
                } else if (feelingid == 3){
                    view.stopspin(btnid, 'Happy');
                } else if (feelingid == 4){
                    view.stopspin(btnid, 'Surprised');
                } else {
                    apputils.echo("error");
                }
                
                $("#hbtn"+tlid).removeClass("btn-success");
                $("#sbtn"+tlid).removeClass("btn-success");
                $("#abtn"+tlid).removeClass("btn-success");
                $("#ubtn"+tlid).removeClass("btn-success");
                
                $("#" + btnid).addClass("btn-success");
            },
            error: function (e) {
                apputils.echo(e);
                view.stopspin(btnid, "UH-OH");
                //$("#errlog").html(view.bslabel("danger", "Something Went Wrong!"));
                //$("#btnlogin").removeClass("fa fa-refresh fa-spin");
            },
            beforeSend: function (xhrObj){
                //$("#btnlogin").addClass("fa fa-refresh fa-spin");
                $("#"+btnid).html(view.spin());
                //$("#logineffects").html(view.spinner());
            }
        });
    }
    
    
    model.postbulletin = function (par_button)
    {

        if (apputils.strtrimta($("#taBulletin").val()).length == 0)
        {
            $("#lblErrorBulletin").html(view.bslabel("danger","Empty Message"));
            return;
        }

        $.ajax({
            url: apputils.rest + '/bulletin',
            type:"POST",
            data: JSON.stringify({
                message: $("#taBulletin").val(),
                schoolid:$.cookie("schoolid"),
                semid:$.cookie("semid")
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_button, "Post");
                apputils.echo(resp);//process

                if (resp.status != "ok")
                {
                    $("#lblErrorBulletin").html(view.bslabel("danger",resp.message));
                    return;
                }
                //$("#user-timeline li").remove();
                apputils.filltimeline();
            },
            error: function (e) {
                $("#lblErrorBulletin").html(view.bslabel("danger","Something went wrong!"));
                view.stopspin(par_button, "Post");
            },
            beforeSend: function (xhrObj){
                $("#lblErrorBulletin").html("");
                $("#" + par_button).html(view.spin() + " Pls Wait.. ");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }


    model.postassignment = function (par_button)
    {
        if (apputils.strtrimta($("#taAssignment").val()).length == 0)
        {
            $("#lblErrorAssignment").html(view.bslabel("danger","Empty Message"));
            return;
        }

        $.ajax({
            url: apputils.rest + '/assignment',
            type:"POST",
            data: JSON.stringify({
                message: $("#taAssignment").val(),
                schoolid:$.cookie("schoolid"),
                semid:$.cookie("semid"),
                duedate:$("#txtassignduedate").val(),
                subject:$("#selassignment").val(),
                offeringid:apputils
                                .getSectionID2(
                                    $("#selassignment").val()
                                )
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_button, "Post");
                apputils.echo(resp);//process

                if (resp.status != "ok")
                {
                    $("#lblErrorAssignment").html(view.bslabel("danger",resp.message));
                    return;
                }
                //$("#user-timeline li").remove();
                apputils.filltimeline();
            },
            error: function (e) {
                $("#lblErrorAssignment").html(view.bslabel("danger","Something went wrong!"));
                view.stopspin(par_button, "Post");
            },
            beforeSend: function (xhrObj){
                $("#lblErrorAssignment").html("");
                $("#" + par_button).html(view.spin() + " Pls Wait.. ");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.postevent = function (par_button)
    {
        if (apputils.strtrimta($("#taEvent").val()).length == 0)
        {
            $("#lblErrorEvent").html(view.bslabel("danger","Empty Message"));
            return;
        }

        $.ajax({
            url: apputils.rest + '/event',
            type:"POST",
            data: JSON.stringify({
                message: $("#taEvent").val(),
                schoolid:$.cookie("schoolid"),
                semid:$.cookie("semid"),
                begindate:$("#txteventstartdate").val(),
                enddate:$("#txteventenddate").val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(resp) {
                view.stopspin(par_button, "Post");
                apputils.echo(resp);//process

                if (resp.status != "ok")
                {
                    $("#lblErrorEvent").html(view.bslabel("danger",resp.message));
                    return;
                }
                //$("#user-timeline li").remove();
                apputils.filltimeline();
            },
            error: function (e) {
                $("#lblErrorEvent").html(view.bslabel("danger","Something went wrong!"));
                view.stopspin(par_button, "Post");
            },
            beforeSend: function (xhrObj){
                $("#lblErrorEvent").html("");
                $("#" + par_button).html(view.spin() + " Pls Wait.. ");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        });
    }

    model.changeschoolyear = function(par_button)
    {
        from = $("#txtbeginningyear").val();

        if (from.length == 0)
        {
            return
        }

        to = parseInt($("#txtbeginningyear").val()) + 1;

        $.ajax({
            url: apputils.rest + '/schoolyear/' + from+to + "/" + $.cookie("schoolid"),
            type:"POST",
            dataType: "json",
            success: function (resp)
            {
                view.stopspin(par_button, "Change");
                if (resp.status == 'OK')
                {
                    $.cookie("semid", from+to);
                    $("#name-rightbadge").data("sections",resp.designated);
                    $("#lblChangeSY").html(view.bslabel("success",
                        "Successfully Changed the Schoolyear to " + from+to));

                }
                else
                {
                    $("#lblChangeSY").html(view.bslabel("danger", resp.message))
                }
            },
            error: function (e) {
                $("#lblChangeSY").html(view.bslabel("danger","Something went wrong!"));
                view.stopspin(par_button, "Post");
            },
            beforeSend: function (xhrObj){
                $("#lblChangeSY").html("");
                $("#" + par_button).html(view.spin() + " Pls Wait.. ");
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }

        });
    }


    model.displayprediction = function(){
            view.displayprediction();
            subject = apputils.getcurrentsubjectbuttonprops().label.split(' ');
            $.ajax({
            url: apputils.rest + "/reports/" + subject[0],
            type: "GET",
            data: {
                    "gradingperiod": $.cookie("quarter"),
                    "section": $("#name-rightbadge").data("section"),
                    "grade_level": $("#name-rightbadge").data("grade"),
                    "schoolid": $.cookie("schoolid"),
                    "semid": $.cookie("semid")},
            datatype: 'json',
            success: function(res){
                apputils.echo(res);
                if (res.length == 0){
                    $('#failingstudentsdiv').append('<p>Nothing found.</p>');
                };

                if (res["status"]==="ok"){
                    for(i=0;i<res["result"].length;i++){
                        var faildivid = '#failingstudentsdiv' + i;
                        var passdivid = '#passingstudentsdiv' + i;
                        var pass
                        var studentname = res["result"][i]["name"] + '<button class="btn btn-danger" id=stud"'+i+'">Show Student Data</button>';
                        var studentpredictedgrade = res["result"][i]["predictedgrade"];

                        if(studentpredictedgrade === "failing"){
                            $(faildivid).append(studentname);
                            $(faildivid).append(studentpredictedgrade);
                        }else{
                            $(passdivid).append(studentname);
                            $(passdivid).append(studentpredictedgrade);
                        }

                    }
                }
                }
            });
        }

        model.showclasslist = function(){
        classlist();
        var schoolid = $.cookie("schoolid");
        var semid = $.cookie("semid");
        var grade_level = $("#name-rightbadge").data("grade");
        var section = $("#name-rightbadge").data("section");
        $.ajax({
            url: apputils.rest + "/classlist/" + schoolid + "/" + semid + "/" + grade_level + "/" + section,
            type: "GET",
            data: {
                    "gradingperiod": $.cookie("quarter"),
                    "section": $("#name-rightbadge").data("section"),
                    "grade_level": $("#name-rightbadge").data("grade"),
                    "schoolid": $.cookie("schoolid"),
                    "semid": $.cookie("semid")
                },
            datatype: 'json',
            success: function(res){
                apputils.echo(res);
                if (res["status"]==="ok"){
                    for(i=0; i<res["size"].length;i++){
                        var name = res["name"];
                        var id = res["id"];

                        var studentry = '<div><input type="checkbox" id="studs"> &nbsp; ' + name + '<br>' + id + '</div>';

                        $('#classlist').append(studentry);
                    }
                }
            }
        });
    }
    

    model.ajaxCall = function (pars)
    {
        /*

        {
         resource: "gradebook",
         data: {
         offeringid:section,
         studentid: $("#name-rightbadge").data("timelrn"),
         schoolid: $.cookie("schoolid"),
         quarter:period,
         semid: $.cookie("semid")
         },
         type: "GET",
         dataType: "json",
         buttonid:"profbtn1",
         buttonlabel:"Get",
         error: function (e){},
         success: function (resp)
         }

         */

        f = function (somev, label, spintext)
        {

            spinnertext = function (spinval)
            {
                result = typeof spintext == "undefined" ?
                    spinval :
                    typeof spintext == "string" ?
                        spintext : spintext();

                    apputils.echo(result);
                return result;
            }

            if (typeof somev == "object")
            {
                stop = function () {
                    apputils.echo("obj-->" + somev);
                    $(somev).html(label);

                };
                spin = function () {
                    apputils.echo("obj<--" + somev);
                    $(somev).html(spinnertext(view.spin() + " Pls Wait.."))

                };
            }
            else
            {
                stop = function () {
                    apputils.echo("oth-->" + somev);
                    view.stopspin(somev, label);

                };

                spin = function () {
                    apputils.echo("oth<--" + somev);
                    view.setspin(somev);


                }
            }
            return {stop:stop, spin:spin};
        };

        spinstop = f(pars.buttonid, pars.buttonlabel, pars.spinnerval);

        basicparams = {
            url: apputils.rest + "/" + pars.resource,
            type: pars.type,
            dataType: pars.dataType,
            success: function(resp) {
                //view.stopspin(pars.buttonid, pars.buttonlabel);
                spinstop.stop();
                pars.success(resp);
            },
            error: function (e) {

                //view.stopspin(pars.buttonid, pars.buttonlabel);
                spinstop.stop();
                pars.error(e);
            },
            beforeSend: function (xhrObj){
                //view.setspin(pars.buttonid);
                spinstop.spin();
                xhrObj.setRequestHeader("Authorization",
                    "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
            }
        }

        if (pars.data !== '' || typeof pars.data !== 'undefined')
        {
            basicparams.data = pars.data;
        }

        if (pars.contentType !== '' || typeof pars.contentType !== 'undefined')
        {
            basicparams.contentType = pars.contentType
        }


        $.ajax(
            basicparams
        ); // ajax
    }

    model.createexam = function(){
            $.ajax({
                url: apputils.rest + '/exam/'+ $.cookie('username'),
                type:"POST",
                dataType: "json",
                data: JSON.stringify(
                    {
                        subjectid: apputils.getcurrentsubjectbuttonprops().label.split(',')[0].split(' ')[0],
                        duration: $('#timeduration').val(),
                        duedate: $('#duedate').val(),
                        title: $('#examtitle').val()
                    }),
                contentType: 'application/json; charset=utf-8',
                success: function(resp) {
                    apputils.echo(resp);
                    $('#examid').val(resp['exam_id']);
                }
            })
        }

    // model.getexams = function(){
    //     $.ajax({
    //         url: apputils.rest + '/exam',
    //         type:"GET",
    //         dataType: "json",
    //         contentType: 'application/json; charset=utf-8',
    //         success: function(resp) {
    //             apputils.echo(resp)
    //         }
    //     })
    // }

    // model.getexamdetails = function(){
    //     $.ajax({
    //         url: apputils.rest + '/exam/' + exam_id,
    //         type:"GET",
    //         dataType: "json",
    //         data:{
    //             lrn: 1,
    //             islocked: 1
    //         }
    //         contentType: 'application/json; charset=utf-8',
    //         success: function(resp) {
    //             apputils.echo(resp);
    //         }
    //     })
    // }


    model.createquestion = function(questionid){
        var choices = [];
        var mode =  $('#questiontype').val();
        var answer;
        apputils.echo(mode);

        if (mode == 1)
        {
            number_of_choices = $('#questiondiv > div').length;

            for(var i=1; i<=number_of_choices; i++ )
                choices.push($('#option_'+i).val());

            choice = $("#optionsRadios1:checked").val();
            answer = $("#"+ choice).val()

        } else if ( mode == 2){
            choices.push('True', 'False');
            if ($('#optionsRadios1:checked').val() == 'true'){
                answer = 'True';
            } else {
                answer = 'False';
            }
        }

        apputils.echo(choices);
        apputils.echo(answer);
        apputils.echo($('#' + questionid).val());
        apputils.echo($('#question'+ questionid + '_point').val());


        $.ajax({
            url: apputils.rest + '/question/' + $.cookie('username') + '/' + $('#examid').val(),
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                question_text: $('#' + questionid).val(),
                choices: choices,
                answer: answer,
                points: $('#question'+ questionid + '_point').val(),
                mode: mode,
                filelink: 'sample/filelink',
            }),
            contentType: 'application/json; charset=utf-8',
            success: function(res){
                apputils.echo(res)

                var displayedquestion = '<div>'+
                    '<div>'+'<h5>Question 1</h5><br>'+'</div>'+
                    '<div>Question</div>'+
                    '<div>choices</div>'+
                    '</div>';

                $("#questionlist").append(displayedquestion);

            }
        });
    }

    model.getstugradedetails = function ()
    {

        section = function () {
            code = '';
            for (i=0; i < $("#name-rightbadge")
                .data("profileload")
                .length; i++)
            {
                if ($("#name-rightbadge")
                        .data("profileload")[i]
                        .subject == $("#selprofileload").val())
                {
                    code = $("#name-rightbadge")
                        .data("profileload")[i]
                        .offeringid;
                    break;
                }
            }
            return code;
        }();
        period = $("#selperiodgrade").val();


        /*
         data: JSON.stringify(
         {
         password1:$("#newpassword").val(),
         password2:$("#repeatpassword").val()
         }),
         contentType: 'application/json; charset=utf-8',
         */

        model.ajaxCall({
            resource: "gradebook",
            data: {
                offeringid:section,
                studentid: $("#name-rightbadge").data("timelrn"),
                schoolid: $.cookie("schoolid"),
                quarter:period,
                semid: $.cookie("semid")
            },
            type: "GET",
            dataType: "json",
            buttonid:"profbtn1",
            buttonlabel:"Get",
            error: function (e){},
            success: function (resp) {
                apputils.echo(resp);
                if (resp.status == 'ok')
                {
                    size = resp.category.length;
                    for (var i=0; i < size; i++)
                    {
                        loc_cats = resp.category[i];
                        tablename = "tbl" + loc_cats.name
                                .replace(" ", "")
                                .toLowerCase();
                        apputils.echo(tablename);

                        collength = $($("#" + tablename).find('tr')[0]).find('th').length;
                        arrmaxscore = apputils.initarray(collength, '');
                        arrstuscore = apputils.initarray(collength, '');
                        maxtotscore = 0;
                        stutotscore = 0;
                        for (var j = 0; j < loc_cats.entries.length; j++)
                        {
                            index = parseInt(loc_cats.entries[j].entryname) - 1;
                            arrmaxscore[index] = loc_cats.entries[j].maxscore;
                            arrstuscore[index] = loc_cats.entries[j].score;
                            maxtotscore += apputils.blankto0(loc_cats.entries[j].maxscore);
                            stutotscore += apputils.blankto0(loc_cats.entries[j].score);
                            apputils.echo(j);
                        }
                        apputils.echo(arrmaxscore);
                        apputils.echo(arrstuscore);
                        arrheader = apputils.makearray(collength);
                        arrheader[collength - 3] = "Total";
                        arrheader[collength - 2] = "PS";
                        arrheader[collength - 1] = "WS";

                        $("#" + tablename + " tbody").html("");
                        arrmaxscore[collength - 3] = +parseFloat(maxtotscore).toFixed(3);
                        arrstuscore[collength - 3] = +parseFloat(stutotscore).toFixed(3);

                        if (loc_cats.stugrade.length > 0)
                        {
                            arrstuscore[collength - 2] = loc_cats.stugrade[0][0];
                            arrstuscore[collength - 1] = loc_cats.stugrade[0][3];
                        }


                        tabrowheader = apputils.maketablehead(collength, arrheader);
                        tabrowmaxscore = apputils.maketablehead(collength, arrmaxscore);
                        tabrowstuscore = apputils.maketablerow(collength, arrstuscore);
                        $("#" + tablename + " tbody").append(tabrowheader);
                        $("#" + tablename + " tbody").append(tabrowmaxscore);
                        $("#" + tablename + " tbody").append(tabrowstuscore);
                    }
                }
            }
        });

    }

    model.getattendancedetails = function (par_lrn, par_this, par_btnlabel)
    {
        model.ajaxCall({
            resource: "attendance",
            data: {
                studentid:par_lrn,
                semid:$.cookie("semid"),
                schoolid:$.cookie("schoolid"),
                month: $("#selattmonth").val(),
                year: $("#txtattyear").val()
            },
            type:"GET",
            dataType: "json",
            buttonid: par_this,
            buttonlabel:par_btnlabel,
            error: function (e) {},
            success: function (resp)
            {
                apputils.echo(resp);
                $("#tblattendancedetails").html("");
                tabrowheader = apputils.maketablehead(4, ["Date", "Status", "Day Part","Points"])
                $("#tblattendancedetails").append(tabrowheader);
                totpoints = 0.0;
                d = '';
                for (var i = 0; i < resp.attendance.length; i++)
                {
                    points = resp.attendance[i].points;
                    totpoints += parseFloat(points);
                    dispdate = '';
                    if (d != resp.attendance[i].date)
                    {
                        dispdate = resp.attendance[i].date;
                        d = resp.attendance[i].date;
                    }

                    switch (resp.attendance[i].status)
                    {
                        case "PRESENT":
                            dispbadge = view.smallbadge("green", "PRESENT");
                            break;
                        case "ABSENT":
                            dispbadge = view.smallbadge("red", "ABSENT");
                            break;
                        case "EXCUSED":
                            dispbadge = view.smallbadge("blue", "EXCUSED");
                            break;
                        case "LATE":
                            dispbadge = view.smallbadge("orange", "LATE");
                            break;
                    }

                    $("#tblattendancedetails")
                        .append(
                            apputils.
                            maketablerow(4,
                                [
                                    dispdate,
                                    dispbadge,
                                    resp.attendance[i].daypart,
                                    points
                                ]

                            )
                        );
                }

                $("#tblattendancedetails").append(
                    apputils.maketablerow(4,[
                        "Total",'', '',
                        view.smallbadge("gray",
                                totpoints.toFixed(2) +
                                " of " +
                                parseFloat(resp.total).toFixed(2))
                    ])
                );
            }
        });
    }


    model.searchfaculty = function (btnname)
    {
        model.ajaxCall({
            resource: "faculty/" + $("#teachersearch").val(),
            type: "GET",
            dataType: "json",
            buttonid: btnname,
            buttonlabel: "Search",
            error: function (e) {
            },
            success: function (resp) {
                apputils.echo(resp);
                $("#coteachsearchtab tbody").html("");
                $("#coteachsearchtab tbody").append("<tr>"+
                    '<th>Action</th>' +
                    '<th>Name</th>' +
                    "</tr>")
                for (var i = 0; i < resp.size; i++)
                {
                    fid = resp.list[i].lrn;
                    $("#coteachsearchtab tbody")
                        .append(
                            '<tr>' +
                                '<td>' +
                                view.buttonact('success btn-xs',
                                'Add',
                                'model.addcoteacher(\'' + fid +
                                                   '\',\'btnadd'+fid+'\',\''+
                                                    resp.list[i].fullname+'\')',
                                "btnadd" + fid) +
                                '</td>' +
                                '<td>' +
                                  resp.list[i].fullname +
                                '</td>' +
                            '</tr>'
                        );
                }
            }
        });

    }

    model.addcoteacher = function (par_id, par_btnid, par_fullname)
    {
        //alert(par_id + ' ' + par_btnid);
        model.ajaxCall({
            resource: "faculty/" + $.cookie("username")  +
                "/" + par_id + "/" + $("#name-rightbadge").data("sectionid"),
            type: "POST",
            dataType: "json",
            buttonid: par_btnid,
            buttonlabel: "Add",
            error: function (e) {
            },
            success: function (resp) {
               apputils.echo(resp);
               if (resp.status == 'ok')
               {
                   if (resp.update == 'yes') {
                       $("#subjcoteacher").append(
                           view.boxcomment(apputils.soonpath(resp.pic),
                               apputils.space(2) + par_fullname,
                               "", "", "div" + par_id) +
                           view.buttonact("danger btn-xs fa fa-minus",
                           "",
                           "model.removecoteacer('"+"removecollab"+par_id+"','"+par_id+"')",
                           "removecollab"+par_id) +
                           apputils.newline()
                       );
                       index = apputils.getIndexID(
                           $("#name-rightbadge")
                               .data("sectionid"));
                       $("#name-rightbadge")
                           .data("subjects")[index]
                           .coteachers
                           .push({
                               fullname:par_fullname,
                               idnum:par_id,
                               pic:resp.pic
                           });
                   }
               }
               else
               {
                   apputils.poperror(resp.message);
               }
            }
        });
    }

    model.removecoteacher = function (par_btnid, par_personnumid)
    {
        model.ajaxCall({
            resource: "faculty/"  +
            "" + par_personnumid + "/" + $("#name-rightbadge").data("sectionid"),
            type: "DELETE",
            dataType: "json",
            buttonid: par_btnid,
            buttonlabel: "",
            error: function (e) {
            },
            success: function (resp) {
                apputils.echo(resp);
                if (resp.status == "ok")
                {
                    $("#div"+par_personnumid).remove();
                    $("#removecollab"+par_personnumid).remove();
                    index = apputils.getIndexID(
                        $("#name-rightbadge")
                            .data("sectionid"));
                    $("#name-rightbadge")
                        .data("subjects")[index]
                        .coteachers
                        .splice(
                            apputils.getIndexOfCollab(index, par_personnumid),
                            1);

                    return;
                }
                apputils.poperror(resp.message);
            }
        });
    }
    //model.last
} ( window.model = window.model || {}, jQuery ));




(function(view, $, undefined ) {

    view.setspin = function (id, ajxlabel)
    {
        ajxlabel = typeof ajxlabel !== 'undefined' ?
            ajxlabel : view.spin() + " Pls wait..";
        $("#" + id).html(ajxlabel);
        //$("#" + id).button("loading");
    }

    view.stopspin = function (id, val)
    {
        $("#" + id).html(val);
        //$("#" + id).button("reset");
    }


    view.textarea = function (par_txtarea)
    {
        /*
         {
         id:"id",
         rows:4,
         cols:'20',
         placeholder:"kani"
         }



         */

        return   '<textarea class="form-control" id="'+
            par_txtarea.id+'" rows="'+par_txtarea.rows+'" '+
            apputils.ifundefined(par_txtarea.cols,
                ' cols="' + par_txtarea.cols + '"' ,
                '') +
            apputils.ifundefined(par_txtarea.wrap,
                ' wrap="' + par_txtarea.wrap + '"' ,
                '') +
            ' placeholder="'+
            par_txtarea.placeholder + '"></textarea>';
    }

    view.timelineitem = function (titem, tstamp, tbody, tfooter)
    {

        /*
         view.timelineitem(
         {btnicolor:'fa fa-remove',
         theader:'No Activity Yet'}, '',
         'You will see impt activities here soon.',
         '...');
         */

        return  "<li>" +
            '<i class="'+ titem.btnicolor + '"></i>' +
            '<div class="timeline-item">' +
            '<span class="time"><i class="fa fa-clock-o"></i>'+tstamp+'</span>' +
            '<h3 class="timeline-header">' +
            ' &nbsp; <a href="#">' + titem.theader + '</a> ...</h3>' +
            '<div class="timeline-body"> ' + tbody + '</div>' +
            '<div class="timeline-footer">' +
            '<a class="btn btn-primary btn-xs">'+ tfooter + '</a>' +
            '</div>' +
            '</div>' +
            '</li>';

    }
    
    view.reports = function (feelingcount){
        apputils.echo(feelingcount);
        var barChartData = {
          labels: ["Happy", "Sad", "Angry", "Surprised"],
          datasets: [
            {
              label: "Statistics",
              fillColor: "rgba(210, 214, 222, 1)",
              strokeColor: "rgba(210, 214, 222, 1)",
              pointColor: "rgba(210, 214, 222, 1)",
              pointStrokeColor: "#c1c7d1",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: [feelingcount.hcount, feelingcount.scount, feelingcount.acount, feelingcount.ucount]
              //data: [10, 15, 16, 13]
            }]
            
        };

        var opts = {
         fillColor:"#00a65a",
         strokeColor:"#00a65a",
         pointColor:"#00a65a",
         datasetFill:false
         };
         
        var barChartOptions = {
          //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
          scaleBeginAtZero: true,
          //Boolean - Whether grid lines are shown across the chart
          scaleShowGridLines: true,
          //String - Colour of the grid lines
          scaleGridLineColor: "rgba(0,0,0,.05)",
          //Number - Width of the grid lines
          scaleGridLineWidth: 1,
          //Boolean - Whether to show horizontal lines (except X axis)
          scaleShowHorizontalLines: true,
          //Boolean - Whether to show vertical lines (except Y axis)
          scaleShowVerticalLines: true,
          //Boolean - If there is a stroke on each bar
          barShowStroke: true,
          //Number - Pixel width of the bar stroke
          barStrokeWidth: 2,
          //Number - Spacing between each of the X value sets
          barValueSpacing: 5,
          //Number - Spacing between data sets within X values
          barDatasetSpacing: 1,
          //String - A legend template
          legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
          //Boolean - whether to make the chart responsive
          responsive: true,
          maintainAspectRatio: true
        };
        
        var id = "barChart";
        
        apputils.echo(barChartOptions);
        apputils.echo(barChartData);
    
        apputils.barchart(id, barChartOptions, barChartData, opts);
    }

    view.postbox = function (titem,
                             tstamp,
                             tbody,
                             //tfooter,
                             //recentfeeling,
                              tltype
                             //recordentryid
       )
    {
        /*

         $("#user-timeline").append(
         view.postbox(
         {
         btnicolor: apputils.bulletinboard(),
         theader:"Orven E. Llantos",
         imgsrc:'../dist/img/user7-128x128.jpg'
         },
         'tstamp',
         "this body"))


         apputils.echo(titem);
         apputils.echo(tstamp);
         apputils.echo(tbody);
         apputils.echo("");*/
         
         /*apputils.echo(tltype);*/
         
       var loc_footer = "";
       usertype = $.cookie("usertype");
 /*      apputils.echo(recentfeeling);
        if (tltype == "grade" && usertype == "students")
        {            
            if (recentfeeling.length == 0)
            {
                loc_footer = '<li><button title="Happy" class="btn btn-xs" padding="2px 2px;" id="hbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'hbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[2][1] + "'" + ');">Happy</button></li>'  +
                                 '<li><button title="Surprised" class="btn btn-xs" padding="2px 2px;" id="ubtn' + recordentryid + '"  onclick="model.savefeeling(' + "'ubtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[3][1] + "'" + ');">Surprised</button></li>' +
                                 '<li><button title="Sad" class="btn btn-xs" padding="2px 2px;" id="sbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'sbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[1][1] + "'" + ');">Sad</button></li>' +
                                 '<li><button title="Angry" class="btn btn-xs" padding="2px 2px;" id="abtn' + recordentryid + '"  onclick="model.savefeeling(' + "'abtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[0][1] + "'" + ');">Angry</button></li>';
            }
            else if (recentfeeling[0][0] == 1)
                {
                    loc_footer = '<li><button title="Happy" class="btn btn-xs" padding="2px 2px;" id="hbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'hbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[2][1] + "'" + ');">Happy</button></li>'  +
                                 '<li><button title="Surprised" class="btn btn-xs" padding="2px 2px;" id="ubtn' + recordentryid + '"  onclick="model.savefeeling(' + "'ubtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[3][1] + "'" + ');">Surprised</button></li>' +
                                 '<li><button title="Sad" class="btn btn-xs" padding="2px 2px;" id="sbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'sbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[1][1] + "'" + ');">Sad</button></li>' +
                                 '<li><button title="Angry" class="btn btn-success btn-xs" padding="2px 2px;" id="abtn' + recordentryid + '"  onclick="model.savefeeling(' + "'abtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[0][1] + "'" + ');">Angry</button></li>';
                }
            else if ( recentfeeling[0][0] == 2)
                {
                    loc_footer = '<li><button title="Happy" class="btn btn-xs" padding="2px 2px;" id="hbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'hbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[2][1] + "'" + ');">Happy</button></li>' +
                                 '<li><button title="Surprised" class="btn btn-xs" padding="2px 2px;" id="ubtn' + recordentryid + '"  onclick="model.savefeeling(' + "'ubtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[3][1] + "'" + ');">Surprised</button></li>' +
                                 '<li><button title="Sad" class="btn btn-success btn-xs" padding="2px 2px;" id="sbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'sbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[1][1] + "'" + ');">Sad</button></li>' +
                                 '<li><button title="Angry" class="btn btn-xs" padding="2px 2px;" id="abtn' + recordentryid + '"  onclick="model.savefeeling(' + "'abtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[0][1] + "'" + ');">Angry</button></li>' ;
                }
            else if ( recentfeeling[0][0]== 3)
                {
                    loc_footer = '<li><button title="Happy" class="btn btn-success btn-xs"  padding="2px 2px;" id="hbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'hbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[2][1] + "'" + ');"><img src="../../ionicons/png/emoticons/happy.png" width="30px;" height="30px;"/></button></li>' +
                                 '<li><button title="Surprised" class="btn btn-xs" padding="2px 2px;" id="ubtn' + recordentryid + '"  onclick="model.savefeeling(' + "'ubtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[3][1] + "'" + ');">Surprised</button></li>' + 
                                 '<li><button title="Sad" class="btn btn-xs" padding="2px 2px;" id="sbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'sbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[1][1] + "'" + ');">Sad</button></li>' +
                                 '<li><button title="Angry" class="btn btn-xs" padding="2px 2px;" id="abtn' + recordentryid + '"  onclick="model.savefeeling(' + "'abtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[0][1] + "'" + ');">Angry</button></li>' ;
                }
            else if ( recentfeeling[0][0] == 4)
                {
                    loc_footer = '<li><button title="Happy" class="btn btn-xs" padding="2px 2px;" id="hbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'hbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[2][1] + "'" + ');">Happy</button></li>'  +
                                 '<li><button title="Surprised" class="btn btn-success btn-xs" padding="2px 2px;" id="ubtn' + recordentryid + '"  onclick="model.savefeeling(' + "'ubtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[3][1] + "'" + ');">Surprised</button></li>'+
                                 '<li><button title="Sad" class="btn btn-xs" padding="2px 2px;" id="sbtn' + recordentryid + '"  onclick="model.savefeeling(' + "'sbtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[1][1] + "'" + ');">Sad</button></li>' +
                                 '<li><button title="Angry" class="btn btn-xs" padding="2px 2px;" id="abtn' + recordentryid + '"  onclick="model.savefeeling(' + "'abtn" +recordentryid+ "', '" + recordentryid + "', '" +  tfooter[0][1] + "'" + ');">Angry</button></li>';
                }
            else
                {
                    loc_footer = '<li>Something Went Wrong</li>';
                }
        
        }
        */
        //apputils.echo("i have room");

        return  "<li>" +
            '<i class="'+ titem.btnicolor + '"></i>' +
            '<div class="timeline-item">' +
            '<span class="time"><i class="fa fa-clock-o"></i>'+tstamp+'</span>' +
            '<h3 class="timeline-header">' +
            '<img style="margin-top: -6px;" class="img-rounded img-sm pull-left" ' +
            ' src="' + titem.imgsrc + '" alt="user image">  &nbsp; ' +
            '  <a href="#">' + titem.theader + '</a></h3>' +
            '<div class="timeline-body"> ' + tbody + '</div>' +
            '</div>' +
            '</li>';

    }



    view.postboxsocial = function (titem, tstamp, tbody, tfooter)
    {
        return  "<li>" +
            '<i class="'+ titem.btnicolor + '"></i>' +
            '<div class="timeline-item">' +
            '<span class="time"><i class="fa fa-clock-o"></i>'+tstamp+'</span>' +
            '<h3 class="timeline-header">' +
            '<img style="margin-top: -6px;" class="img-rounded img-sm pull-left" ' +
            ' src="' + titem.imgsrc + '" alt="user image">  &nbsp; ' +
            '  <a href="#">' + titem.theader + '</a></h3>' +
            '<div class="timeline-body"> ' + tbody + '</div>' +
            '<div class="timeline-footer">' +
            '<ul class="list-inline">' +
            '<li><a href="#" class="link-black text-sm"><i class="fa fa-share margin-r-5"></i> Share</a></li>' +
            '<li><a href="#" class="link-black text-sm"><i class="fa fa-thumbs-o-up margin-r-5"></i> Like</a></li>' +
            '<li class="pull-right"><a href="#" class="link-black text-sm"><i class="fa fa-comments-o margin-r-5"></i> Comments (5)</a></li>' +
            '</ul>' +
            '<input class="form-control input-sm" type="text" placeholder="Type a comment">' +
            '</div>' +
            '</div>' +
            '</li>';

        /*
         ../dist/img/user7-128x128.jpg
         for list-inline

         for comment
         '<input class="form-control input-sm" type="text" placeholder="Type a comment">' +

         $("#user-timeline").append(view.postbox({btnicolor: apputils.bulletinboard(), theader:"Orven E. Llantos", imgsrc:'../dist/img/user7-128x128.jpg'}, 'tstamp', "this body", "this footer"))

         */


    }





    view.postmsg = function (titem, tstamp, tbody, tfooter)
    {
        return  "<li>" +
            '<i class="'+ titem.btnicolor + '"></i>' +
            '<div class="timeline-item">' +
            '<span class="time"><i class="fa fa-clock-o"></i>'+tstamp+'</span>' +
            '<h3 class="timeline-header">' +
            '<img style="margin-top: -6px;" class="img-rounded img-sm pull-left" ' +
            ' src="' + titem.imgsrc + '" alt="user image">  &nbsp; ' +
            '  <a href="#">' + titem.theader + '</a></h3>' +
            '<div class="timeline-body"> ' + tbody + '</div>' +
            '<div class="timeline-footer">' +
            '<form class="form-horizontal"> ' +
            '<div class="form-group margin-bottom-none"> ' +
            column(9, '<input id="postreplytext" class="form-control input-sm" placeholder="Reply">') +
            column(3, view.buttonact("btn btn-success pull-right btn-block fa fa-paper-plane",
                "&nbsp;&nbsp;Reply",
                'model.reply("'+ titem.personnumid +'","' + $("#postreplytext").text() +'", "btnreplypost")', "btnreplypost")) +
            '</div> ' +
            '</form> ' +
            '</div>' +
            '</div>' +
            '</li>';

        /*
         ../dist/img/user7-128x128.jpg
         for list-inline
         '<li><a href="#" class="link-black text-sm"><i class="fa fa-share margin-r-5"></i> Share</a></li>' +
         '<li><a href="#" class="link-black text-sm"><i class="fa fa-thumbs-o-up margin-r-5"></i> Like</a></li>' +
         '<li class="pull-right"><a href="#" class="link-black text-sm"><i class="fa fa-comments-o margin-r-5"></i> Comments (5)</a></li>' +

         for comment
         '<input class="form-control input-sm" type="text" placeholder="Type a comment">' +

         $("#user-timeline").append(view.postmsg({btnicolor: apputils.bulletinboard(), theader:"Orven E. Llantos", imgsrc:'../dist/img/user7-128x128.jpg', personnumid:"sender"}, 'tstamp', "this body", "this footer"))
         */


    }

    view.timenext = function ()
    {
        return '<li>' +
            '<i class="fa fa-sort-amount-asc bg-blue" id="nexttimes"></i>' +
            '<div class="timeline-item">' +
            '</div>' +
            '</li>';
    }

    view.labeldate = function (d8)
    {
        return  '<li class="time-label">' +
            '<span class="bg-red">' +
            d8 +
            '</span>'+
            '</li>';
    }

    view.timeline = function (tdatecurrent, init)
    {
        var timeline = '<ul  id="user-timeline" class="timeline">' +
            view.labeldate(tdatecurrent) +
            '</ul>';
        if (init)
        {
            $("#main").html(column(12,row(column(12,timeline))));
        }
        else
        {
            $("#user-timeline").append(timeline);
        }
    }

    view.initcalendar = function ()
    {

        $("#main").html(column(12, view.simplebox({
            boxtype:"primary",
            title:"Scheduled Activities and Deadlines",
            body:'<div id="calendar"></div>',
            footer:''
        })));

        $("#calendar").fullCalendar({
            header: {
                left:'today',
                center: "",
                right: 'month'
            },
            buttonText: {
                today:'today',
                month:'month',
                week:'week',
                day:'day'
            },
            editable:true,
            droppable:false
        });
        model.getcalentries();

    }


    view.initchangepass = function ()
    {
        $("#main").html(
            column(2,"")+
            column(8,view.simplebox({
                boxtype:'primary',
                title:"Change Password",
                body:view.exformgroup(
                    view.exinputtext("New Password", "password", "newpassword","") + '<br/>' +
                    view.exinputtext("Repeat Password","password", "repeatpassword","")
                ),
                footer:view.paragraph({id:"lblErrorPass", class:'', content:""}) +
                view.buttonact("success pull-right",
                    "OK", "model.updatepassword('btnChangePass')",
                    "btnChangePass")
            })) +
            column(2,"")
        );

        function checkequal()
        {
            var e = '';

            if ($("#newpassword").val() != $("#repeatpassword").val())
            {
                e = " Password do not match."
            }
            return e;
        }

        $("#newpassword").bind("input propertychange",function () {
            $("#lblErrorPass").html(view
                .colortext("danger",
                    apputils.checkPassword("newpassword") +
                    checkequal()));
        });

        $("#repeatpassword").bind("input propertychange",function () {
            $("#lblErrorPass").html(view
                .colortext("danger",
                    apputils.checkPassword("repeatpassword") +
                    checkequal()));
        });

    }


    view.inittimeline = function ()
    {
        var timeline = '<ul  id="user-timeline" class="timeline">' +
            '<li>' + view.boxloading() + '</li>' +
            '</ul>';
        $("#main").html(
            column(12,
                function () {
                    if ($.cookie("usertype") == "faculty") {
                        return row(
                            column(2, "") +
                            column(8, view.timepostbox()) +
                            column(2, ""));
                    }
                    else
                    {
                        return '';
                    }
                } () +
                row(column(12,timeline)))

        );
        $("#taBulletin").wysihtml5({toolbar:{"image":false}});
        $("#taAssignment").wysihtml5({toolbar:{"image":false}});
        $("#taEvent").wysihtml5({toolbar:{"image":false}});
        var now = apputils.noww();
        $("#txtassignduedate").datetimepicker({
            format:'Y/m/d',
            timepicker:false,
            onShow:function(ct){
                this.setOptions({
                    minDate: now
                })
            }
        });

        $("#txteventstartdate").datetimepicker({
            format:'Y/m/d',
            timepicker:false,
            onShow:function(ct){
                this.setOptions({
                    maxDate: jQuery("#txteventenddate").val()?
                        jQuery('#txteventenddate').val():false
                })
            }
        });
        $("#txteventenddate").datetimepicker({
            format:'Y/m/d',
            timepicker:false,
            onShow:function(ct){
                this.setOptions({
                    minDate:jQuery("#txteventstartdate").val()?
                        jQuery("#txteventstartdate").val():false
                })
            }
        });

        $("#txtassignduedate").val(now);
        $("#txteventstartdate").val(now);
        $("#txteventenddate").val(now);

    }

    view.listsections = function ()
    {
        /*sections = $("#name-rightbadge").data("sections");
         boxes = '';
         for (i = 0; i < sections.length; i++)
         {
         ids = sections[i].section+i;
         properties = {
         boxid:ids,
         color:"aqua",
         icon:"fa fa-paw",
         idh:"hdr" +ids,
         header:"Section",
         idh2:"hdr2" +ids,
         content:view
         .buttonact("info",
         sections[i].section,
         "apputils.switchsection('"+sections[i].section+"')")
         };
         boxes += view.boxnoprogress(properties);
         }*/
        sections = $("#name-rightbadge").data("sections");
        sectionlst = [];
        for (i=0; i< sections.length; i++)
        {
            sectionlst[i] = sections[i].section + "-" + sections[i].grade;
        }

        $("#main").html(view.rowdify(sectionlst, view.boxnoprogress,
            function (ids)
            {
                gsec = ids.split("-");
                return {
                    boxid:ids,
                    color:"aqua",
                    icon:"fa fa-paw",
                    idh:"hdr" +ids,
                    header:"Section",
                    idh2:"hdr2" +ids,
                    content:view
                        .buttonact("info",
                            gsec[1] + "-" + gsec[0],
                            "apputils.switchsection('"+gsec[0]+
                            "',"+apputils.kto0(gsec[1])+")")
                }

            }
            ,"Assigned Section(s)"));

        /* $("#main").html(column(12, view.boxify("listsections", "Assigned Sections",
         boxes, "", "")
         ));*/

    }

    view.compose = function (data, init)
    {
        $("#user-timeline li").remove();
        view.inittimeline();

        /*for (i=0; i < data.items.length; i++)
         {
         switch (data.items[i].type)
         {
         case "product":
         decor = apputils.product;
         break;
         case "client":
         decor = apputils.client;
         break;
         case "driver":
         decor = apputils.driver;
         break;
         case "truck":
         decor = apputils.truck;
         break;
         case "trip":
         decor = apputils.trip;
         break;
         }

         $("#user-timeline").append(view.timelineitem(
         decor,
         data.items[i].timestamp,
         data.items[i].description,
         '..'
         ));
         }*/
        $("#name-rightbadge").data("offset", 0);
        $("#nexttimes").click(model.gettimeline);
        if ($.cookie("usertype") != 'parents')
        { model.gettimeline(); }

    }



    function addmenuitem(mnudata, nestedmenu)
    {
        nestedmenu = typeof nestedmenu !== 'undefined' ? ' ' + nestedmenu : "";
        $("#user-menus").append('<li id="umnu'+ mnudata.id +
            '"><a href="#"><i class="'+ mnudata.ico +
            '"></i> <span>'+ mnudata.label +'</span></a>'+
            nestedmenu + '</li>');
    }

    view.sidemenu = function (persontype)
    {
        $("#user-menus").html("");
        $("#user-menus").append('<li class="header">Options</li>');

        switch(persontype)
        {
            case "faculty":
                addmenuitem(apputils.mnutimeline);
                $("#umnu" + apputils.mnutimeline.id)
                    .click(function () {
                        view.mainloading();
                        apputils.filltimeline();
                    });


                addmenuitem(apputils.mnucalendar);
                $("#umnu" + apputils.mnucalendar.id)
                    .click(function () {
                        view.mainloading();
                        view.initcalendar();
                    });

                if (apputils.isadviser()) {
                    addmenuitem(apputils.mnuenroll);
                    $("#umnu" + apputils.mnuenroll.id)
                        .click(function () {
                            view.enroll();
                        });

                    addmenuitem(apputils.mnuregister);
                    $("#umnu" + apputils.mnuregister.id)
                        .click(function () {

                            $("#name-rightbadge")
                                .data("enrlrn", "");
                            view.regdetail();
                        })

                    addmenuitem(apputils.mnuswitchsection);
                    $("#umnu" + apputils.mnuswitchsection.id)
                        .click(function () {
                            view.listsections();
                        });

                    addmenuitem(apputils.mnusclasslist);
                    $("#umnu" + apputils.mnusclasslist.id)
                        .click(function () {
                            model.classlist("umnu" + apputils.mnusclasslist.id);
                        });
                }

                // addmenuitem(apputils.mnudisplayexamoptions);
                // $("#umnu" + apputils.mnudisplayexamoptions.id)
                //     .click(function (){
                //         view.displayexamoptions();
                //     });

                addmenuitem(apputils.mnussubjects);
                $("#umnu" + apputils.mnussubjects.id)
                    .click(function () {
                        model.getuserload();
                    });
                    
                addmenuitem(apputils.mnuchangesem);
                $("#umnu" + apputils.mnuchangesem.id)
                    .click(function () {
                        view.changeschoolyear();
                    });

                //
                addmenuitem(apputils.mnuactivate);
                $("#umnu" + apputils.mnuactivate.id)
                    .click(function () {
                        view.activateacct();
                    });

                addmenuitem(apputils.mnuchangesem);
                $("#umnu" + apputils.mnuchangesem.id)
                    .click(function () {
                        view.changeschoolyear();
                    });

                break;

            case "students":

                addmenuitem(apputils.mnutimeline);
                $("#umnu" + apputils.mnutimeline.id)
                    .click(function () {
                        view.mainloading();
                        apputils.filltimeline();
                    });

                addmenuitem(apputils.mnucalendar);
                $("#umnu" + apputils.mnucalendar.id)
                    .click(function () {
                        view.mainloading();
                        view.initcalendar();
                    });


                addmenuitem(apputils.mnuclasscard);
                $("#umnu" + apputils.mnuclasscard.id)
                    .click(function () {
                        model.profile($.cookie("lrn"),
                            "umnu" + apputils.mnuclasscard.id,
                            '');
                    });

                addmenuitem(apputils.mnutakeexam);
                $("#umnu" + apputils.mnutakeexam.id)
                    .click(function () {
                        view.takeexam();
                    });

                break;

            case "parents":
                addmenuitem(apputils.mnumykids);
                $("#umnu" + apputils.mnumykids.id)
                    .click(function () {
                        view.mykids();
                    });
                break;
        }


        addmenuitem(apputils.mnuchangepass);
        $("#umnu" + apputils.mnuchangepass.id)
            .click(function () {
                view.initchangepass();
            });

        addmenuitem(apputils.mnuuploadpic);
        $("#umnu" + apputils.mnuuploadpic.id)
            .click(function () {
                view.uploadpic();
            });

    }

    view.fillinfo = function (info)
    {
        $("#name-rightbadge").html(info.name);
        $("#name-downbadge").html(info.name);
        $("#name-leftbadge").html(info.name);
        $("#user-position").html(info.position);
    }

    view.setprofimg = function (ref)
    {
        $("#img-leftbadge")
            .error(function () {
                $(this).attr('src', 'dist/img/soon.jpg');
            })
            .attr('src', ref);
        $("#img-rightbadge").error(function () {
            $(this).attr('src', 'dist/img/soon.jpg');
        })
            .attr('src', ref);
        $("#img-downbadge").error(function () {
            $(this).attr('src', 'dist/img/soon.jpg');
        })
            .attr('src', ref);
    }


    view.logout = function()
    {
        $("#main").append(view.loginbox());
        $("#umnu" + apputils.mnuenroll.id).unbind("click");
        $("#umnu" + apputils.mnuregister.id).unbind("click");
        $("#umnu" + apputils.mnuswitchsection.id).unbind("click");
        $("#umnu" + apputils.mnutimeline.id).unbind("click");
        $("#name-userops").html('');
        $("#schoolname").html('Elementary');

    }


    view.resetall = function ()
    {
        $("#name-rightbadge").html("");
        $("#name-downbadge").html("");
        $("#name-leftbadge").html("");
        $("#user-position").html("");
        $("#user-menus").html("");
        $("#main").html("");
        view.setprofimg("dist/img/avatar04.png");
        model.sysout();
        view.logout();
    }

    view.alertbox=function (atype, content)
    {
        return '<div class="alert alert-' + atype + ' alert-dismissable ">' +
            '<button type="button" class="close" data-dismiss="alert" '+
            'aria-hidden="true">×</button>'+
            '<i class="icon fa fa-ban"></i>' +
            content +
            '</div>';
    }



    view.loginbox = function ()
    {
        modhtml = '<div class="login-box">' +
            '<div class="login-logo">' +
            apputils.appname +
            '</div><!-- /.login-logo -->' +
            '<div class="login-box-body">' +
            '<p class="login-box-msg">Sign in to start your session</p>' +
            '<div class="form-group has-feedback">' +
            '<input id="username" type="email" class="form-control" placeholder="User Name">' +
            '<span class="fa fa-user-secret form-control-feedback"></span>' +
            '</div>' +
            '<div class="form-group has-feedback">' +
            '<input id="password" type="password" class="form-control" placeholder="Password">' +
            '<span class="glyphicon glyphicon-lock form-control-feedback"></span>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-8">' +
            '<div id="errlog"></div>' +
            '</div><!-- /.col -->' +
            '<div class="col-xs-4">' +
            '<table><tr><td>' +
            '<button id="btnlogin" class="btn btn-primary btn-large btn-block btn-flat" onclick="apputils.login()">Sign In</button>' +
            '</td><td id="logineffects"></td></tr></table>' +
            '</div><!-- /.col -->' +
            '</div>' +
            '</div><!-- /.login-box-body -->' +
            '</div><!-- /.login-box -->';

        return modhtml;
    }

    view.timelineclean = function () {
        //$("#umnu" + apputils.mnutime.id).unbind("click");
    }

    view.selectize = function (json, fcn, id, title, selectid)
    {

        compo = '<select class="form-control" id="'+selectid+'">'
        for (i=0; i < json.length; i++)
        {
            compo += '<option>' + fcn(json, i) + '</option>';
        }
        compo += '</select>';

        return compo;
    }

    view.spinner = function ()
    {
        return '<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>';
    }

    view.mnuspinner = function ()
    {
        return '<a href="#">' +
            '<i></i>' +
            '<span>'+view.spin() + " Pls wait.." +'</span>' +
            '</a>';
    }

    view.menuentry = function (menuobj)
    {
        return '<a href="#">' +
            '<i class="' + menuobj.ico+ '"></i>' +
            '<span>'+ menuobj.label+ '</span>' +
            '</a>';

    }

    view.spin = function ()
    {
        return '<i class="fa fa-refresh fa-spin"></i>';
    }

    view.check = function ()
    {
        return '<div class="overlay"><i class="fa fa-refresh fa-check-circle"></i></div>';
    }

    function boxwithminimize(boxid, title, contents, footer, moreclass)
    {

        moreclass = typeof moreclass !== 'undefined' ? ' ' + moreclass : "";
        return '<div class="box box-default '+ moreclass +'" id="'+boxid+'">' +
            '<div class="box-header with-border">' +
            '<h3 class="box-title">'+title+'</h3>' +
            '<div class="box-tools pull-right">' +
            '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>' +
            '</div>'+
            '</div><!-- /.box-header -->'+
            '<div class="box-body">'+
            contents +
            '</div><!-- /.box-body -->'+
            '<div class="box-footer">' +
            footer +
            '</div>' +
            '</div><!-- /.box -->';
    }

    view.boxify = function (boxid, title, contents, footer, moreclass)
    {
        return boxwithminimize(boxid, title, contents, footer, moreclass);
    }

    function boxwidget(color, icon, text1, text2, idt1, idt2, iconid)
    {
        iconid = apputils.ifundefined(iconid, "id=" + '"'+ iconid +'"' , '');
        return   '<div class="info-box bg-'+color+'">' +
            '<span class="info-box-icon"><i class="' + icon + '"  '+iconid+'></i></span>' +
            '<div class="info-box-content">' +
            '<span '+ idt1 +' class="info-box-text">' + text1 + '</span>' +
            '<span><h4 '+ idt2 +' >' + text2 + '</h4></span>' +
            '<div class="progress"><div class="progress-bar" style="width:80%"></div></div>' +
            '</div><!-- /.info-box-content -->' +
            '</div><!-- /.info-box -->';
    }

    view.exboxwidget = function(par_obj)
    {
        return boxwidget(par_obj.color, par_obj.icon,
            par_obj.text1, par_obj.text2,
            par_obj.idt1,
            par_obj.idt2,
            par_obj.iconid);
    }

    view.rowdify = function (par_clist,
                             badgetype, fcn,
                             title)
    {

        loc_col = '';
        loc_row = '';

        if (par_clist.length == 0)
        {
            return '';
        }

        for (var i = 1; i <= par_clist.length; i++)
        {
            loc_col +=  view.excolumn(4,
                badgetype(
                    fcn(par_clist[i-1])
                ));

            if (i % 3 == 0)
            {
                loc_row += view.exrow(loc_col);
                loc_col = '';
            }
        }
        //alert(loc_row);
        if (par_clist.length % 3 != 0)
        {
            loc_row += view.exrow(loc_col);
        }

        return view.excolumn(12, view.boxify("",
            title,
            loc_row, ""));

        //return column(12, loc_row);
    }


        view.boxnoprogress = function (par_boxprop)
        {
            //color, icon, header, content, idh, idh2, boxid
            return '<div id="'+ par_boxprop.boxid + '" class="info-box">' +
                '<span class="info-box-icon bg-' + par_boxprop.color + '">' +
                '<i class="' + par_boxprop.icon + '"></i>' +
                '</span>' +
                '<div class="info-box-content">'+
                '<span class="info-box-text" id="'+
                par_boxprop.idh+ '">' +
                par_boxprop.header + '</span>' +
                '<h3 class="info-box-number" id="' +
                par_boxprop.idh2 + '">' +
                par_boxprop.content + '</h3>' +
                '</div>' +
                '</div>';
            /*
             view.boxnoprogress({color :"green",
             icon:"fa fa-flag-o",
             header:"Male",
             content:"25",
             idh:"boxmale",
             idh2:"boxcount",
             boxid:"male"});
             */
        }

    view.boxloading = function () {
        return row(
            column(4,"") +
            column(4, '<div class="box box-danger box-solid">' +
                '<div class="box-header">' +
                '<h3 class="box-title">Processing...</h3>' +
                '</div>' +
                '<div class="box-body">' +
                'Fetching data...' +
                '</div>' +
                '<div class="overlay">' +
                '<i class="fa fa-refresh fa-spin"></i>' +
                '</div>' +
                '</div>') +
            column(4,""));
    }


    view.simplebox = function (par_config)
    {
        /*
         {
         boxtype: "info",
         title:"Transfer Student",
         body: "booty",
         footer: "nehneh"
         }

         * */
        return '<div class="box box-' + par_config.boxtype + '">' +
            '<div class="box-header with-border">' +
            '<h3 class="box-title">' +
            par_config.title +
            '</h3>' +
            '</div>' +
            '<div class="box-body">' +
            par_config.body +
            '</div>' +
            '<div class="box-footer">' +
            par_config.footer +
            '</div>' +
            '</div>';

    }

    function formgroup(elements)
    {
        return '<div class="form-group">' +
            elements +
            '</div>';
    }

    view.exformgroup = function(elements)
    {
        return formgroup(elements);
    }

    view.exrow = function(contents)
    {
        return row(contents);
    }

    function row(contents)
    {
        return '<div class="row">' +contents + '</div>';
    }

    view.excolumn = function(n, contents, id)
    {
        id = apputils.ifundefined(id, id  , '');
        return column(n, contents, id);
    }

    function column(n,contents, id)
    {
        id = apputils.ifundefined(id, "id=" + '"'+ id +'"' , '');
        return '<div class="col-md-'+n+'" ' + id + '>' +
            contents +
            '</div>';
    }

    function inputtext(label, inputtype, id, extension)
    {
        return '<label>'+label+'</label>' +
            '<input type="'+inputtype+'" class="form-control"'+
            '  id="' + id +'" '+ extension + '>';
    }

    view.exinputtext = function (label, inputtype, id, extension)
    {
        return inputtext(label, inputtype, id, extension);
    }

    view.textbox = function (inputtype, id, extension)
    {
        return  '<input type="'+inputtype+'" class="form-control"'+
            '  id="' + id +'" '+ extension + '>';
    }

    function inputbutton(label, id, color)
    {
        return '<br />' +
            button(color, label, id);
    }



    function inputgroup(group) {
        return '<div class="input-group">' + group + '</div>';
    }

    function button(bclass, label, id)
    {
        return '<button class="btn btn-'+bclass+'" id="'+id+'" >'+label+'</button>';
    }

    view.buttonact = function (bclass, label, fcn, id)
    {
        return '<button id="' + id + '" class="btn btn-'+bclass+'"' +
            ' onclick="'+fcn+'" >'+label+'</button>';
    }


    function container(content)
    {
        return '<div class="container">' + content + '</div>';
    }

    function span(wid, content)
    {
        return '<div class="span' + wid + '">' + content + '</div>';
    }

    function gendiv(classp, content)
    {
        return '<div class="'+ classp + '">' + content + '</div>';
    }

    view.select = function (id,label, values, moreclass, cboonly)
    {
        moreclass = typeof moreclass !== 'undefined' ? ' ' + moreclass : "";
        cboonly = typeof moreclass !== 'undefined' ? cboonly : false;
        options = '';

        if (moreclass.length > 0)
        {
            start = 1;
            options += '<option selected="selected">' + values[0] + '</option>';
        }
        else
        {
            start = 0;
        }



        for (i=start; i < values.length; i++)
        {
            options += '<option>' + values[i] + '</option>';
        }
        select = '<select id="'+id+'" class="form-control'+
            moreclass + '">' + options + '</select>';

        if (cboonly)
        {
            return select;
        }

        return '<label>'+label+'</label>' + select;
    }


    function label (caption, id)
    {
        id = typeof id !== 'undefined' ? 'id="' + id +'"' : "";
        return '<label '+id+'>'+ caption +'</label>';
    }



    view.regdetailform = function ()
    {
        //function column(n,conƒtents)
        //gendiv("col-md-4 text-center", button("primary fa fa-save", " Save", 'saveenroll')
        lrn = formgroup(row(
                column(9,inputtext("LRN No",
                    "text", "lrn",
                    'placeholder="LRN No. (Leave Space for None)"')) +
                column(3, label('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') +
                    '<div class="btn-group-vertical">'  +
                    view.buttonact("warning", "New",
                        "view.regdetail();", "lrnNewEntry") +
                    button('success', 'Get', 'ajxstudetails') +
                    '</div>' +
                    label("", "getajx")
                ) //column
            )
        );

        msglabel = formgroup(label("", "msglabel"));

        lastname = formgroup(inputtext("Last Name",
            "text", "stulastname",
            'placeholder="This is required"'));

        firstname = formgroup(inputtext("First Name",
            "text", "stufirstname",
            'placeholder="This is required"'));

        middlename = formgroup(inputtext("Full Middle Name",
            "text", "stumiddlename",
            'placeholder="This is required"'));

        sex = formgroup(view.select('sex', 'Sex', ['Male', 'Female']));

        birthdate = formgroup(inputtext("Birthdate",
            "text", "stubdate",
            'placeholder="mm/dd/yyyy"'));
        //'data-inputmask="'+"'alias': 'dd/mm/yyyy'" + '" data-mask'));

        age = formgroup(inputtext("Age",
            "text", "stuage",
            'placeholder="AGE as of 1st Friday June"'));

        mothertongue = formgroup(inputtext("Mother Tongue",
            "text", "stumothertongue",
            'placeholder="Grade 1 to 3 Only"'));

        ip = formgroup(inputtext("IP",
            "text", "stuip",
            'placeholder="Ethnic Group"'));
        /*
         religion = formgroup(inputtext("Religion",
         "text", "stureligion",
         'placeholder="This is required."'));
         */
        religion = formgroup(view.select('stureligion',
            'Religion',
            $("#name-rightbadge").data("religions"),
            'select2'));


        student = lrn + msglabel + lastname +
            firstname + middlename + sex +
            birthdate + age + mothertongue +
            ip + religion;

        houseno = formgroup(inputtext("House #",
            "text", "stuhouseno",
            'placeholder="House #/Street/Sitio/Purok"'));

        brgy = formgroup(inputtext("Barangay",
            "text", "stubrgy",
            'placeholder="Barangay"'));

        municipal = formgroup(inputtext("Municipality",
            "text", "stumun",
            'placeholder="Municipality/City"'));

        province = formgroup(inputtext("Province",
            "text", "stuprovince",
            'placeholder="Province"'));

        zipcode = formgroup(inputtext("Zip Code",
            "text", "stuzip",
            'placeholder="Zip Code"'));

        address = houseno + brgy + municipal
            + province + zipcode;

        fatherlname = formgroup(inputtext("Father Last Name",
            "text", "stuflname",
            'placeholder="Father Last Name"'));

        fatherfname = formgroup(inputtext("Father First Name",
            "text", "stuffname",
            'placeholder="Father First Name"'));

        fathermi    = formgroup(inputtext("Father Middle Name",
            "text", "stufmname",
            'placeholder="Father Middle Name"'));

        motherlname = formgroup(inputtext("Mother Last Name",
            "text", "stumlname",
            'placeholder="Mother Last Name"'));

        motherfname = formgroup(inputtext("Mother First Name",
            "text", "stumfname",
            'placeholder="Mother First Name"'));

        mothermi    = formgroup(inputtext("Mother Middle Name",
            "text", "stummname",
            'placeholder="Mother Middle Name"'));

        guardlname = formgroup(inputtext("Guard Last Name",
            "text", "stuglname",
            'placeholder="Guard Last Name"'));

        guardfname = formgroup(inputtext("Guard First Name",
            "text", "stugfname",
            'placeholder="Guard First Name"'));

        guardmi = formgroup(inputtext("Guard Middle Name",
            "text", "stugmname",
            'placeholder="Guard Middle Name"'));

        ties = fatherlname + fatherfname + fathermi +
            motherlname + motherfname + mothermi +
            guardlname + guardfname + guardmi;

        conditionalcashtransfer = formgroup(
            view
                .select(
                    'fourps', 'Conditional Cash Transfer',
                    ['YES', 'NO']));

        nutritionalstatus = formgroup(
            view
                .select('stunutritionalstatus',
                    "Nutritional Status",
                    $("#name-rightbadge")
                        .data("nstatus")));



        disabilities = formgroup(
            inputtext("Disabilities",
                "text", "studisabilities",
                'placeholder="Disabilities"'));

        moreinfo = conditionalcashtransfer + nutritionalstatus + disabilities;

        body = row(column(3, student) +
                column(3, address) +
                column(3, ties) +
                column(3, moreinfo)) +
            row( column(4, "") +
                gendiv("col-md-4 text-center", button("primary fa fa-save", " Save", 'saveenroll') +
                    label("", "saveajx")) +
                gendiv("col-md-4 text-center", label("", "savemsg"))
            );

        bodylevel = row(
            column(3,"") +
            column(3,
                formgroup(
                    boxwidget("aqua", "fa fa-child", "Grade", "", '', 'id=advisegrade')
                ))
            +
            column(3,
                formgroup (
                    boxwidget("green", "fa fa-group", "Section", "", '', 'id=advisesection')
                ))
            + column(3,"")
        );
        //$("#stubdate").datetimepicker({format:'m.d.YYYY', timepicker:false, startDate:'2000/01/01'});
        return column(12,
            boxwithminimize("levelbox", "Level", bodylevel,'') +
            boxwithminimize("enrollbox","Register Student", body, "")
        );
    }

    view.regdetail = function ()
    {
        $("#name-rightbadge")
            .data("enrlrn",
                $("#enrolllrn").val());
        //must set cache data before calling register
        $("#name-rightbadge").data("oldlrn", "");
        view.cleanenroll(); //clear memory binding for enroll
        $("#main").html("");
        $("#main").html(view.regdetailform());
        $("#studisabilities").val("None");

        $("#stubdate").datetimepicker({format:'m-d-Y', timepicker:false, startDate:'2000/01/01'});
        $("#saveenroll").click(model.registerstu);
        $("#ajxstudetails").click(model.getstu);
        $('#stulastname').bind('input propertychange', function() {
            $("#stuflname").val($(this).val());
            $("#stumlname").val($(this).val());
        });
        $('#stubdate').change(function() {
            $("#stuage").val(
                apputils.getAge($(this).val())
            );
        });
        $('#stureligion').select2();
        $("#advisegrade").html(apputils.ztok($("#name-rightbadge").data("grade")));
        $("#advisesection").html($("#name-rightbadge").data("section"));

        if ($("#name-rightbadge").data("enrlrn").length != 0) {
            $("#lrn")
                .val(
                    $("#name-rightbadge")
                        .data("enrlrn"));
        }
        else
        {$("#lrn").val($.cookie("freeid"));}
    }

    view.regautofill = function (par_id, eventer)
    {
        $("#name-rightbadge")
            .data("enrlrn",
                eventer);
        view.regdetail();
        model.getstudetails(par_id, $.cookie("schoolid"));
        $("#lrn").val(par_id);
    }

    view.table = function (par_prop)
    {
        //id, class, cols:[]
        cols = '';
        for (var i=0; i < par_prop.cols.length; i++)
        {
            cols += '<th>' + par_prop.cols[i] + '</th>';
        }
        return '<table id="' + par_prop.id + '" class="table '+par_prop.class+'">' +
            '<tbody ' + par_prop.tbodyclass + '>' +
            '<tr>' +
            cols +
            '</tr>' +
            '</tbody>' +
            '</table>';
    }

    view.activateacct = function ()
    {
        $("#main").html("");
        $("#main").html(
            view.excolumn(12,
                view.simplebox(
                    {
                        boxtype:"primary",
                        title:"Activate Account",
                        body:view.excolumn(12,
                            view.exformgroup(
                                view.exinputtext("LRN No.", "text", "activatepid",
                                    "placeholder='Input LRN of Student'") + '<hr/>' +
                                view.centerize(
                                    view.bslabel("info", "&nbsp;&nbsp;&nbsp;O  R&nbsp;&nbsp;&nbsp;"))+
                                '<hr />' +
                                view.exinputtext("Last Name", "text", "activateplname",
                                    "") +
                                view.exinputtext("First Name", "text", "activatepfname",
                                    "") +
                                view.exinputtext("Full Middle Name", "text", "activatepfmname", "") +
                                view.paragraph({id:"lblactivate", class:'', content:""}) +
                                '<br />' +
                                view.buttonact("success pull-right", "Activate",
                                    "model.activateacct('btnactivate')", "btnactivate")
                            )
                        ),
                        footer:""
                    }
                )
            )

        );
    }

    view.tablewithrows = function(par_prop)
    {
        /*
         {
         id:
         tdconfig: [],
         class:
         cols:[]
         rows:[
         [],...
         ]
         }
         */
        cols = '';
        for (var i=0; i < par_prop.cols.length; i++)
        {
            cols += '<th>' + par_prop.cols[i] + '</th>';
        }

        rows = '';
        for (var i=0; i < par_prop.rows.length; i++) {
            rows += '<tr>';
            for (var j = 0; j < par_prop.cols.length; j++) {
                rows += '<td ' + par_prop.tdconfig[j] + '>' + par_prop.rows[i][j] + '</td>';

            }
            rows += '</tr>';
        }

        return '<table id="' + par_prop.id + '" class="table '+par_prop.class+'">' +
            '<tbody>' +
            '<tr>' +
            cols +
            '</tr>' +
            rows +
            '</tbody>' +
            '</table>';

    }

    view.enrollform = function(resp)
    {
        return column(12,boxwithminimize("enrollbox", "Enroll",
            row(
                column(3, inputtext("", "text", "enrolllrn",
                    'placeholder="LRN No."')) +
                column(3,
                    inputbutton("Enroll", "btnenroll", "success")
                ) + column(6, "")
            ) + '<br />' +
            row(column(12,
                row(column(12,
                    label("", "enrolerrmessage"))) +
                row(
                    column(4,view
                        .boxnoprogress({color :"aqua-active",
                            icon:"fa fa-male",
                            header:"Male",
                            content:resp.male,
                            idh:"boxmale",
                            idh2:"boxcount",
                            boxid:"male"})) +
                    column(4,view
                        .boxnoprogress({color :"maroon-active",
                            icon:"fa fa-female",
                            header:"Female",
                            content:resp.female,
                            idh:"boxfemale",
                            idh2:"boxfcount",
                            boxid:"female"})) +
                    column(4,view.boxnoprogress({color :"green",
                        icon:"fa fa-pie-chart",
                        header:"Total",
                        content:resp.male + resp.female,
                        idh:"boxtotal",
                        idh2:"boxtcount",
                        boxid:"total"}))
                )
            )) +
            row(
                column(12,
                    boxwithminimize("boxenclose", "Search",
                        column(12,
                            row(column(6,inputtext("", "text", "enrollsearch",
                                    'placeholder="Type Last Name"')) +
                                column(6,
                                    inputbutton("Search", "btnerlsearch", "info"))
                            ) + '<br />' +
                            row(column(12,boxwithminimize("erlsrchbox", "Search Results",
                                view.table({
                                    "id":"erlsearchtab",
                                    "class":"tables-bordered",
                                    "cols": ["LRN No", "Name"],
                                    "tbodyclass":''
                                }), "", ""))

                            ))
                        , "", "collapsed-box")))

            ,""));
    }

    view.badgify = function (par_clist)
    {

        loc_col = '';
        loc_row = '';

        if (par_clist.size == 0)
        {
            return '';
        }

        for (i = 1; i <= par_clist.size; i++)
        {
            loc_col += column(4,
                view.socialbadge(par_clist.list[i-1]));

            if (i % 3 == 0)
            {
                loc_row += row(loc_col);
                loc_col = '';
            }
        }
        //alert(loc_row);
        if (par_clist.size % 3 != 0)
        {
            loc_row += row(loc_col);
        }

        return column(12, view.boxify("",
            "Class List",
            loc_row, ""));

        //return column(12, loc_row);
    }

    view.mainloading = function ()
    {
        $("#main").html(view.boxloading());
    }

    view.enroll = function ()
    {
        view.mainloading();
        loc_classlist = model.getenrolledstuds();

    }

    view.cleanenroll = function ()
    {
        $("#btnenroll").unbind('click');

    }

    view.cleanregdetail = function ()
    {
        $("#stubdate").datetimepicker("destroy");
        $("#saveenroll").unbind('click');
        $('#stulastname').unbind('input propertychange');
        $('#stubdate').unbind('change');
        $("#ajxstudetails").unbind('click');
        apputils.initboxfields("enrollbox");
    }

    view.socialbadge = function (par_badge)
    {
        //name, color,id, imgsrc,btn1, btnact1,btn2, btnact2, btn3, btnact3
        //bg-aqua-active ---> male
        //bg-maroon-active ---> female
        return' <div class="box box-widget widget-user"> ' +
            ' <div class="widget-user-header '+par_badge.color+' "> ' +
            ' <h3 id="uname' + par_badge.id + '" class="widget-user-username">'+par_badge.name+'</h3> ' +
            '  <h5 id="num'+ par_badge.id +'" class="widget-user-desc">'+par_badge.id+'</h5> ' +
            '</div> ' +
            '<div class="widget-user-image"> ' +
            '   <img class="img-circle" src="' + par_badge.imgsrc + '" alt="file not uploaded"> ' +
            '</div> ' +
            ' <div class="box-footer"> ' +
            '    <div class="row"> ' +
            '          <div class="col-sm-4 border-right"> ' +
            '<button class="btn btn-info btn-xs" ' +
            ' id="'+par_badge.btn1 +par_badge.id+'" ' +
            ' onclick="'+par_badge.btnact1  +'">'+
            par_badge.btn1 + '</button>' +
            '          </div> ' +
            '          <div class="col-sm-4 border-right"> ' +
            '<button class="btn btn-warning btn-xs" '+
            ' id="'+ par_badge.btn2 +par_badge.id+'" ' +
            ' onclick="'+par_badge.btnact2+'">' +
            par_badge.btn2 + '</button>' +
            '          </div> ' +
            '          <div class="col-sm-4"> ' +
            '<button class="btn btn-danger btn-xs" ' +
            ' id="'+par_badge.btn3 +par_badge.id+'" ' +
            'onclick="'+par_badge.btnact3+'">' +
            par_badge.btn3 + '</button>' +
            '          </div> ' +
            '     </div> ' +
            ' </div> ' +
            '</div>';

        /*
         socialbadge({"name":"Orven E. Llantos",
         "id":"2012-2015",
         "imgsrc":"",
         "btn1":"Profile",
         "btnact1":"alert('Profile')",
         "btn2":"Edit",
         "btnact2":"alert('Edit')",
         "btn3":"Remove",
         "btnact3":"alert('Remove')",
         "color": "bg-lime-active"})
         */
    }

    view.profilebox = function(par_profile)
    {
        //img, name, group, moredetails[].col[], btns[]

        listitems = '';
        for (i = 0; i < par_profile
            .moredetails
            .length; i++)
        {
            listitems = listitems +
                '<li class="list-group-item">' +
                '<b>' + par_profile
                    .moredetails[i]
                    .col[0] + '</b> ' +
                ' <a class="pull-right">'+
                par_profile
                    .moredetails[i]
                    .col[1] + '</a>' +
                '</li>';
        }

        btnlist = '';

        if ($.cookie("usertype") == 'faculty') {
            for (i = 0; i < par_profile.btns.length; i++) {
                btnlist = btnlist +
                    view.buttonact(par_profile.btns[i].bclass,
                        par_profile.btns[i].label,
                        par_profile.btns[i].fcn,
                        par_profile.btns[i].id) +
                    "&nbsp;&nbsp;";

            }
        }
        return '<div class="box box-primary">' +
            '<div class="box-body box-profile">' +
            '<img class="profile-user-img img-responsive img-circle"'+
            'src="'+ par_profile.img +'" ' +
            'alt="User profile picture">' +
            '<h3 class="profile-username text-center">' +
            par_profile.name + '</h3>' +
            '<p class="text-muted text-center">' +
            par_profile.lrn +
            '</p>' +
            '<ul ' +
            'class="list-group list-group-unbordered">' +
            listitems +
            '</ul>' +
            btnlist +
            '</div><!-- /.box-body -->' +
            '</div><!-- /.box -->';
        /*
         {
         img: "../../dist/img/user4-128x128.jpg",
         name: "Nina Mcintire",
         lrn: "lrn",
         moredetails:[
         {
         col:["Grade", "1"],
         },
         {
         col:["Section", "Aquamarine"],
         },
         {
         col:["Adviser", "Teachie Magtuturo"],
         }
         ],
         btns:[
         {
         bclass:"btn btn-primary btn-xs",
         label:"This is it",
         fcn:"alert('na sab')",
         id:"kaningaid"
         },
         {
         bclass:"btn btn-warning btn-xs",
         label:"yehey!",
         fcn:"alert('uli na sila')",
         id:"id2"
         }],
         aboutme: [
         {icon: "fa fa-book margin-r-5",
         label:"label 1",
         value:"ahak ka!!!"},
         {icon: "fa fa-book margin-r-5",
         label:"label 1",
         value:"ahak ka!!!"},
         {icon: "fa fa-book margin-r-5",
         label:"label 1",
         value:"ahak ka!!!"}
         ],
         historydata:{
         labels: ["January", "February", "March", "April", "May", "June", "July"],
         datasets: [
         {
         label: "Electronics",
         fillColor: "rgba(210, 214, 222, 1)",
         strokeColor: "rgba(210, 214, 222, 1)",
         pointColor: "rgba(210, 214, 222, 1)",
         pointStrokeColor: "#c1c7d1",
         pointHighlightFill: "#fff",
         pointHighlightStroke: "rgba(220,220,220,1)",
         data: [65, 59, 80, 81, 56, 55, 40]
         },
         {
         label: "Digital Goods",
         fillColor: "rgba(60,141,188,0.9)",
         strokeColor: "rgba(60,141,188,0.8)",
         pointColor: "#3b8bba",
         pointStrokeColor: "rgba(60,141,188,1)",
         pointHighlightFill: "#fff",
         pointHighlightStroke: "rgba(60,141,188,1)",
         data: [28, 48, 40, 19, 86, 27, 90]
         }
         ]
         },
         donutdata : [
         {
         value: 700,
         color: "#f56954",
         highlight: "#f56954",
         label: "Chrome"
         },
         {
         value: 500,
         color: "#00a65a",
         highlight: "#00a65a",
         label: "IE"
         },
         {
         value: 400,
         color: "#f39c12",
         highlight: "#f39c12",
         label: "FireFox"
         },
         {
         value: 600,
         color: "#00c0ef",
         highlight: "#00c0ef",
         label: "Safari"
         },
         {
         value: 300,
         color: "#3c8dbc",
         highlight: "#3c8dbc",
         label: "Opera"
         },
         {
         value: 100,
         color: "#d2d6de",
         highlight: "#d2d6de",
         label: "Navigator"
         }
         ]
         }
         */

    }

    view.aboutmebox = function (par_aboutme, par_partitle)
    {
        loc_title= typeof par_partitle !== 'undefined' ? par_partitle : "About Me";
        entries = '';
        for (i=0; i < par_aboutme.aboutme.length; i++)
        {
            entries = entries +
                '<strong><i class="' + par_aboutme
                    .aboutme[i]
                    .icon + '"></i>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;' +
                par_aboutme
                    .aboutme[i]
                    .label + '</strong>' +
                '<p class="text-muted">'+
                par_aboutme
                    .aboutme[i]
                    .value +
                '</p>' +
                '<hr>';
        }



        return '<div class="box box-primary">' +
            '<div class="box-header with-border">' +
            '<h3 class="box-title">'+loc_title+'</h3>' +
            '</div><!-- /.box-header -->' +
            '<div class="box-body">' +
            entries +
            ' </div><!-- /.box-body --> ' +
            '</div><!-- /.box -->';

    }

    view.calendarset = function ()
    {
        $("#calendar").fullCalendar({
            header: {
                left:'today',
                center: "",
                right: 'month'
            },
            buttonText: {
                today:'today',
                month:'month',
                week:'week',
                day:'day'
            },
            editable:true,
            droppable:false
        });
        model.getcalentries();
        $('#calendar').fullCalendar('render');
    }

    view.profile = function(profile)
    {
        tabscontent = [];


        if ($.cookie("usertype") == 'parents')
        {

            tabscontent.push({
                label: "Calendar",
                assoc:"profilecalendar",
                content:row(column(12, view.simplebox({
                    boxtype:"primary",
                    title:"Scheduled Activities and Deadlines",
                    body:'<div id="calendar"></div>',
                    footer:''
                })))
            });


            tabscontent.push({
                label:'Timeline',
                assoc:'profiletimeline',
                content:row(column(12,
                    '<ul id="user-timeline" class="timeline"></ul>'
                ))
            });







        }

        $("#name-rightbadge").data("timelrn", profile.lrn);
        tabscontent.push({
            label: "Current Performance",
            assoc : "performance",
            content:
            row(
                column(12,
                    '<table id="nowcard" ' +
                    'data-search="false"> </table>')
            ) + '<br />' +//row
            row(
                column(4,'') +
                column(4,view.buttonact("success fa fa-download","Download",
                    "apputils.tabtoexcel('nowcard', 'nowcard"+ profile.lrn +"')",
                    "btnnowcard")) +
                column(4,'')
            ) + '<br />' +
            row(
                column(12,
                    view.navtab(
                        {
                            tabs:
                                [
                                    {
                                        label:"Grade Details",
                                        assoc:"gradedetails",
                                        content:row(column(9, column(2,"Subject") + column(10, view.selectize(
                                                    $("#name-rightbadge").data("profileload"),
                                                    function (x,i) {
                                                        return x[i].subject;
                                                    },
                                                    "selprofileload",
                                                    "",
                                                    "selprofileload"
                                                )) + '<br />' + '<br />' +
                                                column(2,"Period") + column(10,view.selectize(
                                                    [1,2,3,4],
                                                    function (x,i) {
                                                        return x[i];
                                                    },
                                                    "selperiodgrade",
                                                    "",
                                                    "selperiodgrade"
                                                ))
                                                ,"profsubj") +
                                            column(3, view.buttonact("success", "Get", "model.getstugradedetails();", "profbtn1"), "profbtn")
                                        ) + '<br />' +
                                        row(column(12,
                                            view.boxify("boxwrittenworks", "Written Works",
                                                view.table({
                                                    id:"tblwrittenworks",
                                                    class:"table-striped",
                                                    tbodyclass:'',
                                                    cols: [1,2,3,4,5,6,7,8,9,10, "Total", "PS", "WS"]
                                                }), "",""), "")) + '<br />' +
                                        row(column(12,
                                            view.boxify("boxperformancetasks", "Performance Tasks",
                                                view.table({
                                                    id:"tblperformancetasks",
                                                    class:"table-striped",
                                                    tbodyclass:'',
                                                    cols: [1,2,3,4,5,6,7,8,9,10, "Total", "PS", "WS"]
                                                }), "",""), "")) + '<br />' +
                                        row(column(12,
                                            view.boxify("boxquarterlyassessment", "Quarterly Assessment",
                                                view.table({
                                                    id:"tblquarterlyassessment",
                                                    class:"table-striped",
                                                    tbodyclass:'',
                                                    cols: ["Exam Result", "Total", "PS", "WS"]
                                                }), "", ""), ""))
                                    },
                                    {
                                        label:"Attendance Details",
                                        assoc:"attendancedetails",
                                        content:
                                            row(column(6,
                                                view.selectize(
                                                    ["January","February","March","April",
                                                    "May", "June", "July", "August",
                                                    "September", "October", "November",
                                                    "December"],
                                                    function (x,i) {
                                                        return x[i];
                                                    },
                                                    "selattmonth",
                                                    "",
                                                    "selattmonth"
                                                )
                                                ,"") +
                                                column(3,
                                                       view.textbox("text", "txtattyear","")
                                                , "") +
                                                column(3,
                                                    view.buttonact("success", "OK",
                                                    "model.getattendancedetails('"+
                                                    profile.lrn+"', 'btnfetchattendance', 'OK')", "btnfetchattendance")
                                                    , "")
                                            ) + '<br />' +
                                            row(column(12,
                                            view.boxify("boxattendancedetails", "Attendance",
                                                view.table({
                                                    id:"tblattendancedetails",
                                                    class:"table-striped",
                                                    tbodyclass:'',
                                                    cols: ["Date", "Status", "Day Part","Points"]
                                                }), "",""), ""))
                                    }
                                ]
                        }
                    )
                )
            )
        });

        tabscontent.push({
            label:"Previous Performance",
            assoc:"prevperformance",
            content:row(
                column(12,
                    '<table id="prevcard" ' +
                    'data-search="false"> </table>')
            )+ '<br />' +//row
            row(
                column(4,'') +
                column(4,view.buttonact("success fa fa-download","Download",
                    "apputils.tabtoexcel('prevcard', 'prevcard"+ profile.lrn +"')",
                    "btnprevcard")) +
                column(4,'')
            )
        });


        $("#main").html(column(12,
            row(column(3,
                    view.profilebox(profile) +
                    view.aboutmebox(profile)) +
                column(9, view.navtab({
                        tabs: tabscontent //array of singleton objects
                    } //end object navtab
                ))))
        );

        $("#txtattyear").val(new Date().getFullYear());
        perf_cols = [
            {
                field: "la",
                title: "Learning Areas"
            },
            {
                field: "q1",
                title: "1st",
                cellStyle: function (value, row, index) {
                    if (value == 0)
                    {
                        return {}
                    }
                    else if (value < 75)
                    {
                        return {classes: "danger"};
                    }
                    return {};
                }
            },
            {
                field: "q2",
                title: "2nd",
                cellStyle: function (value, row, index) {
                    if (value == 0)
                    {
                        return {}
                    }
                    else if (value < 75)
                    {
                        return {classes: "danger"};
                    }
                    return {};
                }
            },
            {
                field: "q3",
                title: "3rd",
                cellStyle: function (value, row, index) {
                    if (value == 0)
                    {
                        return {}
                    }
                    else if (value < 75)
                    {
                        return {classes: "danger"};
                    }
                    return {};
                }
            },
            {
                field: "q4",
                title: "4th",
                cellStyle: function (value, row, index) {
                    if (value == 0)
                    {
                        return {}
                    }
                    else if (value < 75)
                    {
                        return {classes: "danger"};
                    }
                    return {};
                }
            },
            {
                field: "fr1",
                title: "Final Rating",
                cellStyle: function (value, row, index) {
                    if (value == 0)
                    {
                        return {}
                    }
                    else if (value < 75)
                    {
                        return {classes: "danger"};
                    }
                    return {};
                }
            },
            {
                field: "rem1",
                title: "Remarks",
                cellStyle: function (value, row, index) {
                    if (value == 'FAILED')
                    {
                        return {classes: "danger"};
                    }
                    return {};
                }
            }
        ];


        if ($.cookie("usertype") == "parents")
        {
            model.gettimeline();
            view.calendarset();
        }

        $("#nowcard").bootstrapTable({columns:perf_cols});
        $("#prevcard").bootstrapTable({columns:perf_cols});
        $('.nav-tabs a').click(function(){
            if ($(this).text() == 'Current Performance')
            {
                //model.getclassrecorddata(this);
                model.getcard(profile.lrn, false, this, "nowcard");
            }
            else if ($(this).text() == "Previous Performance")
            {
                model.getcard(profile.lrn, true, this, "prevcard");
            }
            else if ($(this).text() == "Attendance Details")
            {
                model.getattendancedetails(profile.lrn, this, "Attendance Details");
            }
            apputils.echo($(this).text());
        });
        model.getcard(profile.lrn, false, this, "nowcard");

    }

    view.bslabel = function (labeltype, caption)
    {
        return '<span class="label label-'+labeltype+'">'+caption+'</span>';
    }

    view.colortext = function (ttype, caption)
    {
        return '<p class="text-'+ttype+'">'+caption+'</p>';
    }

    view.centerize = function (element)
    {
        return '<div style="text-align: center;">' +
            element +
            '</div>';
    }

    view.labelel = function (labelid, caption)
    {
        return '<span id="' +
            labelid + '" class="label">'+caption+'</span>';
    }

    view.navtab = function(opts)
    {
        /*
         opts = {
         tabs: [
         {
         label:"testingan",
         assoc:"content1"
         content:"blagadag1"
         },
         {
         label:"testingan",
         assoc:"content2",
         content:"blagadag2"
         }]
         }
         */
        navtabs = '';
        navcontents = '';
        for (i = 0; i < opts.tabs.length; i++)
        {
            if (i == 0)
            {
                more2 = 'class="active"';
                more = " active";
            }else
            {

                more2 = more = '';
            };

            navtabs = navtabs +
                '<li '+ more2 +'><a href="#' +
                opts.tabs[i].assoc
                + '" data-toggle="tab">' +
                opts.tabs[i].label
                + '</a></li>';

            navcontents = navcontents +
                '<div class="tab-pane '+more+'" id="'+ opts
                    .tabs[i]
                    .assoc +'">' +
                opts
                    .tabs[i]
                    .content +
                '</div>';
        }

        return '<div class="nav-tabs-custom">' +
            '<ul class="nav nav-tabs">' +
            navtabs +
            '</ul>' +
            '<div class="tab-content">' +
            navcontents +
            '</div>' +
            '</div>';
    }

    view.boxembodiement = function(par_data)
    {
        /*
         par_data = {
         name:"Talpolano",
         idno:'1234',
         options: [
         {
         label: "Transfer",
         action: "alert('transfer')",
         buttonclass:"info btn-xs"
         },
         {
         label: "Drop",
         action: "alert('drop')",
         buttonclass:"danger btn-xs"
         },
         {
         label: "Re-assign",
         action: "alert('Re-assign')",
         buttonclass:"warning btn-xs"
         },
         {
         label: "PWD",
         action: "alert('pwd')",
         buttonclass:"default btn-xs"
         },
         {
         label: "Cond Cash Trans",
         action: "alert('4ps')",
         buttonclass:"success btn-xs"
         }
         ],
         boxcolor: 'maroon-active',
         picsrc: '../dist/img/user7-128x128.jpg'
         }
         */

        /*listitems = '';
         for (i = 0; i < par_data.options.length; i++)
         {
         listitems += '<li>' +
         '<a>' +
         par_data.options[i].label +
         '<span class="pull-right">' +
         view.buttonact(par_data.options[i].buttonclass, ">>",
         par_data.options[i].action, par_data.options[i].idno +
         par_data.options[i].label +
         i) +
         '</span>' +
         '</a>' +
         '</li>' ;
         }*/





        return  ' <div class="box box-widget widget-user-2"> ' +
            '  <div class="widget-user-header bg-'+ par_data.boxcolor + '">' +
            '     <div class="widget-user-image"> ' +
            '  <img class="img-circle" ' +
            '   src="' + par_data.picsrc + '" ' +
            ' alt="User Pics"> ' +
            ' </div> ' +
            '<h3>' + par_data.name + '</h3>' +
            '<h5>' + par_data.idno + '</h5>' +
            '</div>' +
            '<div class="box-footer no-padding">' +
            '<ul class="nav nav-stacked">' +
            par_data.embodiement +
            '</ul>' +
            '</div>' +
            '</div>';
    }

    view.accordionelement = function (par_accordinfo)
    {
        /*
         {
         parent: "accordion", //parent id
         href: 'collapse1', //parent href
         accordtitle: "Item 1",
         body:"the body",
         boxtype:"primary"
         }
         */
        return ' <div class="panel box box-' + par_accordinfo.boxtype +'"> ' +
            ' <div class="box-header with-border"> ' +
            '    <h4 class="box-title"> ' +
            '  <a data-toggle="collapse" ' +
            '  data-parent="#"' + par_accordinfo.parent +
            '  href="#' + par_accordinfo.href + '">' +
            par_accordinfo.accordtitle +
            '</a>' +
            '</h4>' +
            '</div>' +
            '<div id="' + par_accordinfo.href + '" ' +
            ' class="panel-collapse collapse"> ' +
            ' <div class="box-body"> ' +
            par_accordinfo.body +
            ' </div> '+
            '</div>' +
            '</div>';
    }

    view.accordion = function (par_accordion)
    {
        /*
         {
         parent:"accordion",
         title:"buzz",
         elements:[{
         parent: "accordion", //parent id
         href: 'collapse1', //parent href
         accordtitle: "Item 1",
         body:"the body",
         boxtype:"primary"
         },
         {
         parent: "accordion", //parent id
         href: 'collapse2', //parent href
         accordtitle: "Item 1",
         body:"the body",
         boxtype:"primary"
         }]

         }
         */

        accords = '';

        for (var i = 0; i < par_accordion.elements.length; i++)
        {
            accords += view.accordionelement(par_accordion.elements[i]);
        }

        return '<div class="box box-solid">' +
            '<div class="box-header with-border">' +
            '<h3 class="box-title">' +
            par_accordion.title +
            '</h3>' +
            '</div>' +
            '<div class="box-body">' +
            '<div class="box-group" id="' + par_accordion.parent + '">' +
            accords +
            '</div>' +
            '</div>' +
            '</div>';
    }

    view.smallbadge = function(par_color, par_content)
    {
        return '<span class="badge bg-'+par_color+'">'+par_content+'</span>';
    }

    view.appbutton = function(par_properties)
    {
        /*
         {

         icon
         label
         emphasis
         emphcolor
         action
         }
         */
        emphasis = '';
        action = '';
        if (par_properties.emphasis.length > 0)
        {
            emphasis = '<span class="badge bg-'+
                par_properties.emphcolor+'"> ' +
                par_properties.emphasis + '</span>';
        }


        if (par_properties.action.length > 0)
        {
            action = 'onclick=' + par_properties.action;
        }

        return '<a class="btn btn-app" '+action+'>' +
            emphasis +
            '<i class="fa ' + par_properties.icon + '"></i>' +
            par_properties.label +
            '</a>';

    }

    view.setbtnsquarter = function ()
    {
        currquarter = $.cookie("quarter");
        btns = '';
        for (var i=1; i<=4; i ++)
        {
            var appbtn_obj = {
                label: i,
                action:"model.changequarter("+i+");"
            };

            if (i == parseInt(currquarter))
            {
                appbtn_obj["icon"] = 'fa-toggle-on';
                appbtn_obj["emphasis"] = 'active';
                appbtn_obj["emphcolor"] = 'green';
            }
            else {
                appbtn_obj["emphasis"] = '';
                appbtn_obj["icon"] = 'fa-toggle-off';
            }

            btns += view.appbutton(appbtn_obj);
        }

        return btns;
    }

    view.quarterize = function ()
    {
        return view.excolumn(12,
            view.excolumn(3,"") +

            view.excolumn(5,
                view.boxify("bxquarter",
                    "Quarter",
                    view.setbtnsquarter(),
                    "",
                    "")
            ) +
            view.excolumn(4, '')
        );
    }


    function forgradeentry(addbutton, fcnstr, buttonon)
    {

        addbutton = typeof addbutton !== 'undefined' ? addbutton : view.buttonact('success fa fa-save',
            'Save All', "model.batchsavescores('btngradesaveall')",
            "btngradesaveall");
        fcnstr = typeof fcnstr !== 'undefined' ? fcnstr : "model.savestudentscore";
        buttonon = apputils.ifundefined(buttonon, buttonon, true);

        //model.savestudentscore
        return view.aboutmebox({
            aboutme: [{
                icon:"fa fa-list-ol",
                label:"Class List",
                value:(
                    function ()
                    {
                        //view.tablewithrows = function(par_prop)
                        //{
                        /*
                         {
                         id:
                         class:
                         cols:[]
                         rows:[
                         [],...
                         ]
                         }
                         */
                        return view.tablewithrows({
                            id:'tblclasslist',
                            class: '',
                            cols: ['','LRN No', 'Name', 'Entry','', ''],
                            tdconfig: ['','style="vertical-align:middle"',
                                'style="vertical-align:middle"',
                                'style="width:70px;vertical-align:middle"',
                                'style="vertical-align:middle"',
                                'style="vertical-align:middle"'],
                            rows: (
                                function ()
                                {
                                    _rows = [];

                                    _rows.push(['<strong>Male</strong>','','','','', '']);

                                    for (var i = 0;
                                         i <
                                         $("#name-rightbadge")
                                             .data("listmale").length;
                                         i++)
                                    {
                                        instance = $("#name-rightbadge")
                                            .data("listmale")[i];
                                        _rows.push([
                                            '<img width="60px;" height="60px"  class="img-circle img-bordered-sm"'+
                                            ' src=' + instance.imgsrc + '>',
                                            instance.id,
                                            instance.name.toUpperCase(),
                                            '<input type="text" ' +
                                            'class="form-control"'+
                                            '  id="score' +
                                            instance.id  +'" >',
                                            function (x){
                                                if (buttonon) {
                                                    return  view.buttonact('success btn-xs btn-flat fa fa-save',
                                                        '', fcnstr + "('"+"btngrade" +
                                                        instance.id+"','"+ instance.id +"')",
                                                        "btngrade" + instance.id);}
                                                else
                                                {
                                                    return '';
                                                }
                                            }(buttonon),
                                            label("", "error" + instance.id)
                                        ]);
                                    }

                                    _rows.push(['<strong>Female</strong>','','','','', '']);

                                    for (var i = 0;
                                         i <
                                         $("#name-rightbadge")
                                             .data("listfemale").length;
                                         i++)
                                    {
                                        instance = $("#name-rightbadge")
                                            .data("listfemale")[i];
                                        _rows.push([
                                            '<img width="60px;" height="60px" class="img-circle img-bordered-sm"'+
                                            ' src=' + instance.imgsrc + '>',
                                            instance.id,
                                            instance.name.toUpperCase(),
                                            '<input type="text" ' +
                                            'class="form-control"'+
                                            '  id="score' +
                                            instance.id  +'" >',
                                            function (x){
                                                if (buttonon) {
                                                    return  view.buttonact('success btn-xs btn-flat fa fa-save',
                                                        '', fcnstr + "('"+"btngrade" +
                                                        instance.id+"','"+ instance.id +"')",
                                                        "btngrade" + instance.id);}
                                                else
                                                {
                                                    return '';
                                                }
                                            }(buttonon),
                                            label("", "error" + instance.id)
                                        ]);
                                    }

                                    _rows.push(['','', addbutton + "&nbsp;&nbsp;" +
                                    label("", "errorallarea"),'','', '']);
                                    return _rows;
                                }
                            )()

                        });
                    }
                )()
            }]
        }, "")
    }


    function forattendanceentry()
    {
        return view.aboutmebox({
            aboutme: [{
                icon:"fa fa-list-ol",
                label:"Class List",
                value:(
                    function ()
                    {
                        //view.tablewithrows = function(par_prop)
                        //{
                        /*
                         {
                         id:
                         class:
                         cols:[]
                         rows:[
                         [],...
                         ]
                         }
                         */
                        return view.tablewithrows({
                            id:'tblclasslist',
                            class: '',
                            cols: ['','LRN No', 'Name', 'Entry','', ''],
                            tdconfig: ['','style="vertical-align:middle"',
                                'style="vertical-align:middle"',
                                'style="width:110px;vertical-align:middle"',
                                'style="vertical-align:middle"',
                                'style="vertical-align:middle"'],
                            rows: (
                                function ()
                                {
                                    _rows = [];

                                    _rows.push(['<strong>Male</strong>','','','','', '']);

                                    for (var i = 0;
                                         i <
                                         $("#name-rightbadge")
                                             .data("listmale").length;
                                         i++)
                                    {
                                        instance = $("#name-rightbadge")
                                            .data("listmale")[i];
                                        _rows.push([
                                            '<img width="60px;" height="60px"  class="img-circle img-bordered-sm"'+
                                            ' src=' + instance.imgsrc + '>',
                                            instance.id,
                                            instance.name.toUpperCase(),
                                            view.select("status" + instance.id, "",
                                                ['','PRESENT',
                                                    'LATE', 'ABSENT', 'EXCUSED'], "", true)
                                            ,
                                            view.buttonact('success btn-flat fa fa-save',
                                                '',
                                                "model." +
                                                "recordattendance('btnattsave"+
                                                instance.id +"', '" +
                                                instance.id + "')",
                                                "btnattsave" + instance.id),
                                            label("", "error" + instance.id)
                                        ]);
                                    }

                                    _rows.push(['<strong>Female</strong>','','','','', '']);

                                    for (var i = 0;
                                         i <
                                         $("#name-rightbadge")
                                             .data("listfemale").length;
                                         i++)
                                    {
                                        instance = $("#name-rightbadge")
                                            .data("listfemale")[i];
                                        _rows.push([
                                            '<img width="60px;" height="60px" class="img-circle img-bordered-sm"'+
                                            ' src=' + instance.imgsrc + '>',
                                            instance.id,
                                            instance.name.toUpperCase(),
                                            view.select("status" + instance.id, "",
                                                ['','PRESENT',
                                                    'LATE', 'ABSENT', 'EXCUSED'], "", true),
                                            view.buttonact('success btn-flat fa fa-save',
                                                '',
                                                "model." +
                                                "recordattendance('btnattsave"+
                                                instance.id +"', '" +
                                                instance.id + "')",
                                                "btnattsave" + instance.id),
                                            label("", "error" + instance.id)
                                        ]);
                                    }

                                    _rows.push(['','',view.buttonact('success fa fa-save',
                                        'Save All', "model.batchsaveattendance('btnattendall')",
                                        "btnattendall"),'','', '']);

                                    return _rows;
                                }
                            )()

                        });
                    }
                )()
            }]
        }, "")
    }


    function fornavtabs()
    {
        return view.navtab(
            {
                tabs:[
                    {
                        label:"Activity Entry",
                        assoc:"subjgradebook",
                        content: view.aboutmebox(
                                {aboutme:
                                [{
                                    icon: "fa fa-graduation-cap",
                                    label:"Data Entry",
                                    value:
                                column(6, view.
                                    exformgroup(
                                        view.select(
                                            'cbogradecategories',
                                            'Categories',
                                            [
                                                'Written Works',
                                                'Performance Tasks',
                                                'Quarterly Assessment'
                                            ],
                                            ""
                                        )
                                    )+
                                    view.
                                    exformgroup(
                                        view.select(
                                            'cbogradecount',
                                            'Count',
                                            (
                                                function ()
                                                {
                                                    f = [];
                                                    for (var i = 1; i <= 10;i++)
                                                    {
                                                        f.push(i);
                                                    }
                                                    return f;
                                                }
                                            )(),
                                            ""
                                        )
                                    )+
                                    view
                                        .exformgroup(
                                            view
                                                .exinputtext(
                                                    "Total Score", "text",
                                                    "txtTotScore"
                                                )
                                        ) +
                                    view.excolumn(12,
                                        '<div class="text-center">' +
                                        view
                                            .exformgroup(
                                                view
                                                    .buttonact("success fa fa-save", "&nbsp;&nbsp;Set",
                                                        "model.savegradeentry('savegradeentry')", "savegradeentry")) +
                                        '</div>')
                                ) +
                                    column(6, '<div class="box box-success">'+
                                        '<div class="box-header with-border">'+
                                          '<h3 class="box-title">Mood Meter</h3>'+
                                          '<div class="box-tools pull-right">'+
                                          '</div>'+
                                        '</div>'+
                                        '<div class="box-body"  id="chart">'+
                                          '<div class="chart">'+
                                            '<canvas id="barChart" style="height:230px"></canvas>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>')                                                        
                                }]},
                            "")
                    },//saveentry
                    {
                        label:"Attendance",
                        assoc:"subjattendance",
                        content: view.aboutmebox(
                            {aboutme:
                                [{
                                    icon: "fa fa-get-pocket",
                                    label:"Attendance",
                                    value:formgroup(inputtext("Date",
                                        "text", "attendancedate",
                                        'placeholder="mm-dd-yyyy"')) +
                                    view.
                                    exformgroup(
                                        view.select(
                                            'cboattendancepoints',
                                            'Points',
                                            [
                                                '0.5',
                                                '1.0'
                                            ],
                                            "", false)
                                    ) +
                                    formgroup(inputtext("Late Points",
                                        "text", "attendanclate",
                                        '')) +
                                    formgroup(inputtext("Excused Points",
                                        "text", "attendancexcuse",
                                        '')) +
                                    view.
                                    exformgroup(
                                        view.select(
                                            'attendancedaypart',
                                            'Day Part',
                                            [
                                                'AM',
                                                'PM'
                                            ],
                                            "", false
                                        )
                                    ) +
                                    view.excolumn(12,
                                        '<div class="text-center">' +
                                        view
                                            .exformgroup(
                                                view
                                                    .buttonact("success fa fa-save", "&nbsp;&nbsp;OK",
                                                        "model.retrieveattendance('retrieveattendance')",
                                                        "retrieveattendance")) +
                                        '</div>')
                                }
                                ]},"")
                    },
                    {
                        label:"Class Record",
                        assoc: "forclassrecord",
                        content: '<table id="tabclassrecord" ' +
                        ' data-search="true" ' +
                        ' data-search-align="left" ' +
                        ' ></table>' + '<br />' +//row
                        row(
                            column(4,'') +
                            column(4,view.buttonact("success fa fa-download","Download",
                                "apputils.tabtoexcel('tabclassrecord', 'classrecord"+
                                $("#name-rightbadge").data("sectionid") +"')",
                                "btnprevcard")) +
                            column(4,'')
                        )
                    }
                ]
            }
        )
    }

    view.composerow = function (par_cols)
    {
        loc_row = '<tr>';
        for (var i = 0; i < par_cols.length; i++)
        {
            loc_row += '<td>' +
                par_cols[i] +
                '</td>';
        }
        loc_row += '</tr>';
        return loc_row;
    }

    view.subjectmanagement = function (par_subject, par_btnobj, par_label)
    {
    
    
        $.cookie("tracker", par_subject.label);
        $("#name-rightbadge").data("sectionid", par_subject.sectionid);

        lvlsxn = apputils.getSubjectLevelSection(par_subject.sectionid);

        $("#main").html(
            column(12,
                row(
                    column(3,
                        view.aboutmebox({
                                aboutme: [
                                    {
                                        icon: par_subject.icon,
                                        label: par_subject.label,
                                        value: par_subject.value
                                    },
                                    {
                                        icon: "fa fa-cubes",
                                        label: "Grading Quarter",
                                        value: $.cookie("quarter")
                                    },
                                    {
                                        icon: "fa fa-calendar",
                                        label: "School Year",
                                        value: $.cookie("semid").substring(0,4) + "-" +
                                        $.cookie("semid").substring(4,8)
                                    },
                                    {
                                        icon: "",
                                        label: "Summative Report",
                                        value: '<div class="text-center">' +
                                        view.buttonact('success fa fa-line-chart',
                                            'View Grades',
                                            "model.retrievegrades()",
                                            "btnviewgradesubmission") + apputils.space(4) +
                                        view.buttonact('warning fa fa-list-alt',
                                            'Quarterly Assessment',
                                            "view.quarterlyassessment()",
                                            'btnquarterlyassessment') +
                                        '</div>'
                                    },
                                    {
                                        icon: "",
                                        label: "Show Prediction Report",
                                        value: '<div class="text-center">' +
                                        view.buttonact('success fa fa-line-chart',
                                            'Show Prediction',
                                            "model.displayprediction()",
                                            "btndisplayprediction") +
                                        '</div>'
                                    },
                                    {
                                        icon: "",
                                        label: "Create Exams",
                                        value: '<div class="text-center">' +
                                        view.buttonact('success fa fa-pencil',
                                                    'Create New Exam',
                                                    "view.displayexamoptions()",
                                                    "btnviewcreateexam") +
                                                '</div>'
                                    }
                                ]
                            },
                            "About"
                        ) +
                        view.aboutmebox({
                                aboutme:
                                    [{
                                        icon:"",
                                        label:"",
                                        value: (function (arrsubjects) {
                                            loc_currsubjects = $.cookie("tracker");
                                            btns = '';
                                            for (var i = 0; i < arrsubjects.length; i++) {
                                                var btnobject = {
                                                    label: arrsubjects[i].label,
                                                    action: "view.subjectmanagement(" +
                                                    (function (x) {
                                                        return '$("#name-rightbadge").data("subjects")['+x+']';
                                                    })(i) + ")",

                                                    icon: arrsubjects[i].icon
                                                };

                                                if (arrsubjects[i].label ==
                                                    $.cookie("tracker"))
                                                {
                                                    btnobject["emphasis"] = "current";
                                                    btnobject["emphcolor"] = "green";
                                                }
                                                else
                                                {
                                                    btnobject["emphasis"] = "";
                                                    btnobject["emphcolor"] = "";
                                                }
                                                btns = btns + view.appbutton(btnobject)
                                            }
                                            return btns;
                                        })
                                        ($("#name-rightbadge").data("subjects"))
                                    },
                                        {icon:"",
                                            label:"File Operation",
                                            value:'<div class="text-center">' + view.buttonact('success fa fa-upload',
                                                'Upload',
                                                "view.uploadclassrecord()",
                                                "btnviewuploadclassrecord") + '</div>'
                                        }]
                            },
                            "Subjects")
                    )
                    +
                    column(9,
                   // row(
                   //     column(6,
                        '<div id="managesubjectright">' +
                        fornavtabs()
                        +
                        '</div>'//) //column
                        +
                        '<div id="studentperfentries">' +
                        forgradeentry()
                        + '</div>',
                        "grademain"
                        //)//row

                    ))));//column


        level = section = '';

        if (lvlsxn != '')
        {
            level = lvlsxn.split("-")[0];
            section = lvlsxn.split("-")[1];
        }


        coteacherfnc = function ()
        {
            coteachers = apputils.getCoTeacher(par_subject.sectionid);

            if (coteachers.length > 0)
            {
                for (var i = 0; i < coteachers.length; i++)
                {
                    resp = coteachers[i];
                    apputils.echo(apputils.soonpath(resp.pic));
                    //apputils.soonpath
                    $("#subjcoteacher").append(
                        view.boxcomment(apputils.soonpath(resp.pic),
                            apputils.space(2) + resp.fullname,
                            "", "", "div" + resp.idnum) +
                        view.buttonact("danger btn-xs fa fa-minus",
                            "",
                            "model.removecoteacher('"+"removecollab"+resp.idnum+"','"+resp.idnum+"')",
                            "removecollab"+resp.idnum) +
                        apputils.newline()
                    );

                }
            }
        }

        proceedfcn = function (){


            $("#name-rightbadge").data("managesubjectlevel", level);
            $("#name-rightbadge").data("managesubjectsection", section);

            $("#main").html(
                column(12,
                    row(
                        column(3,
                            view.aboutmebox({
                                    aboutme: [
                                        {
                                            icon: par_subject.icon,
                                            label: par_subject.label,
                                            value: par_subject.value
                                        },
                                        {
                                            icon: "fa fa-cubes",
                                            label: "Grading Quarter",
                                            value: $.cookie("quarter")
                                        },
                                        {
                                            icon: "fa fa-calendar",
                                            label: "School Year",
                                            value: $.cookie("semid").substring(0,4) + "-" +
                                            $.cookie("semid").substring(4,8)
                                        },
                                        {
                                            icon: "fa fa-pencil",
                                            label: "Grade & Section",
                                            value: lvlsxn
                                        },
                                        {
                                            icon: "fa fa-puzzle-piece",
                                            label: "Co-Teacher &nbsp;&nbsp;" +
                                                   view.buttonact(
                                                          "success btn-xs fa fa-plus",
                                                          "",
                                                          "view.addcoteacher()"
                                                        ),
                                            value:view.divel("subjcoteacher")
                                        },
                                        {
                                            icon: "",
                                            label: "Summative Report",
                                            value: '<div class="text-center">' +
                                            view.buttonact('success fa fa-line-chart',
                                                'View Grades',
                                                "model.retrievegrades()",
                                                "btnviewgradesubmission") +
                                            '</div>'
                                        }
                                    ]
                                },
                                "About"
                            ) +
                            view.aboutmebox({
                                    aboutme:
                                        [{
                                            icon:"",
                                            label:"",
                                            value: (function (arrsubjects) {
                                                loc_currsubjects = $.cookie("tracker");
                                                btns = '';
                                                for (var i = 0; i < arrsubjects.length; i++) {
                                                    var btnobject = {
                                                        label: arrsubjects[i].label,
                                                        action: "view.subjectmanagement(" +
                                                        (function (x) {
                                                            return '$("#name-rightbadge").data("subjects")['+x+']';
                                                        })(i) + ',$("#studentperfentries"),\'\')',

                                                        icon: arrsubjects[i].icon
                                                    };

                                                    if (arrsubjects[i].label ==
                                                        $.cookie("tracker"))
                                                    {
                                                        btnobject["emphasis"] = arrsubjects[i].section.substring(0,6);
                                                        btnobject["emphcolor"] = "green";
                                                    }
                                                    else
                                                    {
                                                        btnobject["emphasis"] = arrsubjects[i].section.substring(0,6);
                                                        btnobject["emphcolor"] = "gray";
                                                    }
                                                    btns = btns + view.appbutton(btnobject)

                                                }
                                                return btns;
                                            })
                                            ($("#name-rightbadge").data("subjects"))
                                        },
                                            {icon:"",
                                                label:"File Operation",
                                                value:'<div class="text-center">' + view.buttonact('success fa fa-upload',
                                                    'Upload',
                                                    "view.uploadclassrecord()",
                                                    "btnviewuploadclassrecord") + '</div>'
                                            }]
                                },
                                "Subjects")
                        )
                        +
                        column(9,
                            '<div id="managesubjectright">' +
                            fornavtabs()
                            +
                            '</div>'
                            + '<div id="studentperfentries">' +
                            forgradeentry()
                            + '</div>',
                            "grademain"
                        )
                    )
                )
            );

            /*
             credit: http://stackoverflow.com/a/29184836
             */
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href") // activated tab
                if (target == "#subjattendance")
                {
                    $("#attendancedate").val(apputils.now());
                    $("#attendanclate").val("0.5");
                    $("#attendancexcuse").val("0.5");
                    $("#studentperfentries").html(forattendanceentry());
                }
                else if (target == "#forclassrecord")
                {
                    $("#studentperfentries").html("");
                }
                else
                {
                    $("#studentperfentries").html(forgradeentry());
                }
            });

            $("#attendancedate").datetimepicker(
                {format:'m-d-Y',
                    timepicker:false});

            $('#cbogradecategories').on('change',  (function() {
                $("#txtTotScore").val("");
            }));

            $('#cbogradecount').on('change',  (function() {
                $("#txtTotScore").val("");
            }));

            table_cols = [];
            table_cols.push({
                field: 'lrn',
                title: 'LRN No'
            });

            table_cols.push({
                field: 'name',
                title: 'Student Name'
            });

            for (var i = 1; i <= 10; i++)
            {
                table_cols.push({
                    field: 'ww' + i,
                    title: 'Wrtn Wrx ' + i
                });
            }


            table_cols.push({
                field: 'wwtotal',
                title: 'TOTAL'
            });

            table_cols.push({
                field: 'wwps',
                title: 'PS'
            });

            table_cols.push({
                field: 'wwws',
                title: 'WS'
            });

            for (var i = 1; i <= 10; i++)
            {
                table_cols.push({
                    field: 'pt' + i,
                    title: 'Prf Tsx ' + i
                });
            }

            table_cols.push({
                field: 'pttotal',
                title: 'TOTAL'
            });

            table_cols.push({
                field: 'ptps',
                title: 'PS'
            });

            table_cols.push({
                field: 'ptws',
                title: 'WS'
            });

            table_cols.push({
                field: 'qa1',
                title: 'Qrtr Asmt'
            });

            table_cols.push({
                field: 'qaps',
                title: 'PS'
            });

            table_cols.push({
                field: 'qaws',
                title: 'WS'
            });

            table_cols.push({
                field: 'igrade',
                title: 'Ini Grd'
            });

            table_cols.push({
                field: 'grade',
                title: 'Grade'
            });

            $("#tabclassrecord").bootstrapTable({
                columns: table_cols});


            $('.nav-tabs a').click(function(){
                if ($(this).text() == 'Class Record')
                {
                    model.getclassrecorddata(this);
                }
            })
            coteacherfnc();
        }


        if (section == $("#name-rightbadge").data("section") &&
            level == $("#name-rightbadge").data("grade"))
        {
            $("#name-rightbadge").data("listmale", $("#name-rightbadge").data("thislistmale"));
            $("#name-rightbadge").data("listfemale", $("#name-rightbadge").data("thislistfemale"));
            proceedfcn();
        }
        else {
            apputils.echo("this is it");
            model.ajaxCall({
                resource: "classlist/" + $("#name-rightbadge").data("sectionid"),
                data: {},
                type: "GET",
                dataType: "json",
                buttonid: par_btnobj,
                buttonlabel: par_label,
                spinnerval: view.boxloading,
                error: function () {

                },
                success: function (resp) {
                    if (resp.status != 'ok') {
                        new PNotify({
                            title: "Info  Access",
                            text: resp.message,
                            type: 'error'
                        });
                        return;
                    }

                    $("#name-rightbadge").data("listmale", resp.listmale);
                    $("#name-rightbadge").data("listfemale", resp.listfemale);

                    proceedfcn();

                }
            });
        }

        //subjcoteacher

    }

    view.forgradesubmission = function()
    {
        $("#managesubjectright").html("");
        $("#studentperfentries").html("");
        $("#managesubjectright").html(forgradeentry(view.buttonact('success fa fa-cloud-upload',
            'Submit', " model.savequartergroupgrade('btnsavegrade')",
            "btnsavegrade"), "model.savequarterstugrade", false))
    }


    view.displayprediction = function(){

        var predictiondiv = '<div class="col-sm-6">'+
                                '<div class="box box-danger">'+
                                    '<div class="box-header with-border">'+
                                      '<h3 class="box-title">Predicted Failing Students</h3><div class="box-tools pull-right">'+
                                        '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'+
                                        '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-remove"></i></button>'+
                                    '</div>'+
                                    '</div>'+
                                    '<div class="box-body">'+
                                      '<div class="row">'+
                                        '<div id="failingstudentsdiv"></div>'+
                                      '</div>'+
                                    '</div><!-- /.box-body -->'+
                                  '</div><!-- /.box -->'+

                                '<div class="box box-success">'+
                                    '<div class="box-header with-border">'+
                                      '<h3 class="box-title">Predicted Passing Students</h3><div class="box-tools pull-right">'+
                                        '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'+
                                        '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-remove"></i></button>'+
                                    '</div>'+
                                    '</div>'+
                                    '<div class="box-body">'+
                                      '<div class="row">'+
                                          '<div id="passingstudentsdiv"></div>'+

                                    '</div><!-- /.box-body -->'+
                                  '</div><!-- /.box -->'+
                            '</div> <!--col-sm-6-->'+
                          '</div>'+
                            '<div class="col-sm-6">'+
                                '<div class="box box-warning">'+
                                    '<div class="box-header with-border">'+
                                      '<h3 class="box-title">Predicted Passing Students</h3>'+
                                      '<div class="box-tools pull-right">'+
                                        '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'+
                                        '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-remove"></i></button>'+
                                      '</div>'+
                                    '</div>'+
                                    '<div class="box-body">'+
                                      '<div class="row">'+
                                        '<div id="Student Data"></div>'+
                                      '</div>'+
                                    '</div><!-- /.box-body -->'+
                                '</div><!-- /.box -->'+
                            '</div>';

        $("#managesubjectright").html("");
        $("#studentperfentries").html("");
        $("#managesubjectright").html(predictiondiv);

    }

    view.uploadclassrecord = function () {
        $("#managesubjectright").html("");
        $("#studentperfentries").html("");
        $("#managesubjectright").html(
            view.simplebox({
                boxtype: "primary",
                title:"Upload Class Record",
                body:
                column(2,"") +
                column(8,
                    view
                        .exboxwidget({color:"green",
                            icon:"fa fa-upload",
                            text1: column(12,row("XLSX File Upload" +
                                    '<input type="file" id="xlsxfile">') +
                                row(view.labelel("progressmessage", ""))),
                            text2:"",
                            idt1:"",
                            idt2:"",
                            iconid:"xlsuploadicon"
                        })) +
                column(2, ""),
                footer: row(column(12, view.buttonact("info fa fa-backward", "&nbsp;&nbsp;Back",
                    "{view.subjectmanagement(apputils.getcurrentsubjectbuttonprops()); "+
                    " $('#xlsxfile').unbind('change');$('#xlsxfile').unbind('click');}",
                    "btnsubmitxls")
                ))
            }) +
            '<div id="excelresults"></div>'
        );

        $("#xlsxfile").change(apputils.readxlsx);
        $("#xlsxfile").click(function() {$("#xlsxfile").val("");});
    }

    view.uploadpic = function ()
    {


        $("#main").html(column(12, view.simplebox({
            boxtype:"primary",
            title:"Upload Image",
            body:
            function () {
                if ($.cookie("usertype") == "faculty")
                {return formgroup(view.exinputtext("LRN No.",
                    "text",
                    "imguploadlrn",
                    'placeholder="Leave it blank if you are uploading your own image file."' ));
                }
                else
                {
                    return "";
                }
            }() +
            view
                .exboxwidget({color:"green",
                    icon:"fa fa-upload",
                    text1: column(12, row("Image Upload" +
                            '<div id="dropbox"><span class="message">Drop File here.</span></div>')
                        +
                        row(view.labelel("imgprogressmessage", ""))),

                    text2:"",
                    idt1:"",
                    idt2:"",
                    iconid:"imguploadicon"
                }) +
            function () {

                if ($.cookie("usertype") == "faculty")
                    return row(column(12,
                        boxwithminimize("boxenclose", "Search",
                            column(12,
                                row(column(6,inputtext("", "text", "enrollsearch",
                                        'placeholder="Type Last Name"')) +
                                    column(6,
                                        inputbutton("Search", "btnerlsearch", "info"))
                                ) + '<br />' +
                                row(column(12,boxwithminimize("erlsrchbox", "Search Results",
                                    view.table({
                                        "id":"erlsearchtab",
                                        "class":"tables-bordered",
                                        "cols": ["LRN No", "Name"],
                                        "tbodyclass":''
                                    }), "", ""))
                                ))
                            , "", "collapsed-box")));
                else
                    return '';
            }()

            ,

            footer:""/*row(column(12, view.buttonact("info fa fa-backward", "&nbsp;&nbsp;Back",
             "", "btimgpass")))*/
        })));
        $("#btnerlsearch").click(function () {model.enrollsearch(true);})
        var dropbox = $("#dropbox"),
            message = $('.message', dropbox);
        $(".progress-bar").attr('style', 'width:0%')
        //var imglrn = ;
        //
        dropbox.filedrop({
            fallback_id:'btnimagepass',
            paramname:'file',
            maxfiles: 1,
            data : {lrn:function () {
                if ($.cookie("usertype") == "faculty")
                { return $("#imguploadlrn").val(); }
                else
                { return ''; }
            }},
            maxfilesize:2,
            allowedfiletypes:['image/jpeg'],
            allowedfileextensions:['.jpg','.jpeg'],
            url: apputils.rest + '/image',
            uploadFinished:function (i, file, response) {

                $("#imguploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                //$.data(file).addClass('fa-upload');
                $("#dropbox").html('<span class="message">DROP FILE HERE.</span>');
                $(".progress-bar").attr('style', 'width:0%');
                apputils.echo(response);
                if (response.status.toLowerCase() == 'error')
                { $("#imgprogressmessage").html(response.message);
                    $(".progress-bar").attr('style', 'width:0%');
                }
                else {

                    if ($("#imguploadlrn").val() == undefined)
                    {
                        view.setprofimg(response.message);
                        $("#imgprogressmessage").html("Done.");
                        return;
                    }

                    if ($("#imguploadlrn").val().length == 0)
                    {
                        view.setprofimg(response.message);
                        $("#imgprogressmessage").html("Done.");
                        return;
                    }

                }

            },
            error: function (err,file) {
                $(".progress-bar").attr('style', 'width:0%');
                $("#imguploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                switch (err) {
                    case 'BrowserNotSupported':
                        $("#imgprogressmessage").html('Browser NOT SUPPORTED!'); break;
                    case 'TooManyFiles':
                        $("#imgprogressmessage").html('Only One file is allowed to be uploaded'); break;
                    case 'FileTooLarge':
                        $("#imgprogressmessage").html(file.name + 'is too large file size is limited to ' + this.maxfilesize + " MB.");
                        break;
                    case 'FileTypeNotAllowed':
                        $("#imgprogressmessage").html("Unsupported Image files.");
                        break;
                    case 'FileExtensionNotAllowed':
                        $("#imgprogressmessage").html("Only .jpg or .jpeg is allowed.");
                        break;
                    default:
                        $("#imgprogressmessage").html(err);
                        break;
                }
            },
            beforEach: function(file) {

            },
            beforeSend: function(file, i, done) {
                $(".progress-bar").attr('style', 'width:0%');
                $("#dropbox").html('<span class="message">' + file.name +  '</span>');
                this.data = {lrn:function () {
                    if ($.cookie("usertype") == "faculty")
                    { return $("#imguploadlrn").val(); }
                    else
                    { return ''; }
                }}
                //apputils.echo(this.data);
            },
            uploadStarted: function(i, file, len) {

                //createImage(file);
                $(".progress-bar").attr('style', 'width:0%');
                $("#imguploadicon").removeClass('fa-upload').addClass('fa-refresh fa-spin');
                $("#imgprogressmessage").html("Uploading..")
            },
            progressUpdated: function (i, file, progress) {
                //apputils.echo(progress);
                $(".progress-bar").attr('style', 'width:'+progress+'%');
            }
        });



        //$("#imagefile").change(model.uploadimg);
        //$("#imagefile").click(function() {$("#imagefile").val("");});
    }


    view.paragraph = function (par_opts)
    {
        ids = '';
        if (par_opts.id.length > 0 )
        {
            ids = '  id="' + par_opts.id + '"'
        }

        classes = '';

        if (par_opts.class.length > 0)
        {
            classes = '  class="' + par_opts.class + '"';
        }

        return '<p'+ ids  + classes + '>' + par_opts.content + '</p>';
    }

    view.initbulletinboard = function()
    {
        return view.simplebox({
            boxtype: "info",
            title:"Bulletin Board",
            body: view.exformgroup(
                view.textarea({
                    id:"taBulletin",
                    rows: 5,
                    cols:20,
                    wrap:'hard',
                    placeholder: "Your message to the class."
                })),
            footer: view.labelel("lblErrorBulletin") +
            view.buttonact("success pull-right",
                "Post", "model.postbulletin('btnPostBulletin')",
                "btnPostBulletin")
        });
    }


    view.initassignment = function ()
    {
        return view.simplebox({
            boxtype:"info",
            title:"Assignment",
            body: view.exformgroup(
                view.selectize($("#name-rightbadge").data("subjects"),
                    function(x,i) {
                        return x[i].label + ' ' + x[i].section;
                    },
                    "selassignment",
                    "",
                    "selassignment") + '<br />' +
                view.textarea({
                    id:"taAssignment",
                    rows: 5,
                    cols:20,
                    wrap:'hard',
                    placeholder: "Assignment"
                }) + '<br />' +
                inputtext("Due Date",  "text", "txtassignduedate",     'placeholder="mm/dd/yyyy"')
            ),
            footer: view.labelel("lblErrorAssignment") +
            view.buttonact("success pull-right", "Post",
                "model.postassignment('btnpostAssign')", "btnpostAssign")
        });
    }

    view.initevent = function ()
    {
        return view.simplebox({
            boxtype:"info",
            title:"Event",
            body: view.exformgroup(
                inputtext("Start Date",
                    "text",
                    "txteventstartdate",
                    'placeholder="mm/dd/yyyy"')  + '<br />' +
                inputtext("End Date",
                    "text",
                    "txteventenddate",
                    'placeholder="mm/dd/yyyy"')  + '<br />' +
                view.textarea({
                    id:"taEvent",
                    rows: 5,
                    cols:20,
                    wrap:'hard',
                    placeholder: "Event Description"
                })

            ),
            footer: view.labelel("lblErrorEvent") +
            view.buttonact("success pull-right", "Post",
                "model.postevent('btnpostAssign')", "btnpostAssign")
        });
    }


    view.timepostbox = function ()
    {
        return column(12, view.navtab(
            {
                tabs: [
                    {
                        label:"Bulletin",
                        assoc:"tlpostbulletin",
                        content:view.initbulletinboard()
                    },
                    {
                        label:"Assignment",
                        assoc:"tlpostassignment",
                        content:view.initassignment()
                    },
                    {
                        label:"Event",
                        assoc:"tlevent",
                        content:view.initevent()
                    }
                ]

            })
        );
    }

    /* view.postbox = function (par_opts)
     {

     {
     content:'',
     imgsrc:'',
     userurl:'#',
     owner:'',
     postdesc:'' //share type + time

     }

     return gendiv("post", gendiv("user-block", '<img class="img-circle img-bordered-sm" '+
     'src="'+par_opts.imgsrc+'" alt="user image">' +
     '<span class="username">' +
     '<a href="' + par_opts.userurl + '">' + par_opts.owner + '</a>' +
     '</span>' +
     '<span class="description">' + par_opts.postdesc + '</span>'
     ) +
     view.paragraph({id:'', class:'', content:par_opts.content}));
     }*/


    view.dropdownbuttons = function (first_btn_lbl,btns)
    {

        var all_btns = '';
        for (var i = 0; i < btns.length; i++)
        {
            all_btns += '<li>' +btns[i] + '</li>';
        }
        return '<div class="input-group-btn">' +
            '<button type="button"' +
            'class="btn btn-default dropdown-toggle"' +
            'data-toggle="dropdown"' +
            'aria-expanded="false" >' +
            first_btn_lbl +
            '<span class="fa fa-caret-down"></span>' +
            '</button>' +
            '<ul class="dropdown-menu">' +
            all_btns +
            '</ul>' +
            '</div>';

    }


    view.mykids = function ()
    {

        $("#main").html(
            view.excolumn(12,
                view.rowdify(
                    $("#name-rightbadge").data("mystu"),
                    view.boxembodiement,
                    function(kiddo)
                    {
                        apputils.echo(kiddo)
                        return {
                            name:kiddo.name,
                            boxcolor:kiddo.color.split('bg-')[1],
                            idno:kiddo.id,
                            picsrc:$(kiddo.imgsrc).attr('src'),
                            embodiement:
                                view.centerize(
                                    view.buttonact("success", "Profile",
                                        kiddo.btn, "btn" + kiddo.id))
                        }

                    },"My Student(s)")
            )
        );



    }

    view.changeschoolyear = function ()
    {
        $("#main").html("");
        $("#main").html(
            view.excolumn(12,
                view.excolumn(4, "") +
                view.excolumn(4,
                    view.simplebox({
                        boxtype: "primary",
                        title: "Change School Year",
                        body:view.centerize(
                            view.exinputtext("Beginning Year", "text", "txtbeginningyear", "") +
                            "<br />" +
                            view.buttonact("success", "Change",
                                "model.changeschoolyear('btnchangesy')",
                                "btnchangesy"
                            )
                        ),
                        footer:view.labelel("lblChangeSY")
                    })) +
                view.excolumn(4, "")
            ));

    }

    view.schoolyearbanner = function()
    {
        return column(12,
            view.simplebox({
                boxtype:"default",
                title:"School Year",
                body:view.centerize(
                    "<h1>" +
                    $.cookie("semid").slice(0, $.cookie("semid").length / 2) +
                    "-" +
                    $.cookie("semid").slice($.cookie("semid").length / 2, $.cookie("semid").length) +
                    "</h1>" + "<br />" +
                    view.buttonact("success", "Change", "view.changeschoolyear()")
                ),
                footer:""
            })
        );
    }


    view.divel = function (par_divid)
    {
        if (apputils.ifundefined(par_divid))
        {
            divid = '';
        }
        else
        {
            divid = 'id="' + par_divid + '" ';
        }
        return '<div ' + divid + '></div>';
    }

    view.boxcomment = function (par_srcimg, par_username, par_time, par_message, par_id)
    {
        return '<div id="'+par_id+'" class="box-comment">' +
           '<img class="img-circle img-sm" src="'+ par_srcimg +'" alt="User Image">' +
           '<div class="comment-text">' +
              '<span class="username">' +
                   par_username +
              '</span>' +
               '<span class="text-muted pull-right">' +
                    par_time +
               '</span>' +
               '<div>' +
                 par_message +
               '</div>' +
           '</div>' +
        '</div>';
    }

    view.addcoteacher = function ()
    {
      $("#grademain").html(
        column(12,
            boxwithminimize("boxcoteachenclose", "Search Teacher",
                column(12,
                    row(column(6,inputtext("", "text", "teachersearch",
                            'placeholder="Type Last Name"')) +
                        column(6,
                            apputils.newline() +
                            view.buttonact("info", "Search",
                                "model.searchfaculty('btnsrchteach');",
                                "btnsrchteach")
                        )
                    ) + '<br />' +
                    row(column(12,boxwithminimize("coteachsrchbox", "Search Results",
                        view.table({
                            "id":"coteachsearchtab",
                            "class":"tables-bordered",
                            "cols": ["Action", "Name"],
                            "tbodyclass":''
                        }), "", ""))

                    ) + '<br />' +
                    view.buttonact("info fa fa-backward", "&nbsp;&nbsp;Back",
                        "{view.subjectmanagement(apputils.getcurrentsubjectbuttonprops(),"+
                        "$('#btncoteach'), ''); "+
                        "}",
                        "btncoteach")
                )
                , "", "")
        ));
    }



    view.displayexamoptions = function(){
        subject = apputils.getcurrentsubjectbuttonprops().label.split(',');
        var exam =  '<div class="row">'+
                        '<div class="box box-primary">'+
                            '<div class="box-header with-border">'+
                                '<h3 class="box-title">Created Exams</h3>'+
                            '</div>'+
                            '<div class="box-body"></div>'+
                        '</div>'+
                        '<div class="box box-success">'+
                            '<div class="box-header with-border" style="overflow: hidden;">'+
                                '<h3 class=box-title>Create New Exam</h3>'+
                                '</div>'+
                            '<div id="createexamsdiv" class="box-body"></div>'+
                        '</div>'+
                    '</div>';
         $("#managesubjectright").html("");
        $("#studentperfentries").html("");
        $("#managesubjectright").html(exam);
        createexam(subject);
    };

    view.takeexam = function(){
        var takeexamquestionsdiv =  '<section class="content">'+
                                        '<div class="box">'+
                                            '<div class="box-header">'+
                                              '<h2 class="box-title">Exams List</h2>'+
                                              '<div id="examslist"></div>'+
                                            '</div><!-- /.box-header -->'+
                                            '<div id="questionwrapper">'+
                                                '<div id="takeexamquestionsdiv" class="well"></div>'+
                                                '<div class="text-center">'+
                                                  '<ul id="pagination-demo" class="pagination-sm"></ul>'+
                                                '</div></div>'+
                                              '<div class="modal-footer">'+
                                                '<button type="button" class="btn btn-primary" id="saveexam">Save changes</button>'+
                                              '</div>'+
                                        '</div><!-- /.box -->'+
                                    '</section>';
        $('#main').html(takeexamquestionsdiv);
        takeexamtimer();
        paginateexamquestions();
    };



    //view.last

}( window.view = window.view || {}, jQuery ));



/*============================================FUNCTIONS FOR CREATING EXAMS START============================================*/    
function classlist(){
    var classlistdiv = '<div class="box box-success">'+
                            '<div class="box-header with-border" style="overflow: hidden;">'+
                            '<h3 class="box-title">Class List</h3>'+
                                '<div class="box-tools pull-right">'+
                                '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'+
                                '</div><!-- /.form-group -->'+
                            '</div>'+
                            '<div class="box-body">'+
                            '<button type="button" id="clbutton" class="btn btn-primary">Show Class List</button>'+
                                '<div id="classlist"></div>'+
                            '</div>' +
                        '</div>';
    $('#assignexamsdiv').html(classlistdiv);
} 

    function createexam(subject){
        var examdiv = ' <section class="content">'+
                      '<div class="box box-default">'+
                        '<div class="box-header">'+
                            '<h3>Subject: '+subject+'</h3>'+
                            '<div class="box-tools pull-right">'+
                            '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'+
                          '</div>'+
                        '</div><!-- /.box-header -->'+
                        '<div class="col-md-12">'+                        
                              '<div class="form-group">'+
                                '<label>Exam Title</label>'+
                                '<input id="examtitle" type="text" class="form-control" placeholder="Enter ...">'+
                                '<input id="examid" hidden></input>' +
                              '</div>'+
                        '</div><!--col 12-->'+
                        '<div class="box-body">'+
                          '<div class="row">'+
                            '<div class="col-md-6">'+                        
                                '<!-- Date and time range -->'+
                              '<div class="form-group">'+
                                '<label>Time Duration (In mins e.g. 60, 85):</label>'+
                                '<div class="input-group">'+
                                  '<div class="input-group-addon">'+
                                    '<i class="fa fa-clock-o"></i>'+
                                  '</div>'+
                                  '<input id="timeduration" type="number" min="1" class="form-control pull-right">'+
                                '</div><!-- /.input group -->'+
                              '</div><!-- /.form group -->'+
                              
                            '</div><!-- /.col -->'+
                            '<div class="col-md-6">'+
                              '<!-- Date range -->'+
                              '<div class="form-group">'+
                                '<label>Due Date:</label>'+
                                '<div class="input-group">'+
                                  '<div class="input-group-addon">'+
                                    '<i class="fa fa-calendar"></i>'+
                                  '</div>'+
                                  '<input type="text" class="form-control pull-right" id="duedate">'+
                                '</div><!-- /.input group -->'+
                              '</div><!-- /.form group -->'+
                            '</div><!-- /.col -->'+
                          '</div><!-- /.row -->'+
                        '</div><!-- /.box-body --> '+
                              '<div class="modal-footer">'+
                                '<button type="button" class="btn btn-primary" onclick="model.createexam();">Save changes</button>'+
                              '</div>'+
                      '</div><!-- /.box -->'+
                    '</section>'+
                    '<div id="assignexamsdiv" class="box-body"></div>'+
                    '<div id="createexamquestionsdiv"><div>';

    $('#createexamsdiv').html(examdiv);
    createexamquestions();
    pluginfunctions();
    classlist();
    };

function createexamquestions (){
        var questionsdiv = '<section class="content">'+
                          '<div class="box box-warning">'+
                            '<div class="box-header">'+
                              '<div class="style="overflow: hidden;">'+
                                '<h3 class="box-title">Create Question</h3>'+
                                '<button data-toggle="modal" data-target="#squarespaceModal" class="btn btn-warning btn-sm right" '+
                                    'onclick="createquestion();" style="float: right;">Add Question</button>'+
                                // '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'+
                              '</div>'+
                            '</div><!-- /.box-header -->'+
                            '<div class="box-body pad">'+
                              '<div class="row">'+
                                      '<div class="box-body" id="questionlist"></div>'+
                              '</div><!-- /.row -->'+
                            '</div><!-- /.box-body -->'+ 
                                  '<div class="modal-footer">'+
                                    '<!--button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button-->'+
                                    '<button type="button" id="saveallquestionsbutton" class="btn btn-sm btn-primary">Save changes</button>'+
                                  '</div>'+
                          '</div><!-- /.box -->'+
                        '</section>';
    $('#createexamquestionsdiv').html(questionsdiv);
    $('#saveallquestionsbutton').prop('disabled', true);
};

$(".modal").on("hidden.bs.modal", function(){
    $("#here").empty();
});
$(".modal").on("shown.bs.modal", function(){
    $("#here").empty();
    $('#questiontype option[value=0]').prop('selected', true);
});

function izero(){
    choicenum_counter = 0;
};

function disable_removebutton(){
    $("#removechoice_button").prop("disabled",true);
};


function reenable_removebutton(){
    $("#removechoice_button").prop("disabled",false);
};

function reenable_savequestion_button(){
    $("#savequestion_button").prop("disabled",false);
};

function showchoicesonload(questionid){
    add_choice(questionid);
    add_choice(questionid);
    add_choice(questionid);
    add_choice(questionid);
    // divlength();
};

function divlength(choiceid){
    var divlength = $('#questiondiv > div').length;
    var choicediv = '#choices'+divlength;

    $(choicediv).remove();

    // console.log(divlength);
    // console.log("heyy: " +choicediv);
    // console.log("hoooyy: " +choiceid);
};

var choicenum_counter = 0;
var questionid = 1;
function createquestion(){  
    var questiontype = $('#questiontype').val();
    if(questiontype == 1){
        reenable_savequestion_button();
        $('#here').empty();
        var multiplechoice = '<div id="questionid'+questionid+'" ><form>' +
                    '<label for="">Multiple Choice Question </label> &nbsp;&nbsp;' + 
                    'Points: &nbsp; <input id="question'+questionid+'_point" type="number" value="1" min="1"><br><br>'+
                    '<textarea id="'+questionid+'" rows="3" cols="50"></textarea><br> <br> <br>' +
                    '<button type="button" class="btn btn-success btn-sm" id="choice_button" onclick="add_choice('+questionid+');">Add Choice</button>' +
                    '<button type="button" class="btn btn-danger btn-sm rbutton" data-toggle="modal" id="removechoice_button" onclick="remove_choice();">'+
                    'Remove Choice</button><br>' +
                    '<div class="box-body">'+
                    '<div id="questiondiv""></div>' +
                  '</div><!-- /.box-body -->' +
                  '</form><div>';
        $('#here').append(multiplechoice);
        console.log("fromquestion choicenumcounter: "+choicenum_counter);
        izero();
        display_addremovebuttons(questionid);
        showchoicesonload(questionid);
        questionid++;
        $('#saveallquestionsbutton').prop('disabled', false);
    }else if(questiontype == 2){
        reenable_savequestion_button();
        $('#here').empty();
        var trueorfalse = '<div id="questionid'+questionid+'"><form>' +
                            '<label for="">True or False Question </label> &nbsp;&nbsp;' + 
                            'Points: &nbsp; <input id="question'+questionid+'_point" type="number" value="1" min="1"><br><br>'+
                            '<textarea id="'+questionid+'" name="question3" rows="3" cols="50"></textarea>' +
                            '<br><br>' +
                            '<div class="box-body">' + 
                            '<table class="table table-bordered">' +
                              '<tr>' +
                                '<td><input type="radio" name="optionsRadios" id="optionsRadios1" value="true" checked></td>' +
                                '<td>True</td>' +
                              '</tr>' +
                              '<tr>' +
                                '<td><input type="radio" name="optionsRadios" id="optionsRadios2" value="false"></td>' +
                               '<td>False</td>' +
                              '</tr>' +
                            '</table>' +
                          '</div><!-- /.box-body -->' +
                          '</form>';

        $('#here').append(trueorfalse);
        izero();
        display_addremovebuttons(questionid);
        showchoicesonload(questionid);
        questionid++;
        $('#saveallquestionsbutton').prop('disabled', false);
    }else if(questiontype==0){
        $("#savequestion_button").prop("disabled",true);
        $("#here").empty();
    }else{
        $("#here").empty();
    }

};

function add_choice(questionid){
    var choiceid = choicenum_counter + 1;
        var letter = String.fromCharCode('A'.charCodeAt(0) + choicenum_counter);
            var choice =    '<div id="'+questionid+'_'+choiceid+'" class="choicedivcontainer'+choiceid+'">'+
                            '<input type="radio" name="optionsRadios" id="optionsRadios1" value="option_'+choiceid+'" checked>' +
                            letter + '<input type="text" id="option_'+choiceid+'" class="form-control" placeholder="Enter ...">'+
                            '<div>';
            $('#questiondiv').append(choice);
    choicenum_counter++;
    reenable_removebutton();
    console.log("add_choice: "+choicenum_counter);
    console.log("choiceid: "+choiceid);
};

function remove_choice(){
    var choice = choicenum_counter+1;
     var choicediv = '.choicedivcontainer'+choicenum_counter;
     //var choicenum_count = choicenum_counter-1;
    if(choicenum_counter==3){ //euqals 2 kay multiple choice should have at least 2 choices
        console.log("No more questions to remove.");
        $("#removechoice_button").prop("disabled",true);
    };

    $('div').remove(choicediv);

    choicenum_counter--;
    console.log("choicediv"+choicediv);
    console.log("choicenum"+choicenum_counter);
};

function remove_question(question_id){
    var question = '#questionid'+question_id;
    $('div').remove(question);
    question_id--;
    console.log("questionidfrom_removequestion: "+question_id)
    ifremovequestionbutton_isclicked();
};

function ifremovequestionbutton_isclicked(questionid){
    $(".modal").on("shown.bs.modal", function(){
        questionid--;
    });
};

function display_addremovebuttons(questionid){
        $('#addremovebuttonsdiv').empty();
        

        var appendbuttons = '<div class="btn-group btn-danger" role="group">' +
                              '<button type="button" id="cancelquestion_button" class="btn btn-danger" data-dismiss="modal">Cancel</button>' +
                            '</div>'+
                            '<div class="btn-group btn-success" role="group">'+
                              '<button type="button" id="savequestion_button" class="btn btn-success" onclick="model.createquestion('+questionid+');">Add</button>'+
                            '</div>';
        $('#addremovebuttonsdiv').append(appendbuttons);
};

function displayquestion_selector(questionid){
    var questiontype = $('#questiontype').val();
     if(questiontype==1){
        displayquestion_multiplechoice(questionid);
    }else if(questiontype==2){
        displayquestion_trueorfalse(questionid);
    }else {
        console.log("hi");
        $("#savequestion_button").prop("disabled",true);
    };

    izero();
};

function displayquestion_multiplechoice(questionid){
    var deletequestion_button = '<button type="button" class="btn btn-danger btn-sm right"   style="float: right;" onclick="remove_question('+questionid+');">Remove Question</button>';
    var multiplechoice = '<div id="questionid'+questionid+'" style="overflow: hidden;"><form>' +
                    '<label for="">Question: Multiple Choice </label>' + deletequestion_button +
                    '<br><br><textarea id="'+questionid+'" rows="3" cols="50"></textarea><br>' +
                    '<div class="box-body">'+
                    '<div id="displaychoicesdiv'+questionid+'"></div>' +
                  '</div><!-- /.box-body -->' +
                  '</form><div>';
    $('#questionlist').append(multiplechoice);
    $('#here').empty();
    $('.questionselector option[value=0]').prop('selected', true);
    console.log("questionid_fromquestion_mulchoice: "+questionid);
    displayquestion_choices(questionid);
    questionid++;
};

function displayquestion_choices(questionid){
    var questiondiv = '#displaychoicesdiv'+questionid;
    var choiceid = choicenum_counter + 1;
    for(var loopcounter=0; loopcounter<4; loopcounter++){

        var letter = String.fromCharCode('A'.charCodeAt(0) + loopcounter);
        var choice =    '<div id="'+choiceid+'" class="choicedivcontainer">'+'<input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>' +
                        letter + '<input type="text" class="form-control" placeholder="Enter ...">'+
                        '<div>';
        $(questiondiv).append(choice);
    choicenum_counter++;
    choiceid++;
    };
};

function displayquestion_trueorfalse(questionid){
    var deletequestion_button = '<button type="button" class="btn btn-danger btn-sm right" style="float: right;" onclick="remove_question('+questionid+');">Remove Question</button>';
        var trueorfalse = '<div id="questionid'+questionid+'" style="overflow hidden;">'+
                            '<form>' +
                            '<label for="">Question: True or False </label>' + deletequestion_button +
                            '<br><br><textarea id="'+questionid+'" rows="3" cols="50"></textarea>' +
                            '<br><br>' +
                            '<div class="box-body">' + 
                            '<table class="table table-bordered">' +
                              '<tr>' +
                                '<td><input type="radio" value="true" checked></td>' +
                                '<td>True</td>' +
                              '</tr>' +
                              '<tr>' +
                                '<td><input type="radio" value="false"></td>' +
                               '<td>False</td>' +
                              '</tr>' +
                            '</table>' +
                          '</div><!-- /.box-body -->' +
                          '</form></div>';

        $('#questionlist').append(trueorfalse);
    $('#here').empty();
    $('.questionselector option[value=0]').prop('selected', true);
    console.log("questionid_fromquestion_trufalse: "+questionid);
    questionid++;
};

function pluginfunctions () {
        //Initialize Select2 Elements
        $(".select2").select2();
        //Date range picker
        $('#duedate').datepicker();
        //Date range picker with time picker
        $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30, format: 'MM/DD/YYYY h:mm A'});
        //Date range as a button
        $('#daterange-btn').daterangepicker(
                {
                  ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                  },
                  startDate: moment().subtract(29, 'days'),
                  endDate: moment()
                },
        function (start, end) {
          $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        );

        //Timepicker
        $(".timepicker").timepicker({
          showInputs: false
        });
      };

/*============================================FUNCTIONS FOR CREATING EXAMS END============================================*/


/*===========================================FUNCTIONS FOR TAKING EXAMS START============================================*/

function takeexamtimer(){
    $("#ms_timer").countdowntimer({
        minutes : "00",
        seconds : ''+5+'',
        size : "lg"

    });

    setTimeout(disablesaveexam, 5000);
};

function startexam(){
    var takeexamquestionsdiv =  '<section class="content">'+
                                        '<div class="box">'+
                                            '<div class="box-header">'+
                                              '<h2 class="box-title">Exam Title</h2>'+
                                              '<div id="countdowntimer"><span id="ms_timer"><span></div>'+
                                            '</div><!-- /.box-header --><div id="questionwrapper">'+
                                                '<div id="takeexamquestionsdiv" class="well"></div>'+
                                                '<div class="text-center">'+
                                                  '<ul id="pagination-demo" class="pagination-sm"></ul>'+
                                                '</div></div>'+
                                              '<div class="modal-footer">'+
                                                '<button type="button" class="btn btn-primary" id="saveexam">Save changes</button>'+
                                              '</div>'+
                                        '</div><!-- /.box -->'+
                                    '</section>';
}

function paginateexamquestions(){
    $('#pagination-demo').twbsPagination({
    totalPages: 10,
    visiblePages: 5,
    onPageClick: function (event, page){
        $('#takeexamquestionsdiv').empty();
            var trueorfalse = '<div id="questionid"><form>' +
                            '<label for="">True or False Question </label><br>' +
                            '<textarea id="" name="question3" rows="3" cols="77"></textarea>' +
                            '<br><br>' +
                            '<div class="box-body">' + 
                            '<table class="table table-bordered">' +
                              '<tr>' +
                                '<td><input type="radio" name="optionsRadios" id="optionsRadios1" value="true" checked></td>' +
                                '<td>True</td>' +
                              '</tr>' +
                              '<tr>' +
                                '<td><input type="radio" name="optionsRadios" id="optionsRadios2" value="false"></td>' +
                               '<td>False</td>' +
                              '</tr>' +
                            '</table>' +
                          '</div><!-- /.box-body -->' +
                          '</form>';
        $('#takeexamquestionsdiv').html(trueorfalse);
        console.log(page);
    }
});
};


function disablesaveexam(){
    $('#saveexam').prop('disabled', true);
    $('#takeexamquestionsdiv').prop('disabled', true);
    $('#questionwrapper').replaceWith('<h3>Time is up! Exam ended.</h3>');
};
/*============================================FUNCTIONS FOR TAKIING EXAMS END============================================*/


function init()
{
    if (apputils.islogin())
    {
        model.verify($.cookie("username"), $.cookie("key"));
    }
    else
    {
        view.resetall();
    }
}

init();

function forbarchart(){

    var barChartData = {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
            {
              label: "Electronics",
              fillColor: "rgba(210, 214, 222, 1)",
              strokeColor: "rgba(210, 214, 222, 1)",
              pointColor: "rgba(210, 214, 222, 1)",
              pointStrokeColor: "#c1c7d1",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
              label: "Digital Goods",
              fillColor: "rgba(60,141,188,0.9)",
              strokeColor: "rgba(60,141,188,0.8)",
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              data: [28, 48, 40, 19, 86, 27, 90]
            }
          ]
        };

        var opts = {
         fillColor:"#00a65a",
         strokeColor:"#00a65a",
         pointColor:"#00a65a",
         datasetFill:false
         };
         
        var barChartOptions = {
          //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
          scaleBeginAtZero: true,
          //Boolean - Whether grid lines are shown across the chart
          scaleShowGridLines: true,
          //String - Colour of the grid lines
          scaleGridLineColor: "rgba(0,0,0,.05)",
          //Number - Width of the grid lines
          scaleGridLineWidth: 1,
          //Boolean - Whether to show horizontal lines (except X axis)
          scaleShowHorizontalLines: true,
          //Boolean - Whether to show vertical lines (except Y axis)
          scaleShowVerticalLines: true,
          //Boolean - If there is a stroke on each bar
          barShowStroke: true,
          //Number - Pixel width of the bar stroke
          barStrokeWidth: 2,
          //Number - Spacing between each of the X value sets
          barValueSpacing: 5,
          //Number - Spacing between data sets within X values
          barDatasetSpacing: 1,
          //String - A legend template
          legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
          //Boolean - whether to make the chart responsive
          responsive: true,
          maintainAspectRatio: true
        };
        
        var id="barChart";
        
        apputils.barchart(id, barChartOptions, barChartData, opts);

}

/*
 $.ajax({
 url: apputils.rest + '/exit',
 type:"GET",
 dataType: "json",
 success: function(resp) {
 view.stopspin("ajxstudetails", "Get");
 apputils.echo(resp);
 },
 error: function (e) {
 view.stopspin("ajxstudetails", "Get");
 alert("error pre");
 },
 beforeSend: function (xhrObj){
 view.setspin("ajxstudetails");
 xhrObj.setRequestHeader("Authorization",
 "Basic " + btoa($.cookie("username") + ":" + $.cookie("key")));
 }
 });

 $.ajax({
 url: 'http://127.0.0.1:5000/drivers',
 type:"GET",
 dataType: "json",
 crossDomain: true,
 contentType: 'application/json; charset=utf-8',
 success: function(data) {
 apputils.echo(data);
 },
 error: function () {
 alert("error pre");
 },
 beforeSend: function (xhrObj){
 xhrObj.setRequestHeader("username", "super");
 xhrObj.setRequestHeader("password", $.sha1('letmein'));
 }
 });


 $("#deliverydate").datetimepicker("");
 $("#deliverydate").datetimepicker("destroy");
 $("#selplateno").find("option:selected").text();

 */
