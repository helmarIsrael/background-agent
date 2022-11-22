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

            apputils.mnunotif = {
                ico: "fa fa-bell-o",
                label:"Notifications",
                id:"mnunotif"
            }

            apputils.mnuenroll = {
                ico:"fa fa-registered",
                label:"Enroll",
                id: "mnuEnroll"
            };

            apputils.mnuregister = {
                ico:"fa fa-pencil",
                label: "Student Data",
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
                return $("#name-rightbadge").data(cname) != undefined && $("#name-rightbadge").data(cname).length > 0 &&
                    $("#name-rightbadge").data(cname) != 'null';
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

            apputils.rest = window.location.origin;


            apputils.dashset = function (data)
            {
                $("#main").html("");
                apputils.echo(data);
                view.fillinfo(data.userdetails);
                view.sidemenu(data.usertype);
                view.compose(data, true); //timeline compose
                view.setsemid(data.semid);
                view.setprofimg($(data.imgsrc).attr('src'));
            }

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

                 var pieOptions     = {
                            // Boolean - Whether we should show a stroke on each segment
                            segmentShowStroke    : true,
                            // String - The colour of each segment stroke
                            segmentStrokeColor   : '#fff',
                            // Number - The width of each segment stroke
                            segmentStrokeWidth   : 1,
                            // Number - The percentage of the chart that we cut out of the middle
                            percentageInnerCutout: 50, // This is 0 for Pie charts
                            // Number - Amount of animation steps
                            animationSteps       : 100,
                            // String - Animation easing effect
                            animationEasing      : 'easeOutBounce',
                            // Boolean - Whether we animate the rotation of the Doughnut
                            animateRotate        : true,
                            // Boolean - Whether we animate scaling the Doughnut from the centre
                            animateScale         : false,
                            // Boolean - whether to make the chart responsive to window resizing
                            responsive           : true,
                            // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
                            maintainAspectRatio  : false,
                            // String - A legend template
                            legendTemplate       : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++){%><li><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
                            // String - A tooltip template
                            tooltipTemplate      : '<%=value %> <%=label%> users'
                          }
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

                $("#" + id).html("");
                $("#" + id).html('<canvas id="perfgraph"></canvas>');


                var barChartCanvas = $("#perfgraph").get(0).getContext("2d");
                var barChart = new Chart(barChartCanvas);
                var barChartData = data;
                /*
                 barChartData.datasets[1].fillColor = "#00a65a";
                 barChartData.datasets[1].strokeColor = "#00a65a";
                 barChartData.datasets[1].pointColor = "#00a65a";
                 */
                /*barChartData.datasets[0].fillColor = opts.fillColor;
                barChartData.datasets[0].strokeColor = opts.strokeColor;
                barChartData.datasets[0].pointColor = opts.pointColor;*/
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

            apputils.switchsection = function (par_section,par_grade, btnid)
            {
                $("#name-rightbadge").data("grade", apputils.kto0(
                    par_grade
                ));
                $("#name-rightbadge").data("section", par_section);
               /* if (par_grade == 0)
                {
                    par_grade = 'Kinder';
                }*/
                $("#name-userops").html(
                    view.bslabel("info", "Grade " + par_grade) +
                    "-" + view.bslabel("info", par_section));
                //model.switchsection(par_section, par_grade, btnid);
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
                    var desiredcell = worksheet['AG7']; //place for subject name
                    apputils.echo(desiredcell);
                    counter = 1;

                    if (typeof desiredcell !== 'undefined')
                    {
                        /*
                          category is the name of the allowed categories
                          maxitem is the expected number of items in the category
                          cellstart is the starting column
                          cellend is the marker that will end the excel reading
                         */
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
                            },
                            {
                                category: 'GRD',
                                maxitem: 1,
                                cellstart: 'aj',
                                cellend: 'ak'
                            }
                        ];
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
                                    apputils.echo(category);
                                    if (maxscore > 0.0 || category === 'GRD') {
                                        for (var k = 12; k < 112; k++) {
                                            student = f(worksheet['B' + k.toString()], '');
                                            score = f(worksheet[j.toUpperCase() + k.toString()], 0.00);
                                            $("#progressmessage").html("Accessing " + sheetName +
                                                " for " + desiredcell.v);
                                            if (student.toString().indexOf('FEMALE') == -1 &&
                                                typeof student == 'string' && student.length > 0) {
                                                $("#progressmessage")
                                                    .html("Processing data of " +
                                                        student + " with a score of " + score.toString() + "/" +
                                                        maxscore.toString() + " for " + category + " entry no " + entrycount.toString());
                                                details.push({
                                                    entrycount:entrycount,
                                                    maxscore: maxscore.toString(),
                                                    student: student,
                                                    score: score.toString()
                                                });


                                            } //student.toString().indexOf('FEMALE')
                                        } // for (var k=12

                                    } //if maxscore
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
                                    semid:$("#name-rightbadge").data("semid"),
                                    schoolid: $("#name-rightbadge").data("schoolid"),
                                    quarter: $("#name-rightbadge").data("quarter"),
                                    grade: $("#name-rightbadge").data("grade"),
                                    section:$("#name-rightbadge").data("section"),
                                    records:categoryscores,
                                    token:$("#name-rightbadge").data("token"),
                                    group:$("#name-rightbadge").data("usertype")
                                });
                                categoryscores = [];
                                $("#progressmessage").html("Receiving data from Server");
                            }
                        }
                        else
                        {
                            apputils.poperror("Unexpected Subject.");
                            $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                            $("#progressmessage").html("Done.");
                        }

                    }
                     else
                        {
                            apputils.poperror("Unexpected file contents.");
                            $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                            $("#progressmessage").html("Done.");
                        }


                    //var desiredvalue = desiredcell.v;
                    //
                    //apputils.echo(desiredcell);
                });


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
                //$("#progressmessage").html("Done.");
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
                return "fa fa-calendar-check-o bg-gray";
            }

            apputils.collab = function () {
                return "fa fa-share-alt bg-fuschia-active";
            }

            apputils.memo = function () {
                return "fa fa-tasks bg-red-active";
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
                        return this.collab();
                    case "memo":
                        return this.memo();
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
                    $("#name-rightbadge").data("msgkey"), {mode:CryptoJS.mode.CFB});
                return decrypted.toString(CryptoJS.enc.Utf8);
            }

            apputils.scramble = function(par_unsquabledmessage)
            {
                var encrypted = CryptoJS.AES.encrypt(par_unsquabledmessage,
                    $("#name-rightbadge").data("msgkey"), {mode:CryptoJS.mode.CFB});
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

                var key = CryptoJS.enc.Utf8.parse($("#name-rightbadge").data("msgkey"));

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

            apputils.newline = function ()
            {
                return "<br />";
            }

             apputils.poperror = function (par_message)
            {
                new PNotify({
                    title: "Info  Access",
                    text:par_message,
                    type:'error'
                });
            }

            apputils.fileupload = function (par_label, par_id)
            {
                return view.exboxwidget({color:"green",
                                    icon:"fa fa-upload",
                                    text1: view.excolumn(12,view.exrow(par_label.toUpperCase() + " File Upload" +
                                            '<input type="file" id="' + par_id + '">') +
                                        view.exrow(view.labelel("progressmessage", ""))),
                                    text2:"",
                                    idt1:"",
                                    idt2:"",
                                    iconid:"xlsuploadicon"
                                });
            }


            apputils.readform1xls = function (e)
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
                        $("#progressmessage").html("Unsupported, only XLSX.");
                        $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                        return;
                    }
                    reader.onload = function (e)
                    {

                        var data = e.target.result;
                        var arr = fixdata(data);
                        wb  = XLSX.read(btoa(arr), {type:'base64'});
                        var valid_columns = ['A', //LRN
                                             'C', // fullname= lname, fname, mname
                                             'G', //sex(M or F)
                                             'H', //birtdate
                                             'J', //AGE
                                             'L', //mother tongue
                                             'N', // IP (Ethnic Group)
                                             'O', //Religion
                                             'P', //House Number/ Street
                                             'Q', // Barangay
                                             'U', //Municipality/City
                                             'X', //Province
                                             'AB', //father's name= lname, fname, mname NOTE: Spreadsheet shows that fname and middlename is not separated by ','
                                             'AF', //mother's name= lname, fname, mname
                                             'AH', //expectation= lname, fname, mname
                                             'AL', //Contact Number
                                             'AN', //Remarks
                                            ];
                        var row = 7;
                        try {
                            //to_api(wb)
                            wb.SheetNames.forEach(
                                function (sheetName) {
                                    apputils.echo(sheetName);
                                    if (row == 7 && sheetName === "school_form_1_shs_ver2018.2.1.1")
                                    {
                                        //reset columns for senior high school entries
                                        row = 21;
                                        valid_columns = ['A', //LRN
                                             'C', // fullname= lname, fname, mname
                                             'K', //sex(M or F)
                                             'L', //birtdate
                                             'O', //AGE
                                             'BJ', //mother tongue
                                             'BJ', // IP (Ethnic Group)
                                             'Q', //Religion
                                             'U', //House Number/ Street
                                             'Z', // Barangay
                                             'AE', //Municipality/City
                                             'AG', //Province
                                             'AM', //father's name= lname, fname, mname NOTE: Spreadsheet shows that fname and middlename is not separated by ','
                                             'AP', //mother's name= lname, fname, mname
                                             'AS', //expectation= lname, fname, mname
                                             'BA', //Contact Number
                                             'BC', //Remarks
                                            ];
                                    }
                                    var worksheet = wb.Sheets[sheetName];
                                    $("#name-rightbadge").data("enrolllist", []);
                                    apputils.echo('C'+row.toString());
                                    while (worksheet['C'+row.toString()].v.toUpperCase().search('COMBINED') == -1) {
                                       if (worksheet['C'+row.toString()].v.toUpperCase().search('TOTAL') == -1) {
                                           var fields = [];
                                           for (i = 0; i < valid_columns.length; i++) {
                                               var cellAddress = valid_columns[i] + row.toString();
                                               apputils.echo(valid_columns[i] + row.toString());

                                               if (typeof worksheet[cellAddress] !== 'undefined')
                                               {
                                                   var cellv = worksheet[cellAddress].v;
                                                   if (sheetName === "school_form_1_shs_ver2018.2.1.1"
                                                       && valid_columns[i] === 'L')
                                                   {
                                                       cellv = cellv.replace(/\//g, "-");
                                                   }
                                                   fields.push(cellv);
                                               }
                                               else
                                               {fields.push("");}

                                           }
                                           apputils.echo(fields);
                                           $("#name-rightbadge").data("enrolllist").push(fields);
                                       }
                                        row = row + 1;
                                    }
                                });
                            var recordsize = $("#name-rightbadge").data("enrolllist").length;

                            $(".progress-bar").attr('style', 'width:' + ((1.0 / parseFloat(recordsize)) * 100.0).toString() + '%');
                            $("#progressmessage").html("Uploading 1 of " + recordsize);
                            model.enrollspreadsheet(recordsize);
                        }
                        catch (e)
                        {
                            apputils.echo(e);
                            $("#progressmessage").html("Error Occured");
                            $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                        }
                    }
                    reader.readAsArrayBuffer(f);
                }
            }

            apputils.handleundefined = function (some_var, defaultvalue)
            {
                return (typeof some_var !== 'undefined' ? some_var : defaultvalue);
            }

            apputils.docs = function ()
            {
                return "/static/downloads";
            }


            apputils.getSubjectDescfromOffID = function (par_sectionid)
            {
                subjects = $("#name-rightbadge").data("subjects");
                for (i in subjects)
                {
                    if (subjects[i].sectionid.toUpperCase() == par_sectionid.toUpperCase())
                    {
                        return subjects[i].value;
                    }
                }
                return '';
            }

            apputils.popsuccess = function (par_message)
            {
                new PNotify({
                    title: "Info  Access",
                    text:par_message,
                    type:'success'
                });
            }


            apputils.space = function (n)
            {
                space = '';
                for (var i=0; i < n; i++)
                {
                    space += '&nbsp;';
                }
                return space;
            }

            apputils.bold = function (word)
            {
                return '<b>' + word + '</b>';
            }

            apputils.itempicsetting = function(imgsrc)
            {
                return '<img width="60px;" '+
                       'height="60px"  ' +
                    'class="img-circle img-bordered-sm"'+
                     ' src=' + imgsrc + '>';
            }

            apputils.resettablerows = function (id)
            {
                $("#" + id).find("tr:gt(0)").remove();
            }

            apputils.timerid = '';
            apputils.timeremain = 0;

            apputils.sec2HMS = function (t){
                //thanks to https://stackoverflow.com/a/19300106
                                          return parseInt(t/86400)+'d '+(new Date(t%86400*1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s");
                                        }


            apputils.fontsize = function(par_size, par_content)
            {
                return '<font size="'+par_size+'">' + par_content +'</font>';
            }

            apputils.getSubjectFromOffID = function (par_sectionid)
            {
                subjects = $("#name-rightbadge").data("subjects");
                for (i in subjects)
                {
                    if (subjects[i].sectionid.toUpperCase() == par_sectionid.toUpperCase())
                    {
                        return subjects[i];
                    }
                }
                return {};
            }

            apputils.zeroreturn = function(id, par_msg)
                 {
                     $("#" + id).html("");
                     $("#" + id).html(par_msg);
                 }

                 apputils.plotgraph = function (id, piedata)
                {
                    /*
                    piedata = [
                               {
                                     value: 600,
                                     color: "#00c0ef",
                                     highlight: "#00c0ef",
                                     label: "Safari"
                                },
                    ]
                     */

                     $("#" + id).html("");
                     $("#" + id).html('<canvas id="perfdonut"></canvas>');
                     apputils.donutchart("perfdonut", {
                            // Boolean - Whether we should show a stroke on each segment
                            segmentShowStroke    : true,
                            // String - The colour of each segment stroke
                            segmentStrokeColor   : '#fff',
                            // Number - The width of each segment stroke
                            segmentStrokeWidth   : 1,
                            // Number - The percentage of the chart that we cut out of the middle
                            percentageInnerCutout: 50, // This is 0 for Pie charts
                            // Number - Amount of animation steps
                            animationSteps       : 100,
                            // String - Animation easing effect
                            animationEasing      : 'easeOutBounce',
                            // Boolean - Whether we animate the rotation of the Doughnut
                            animateRotate        : true,
                            // Boolean - Whether we animate scaling the Doughnut from the centre
                            animateScale         : false,
                            // Boolean - whether to make the chart responsive to window resizing
                            responsive           : true,
                            // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
                            maintainAspectRatio  : false,
                            // String - A legend template
                            legendTemplate       : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++){%><li><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
                            // String - A tooltip template
                            tooltipTemplate      : '<%=value %>\%'
                          }, piedata);
                }


                apputils.topercentage = function (par_values)
                {
                    /*
                       par_values = []
                     */
                    sum = 0.0;
                    for (var i=0; i < par_values.length; i++)
                    {
                        sum += par_values[i];
                    }
                    result = [];

                    for (var i=0; i < par_values.length; i++)
                    {
                        result.push(Number((parseFloat(par_values[i]) / parseFloat(sum) * 100.00).toFixed(2)));
                    }

                    return result;

                }

            apputils.plotperfbardata = function (id, par_data)
            {
                var barChartData = {
                  labels: ["\%age"],
                  datasets: [
                    {
                      label: "Did Not Meet Expectations",
                      fillColor: "#f56954",
                      strokeColor: "#f56954",
                      pointColor: "#f56954",
                      pointStrokeColor: "#f56954",
                      pointHighlightFill: "#f56954",
                      pointHighlightStroke: "#f56954",
                      data: [par_data[0]]
                    },
                    {
                      label: "Fairly Satisfactory",
                      fillColor: "#00a65a",
                      strokeColor: "#00a65a",
                      pointColor: "#00a65a",
                      pointStrokeColor: "#00a65a",
                      pointHighlightFill: "#00a65a",
                      pointHighlightStroke: "#00a65a",
                      data: [par_data[1]]
                    },
                    {
                      label: "Satisfactory",
                      fillColor: "#f39c12",
                      strokeColor: "#f39c12",
                      pointColor: "#f39c12",
                      pointStrokeColor: "#f39c12",
                      pointHighlightFill: "#f39c12",
                      pointHighlightStroke: "#00a65a",
                      data: [par_data[2]]
                    },
                    {
                      label: "Very Satisfactory",
                      fillColor: "#00c0ef",
                      strokeColor: "#00c0ef",
                      pointColor: "#00c0ef",
                      pointStrokeColor: "#00c0ef",
                      pointHighlightFill: "#00c0ef",
                      pointHighlightStroke: "#00a65a",
                      data: [par_data[3]]
                    },
                    {
                      label: "Outstanding",
                      fillColor: "#3c8dbc",
                      strokeColor: "#3c8dbc",
                      pointColor: "#3c8dbc",
                      pointStrokeColor: "#3c8dbc",
                      pointHighlightFill: "#3c8dbc",
                      pointHighlightStroke:"#00a65a",
                      data: [par_data[4]]
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
                apputils.barchart(id, barChartOptions, barChartData, opts);
            }


            apputils.startvideoconf = function (par_room_name, par_userInfo, par_displayName, par_divid)
            {
                view.setupconfinterface();
                const domain = 'meet.jit.si';
                const options = {
                    roomName: par_room_name,
                    //width: 700,
                    configOverwrite:{
                        prejoinPageEnabled:false,
                    },
                    interfaceConfigOverwrite: {
                            TOOLBAR_BUTTONS: [
                                'microphone', 'camera', 'closedcaptions', 'desktop',
                                'fodeviceselection', 'hangup', 'fullscreen',
                                'raisehand', 'settings',
                                'videoquality',  'stats', 'chat',
                                'videobackgroundblur', 'select-background', 'mute-everyone',
                                'mute-video-everyone', 'recording',
                                'stats',
                            ],
                            HIDE_INVITE_MORE_HEADER: true,
                            SHOW_CHROME_EXTENSION_BANNER: false,
                            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                        },
                    height: 500,
                    userInfo: {
                        email: par_userInfo,
                        displayName: par_displayName
                    },
                    parentNode: document.querySelector('#' + par_divid)
                };
                var api = new JitsiMeetExternalAPI(domain, options);
                //api.executeCommand('avatarUrl', $("#img-leftbadge").attr('src'));
                api.addListener('videoConferenceJoined', () => {
                        api.executeCommand('avatarUrl', $("#img-leftbadge").attr('src'));
                });
                api.executeCommand('toggleChat');
                api.addEventListener('displayNameChange', function(event){
                    var partID = event.id;
                    var dNameChanged = api.getDisplayName(partID);
                    var usename = $("#name-rightbadge").data("username");
                    if (dNameChanged !== usename)
                    {
                        apputils.poperror('Changing of name is not allowed.');
                    }
                    api.executeCommand('displayName', usename);
                });
            }

            apputils.startvideoconfclient = function (par_room_name, par_userInfo, par_displayName, par_divid)
            {
                view.setupconfinterface();
                const domain = 'meet.jit.si';
                var opt;
                /*if ($("#name-rightbadge").data("usertype") == 'students') {
                    opt = {
                        roomName: par_room_name,
                        //width: 700,
                        configOverwrite: {
                            startWithAudioMuted: true,
                            remoteVideoMenu: {
                                disableKick: true
                            },
                            disableRemoteMute: true,
                            googleAnalyticsTrackingId: 'UA-146424556-1',
                            scriptURLs: [
                                "https://www.googletagmanager.com/gtag/js?id=UA-146424556-1"
                                //"libs/analytics-ga.min.js", // google-analytics
                            ]
                        },
                        interfaceConfigOverwrite: {
                            TOOLBAR_BUTTONS: [
                                'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
                                'fodeviceselection', 'hangup', 'profile',
                                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                                'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                                'tileview', 'videobackgroundblur', 'help', 'security'
                            ]

                        },
                        height: 500,
                        userInfo: {
                            email: par_userInfo,
                            displayName: par_displayName
                        },
                        parentNode: document.querySelector('#' + par_divid)
                    }
                }else*/
                //{
                    opt = {
                        roomName: par_room_name,
                        //width: 700,HIDE_INVITE_MORE_HEADER: true,
                        configOverwrite: {
                            prejoinPageEnabled:false,
                            startWithAudioMuted: true,
                            remoteVideoMenu: {
                                disableKick: true
                            },
                            disableRemoteMute: true,
                            disablePolls: false
                            /*googleAnalyticsTrackingId: 'UA-146424556-1',
                            scriptURLs: [
                                "https://www.googletagmanager.com/gtag/js?id=UA-146424556-1"
                                //"libs/analytics-ga.min.js", // google-analytics
                            ]*/
                          },
                        /*interfaceConfigOverwrite: {
                            //DISABLE_VIDEO_BACKGROUND: true,
                            //DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                            HIDE_INVITE_MORE_HEADER: true
                        },*/
                        //https://github.com/jitsi/jitsi-meet/blob/master/interface_config.js
                        //https://github.com/jitsi/jitsi-meet/blob/master/config.js
                        interfaceConfigOverwrite: {
                            TOOLBAR_BUTTONS: [
                                'microphone', 'camera', 'closedcaptions', 'desktop',
                                'fodeviceselection', 'hangup', 'fullscreen',
                                'raisehand', 'settings',
                                'videoquality',  'stats', 'chat',
                                'videobackgroundblur', 'select-background'
                            ],
                            HIDE_INVITE_MORE_HEADER: true,
                            SHOW_CHROME_EXTENSION_BANNER: false,
                            SETTINGS_SECTIONS: ['devices'],
                            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                        },


                        height: 500,
                        userInfo: {
                            email: par_userInfo,
                            displayName: par_displayName
                        },
                        parentNode: document.querySelector('#' + par_divid)
                    }
                //};
                const options = opt;
                var api = new JitsiMeetExternalAPI(domain, options);
                api.executeCommand('setVideoQuality', '180');
                //api.executeCommand('avatarUrl', $("#img-leftbadge").attr('src'));
                 api.addListener('videoConferenceJoined', () => {
                        api.executeCommand('avatarUrl', $("#img-leftbadge").attr('src'));
                });
                api.addEventListener('displayNameChange', function(event){
                    var partID = event.id;
                    var dNameChanged = api.getDisplayName(partID);
                    var usename = $("#name-rightbadge").data("username");
                    if (dNameChanged !== usename)
                    {
                        apputils.poperror('Changing of name is not allowed.');
                    }
                    api.executeCommand('displayName', usename);
                });
                /*
                JitsiMeetJS.events.conference.CONFERENCE_JOINED
                JitsiMeetJS.events.conference.CONFERENCE_LEFT
                 */

                //api.addListener('videoConferenceLeft', function(){alert('hello')});

            }


             apputils.joinvideoconfclient = function(par_room_name)
            {
                apputils.startvideoconfclient(par_room_name,
                    $("#name-rightbadge").data("username"),
                    $("#name-rightbadge").data("username"),
                    'meet'
                    );
            }

            apputils.joinvideoconf = function(par_room_name)
            {
                apputils.startvideoconf(par_room_name,
                    $("#name-rightbadge").data("username"),
                    $("#name-rightbadge").data("username"),
                    'meet'
                    );
            }

            apputils.roomid = function ()
            {
                return $("#name-rightbadge").data("token").substring(0,4) +
                       Math.random().toString(36).substring(2, 16);
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
                    imgsrc: "/static/dist/img/user2-160x160.jpg",
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
                            password2:$("#repeatpassword").val(),
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype")
                        }),
                    contentType: 'application/json; charset=utf-8',
                    success: function(resp) {
                        apputils.echo(resp);
                        view.stopspin(par_btnid, "OK");

                            if (resp.status == "OK")
                            {
                                $("#name-rightbadge").data("key", $.sha1($("#newpassword").val()));
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
                            semid: $("#name-rightbadge").data("semid"),
                            lastname: $("#activateplname").val(),
                            firstname:  $("#activatepfname").val(),
                            middlename:  $("#activatepfmname").val(),
                            group: $("#name-rightbadge").data("usertype"),
                            token: $("#name-rightbadge").data("token")
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                }); // ajax
            }


            model.sysout = function ()
            {

                model.ajaxCall(
                    {
                        resource: 'exit',
                        type:'GET',
                        dataType:'json',
                        buttonid:'',
                        buttonlabel:'',
                        error: function (e) {
                            apputils.poperror(e);
                        },
                        success: function(resp)
                        {
                            apputils.echo(resp);
                        }
                    }
                )

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
                            apputils.echo(resp);
                            $("#name-rightbadge").data("usertype", resp.usertype);
                            $("#name-rightbadge").data("token", resp.token);
                            $("#name-rightbadge").data("username", username);
                            $("#name-rightbadge").data("key", password);
                            $("#name-rightbadge").data("tracker", "home");
                            $("#name-rightbadge").data("schoolid",resp.userschool.id);
                            $("#name-rightbadge").data("semid", resp.semid);
                            $("#name-rightbadge").data("freeid", resp.freeid);
                            $("#name-rightbadge").data("quarter", resp.quarter);
                            $("#name-rightbadge").data("mystu", resp.mystu);

                            $("#name-rightbadge").data("virtualroomid", resp.virtualroomid);
                            $("#name-rightbadge").data("personname", resp.userdetails["name"])
                            $("#name-rightbadge").data("personnumid", resp.personnumid)
                            
                            model.pubnub_sub($("#name-rightbadge").data("virtualroomid"))
                            
                            if (resp.usertype == "students")
                            { $("#name-rightbadge").data("lrn", resp.lrn); }
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
                                        color: resp.load[i][2],
                                        section: resp.load[i][5]
                                    });
                                }
                                $("#name-rightbadge").data("subjects", load);
                            }

                            /*
                            if (resp.usertype == 'students')
                            {
                                $("#name-rightbadge").data("subjects").unshift({icon: '', label:'All', sectionid: '', value:''});
                            }
                            */

                            if (
                                resp.userschool.name == 'NOT SET' ||
                                typeof resp.userschool.name === 'undefined'
                            )
                            {
                                $("#schoolname").html("Your");
                            }
                            else
                            {
                                $("#schoolname").html(resp.userschool.name);
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

                            $("#name-rightbadge").data("offset", 0);


                            //view.sidemenu(resp.usertype);
                        } else
                        {
                            view.stopspin("btnlogin", "Sign In");
                            $("#errlog").html(view.bslabel("danger", resp.message));
                            //$("#btnlogin").removeClass("fa fa-refresh fa-spin");
                            $("#logineffects").html("");
                            return;
                        }
                         if ($("#name-rightbadge").data("grade") !== "none")
                         {
                             $("#name-rightbadge").data("isadviser", true);
                         }
                         else
                         {
                             $("#name-rightbadge").data("isadviser", false);
                         }

                         apputils.dashset(resp);
                         if (resp.usertype === "parents")
                            {
                                apputils.echo("in here....-->>");
                                view.mykids();
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
                        apputils.echo(resp);
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
                    data: {
                        token: $("#name-rightbadge").data("token")
                    },
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }


                });
            }



            model.getstu = function ()
            {
                model.getstudetails($("#lrn").val(), $("#name-rightbadge").data("schoolid"));
            }

            function setlrn()
            {
                fields = apputils.composeboxfields("enrollbox").split("*");
                fields.shift();
                fields[0] = $("#lrn").val();
                fields.push($("#name-rightbadge").data("grade"));
                fields.push($("#name-rightbadge").data("section"));
                return fields.map(function (x) {return x.replace('/','-')}).join('*');
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
                    $("#name-rightbadge").data("schoolid"),
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
                                $("#name-rightbadge").data("freeid", resp.freeid);
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid") + "/" +
                    $("#name-rightbadge").data("grade") + "/" +
                    $("#name-rightbadge").data("section") + "/" +
                    $("#name-rightbadge").data("token")
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

                            $("#form1upload").change(apputils.readform1xls);
                            $("#form1upload").click(function() {$("#form1upload").val("");});
                            $("#progressmessage").html("Save Form 1 as xlsx, then Upload.");

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
                            "Basic " + btoa($("#name-rightbadge").data("username") +
                                ":" + $("#name-rightbadge").data("key")));
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
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid") + "/" +
                    $("#name-rightbadge").data("grade") + "/" +
                    $("#name-rightbadge").data("section") + "/" +
                    $("#name-rightbadge").data("enrlrn"),
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype")
                    }),
                    contentType: "application/json; charset=utf-8",
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
                            "Basic " + btoa($("#name-rightbadge").data("username") +
                                ":" + $("#name-rightbadge").data("key")));
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
                        if ($("#name-rightbadge").data("usertype") == "students")
                        {
                            view.setspin("umnu" + apputils.mnuclasscard.id,
                                view.mnuspinner());
                        }
                        else
                        {
                            view.setspin(eventerid);
                        }
                    }
                    else
                    {
                        if ($("#name-rightbadge").data("usertype") == "students")
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
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid"),
                    type: "GET",
                    success: function (resp)
                    {
                        apputils.echo(resp);
                        spinalot('stop');
                        //$("#erlajx").html("");
                        if ($("#name-rightbadge").data("usertype") == "parents") {
                            $("#name-rightbadge").data("schoolid", resp.schoolid);
                        }
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
                            "Basic " + btoa($("#name-rightbadge").data("username") +
                                ":" + $("#name-rightbadge").data("key")));
                    }
                });

            }

            model.removestu = function (par_stuid, eventerid)
            {
                $.ajax({
                    url:  apputils.rest + '/classlist/'+
                    par_stuid + '/' + $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid") + "/" + $("#name-rightbadge").data("grade") +
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data('key')));
                    }
                });
            }

            model.getnotif = function (){
                $("#notifholder").show()
                  $.ajax({
                    url: apputils.rest + '/getnotif',
                    type:"GET",
                    data:{
                        personid: $("#name-rightbadge").data("personnumid"),
                        channels: $("#name-rightbadge").data("virtualroomid").join(", ")
                    },
                    dataType: "json",
                    success: function(resp){
                        data = resp.notifs
                        $("#notifholder").empty()
                        for (var i = 0; i < data.length; i++){
                            $("#notifholder").append(`
                                <li>
                                    <a onclick="view.initnotif('${data[i].body}', '${data[i].notif_readablets}', '${data[i].initiatorid}', '${data[i].receiverid}', '${data[i].timeline_timestamp}')" style="${data[i].is_read ? '' : 'background-color:#fffaeb !important'}">
                                        <i class="fa fa-circle-o text-aqua"></i> ${data[i].is_read ? `${data[i].body}` : `<strong>${data[i].body}</strong>`}
                                    </a>
                                </li>`
                            )
                        }
                        
                       
                    }, beforeSend: function (xhrObj){
                        //$(par_this).html(view.spin() + " Pls Wait..")
                        $("#nexttimes").removeClass('fa-sort-amount-asc');
                        $("#nexttimes").addClass('fa-refresh fa-spin');
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                })
            }

            model.notif_getpost = function (notif, ts, initid, receiveid, tlts){
                $("#notifholder").show()
                  $.ajax({
                    url: apputils.rest + '/getpost',
                    type:"GET",
                    data:{
                        initiatorid: initid,
                        receiverid: receiveid,
                        ts: tlts
                    },
                    dataType: "json",
                    success: function(resp){
                        $("#notif_postbox li").remove()
                        $("#notif_postbox").append(
                            view.postbox(
                                {
                                    btnicolor: apputils.getbutton(resp.timelines[0].tltype),
                                    theader: resp.timelines[0].owner,
                                    imgsrc: $(resp.timelines[0].pic).attr('src')
                                },
                                resp.timelines[0].tstamp,
                                resp.timelines[0].body,
                                resp.timelines[0].tltype,
                                resp.timelines[0]
                                )
                        );
                       
                  
                    }, beforeSend: function (xhrObj){
                        //$(par_this).html(view.spin() + " Pls Wait..")
                        $("#nexttimes").removeClass('fa-sort-amount-asc');
                        $("#nexttimes").addClass('fa-refresh fa-spin');
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                })
            }

            model.pubnub_sub = function (user_channels)
            {   
                var pubnub = new PubNub({
                    subscribe_key : 'sub-c-4813d7cf-d269-45f3-9937-3f5811a879d0',
                    publish_key:'pub-c-120bfc98-ed9d-48c0-8bcb-48ba129e6056',
                    uuid: "myUUID",
                    origin: 'pubsub.pubnub.com',
                    restore:true
                }
          );
          
          pubnub.addListener(
              {
                  message: function(m){
                      msg = m.message
                    //   $("#main").html(view.showNotif(m.message))
                    if (msg.initiatorid != $("#name-rightbadge").data("personnumid")){
                        console.log(m.message.initiatorid)
                        console.log( $("#name-rightbadge").data("personnumid"))
                        apputils.popsuccess(msg.poster)
                        model.countNewNotif()
                    }
                     

                },
              }
          );
      
          pubnub.subscribe({
                channels: user_channels,
            });
            $("#notifbell").show()
            model.countNewNotif()
            model.getnotif()
            }

            model.countNewNotif = function(){
                $.ajax({
                    url: apputils.rest + '/newnotifcount',
                    type:"GET",
                    data:{
                        personid: $("#name-rightbadge").data("personnumid"),
                        channels: $("#name-rightbadge").data("virtualroomid").join(", ")
                        // channels: ["asd", "asdasd"].join(", ")
                    },
                    dataType: "json",
                    success: function(resp){
                        if (resp.count > 0){
                            $("#notif-count").show()
                            $("#notif-count").html(resp.count)
                            $("#headnotif-count").html(`You have ${resp.count} new notifications`)
                        } else {
                            $("#notif-count").hide()
                            $("#headnotif-count").html(`All caught up!`)
                        }
                       
                    }, beforeSend: function (xhrObj){
                        //$(par_this).html(view.spin() + " Pls Wait..")
                        $("#nexttimes").removeClass('fa-sort-amount-asc');
                        $("#nexttimes").addClass('fa-refresh fa-spin');
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                })
            }

            model.readnewnotif = function(){
                $.ajax({
                    url: apputils.rest + '/readnewnotif',
                    type:"POST",
                    data:JSON.stringify({
                        personid: $("#name-rightbadge").data("personnumid"),
                        channels: $("#name-rightbadge").data("virtualroomid").join(", "),
                        group: $("#name-rightbadge").data("usertype"),
                        // channels: ["asd", "asdasd"].join(", ")
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(resp){
                        if (resp.status == 'OK'){
                            model.countNewNotif()
                        }
                       
                    },
                    beforeSend: function (xhrObj){
                        //$(par_this).html(view.spin() + " Pls Wait..")
                        $("#nexttimes").removeClass('fa-sort-amount-asc');
                        $("#nexttimes").addClass('fa-refresh fa-spin');
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                })
            }

            model.classlist = function (eventerid)
            {
                //apputils.mnusclasslist


                $.ajax({
                    url:  apputils.rest + '/classlist/'+
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid") + "/" + $("#name-rightbadge").data("grade") +
                    "/" + $("#name-rightbadge").data("section") + "/" + $("#name-rightbadge").data("token"),
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
                                    body:"<h3>NO ENROLLED STUDENTS!<h3>",
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
                                        picsrc:  clistentry.imgsrc
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data('key')));
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
                    contentType: par_object.contentType,
                    data: par_object.data,
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                });
            }

            model.dropstudent = function(par_idnum, par_textid,par_btnid, par_btnlabel, par_errorid)
            {
                model.clistop({
                    url: apputils.rest + '/classlist/'+
                    par_idnum + "/" +
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid")+  "/" +
                    apputils.kto0($("#name-rightbadge").data("grade")) + "/" +
                    $("#name-rightbadge").data("section") + "/" +
                    $("#" + par_textid).val(),
                    type: "DELETE",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype")
                    }),

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
                //here
                model.clistop({
                    url: apputils.rest + '/classlist/'+
                    par_idnum + "/" +
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid")+  "/" +
                    apputils.kto0($("#name-rightbadge").data("grade")) + "/" +
                    $("#name-rightbadge").data("section") + "/" +
                    apputils.kto0(
                        $("#" + par_tolevelid).val()) + "/" + $("#" + par_tosectionid).val() + "/" +
                    $("#" + par_reasonid).val(),
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype")
                    }),
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
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid")+  "/" +
                    apputils.kto0($("#name-rightbadge").data("grade")) + "/" +
                    $("#name-rightbadge").data("section") + "/" +
                    $("#" + par_toschoolid).val()  + "/" +
                    $("#" + par_reasonid).val(),
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype")
                    }),
                    type: "PUT",
                    btnid:par_btnid,
                    btnlabel: par_btnlabel,
                    errorid: par_errorid
                });
            }

            model.getuserload = function (par_semester = 1)
            {
                $("#name-rightbadge").data("semswitch", par_semester);
                var activefcn = function(par_btn)
                {
                    if (par_btn == par_semester)
                        {return 'active';}
                    return '';
                }
                var btntoggles =
                    view.centerize(
                    view.togglebuttons(
                    {
                        tooltip: "Semester " + par_semester,
                        pullright: "", //"pull-right"
                        buttons: [
                            {
                                id: "btnfirstsem",
                                color:"default",
                                size: "btn-lg",
                                label: "1st",
                                fcn: "model.getuserload('1');",
                                active: activefcn('1')
                            },
                            {
                                id: "btnsecondsem",
                                color:"default",
                                size: "btn-lg",
                                label: "2nd",
                                fcn: "model.getuserload('2');",
                                active: activefcn('2')
                            }
                        ]
                    }
                ));

                var addsubjui = function()
                {
                    return view.exrow(

                                    view.excolumn(3, "") +

                                    view.excolumn(6,
                                         view.simplebox(
                                             {
                                                 boxtype: "primary",
                                                 title: "",
                                                 footer: "",
                                                 body: view.filledbox(
                                                     {
                                                         color: 'gray',
                                                         title: 'Add Subject',
                                                         description: 'Add subject in your load.',
                                                         icon: 'fa-plus',
                                                         footer:
                                                             view.centerize(
                                                                view.buttonact(
                                                                    "success",
                                                                    "Start Here",
                                                                    "model.setupencode()",
                                                                    "btnaddsubject"
                                                                )
                                                             )
                                                     }
                                                 )
                                             }
                                         )
                                    ) +
                                    view.excolumn(3, "")
                                );
                }


                eventerid = "umnu" + apputils.
                        mnussubjects
                        .id;
                view.mainloading();
                $.ajax({
                    url: apputils.rest + '/load/' +
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid") + '/' + $("#name-rightbadge").data("token"),
                    data: {
                        semester: par_semester
                    },
                    type:"GET",
                    dataType: "json",
                    success: function(resp) {
                        apputils.echo(resp);
                        view.stopspin(eventerid,
                            view.
                            menuentry(apputils.
                                mnussubjects));

                        if (resp.status == 'error')
                        {
                            $("#main").html(

                                  addsubjui()
                                  +
                                view.excolumn(12,
                                  view.simplebox(
                                                            {
                                                               boxtype: "primary",
                                                               title: "Semester (for SHS only)",
                                                               body: btntoggles,
                                                               footer:""
                                                            }
                                                          )
                              ) +
                                apputils.newline() +
                                view.exrow(
                                view.excolumn(12,view
                                            .simplebox({
                                                boxtype:"ERROR",
                                                title:"Subject Loading",
                                                body:"<h3>" + resp.message + "<h3>",
                                                footer:"Please consult proper authority."
                                            })
                                        )
                                )
                            );
                            return;
                        }
                        $("#name-rightbadge").data("subjects", []);

                        $("#name-rightbadge").data("quarter", resp.quarter);
                        $("#name-rightbadge").data("listmale", resp.listmale);
                        $("#name-rightbadge").data("listfemale", resp.listfemale);
                        if (resp.size == 0)
                        {
                            $("#main").html(
                                addsubjui() +
                                view.excolumn(12,
                                  view.simplebox(
                                                            {
                                                               boxtype: "primary",
                                                               title: "Semester (for SHS only)",
                                                               body: btntoggles,
                                                               footer:""
                                                            }
                                                          )
                              ) +
                                view.exrow(
                                  view.excolumn(12,
                                    view.excolumn(12,view
                                        .simplebox({
                                            boxtype:"info",
                                            title:"Subject Loading",
                                            body:"<h3>NO ASSIGNED SUBJECTS!<h3>",
                                            footer:"Please consult proper authority."
                                            })
                                     )
                                  )
                                )
                            );

                           return;
                        }

                        $("#main").html(
                            view.exrow(
                                (
                                    function ()
                                    {
                                        if ($("#name-rightbadge").data("isadviser"))
                                            {
                                               return view.quarterize();
                                            }
                                            else
                                                {return '';}
                                    })()
                            )+
                         view.exrow(
                             view.excolumn(12,
                           view.simplediv("managesubjects",
                              view.excolumn(12,
                              view.simplebox(
                                                        {
                                                           boxtype: "primary",
                                                           title: "Semester (for SHS only)",
                                                           body: btntoggles,
                                                           footer:""
                                                        }
                                                      )
                              ) +
                            view.rowdify(
                                resp.load,
                                view.boxnoprogress,
                                function(resp)
                                {
                                    objectified = (function (x) {
                                        $("#name-rightbadge").data(x[4],x[6].coteachers);
                                        return {
                                            icon:"fa " + x[3],
                                            label: x[0] + ' ' + (function () {
                                                                            //sxnfn = '';
                                                                            //if ($("#name-rightbadge").data("grade") == "none")
                                                                            //    {
                                                                                    sxnfn = x[5];
                                                                            //    }
                                                                            return sxnfn;
                                                                        }
                                                                    )(),
                                            value: x[1],
                                            sectionid: x[4],
                                            color: x[2],
                                            section: x[5]
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
                                        header: resp[0],
                                        idh2: "hdr2" + resp[0],
                                        text2: resp[1],
                                        content: view.buttonact("default",
                                            "Manage " + (function () {
                                                                sxnfn = '';
                                                                //if ($("#name-rightbadge").data("grade") == "none")
                                                                //    {
                                                                        sxnfn = resp[5];
                                                                //    }
                                                                return sxnfn;
                                                            }
                                                        )(),
                                            "model.getstudentssubject("+ //--> here
                                            (function (x) {
                                                return '{' +
                                                    "icon:'fa " + x[3] + "'," +
                                                    "label:'" +  x[0]  + ' ' + (function () {
                                                                        sxnfn = '';
                                                                        //if ($("#name-rightbadge").data("grade") == "none")
                                                                        //    {
                                                                                sxnfn = x[5];
                                                                        //    }
                                                                        apputils.echo("snx " + sxnfn)
                                                                        return sxnfn;
                                                                    }
                                                                )()
                                                            + "'," +
                                                    "value:'" + x[1] + "'," +
                                                    "sectionid:'" + x[4] + "'" +
                                                    '}'
                                            })(resp)
                                            +")", "btn" + resp[4]
                                                    .replace(/[& !\-\?]/g, '').toLowerCase()
                                                    + $("#name-rightbadge").data("semid")
                                        ) + apputils.space(3) +
                                            view.buttonact(
                                                'danger fa fa-trash-o',
                                                ' ',
                                                "model.removeload('" + resp[4] + "')",
                                                'btnremove' + $.sha1(resp[4]).substring(0,5)
                                            )
                                    }

                                },
                                "Subject Load"
                            )
                           ) //simplediv
                             )// excolumn
                        ) // exrow
                            + addsubjui()
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid"),
                    type:"POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype")
                        //adviser: $("#name-rightbadge").data("isadviser").toString()
                    }),
                    success: function(resp) {
                        apputils.echo(resp);
                        $("#name-rightbadge").data("quarter", resp.quarter);
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
                                    '/' + $("#name-rightbadge").data("username"),
                    type: 'GET',
                    dataType:'json',
                    success: function(resp) {
                        apputils.echo(resp);

                        reportcanvas = '<div class="col-md-6"> '+
                            '<div class="box box-success">'+
                            '<div class="box-header with-border">'+
                          '<h3 class="box-title">Feeling Report</h3>'+
                          '<div class="box-tools pull-right">'+
                            '<button type="button" class="btn btn-box-tool" data-widget="collapse">'+
                            '<i class="fa fa-minus"></i></button>'+
                            '<button type="button" class="btn btn-box-tool" data-widget="remove">'+
                            '<i class="fa fa-times"></i></button>'+
                          '</div>'+
                        '</div>'+
                        '<div class="box-body">'+
                          '<div class="chart">'+
                            /*'<a href="javascript:apputils.barchart("barChart",'+barChartOptions+','+
                            barChartData+','+opts+');">click</a>'+*/
                            '<canvas id="barChart" style="height:230px"></canvas>'+
                          '</div>'+
                        '</div>'+
                      '</div>' +
                      '</div>';

                      //$("#barChart").append(reportcanvas);
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
                    $("#name-rightbadge").data("semid") + "/" +
                    $("#name-rightbadge").data("quarter") + "/" +
                    $('#cbogradecategories').val(),
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype")
                    }),
                    type:"POST",
                    dataType: "json",
                    success: function(resp) {



                        view.stopspin(par_btnid, "Set");

                        if (resp.status === 'Error')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }


                        apputils.echo(resp);
                        $("#txtTotScore").val(resp.maxscore);

                        setstuscores("");

                        for (var i = 0; i < resp.entries.length; i++)
                        {
                            $("#score"+resp.entries[i][0]).val(resp.entries[i][1])
                        }

                        $("#name-rightbadge").data("entryid", resp.entryid);

                        //model.getreports(resp.entryid);

                    },
                    error: function (e) {
                        view.stopspin(par_btnid, "Set");
                        apputils.echo("error pre");
                    },
                    beforeSend: function (xhrObj){
                        view.setspin(par_btnid);
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" +
                                $("#name-rightbadge").data("key")));
                    }
                });

            }

            function composeaddgradereqt()
            {
                return $("#name-rightbadge").data("section") + "*" +
                    $("#name-rightbadge").data("grade") + "*" +
                    $("#name-rightbadge").data("quarter") + "*" +
                    $("#name-rightbadge").data("semid") + "*" +
                    $("#name-rightbadge").data("schoolid") + "*" +
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

                if (typeof $("#name-rightbadge").data("entryid") == 'undefined')
                {
                    apputils.poperror('Set the Total Score, First!');
                    return;
                }

                if (isNaN(parseFloat($("#score"+par_idno).val())))
                {
                    apputils.poperror('Score is not set!');
                    return;
                }

                $.ajax({
                    url: apputils.rest + '/gradebook/' +
                    par_idno + "/" +
                    $("#name-rightbadge").data("entryid")  + "/" +
                    parseFloat($("#score"+par_idno).val()).toFixed(2) + "/1.00/" +
                    composeaddgradereqt(),
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid : $("#name-rightbadge").data("semid"),
                        sectioncode:$("#name-rightbadge").data("sectionid")
                    }),
                    type:"POST",
                    dataType: "json",
                    success: function(resp) {
                        view.stopspin(par_btnid, "");
                        apputils.echo(resp);

                        if (resp.hasOwnProperty('status')) {
                            if (resp.status == "error") {
                                apputils.poperror(resp.message);
                                return;
                            }
                        }

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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
                    $("#name-rightbadge").data("semid") + "/" +
                    $("#name-rightbadge").data("schoolid") + "/" +
                    parseFloat($("#score" + par_idno).val()).toFixed(2) + "/" +
                    $("#name-rightbadge").data("quarter"),
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
                    $("#name-rightbadge").data("semid") + "/" +
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("quarter") + "/" +
                    apputils.exremtail(getscores("male") + getscores("female"), "@") + "/" +
                    $("#name-rightbadge").data("sectionid"),
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype")
                        }),
                    type:"POST",
                    dataType: "json",
                    success: function(resp) {
                        view.stopspin(par_btnid, "Submit");
                        apputils.echo(resp);

                        if (resp.status == 'error')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

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
                        view.stopspin(par_btnid, "&nbsp;Save");
                        alert("error pre");
                    },
                    beforeSend: function (xhrObj){
                        view.setspin(par_btnid);
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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

                $.ajax({
                    url: apputils.rest + '/attendance/' +
                    batch + "/" +
                    $("#name-rightbadge").data("section") + "/" +
                    $("#name-rightbadge").data("grade") + "/" +
                    $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid") + "/" +
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" +
                                $("#name-rightbadge").data("key")));
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
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid : $("#name-rightbadge").data("semid"),
                        sectioncode:$("#name-rightbadge").data("sectionid")
                    }),
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" +
                                $("#name-rightbadge").data("key")));
                    }
                });

            }

            model.recordattendance = function (par_btnid, par_studentid, par_status)
            {
                /*  "/attendance/<string:par_studentid>/<string:par_semid>/<string:par_status>/" +
                 "<string:par_att_date>/<float:par_points>/<string:par_daypart>/" +
                 "<string:par_schoolid>/<string:par_section>/<int:par_level>"
                 */

                /*
                 to do:
                 attendancedaypart
                 */
                if (par_status == "LATE")
                {
                    loc_points = parseFloat($("#attendanclate").val()).toFixed(2).toString();
                }
                else
                {
                    loc_points = parseFloat($("#cboattendancepoints").val()).toFixed(2).toString();
                }

                $.ajax({
                    url: apputils.rest + '/attendance/' + par_studentid + "/" +
                    $("#name-rightbadge").data("semid") + "/" + par_status + "/" +
                    $("#attendancedate").val() + "/" +
                    loc_points + "/" +
                    $("#attendancedaypart").val() + "/" + $("#name-rightbadge").data("schoolid") + "/" +
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                });
            }

            model.retrieveattendance = function(par_btnid)
            {
                $.ajax({
                    url: apputils.rest + '/attendance/' + $("#name-rightbadge").data("section") + "/" +
                    $("#name-rightbadge").data("grade") + "/" + $("#name-rightbadge").data("schoolid") + "/" +
                    $("#name-rightbadge").data("semid") + "/" + $("#attendancedate").val() + "/" +
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                });
            }

            model.retrievegrades = function(par_btnid)
            {
                view.forgradesubmission();
                function yesno(val)
                            {
                                if (val)
                                    return view.bslabel('info','Yes');
                                else
                                    return view.bslabel('default','No');
                            }

                $("#isgradelocked").html(yesno(false));
                $("#isgradepublished").html(yesno(false));
                $.ajax({
                    url: apputils.rest + '/gradebook/' + apputils.getSubjectNofromOffID($("#name-rightbadge").data("sectionid")) + "/" +
                    $("#name-rightbadge").data("schoolid") + "/" + $("#name-rightbadge").data("semid") + "/" + $("#name-rightbadge").data("quarter") + "/" +
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

                            $("#isgradelocked").html(yesno(resp.grades[i].finalized));
                            $("#isgradepublished").html(yesno(resp.grades[i].published));

                        }
                    },
                    error: function (e) {
                        view.stopspin("btnviewgradesubmission", "View Grades");
                        alert("error pre");
                    },
                    beforeSend: function (xhrObj){
                        view.setspin("btnviewgradesubmission");
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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

                        apputils.echo(resp);//process
                        $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                        $("#progressmessage").html("Done.");

                        for (var i = 0; i < resp.result.length; i++)
                        {

                            if (resp.result[i].result.indexOf("Error") != -1) {
                                loc_body = '<tr>';
                                var loc_subject = resp.result[i].sectionid.split(" ")[0];
                                loc_body += '<td>'+ resp.result[i].lrn +'</td>';
                                loc_body += '<td>'+ resp.result[i].studentname +'</td>';
                                loc_body += '<td>'+ loc_subject +'</td>';
                                loc_body += '<td>'+ resp.result[i].category +'</td>';
                                loc_body += '<td>'+ resp.result[i].entrycount +'</td>';
                                loc_body += '<td>'+ resp.result[i].result +'</td>';
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                });
            }


            model.getclassrecorddata = function (par_this)
            {   //def getclassrecord
                $.ajax({
                    url: apputils.rest + '/gradebook/' + $("#name-rightbadge").data("sectionid"),
                    type:"GET",
                    data: {
                        semid:$("#name-rightbadge").data("semid"),
                        schoolid: $("#name-rightbadge").data("schoolid"),
                        quarter: $("#name-rightbadge").data("quarter"),
                        grade: $("#name-rightbadge").data("grade"),
                        section:$("#name-rightbadge").data("section"),
                        subject:apputils.getSubjectNofromOffID($("#name-rightbadge").data("sectionid")),
                        token: $("#name-rightbadge").data("token")
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                });
            }

            model.getcard = function (par_lrn, par_all, par_this, par_tabid)
            {
                prevtext = $(par_this).text();
                if (par_all)
                {
                    sem = 'old';
                }
                else
                {
                    sem = $("#name-rightbadge").data("semid");
                }
                $.ajax({
                    url: apputils.rest + '/card/' + par_lrn + '/' + sem,
                    type:"GET",
                    data: {
                        "schoolid": $("#name-rightbadge").data("schoolid")
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

                        if (sem == "old")
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                });
            }

            model.getcalentries = function ()
            {
                $.ajax({
                    url: apputils.rest + '/calendar',
                    type:"GET",
                    data: {
                        lrn: apputils.ifundefined($('#name-rightbadge').data('timelrn'), $('#name-rightbadge').data('timelrn'), '')
                    },
                    success: function(resp) {
                        //view.stopspin("ajxstudetails", "Get");
                        //apputils.removehtmltags();
                        view.stopspin("umnu" + apputils.mnucalendar.id,
                            view. menuentry(apputils. mnucalendar));
                        apputils.echo(resp);
                        item = [];
                        for (var i=0; i< resp.size; i++) {
                            resp.items[i].title = apputils
                                .removehtmltags(resp.items[i].title);

                            if (item.indexOf(resp.items[i].title + resp.items[i].start) == -1) {
                                apputils.echo(resp.items[i]);

                                if (typeof resp.items[i].end !== 'undefined')
                                {
                                    var parts = resp.items[i].end.split('/');
                                    var endd =parseInt(parts[2]) + 1;
                                    resp.items[i].end = parts[0]  + "/" + parts[1] + "/" + endd.toString();

                                }

                                $('#calendar').fullCalendar('renderEvent',
                                    resp.items[i], true);
                                item.push(resp.items[i].title + resp.items[i].start);
                            }
                            //apputils.echo(item);
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                });
            }

            model.gettimeline = function(par_getchild)
            {
                
                //apputils.ifundefined(var_, defvalue, nullvalue)

                if ($("#name-rightbadge").data("usertype") === "students" /*||
                     $("#name-rightbadge").data("usertype") === "faculty"*/)
                 {
                     $("#announce").html(
                            view.excolumn(12,
                                view.excolumn(12,

                                   view.simplebox({
                                           boxtype: "primary",
                                           title: "Shortcut to Online Class",
                                           body:
                                             view.centerize(
                                                           view.buttonact(
                                                           "primary btn-lg ",
                                                           "Attend Class",
                                                           "model.joinonlineclass()",
                                                           "btnjoinvclass"
                                                    )),
                                          footer: ""
                                       }
                                   )
                                )
                            )
                     );
                 }

                loc_getchild = apputils.ifundefined(par_getchild, par_getchild, '');
                apputils.echo('Get Child');
                apputils.echo(loc_getchild);
                offset = apputils.ifundefined($("#name-rightbadge").data("offset"),
                    $("#name-rightbadge").data("offset"), 0);

                lrn = apputils.ifundefined($("#name-rightbadge").data("timelrn"),
                    $("#name-rightbadge").data("timelrn"), '');

                $.ajax({
                    url: apputils.rest + '/timeline',
                    type:"GET",
                    data: {
                        offset: offset,
                        lrn:lrn,
                        token: $("#name-rightbadge").data("token"),
                        getchild: loc_getchild
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
                                'You will see assignments here soon.',
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
                            apputils.echo('tstamp' + resp.timelines[i].tstamp);
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
                                resp.timelines[i].tltype,
                                resp.timelines[i]
                                //resp.timelines[i].recordentryid
                                );


                            $("#user-timeline").append(
                                pbox
                            );
                            /*
                            var tlid = $.sha1(
                                resp.timelines[i].owner +
                                resp.timelines[i].tltype +
                                resp.timelines[i].tstamp
                            )
                                .substring(0,7);
                            apputils.echo('tlid---->>' + tlid)
                            for (var j =0; j < resp.timelines[i].comments.size; j++)
                            {
                                $("#lstcomments" + tlid).append(
                                    view.boxcomment(
                                        resp.timelines[i].comments.comments[j].src,
                                        resp.timelines[i].comments.comments[j].byfullname,
                                        resp.timelines[i].comments.comments[j].time,
                                        resp.timelines[i].comments.comments[j].comment,
                                        resp.timelines[i].comments.comments[j].id
                                    )

                                )
                            }
                            */
                        }

                        $("#user-timeline").append(view.timenext())
                        $("#nexttimes").click(function () {
                            model.gettimeline(par_getchild);
                        });

                        $('img').error(function () {
                            $(this).attr('src', '/static/dist/img/soon.jpg');
                        })


                    },
                    error: function (e) {
                        //view.stopspin("ajxstudetails", "Get");
                        $("#nexttimes").removeClass('fa-refresh fa-spin');
                        $("#nexttimes").addClass('fa-sort-amount-asc');
                        $("#main").html(view.excolumn(12,view
                                .simplebox({
                                    boxtype:"info",
                                    title:"Timeline",
                                    body:"<h3>No Internet Connection!<h3>",
                                    footer:"Please consult proper authority."
                                })));
                        //$(par_this).html(prevtext);
                        //alert("error pre");
                    },
                    beforeSend: function (xhrObj){
                        //$(par_this).html(view.spin() + " Pls Wait..")
                        $("#nexttimes").removeClass('fa-sort-amount-asc');
                        $("#nexttimes").addClass('fa-refresh fa-spin');
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                });

            }


            model.savefeeling = function(btnid, tlid, feelingid)
            {
                $.ajax({
                    url:apputils.rest + '/feeling/' +
                            tlid + '/' + feelingid,
                    type: "POST",
                    contentType:"application/json; charset=utf-8",
                    dataType: "json",
                    success: function(resp){
                        apputils.echo(resp)
                       // $("#result"+tlid).html(resp);
                        if (feelingid == 1){
                            view.stopspin(btnid, "Angry");
                        } else if (feelingid == 2){
                            view.stopspin(btnid, "Sad");
                        } else if (feelingid == 3){
                            view.stopspin(btnid, "Happy");
                        } else if (feelingid == 4){
                            view.stopspin(btnid, "Surprised");
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

                var files = '';

                if ($("#lblfilesattachmentbboard").html() !== 'undefined')
                {
                    files = $("#lblfilesattachmentbboard").html();
                }

                $.ajax({
                    url: apputils.rest + '/bulletin',
                    type:"POST",
                    data: JSON.stringify({
                        message: $("#taBulletin").val()  + files + apputils.newline(),
                        schoolid:$("#name-rightbadge").data("schoolid"),
                        semid:$("#name-rightbadge").data("semid"),
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        vroomid: $("#name-rightbadge").data("virtualroomid"),
                        notif_msg: $("#taBulletin").val(),
                        name: $("#name-rightbadge").data("personname")
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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

                 var files = '';

                if ($("#lblfilesattachmenthowofiles").html() !== 'undefined')
                {
                    files = $("#lblfilesattachmenthowofiles").html();
                }

                $.ajax({
                    url: apputils.rest + '/assignment',
                    type:"POST",
                    data: JSON.stringify({
                        message: $("#taAssignment").val() + files + apputils.newline(),
                        duedate:$("#txtassignduedate").val(),
                        section:function (x) {
                                  scode = '';
                                  loads = $("#name-rightbadge").data("subjects");
                                  for (i = 0; i < loads.length; i++)
                                  {
                                      if (loads[i].label === x)
                                      {
                                          return loads[i].sectionid;
                                      }

                                  }
                                  return scode;
                        }($("#selassignment").val()),
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid: $("#name-rightbadge").data("semid"),
                        schoolid: $("#name-rightbadge").data("schoolid"),

                        notif_section:function (x) {
                            scode = '';
                            loads = $("#name-rightbadge").data("subjects");
                            for (i = 0; i < loads.length; i++)
                            {
                                if (loads[i].label === x)
                                {
                                    return loads[i].label;
                                }

                            }
                            return scode;
                        }($("#selassignment").val()),
                        vroomid: $("#name-rightbadge").data("virtualroomid"),
                        name: $("#name-rightbadge").data("personname")
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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

                 var files = '';

                if ($("#lblfilesattachmenteventfiles").html() !== 'undefined')
                {
                    files = $("#lblfilesattachmenteventfiles").html();
                }

                $.ajax({
                    url: apputils.rest + '/event',
                    type:"POST",
                    data: JSON.stringify({
                        message: $("#taEvent").val()  + files + apputils.newline(),
                        schoolid:$("#name-rightbadge").data("schoolid"),
                        semid:$("#name-rightbadge").data("semid"),
                        begindate:$("#txteventstartdate").val(),
                        enddate:$("#txteventenddate").val(),
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        vroomid: $("#name-rightbadge").data("virtualroomid"),
                        notif_msg: $("#taEvent").val(),
                        name: $("#name-rightbadge").data("personname")
                        
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
                    url: apputils.rest + '/schoolyear/' + from+to + "/" + $("#name-rightbadge").data("schoolid") + "/" + $("#name-rightbadge").data("token"),
                    type:"POST",
                    dataType: "json",
                    success: function (resp)
                        {
                            view.stopspin(par_button, "Change");
                            apputils.echo(resp);
                            if (resp.status == 'OK')
                            {
                                $("#name-rightbadge").data("semid", from+to);
                                $("#name-rightbadge").data("sections",resp.designated);
                                $("#lblChangeSY").html(view.bslabel("success", "Successfully Changed the Schoolyear to " + from+to));
                                view.setsemid(from+to);
                                $("#name-rightbadge").data("schoolid", resp.designated.school);
                                if (resp.designated.grade !== 'none') {
                                    apputils.switchsection(resp.designated.section, resp.designated.grade);
                                }
                                $("#schoolname").html(resp.designated.schoolname);
                                $("#name-rightbadge").data("quarter", resp.designated.quarter);
                                $("#name-rightbadge").data("subjects",[]);
                                apputils.echo(resp.load);
                                for (i=0; i<resp.load.length; i++)
                                {

                                    /*
                                    load.push({
                                        icon: "fa " + resp.load[i][3],
                                        label: resp.load[i][0],
                                        value: resp.load[i][1],
                                        sectionid: resp.load[i][4],
                                        color: resp.load[i][2],
                                        section: resp.load[i][5]
                                    });
                                     */

                                    $("#name-rightbadge").data("subjects").push(
                                        {
                                            icon:'fa ' + resp.load[i][3],
                                            label: resp.load[i][0] + ' ' + resp.load[i][5],
                                            value: resp.load[i][1],
                                            sectionid:resp.load[i][4],
                                            color: resp.load[i][2],
                                            section: resp.load[i][5]
                                        }
                                    );
                                }
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
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }

                });
            }


           model.ajaxCall = function (pars) {


                /*

                 {
                 resource: "gradebook",
                 data: {
                 offeringid:section,
                 studentid: $("#name-rightbadge").data("timelrn"),
                 schoolid: $("#name-rightbadge").data("schoolid"),
                 quarter:period,
                 semid: $("#name-rightbadge").data("semid")
                 },
                 type: "GET",
                 dataType: "json",
                 buttonid:"profbtn1",
                 buttonlabel:"Get",
                 error: function (e){},
                 success: function (resp)
                 }

                 */

                if (pars.buttonlabel == "")
                {
                    btnlabel = $("#" + pars.buttonid).html();
                }
                else
                {
                    btnlabel = pars.buttonlabel;
                }


                f = function (somev, label, spintext) {

                    spinnertext = function (spinval) {
                        result = typeof spintext == "undefined" ?
                            spinval :
                            typeof spintext == "string" ?
                                spintext : spintext();

                        apputils.echo(result);
                        return result;
                    }

                    if (typeof somev == "object") {
                        stop = function () {
                            apputils.echo("obj-->" + somev);
                            $(somev).html(label);

                        };
                        spin = function () {
                            apputils.echo("obj<--" + somev);
                            $(somev).html(spinnertext(view.spin() + " Pls Wait.."))

                        };
                    }
                    else {
                        stop = function () {
                            apputils.echo("oth-->" + somev);
                            view.stopspin(somev, label);

                        };

                        spin = function () {
                            apputils.echo("oth<--" + somev);
                            view.setspin(somev);


                        }
                    }
                    return {stop: stop, spin: spin};
                };

                spinstop = f(pars.buttonid, btnlabel, pars.spinnerval);

                basicparams = {
                    url: apputils.rest + "/" + pars.resource,
                    type: pars.type,
                    dataType: pars.dataType,
                    success: function (resp) {
                        //view.stopspin(pars.buttonid, pars.buttonlabel);
                        spinstop.stop();
                        pars.success(resp);
                    },
                    error: function (e) {

                        //view.stopspin(pars.buttonid, pars.buttonlabel);
                        spinstop.stop();
                        pars.error(e);
                    },
                    beforeSend: function (xhrObj) {
                        //view.setspin(pars.buttonid);
                        spinstop.spin();
                        xhrObj.setRequestHeader("Authorization",
                            "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                    }
                }

                if (pars.data !== '' || typeof pars.data !== 'undefined') {
                    basicparams.data = pars.data;
                }


                if (pars.contentType !== '' || typeof pars.contentType !== 'undefined') {
                    basicparams.contentType = pars.contentType
                }


                $.ajax(
                    basicparams
                ); // ajax
            }


            model.getstudentssubject = function (par_list)
            {
                view.subjectmanagement(par_list);
                $("#studentperfentries").html(view.boxloading());

                subjectkey = par_list.sectionid.replace(/[& !\-\?]/g, '').toLowerCase() + $("#name-rightbadge").data("semid");
               /*
               NOTE: Ditch this caching mechanism to make sure that Grading quarter is
               detected both by adviser and non-adviser.

               if (typeof $("#name-rightbadge").data(subjectkey) !== 'undefined')
                {
                     $("#name-rightbadge").data("listmale",  $("#name-rightbadge").data(subjectkey).listmale);
                     $("#name-rightbadge").data("listfemale",  $("#name-rightbadge").data(subjectkey).listfemale);
                     $("#studentperfentries").html(view.forgradeentry());
                    return;
                }*/

                apputils.echo("btnkey --->" + subjectkey);

                model.ajaxCall(
                    {
                        resource: "classlist/" + par_list.sectionid + "/" + $("#name-rightbadge").data("token"),
                        data: {},
                        type: "GET",
                        dataType: "json",
                        buttonid: "btn" + subjectkey,
                        buttonlabel: par_list.value,
                        error: function (e) {alert(e); apputils.echo(e);},
                        success: function (resp)
                        {
                            apputils.echo(resp);

                            if (resp.male == 0 && resp.female == 0)
                            {
                                apputils.poperror("No Enrolled Students!");
                            }

                            if (resp.male == 0)
                                lstmale = [];
                            else
                                lstmale = resp.listmale;

                            if (resp.female == 0)
                                lstfemale = [];
                            else
                                lstfemale = resp.listfemale;

                            $("#name-rightbadge").data(subjectkey, {
                                                                        listmale: lstmale,
                                                                        listfemale: lstfemale
                                                                    });
                            $("#name-rightbadge").data("listmale", lstmale);
                            $("#name-rightbadge").data("listfemale", lstfemale);
                            $("#name-rightbadge").data("grade", resp.level);
                            $("#name-rightbadge").data("section", resp.section);
                            $("#name-rightbadge").data("quarter", resp.quarter);
                            $("#aboutmequarter").html(resp.quarter)
                            $("#studentperfentries").html(view.forgradeentry());

                        }
                    }
                );

            }

                model.searchfaculty = function (btnname)
            {
                model.ajaxCall({
                    resource: "faculty/" + $("#teachersearch").val(),
                    data:{
                        token:$("#name-rightbadge").data("token")
                    },
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
                                                            resp.list[i].fullname+'\', \'' + resp.list[i].picurl + '\')',
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

            model.addcoteacher = function (par_id, par_btnid, par_fullname, par_picurl)
            {
                //alert(par_id + ' ' + par_btnid);
                model.ajaxCall({
                    resource: "faculty/" + $("#name-rightbadge").data("username")  +
                        "/" + par_id + "/" + $("#name-rightbadge").data("sectionid"),
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            quarter: $("#name-rightbadge").data("quarter")
                    }),
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
                           $("#tabcoteacher tbody").append(
                               '<tr>' +
                               '<td>' + '<img width="60px;" height="60px"  class="img-circle img-bordered-sm"'+
                                                         ' src=' + par_picurl + '>'  + '</td>' +
                               '<td></td>' +
                               '<td>' + par_fullname + ' &nbsp; &nbsp; &nbsp; &nbsp;</td>' +
                               '<td>' + view.buttonact("danger btn-xs",
                                        "Remove",
                                        "model.removecoteacher('"+"removecollab"+par_id+"','"+par_id+"')",
                                        "removecollab"+par_id) + '</td>' +
                               '</tr>'
                           );

                           $("#name-rightbadge").data()[
                               $("#name-rightbadge").data("sectionid")
                               ].push({
                               fullname: par_fullname,
                               idnum: par_id,
                               pic:par_picurl
                           });
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
                sectionid = $("#name-rightbadge").data("sectionid");
                model.ajaxCall({
                    resource: "faculty/"  +
                    "" + par_personnumid + "/" + sectionid,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            quarter: $("#name-rightbadge").data("quarter")
                    }),
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

                         coteachers = $("#name-rightbadge").data(sectionid);

                         for (i = 0; i < coteachers.length; i++)
                         {
                             if (coteachers[i].idnum === par_personnumid)
                             {
                                 coteachers.splice(i,1);
                             }
                         }

                         view.populationcoteachers();

                         /* $("#div"+par_personnumid).remove();
                            $("#removecollab"+par_personnumid).remove();
                            index = apputils.getIndexID(
                                $("#name-rightbadge")
                                    .data("sectionid"));
                            $("#name-rightbadge")
                                .data("subjects")[index]
                                .coteachers
                                .splice(
                                    apputils.getIndexOfCollab(index, par_personnumid),
                                    1); */

                            return;
                        }
                        apputils.poperror(resp.message);
                    }
                });
            }


            model.enrollspreadsheet = function(par_size)
            {

                 if ($("#name-rightbadge").data("enrolllist").length == 0)
                 {
                     $("#progressmessage").html("Done.");
                     $("#xlsuploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                     model.getenrolledstuds();
                     return;
                 }

                 record = $("#name-rightbadge").data("enrolllist").pop();
                 apputils.echo('enrollspreadsheet')
                 apputils.echo(record[2]);

                 n = parseFloat(par_size - $("#name-rightbadge").data("enrolllist").length);

                 $(".progress-bar").attr('style', 'width:' + ((n / parseFloat(par_size)) * 100.0).toString() + '%');
                 $("#progressmessage").html("Uploading " + n.toString() + " of " + par_size);

                 //apputils.handleundefined = function (some_var, defaultvalue)
                 stufullname = record[1].split(",");
                 father = record[12].split(",");
                 mother = record[13].split(",");
                 guardian = record[14].split(",");
                  model.ajaxCall({
                    resource: "classlist/" +
                        $("#name-rightbadge").data("schoolid") + "/" +
                        $("#name-rightbadge").data("semid") + "/" +
                        $("#name-rightbadge").data("grade") + "/" +
                        $("#name-rightbadge").data("section"),
                    data:JSON.stringify({
                                    group:$("#name-rightbadge").data("usertype"),
                                    token:$("#name-rightbadge").data("token"),
                                    lrn:record[0],
                                    lastname: apputils.handleundefined(stufullname[0], '').trim(),
                                    firstname: apputils.handleundefined(stufullname[1], '').trim(),
                                    middlename: apputils.handleundefined(stufullname[2], '').trim(),
                                    sex: (function () {
                                                            if (record[2].trim().toUpperCase() == 'M')
                                                            {
                                                                return 'Male';
                                                            }
                                                            else
                                                            {
                                                                return 'Female';
                                                            }
                                                      })(),
                                    birthdate: record[3],
                                    age: record[4],
                                    mothertongue: record[5],
                                    ip: record[6],
                                    religion: record[7],
                                    housenum: record[8],
                                    brgy: record[9],
                                    mun: record[10],
                                    province: record[11],
                                    zipcode:'',
                                    flname: apputils.handleundefined(father[0], '').trim(),
                                    ffname: apputils.handleundefined(father[1], '').trim(),
                                    fmname: apputils.handleundefined(father[2], '').trim(),
                                    mlname: apputils.handleundefined(mother[0], '').trim(),
                                    mfname: apputils.handleundefined(mother[1], '').trim(),
                                    mmname: apputils.handleundefined(mother[2], '').trim(),
                                    glname: apputils.handleundefined(guardian[0], '').trim(),
                                    gfname: apputils.handleundefined(guardian[1], '').trim(),
                                    gmname: apputils.handleundefined(guardian[2], '').trim(),
                                    condcashtrans: record[15],
                                    nutionalstatus: record[16],
                                    disabilities: 'none'
                            }),
                    contentType: 'application/json; charset=utf-8',
                    type: "POST",
                    dataType: "json",
                    buttonid: '',
                    buttonlabel: "",
                    error: function (e) {
                        apputils.poperror(e);
                        model.enrollspreadsheet(par_size);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status === 'Error')
                        {
                            apputils.poperror(resp.message);
                        }
                        model.enrollspreadsheet(par_size);
                    }
                });




            }

            model.getuseraccounts = function ()
            {
                alert("It may take a while to activate the student and parent accounts.");
                model.ajaxCall({
                    resource: "auth/" + $("#name-rightbadge").data("section") + "/" +
                        $("#name-rightbadge").data("grade") + "/" +
                        $("#name-rightbadge").data("semid"),
                    data:JSON.stringify({
                                    token:$("#name-rightbadge").data("token"),
                                    group:$("#name-rightbadge").data("usertype"),
                                    schoolid: $("#name-rightbadge").data("schoolid")

                            }),
                    contentType: 'application/json; charset=utf-8',
                    type: "POST",
                    dataType: "json",
                    buttonid: 'btngenerateallaccounts',
                    buttonlabel: "&nbsp;Activate All",
                    error: function (e) {
                        apputils.poperror(e);
                        apputils.echo(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        apputils.echo(resp);
                        var endnote = 'Copy and Paste these accounts for distribution.';

                        if (resp.accounts.accounts.length == 0)
                        {
                            endnote = 'Accounts were already activated, if Excel file does not download contact: myeskwela.app@gmail.com';
                        }

                        $("#fortableusername").html(
                                '<table id="tabuseraccount" ' +
                                ' data-search="true" ' +
                                ' data-search-align="left" ' +
                                ' ></table>' + '<br />' +//row
                                view.exrow(
                                    view.excolumn(4,'') +
                                    view.excolumn(4,view.buttonact("success fa fa-download"
                                        + ' data-step="1" data-intro="For security reasons, my.eskwela cannot store plain text copies of login credentials. \nIf you have not seen a file downloaded, please click this button now.' ,"Download",
                                        "apputils.tabtoexcel('tabuseraccount', 'useraccounts"+
                                        $("#name-rightbadge").data("section") + $("#name-rightbadge").data("grade") + $("#name-rightbadge").data("semid") +"')",
                                        "btnprevcard")) +
                                    view.excolumn(4,'')
                                )
                        );

                        var table_cols = [];

                        table_cols.push({
                            'field': "studentuser",
                            'title': 'Student'
                        });

                        table_cols.push({
                            'field': "studentpassword",
                            'title': ''
                        });

                        table_cols.push({
                            'field': "fatheruser",
                            'title': 'Father'
                        });

                        table_cols.push({
                            'field': "fatherpassword",
                            'title': ''
                        });

                        table_cols.push({
                            'field': "motheruser",
                            'title': 'Mother'
                        });

                        table_cols.push({
                            'field': "motherpassword",
                            'title': ''
                        });

                        table_cols.push({
                            'field': "guardianuser",
                            'title': 'Guardian'
                        });

                        table_cols.push({
                            'field': "guardianpassword",
                            'title': ''
                        });

                        $("#tabuseraccount").bootstrapTable({columns: table_cols});

                        records = [
                            {
                                "studentuser":"Username",
                                "studentpassword": "Password",
                                "fatheruser":"Username",
                                "fatherpassword": "Password",
                                "motheruser":"Username",
                                "motherpassword": "Password",
                                "guardianuser":"Username",
                                "guardianpassword": "Password"
                            }
                        ];

                    for (var i=0; i < resp.accounts.accounts.length; i++)
                    {
                        var student = ['', ''];
                        var father = ['', ''];
                        var mother = ['', ''];
                        var guardian = ['', ''];

                        if (resp.accounts.accounts[i].student.search('->') != -1 &&
                            typeof resp.accounts.accounts[i].student.search('->') != "undefined"
                        )
                        {
                            student = resp.accounts.accounts[i].student.split('->');
                        }

                        if (resp.accounts.accounts[i].father.split('->') != -1 &&
                            typeof resp.accounts.accounts[i].father.search('->') != "undefined")
                        {
                            father = resp.accounts.accounts[i].father.split('->');
                        }

                        if (resp.accounts.accounts[i].mother.split('->') != -1 &&
                            typeof resp.accounts.accounts[i].mother.search('->') != "undefined")
                        {
                            mother = resp.accounts.accounts[i].mother.split('->');
                        }

                        if (resp.accounts.accounts[i].guardian.split('->') != -1 &&
                            typeof resp.accounts.accounts[i].guardian.search('->') != "undefined")
                        {
                            guardian = resp.accounts.accounts[i].guardian.split('->');
                        }

                        var blanks = function (par_r)
                        {
                            return typeof par_r !== 'undefined' ? par_r : "";
                        }

                        records.push({
                              "studentuser": blanks(student[0]),
                              "studentpassword": blanks(student[1]),
                              "fatheruser": blanks(father[0]),
                              "fatherpassword": blanks(father[1]),
                              "motheruser": blanks(mother[0]),
                              "motherpassword": blanks(mother[1]),
                              "guardianuser": blanks(guardian[0]),
                              "guardianpassword": blanks(guardian[1])
                            });
                    }
                    apputils.echo(records);
                    $("#tabuseraccount").bootstrapTable('removeAll');
                    $("#tabuseraccount").bootstrapTable('append', records);
                    apputils.tabtoexcel('tabuseraccount',
                        'useraccounts' +
                        $("#name-rightbadge").data("section") +
                        $("#name-rightbadge").data("grade") +
                        $("#name-rightbadge").data("semid"));

                        introJs().start();
                        /*
                        window.open(
                       Flask.url_for('static', {filename:'downloads/' + $("#name-rightbadge").data("section") +
                        $("#name-rightbadge").data("grade") +
                        $("#name-rightbadge").data("schoolid") + $("#name-rightbadge").data("semid") + '.xlsx'})
                        , '_blank');*/

                    }
                });
            }

            model.getxcelcrformat = function ()
            {
                model.ajaxCall({
                    resource: "classlist/spreadsheet",
                    data:{
                        token:$("#name-rightbadge").data("token"),
                        section:$("#name-rightbadge").data("section"),
                        level: $("#name-rightbadge").data("grade"),
                        group:$("#name-rightbadge").data("usertype"),
                        schoolid: $("#name-rightbadge").data("schoolid"),
                        semid: $("#name-rightbadge").data("semid"),
                        teachername:$("#name-leftbadge").html(),
                        schoolname:$("#schoolname").html(),
                        quarter: $("#name-rightbadge").data("quarter"),
                        subjectdesc: apputils
                            .getSubjectDescfromOffID($("#name-rightbadge")
                                .data("sectionid"))
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: 'btnxclcompat',
                    buttonlabel: "&nbsp; &nbsp;Excel File",
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        window.open(
                            //section+level+schoolid+"ECRECORD" + ".xlsx"
                       Flask.url_for('static', {filename:'downloads/' + $("#name-rightbadge").data("section") +
                        $("#name-rightbadge").data("grade") +
                        $("#name-rightbadge").data("schoolid") + $("#name-rightbadge").data("semid") + "ECRECORD" + '.xlsx'})
                        , '_blank');
                    }
                });
            }


            model.lockgrades = function (par_btnid, par_btnname)
            {
                 model.ajaxCall({
                    resource: "gradebook/lock/"+$("#name-rightbadge").data("sectionid"),
                    data:JSON.stringify({
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#name-rightbadge").data("quarter")
                        }),
                     contentType: 'application/json; charset=utf-8',
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR') {
                            apputils.poperror(resp.message);
                            return;
                        }
                        apputils.popsuccess("Lock operation successful!");
                        function yesno(val)
                            {
                                if (val)
                                    return view.bslabel('info','Yes');
                                else
                                    return view.bslabel('default','No');
                            }

                            $("#isgradelocked").html(yesno(true));
                    }
                 });
            }


            model.publishgrades = function (par_btnid, par_btnname)
            {
                 model.ajaxCall({
                    resource: "gradebook/publish/"+$("#name-rightbadge").data("sectionid"),
                    data:JSON.stringify({
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#name-rightbadge").data("quarter")
                        }),
                     contentType: 'application/json; charset=utf-8',
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR') {
                            apputils.poperror(resp.message);
                            return;
                        }
                          apputils.popsuccess(resp.message);
                        function yesno(val)
                            {
                                if (val)
                                    return view.bslabel('info','Yes');
                                else
                                    return view.bslabel('default','No');
                            }
                            $("#isgradepublished").html(yesno(true));
                    }
                 });
            }


            model.getquarterlyassessment = function (par_btnid, par_btnname)
            {
                //par_btnid = "btnquarterlyassessment";
                //par_btnname = "Quarterly Assessment";
                model.ajaxCall({
                    resource: "rawscore",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#name-rightbadge").data("quarter"),
                            sectioncode: $("#name-rightbadge").data("sectionid")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        $("#aktotalitems").html(resp.maxscore);
                        $("#name-rightbadge").data("aktotalitems", resp.maxscore);

                        if (parseInt(resp.size) == 0)
                        {
                            return;
                        }


                        for (var i =0; i < parseInt(resp.size); i++)
                        {
                            var id = resp.rawscores[i].lrn;
                            $("#raw_score" + id).html(resp.rawscores[i].score);
                            $("#ps" + id).html(resp.rawscores[i].ps);
                            $("#ml" + id).html(resp.rawscores[i].ms);
                        }

                    }
                 });
            }

            model.getanswerkey = function ()
            {
                par_btnid = "btnanswerkey";
                par_btnname = "Answer Key";
                model.ajaxCall({
                    resource: "answerkey",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#name-rightbadge").data("quarter"),
                            sectioncode: $("#name-rightbadge").data("sectionid")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (parseInt(resp.size) == 0)
                        {
                            return;
                        }

                        $("#txtqatotalscore").val(resp.size);

                        for (var i =0; i < parseInt(resp.size); i++)
                        {
                            var id = resp.answerkey[i].item;
                            view.combochange("answer" + id, resp.answerkey[i].answer);
                        }

                    }
                 });


            }


            model.saveanswerkey = function ()
            {
                par_btnid = 'btnsaveanswerkey';
                par_btnname = "Save";
                totalitems = parseInt($("#txtqatotalscore").val());
                answers = '';

                for (var i = 1; i <= totalitems ; i++)
                {
                    if ($("#answer" + i).val() !== '-')
                    {
                        answers += $("#answer" + i).val();
                    }
                }
                apputils.echo(answers);
                if (totalitems != answers.length)
                {
                    apputils.poperror("Inconsitencies in total item and number of encoded answers!");
                    return;
                }

                    model.ajaxCall({
                    resource: "answerkey",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            sectioncode: $("#name-rightbadge").data("sectionid"),
                            quarter: $("#name-rightbadge").data("quarter"),
                            answers: answers,
                            totalitems: totalitems
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       if (resp.status.toUpperCase() == 'OK')
                       {
                           $("#name-rightbadge").data("aktotalitems", $("#txtqatotalscore").val());
                          apputils.popsuccess("Answer Keys Saved!");
                       }
                       else
                       {
                           apputils.poperror(resp.message);
                       }
                    }
                });
            }

            model.lockanswerkey = function ()
            {
                par_btnid = "btnlockak";
                par_btnname = 'Lock';
                model.ajaxCall({
                    resource: "answerkey",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            sectioncode: $("#name-rightbadge").data("sectionid"),
                            quarter: $("#name-rightbadge").data("quarter")
                        }),
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       if (resp.status.toUpperCase() == 'OK')
                       {
                           $("#name-rightbadge").data("aktotalitems", $("#txtqatotalscore").val());
                           apputils.popsuccess("Answer Keys Locked!");
                       }
                       else
                       {
                           apputils.poperror(resp.message);
                       }
                    }
                });
            }

            model.getencodedstuanswers = function(par_lrn, par_errid)
            {
                par_btnid = "txtstudentrawscore";
                par_btnname = $("#txtstudentrawscore").text();
                model.ajaxCall({
                    resource: "rawscore/answer",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#name-rightbadge").data("quarter"),
                            sectioncode: $("#name-rightbadge").data("sectionid"),
                            lrn:par_lrn
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (parseInt(resp.size) == 0)
                        {
                            return;
                        }

                        //$("#txtqatotalscore").val(resp.size);

                        for (var i =0; i < parseInt(resp.size); i++)
                        {
                            var id = resp.answers[i].item;
                            view.combochange("answer" + id, resp.answers[i].answer);
                        }

                        $("#txtstudentrawscore").html(resp.score);
                    }
                 });

            }


            model.savestudentanswer = function(par_lrn)
            {
                par_btnid = 'btnsavestudentanswer';
                par_btnname = "Save";

                totalitems = parseInt($("#name-rightbadge").data("aktotalitems"));
                answers = '';

                for (var i = 1; i <= totalitems ; i++)
                {
                    if ($("#answer" + i).val() !== '-')
                    {
                        answers += $("#answer" + i).val();
                    }
                }

                /*
                    # par_token
                    # par_group
                    # par_lrn
                    # par_sectioncode
                    # par_answers
                    # par_quarter
                 */
                model.ajaxCall({
                    resource: "rawscore/answer",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            lrn: par_lrn,
                            sectioncode: $("#name-rightbadge").data("sectionid"),
                            quarter: $("#name-rightbadge").data("quarter"),
                            answers: answers
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       if (resp.status.toUpperCase() == 'OK')
                       {
                          $("#txtstudentrawscore").text(resp.score);
                       }
                       else
                       {
                           apputils.poperror(resp.message);
                       }
                    }
                });
            }


            model.downloadiamps = function ()
            {
                /*
                 token = params["token"]
                sectioncode = params["sectioncode"]
                quarter = params["quarter"]
                group = params["group"]
                 */
                par_btnid = "btndownloadreport";
                par_btnname = "&nbsp;&nbsp;&nbsp;Item Analysis and MPS Reports";
                model.ajaxCall({
                    resource: "rawscore/reports",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#name-rightbadge").data("quarter"),
                            sectioncode: $("#name-rightbadge").data("sectionid")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        //"IAMPS" + sectioncode + quarter  + ".xlsx"
                        window.open(
                            //section+level+schoolid+"ECRECORD" + ".xlsx"
                             Flask.url_for('static', {filename:'downloads/' +
                                     "IAMPS" + $("#name-rightbadge").data("sectionid") +
                                     $("#name-rightbadge").data("quarter") +
                                     '.xlsx'})
                        , '_blank');
                    }
                 });

            }


            model.teachermonitoring = function ()
            {
                par_btnid = 'btnretrievereport';
                par_btnname = 'OK';
                model.ajaxCall({
                    resource: "report/submission/status",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#cbomonquarter").val(),
                            gradelevel: $("#cbogmonradelevel").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            schoolid: $("#name-rightbadge").data("schoolid")

                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        $("#tblmonteacherlist").find("tr:gt(0)").remove();
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (resp.teachers == null ||
                            resp.teachers.length == 0
                          )
                        {
                            return;
                        }


                        var loc_body = '';
                        for (var i=0; i < resp.teachers.length; i ++)
                        {
                             tid = resp.teachers[i].id;
                             loc_body +=  view.composerow(
                                 [
                                     apputils.itempicsetting(resp.teachers[i].picsrc),
                                     resp.teachers[i].fullname,
                                     view.centerize(
                                                resp.teachers[i].completiongrade
                                     ),
                                     view.centerize(resp.teachers[i].completionia),
                                     view.buttonact("success", "Details", "model.getreportdetails('"+tid+"', '"+resp.teachers[i].picsrc+"', '"+resp.teachers[i].fullname+"')", "btnviewdetails" + tid)
                                 ]
                             );

                        }

                        $("#tblmonteacherlist > tbody").append(loc_body);

                    }
                 });
            }


            model.getreportdetails = function (par_facultyid, par_picture, par_fullname)
            {
                /*
                token = params["token"]
                group = params["group"]
                quarter = params["quarter"]
                teacherid = params["teacherid"]
                semid = params["semid"]
                * */
                par_btnid = 'btnviewdetails' + par_facultyid;
                par_btnname = 'Details';
                loc_quarter = $("#cbomonquarter").val();
                $("#name-rightbadge").data("monitorsendallfacultyid", par_facultyid);
                $("#name-rightbadge").data("monitorsendallquarter", loc_quarter);
                model.ajaxCall({
                    resource: "report/submission/details",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: loc_quarter,
                            teacherid: par_facultyid,
                            semid: $("#name-rightbadge").data("semid"),
                            schoolid: $("#name-rightbadge").data('schoolid')
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        view.teacherreportdetails();
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (resp.size == 0)
                        {
                            return;
                        }
                        /*
                        resp.report[i].grdsubmission,
                        resp.report[i].sectioncode,
                        resp.report[i].subjectid + ' ' + resp.report[i].level,
                        resp.report[i].section,
                        resp.report[i].title,
                        'Grade'
                         */
                        function labeldate(
                                           par_lbldate,
                                           par_sectioncode,
                                           par_subject,
                                           par_section,
                                           par_title,
                                           par_type)
                        {
                            var datearr = par_lbldate.split('@');

                            var disp = '';


                            if (datearr[0].length > 0) {
                                if (datearr[1] === 'ontime') {
                                    return view.bslabel('success', datearr[0]);
                                }
                                else {
                                    return view.bslabel('default', datearr[0]);
                                }
                            }
                            var btnid = $.sha1('btnremind' + par_type + par_sectioncode);
                            return view.buttonact('danger btn btn-xs btn-flat',
                                'Remind',
                                "model.remindfaculty('" +
                                par_facultyid + "', '" + btnid + "', '" +
                                par_subject + "', '"+
                                par_section +"','" +
                                par_title +
                                "', '"+
                                par_type+"', '"+ loc_quarter +"')",
                                btnid);

                        }


                        $(".rmdpic").html(apputils.itempicsetting(par_picture));
                        $("#rmdname").html("Name:" + par_fullname);
                        $("#rmdrank").html("Rank:" + resp.position);
                        $("#rmdadviserof").html("Adviser of:" + resp.yearlevel + "-" + resp.section);

                        var loc_ressexize;

                        if (parseInt(resp.classinfo.total) == 0) {
                            loc_ressexize = "Class Size : 0";
                        }
                        else
                        {
                            loc_ressexize = "Class Size : " + resp.classinfo.total;
                            for (var i = 0; i < resp.classinfo.slice.length; i++)
                            {
                                loc_ressexize += apputils.space(3) + Object.keys(resp.classinfo.slice[i])[0] + ":" +
                                Object.values(resp.classinfo.slice[i])[0];
                            }

                        }

                        $("#rmclasssize").html(
                            loc_ressexize + apputils.space(3) +
                            view.buttonact('danger btn btn-xs btn-flat',
                                            'Remind',
                                            "model.remindfacultyenrollment('" +
                                            par_facultyid + "', 'btnenrollremind')",
                                            'btnenrollremind'));

                        var loc_body = '';
                        for (var i = 0; i < resp.size; i++)
                        {
                            loc_body += view.composerow(
                                [
                                    resp.report[i].subjectid + ' ' + resp.report[i].level,
                                    resp.report[i].section,
                                    resp.report[i].title,
                                    view.centerize(
                                        labeldate(
                                            resp.report[i].grdsubmission,
                                            resp.report[i].sectioncode,
                                            resp.report[i].subjectid + ' ' + resp.report[i].level,
                                            resp.report[i].section,
                                            resp.report[i].title, 'Grade')),
                                        view.centerize(
                                        labeldate(
                                            resp.report[i].iasubmission,
                                            resp.report[i].sectioncode,
                                            resp.report[i].subjectid + ' ' + resp.report[i].level,
                                            resp.report[i].section,
                                            resp.report[i].title, 'Item Analysis')),
                                    resp.report[i].coteacher
                                ]
                            );
                        }
                        $("#tblrmddetails > tbody").append(loc_body);
                    }
                 });
            }


            model.teachersearchmonitoring = function ()
            {
                /*
                   token = params["token"]
                    group = params["group"]
                    lastname = params["lastname"]
                    schoolid = params["schoolid"]
                    semid = params["semid"]
                    gradelevel = params["level"]
                    quarter = params["quarter"]

                 */
                par_btnid = 'btnsrchteach';
                par_btnname = 'Search';
                model.ajaxCall({
                    resource: "report/submission/faculty/search",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            lastname: $("#teachersearch").val(),
                            quarter: $("#cbomonquarter").val(),
                            level: $("#cbogmonradelevel").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            schoolid: $("#name-rightbadge").data("schoolid")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        $("#tblmonteacherlist").find("tr:gt(0)").remove();
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (resp.teachers == null ||
                            resp.teachers.length == 0
                          )
                        {
                            return;
                        }


                        var loc_body = '';
                        for (var i=0; i < resp.teachers.length; i ++)
                        {
                             tid = resp.teachers[i].id;
                             loc_body +=  view.composerow(
                                 [
                                     apputils.itempicsetting(resp.teachers[i].picsrc),
                                     resp.teachers[i].fullname,
                                     view.centerize(
                                                resp.teachers[i].completiongrade
                                     ),
                                     view.centerize(resp.teachers[i].completionia),
                                     view.buttonact("success", "Details", "model.getreportdetails('"+tid+"', '"+resp.teachers[i].picsrc+"', '"+resp.teachers[i].fullname+"')", "btnviewdetails" + tid)
                                 ]
                             );

                        }

                        $("#tblmonteacherlist > tbody").append(loc_body);

                    }
                 });
            }

            model.setdeadline = function()
            {
                par_btnid = 'btnsetdeadline';
                par_btnname = 'OK';
                model.ajaxCall({
                    resource: "report/submission/deadline",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            quarter: $("#cbodlnquarter").val(),
                            dlntype: $("#cbodlntype").val(),
                            date: $("#txtdlndate").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            schoolid: $("#name-rightbadge").data("schoolid")
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       if (resp.status.toUpperCase() == 'OK')
                       {
                          apputils.popsuccess("Deadline Successfully Set.\n" +
                          "To check issued deadlines, please check Calendar.");
                       }
                       else
                       {
                           apputils.poperror(resp.message);
                       }
                    }
                });

            }

            model.remindfaculty = function(par_facultyid,
                                           par_btnid,
                                           par_subject,
                                           par_section,
                                           par_title,
                                           par_type,
                                           par_quarter)
            {
                par_btnname = 'Remind';
                model.ajaxCall({
                    resource: "report/submission/faculty/remind",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            quarter: par_quarter,
                            semid: $("#name-rightbadge").data("semid"),
                            schoolid: $("#name-rightbadge").data("schoolid"),
                            facultyid: par_facultyid,
                            subject: par_subject,
                            section: par_section,
                            title: par_title,
                            type: par_type
                    }),
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       if (resp.status.toUpperCase() == 'OK')
                       {
                          apputils.popsuccess("A Gentle Reminder Successfully Sent.");
                       }
                       else
                       {
                           apputils.poperror(resp.message);
                       }
                    }
                });
            }


            model.remindfacultyenrollment = function(par_facultyid, par_btnid)
            {
                par_btnname = 'Remind';
                model.ajaxCall({
                    resource: "report/enrollment/faculty/remind",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            semid: $("#name-rightbadge").data("semid"),
                            schoolid: $("#name-rightbadge").data("schoolid"),
                            facultyid: par_facultyid
                    }),
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       if (resp.status.toUpperCase() == 'OK')
                       {
                          apputils.popsuccess("A Gentle Reminder Successfully Sent.");
                       }
                       else
                       {
                           apputils.poperror(resp.message);
                       }
                    }
                });
            }


            model.sendreminderall = function ()
            {
                /*
                        par_username text,
                        par_token text,
                        par_group text,
                        par_facultyid text,
                        par_semid text,
                        par_schoolid text,
                        par_quarter text
                 */
                par_btnid = 'btnremindallmonitoring';
                par_btnname = 'Remind All';
                model.ajaxCall({
                    resource: "report/submission/faculty/remind/all",
                    contentType: 'application/json; charset=utf-8',
                    data:JSON.stringify({
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            facultyid: $("#name-rightbadge").data("monitorsendallfacultyid"),
                            semid: $("#name-rightbadge").data('semid'),
                            schoolid: $("#name-rightbadge").data("schoolid"),
                            quarter: $("#name-rightbadge").data("monitorsendallquarter")
                        }),
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        var j = 0;
                        var gradesent = '';
                        for (var i=0; i < resp.gradescount; i++)
                        {
                            j++;
                            gradesent += j.toString() + '. ' + resp.gradesubjects[i].subject + ' ' +
                                resp.gradesubjects[i].description +
                                ' section ' + resp.gradesubjects[i].section + '\n';
                        }

                        var iasent = '';
                        for (var i=0; i < resp.iacount; i++)
                        {
                            j++;
                            iasent += j.toString() + '. ' + resp.iasubjects[i].subject + ' ' +
                                resp.iasubjects[i].description +
                                ' section ' + resp.iasubjects[i].section + '\n';
                        }

                        if (resp.iacount > 0 ||
                            resp.gradescount > 0)
                        {
                            apputils.popsuccess("Reminder was successfully sent for the following:" +
                                  function () {
                                       if (resp.gradescount == 0)
                                       {
                                           return '';
                                       }

                                       return 'Grade Reminder for:\n' +
                                              gradesent;
                                  }() +
                                  function () {
                                       if (resp.iacount == 0)
                                       {
                                           return '';
                                       }

                                       return 'Item Analysis and MPS reminder for:\n' +
                                           iasent;
                                    }()

                            );
                        } else
                            apputils.popsuccess('Operation Done.');
                    }
                 });
            }


            model.principalmonitoring = function ()
            { //def getschoolreportstatus
                par_btnid = 'btnretrievereport';
                par_btnname = 'OK';
                model.ajaxCall({
                    resource: "report/submission/status/principal",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#cbomonquarter").val(),
                            semid: $("#name-rightbadge").data("semid")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        $("#tblmonprincipallist").find("tr:gt(0)").remove();
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (resp.totalschools == 0)
                        {
                            apputils.poperror('No School has been assigned\n to your region yet.');
                            return;
                        }


                        var loc_body = '';
                        for (var i=0; i < resp.totalschools; i ++)
                        {
                             tid = $.sha1(resp.submissions[i].principalid);
                             loc_body +=  view.composerow(
                                 [
                                     apputils.itempicsetting(resp.submissions[i].pic),
                                     resp.submissions[i].principalname,
                                     view.centerize(resp.submissions[i].schoolid),
                                     resp.submissions[i].schoolname,
                                     view.centerize(
                                                resp.submissions[i].grade
                                     ),
                                     view.centerize(resp.submissions[i].itemanalysis),
                                     view.buttonact("danger btn-flat", "Remind",
                                         "model.remindprincipal('btnviewremind"+tid+"', '"+
                                         resp.submissions[i].principalid + "'"+
                                         ",'" + resp.submissions[i].schoolid + "')",
                                         "btnviewremind" + tid)
                                 ]
                             );

                        }

                        $("#tblmonprincipallist > tbody").append(loc_body);

                    }
                 });
            }


               model.remindprincipal = function (par_btnid, par_principalid, par_schoolid)
            {
                /*
                        par_username text,
                        par_token text,
                        par_group text,
                        par_facultyid text,
                        par_semid text,
                        par_schoolid text,
                        par_quarter text
                 */
                par_btnname = 'Remind';
                model.ajaxCall({
                    resource: "report/submission/principal/remind",
                    contentType: 'application/json; charset=utf-8',
                    data:JSON.stringify({
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            principalid: par_principalid,
                            semid: $("#name-rightbadge").data('semid'),
                            schoolid: par_schoolid,
                            quarter: $("#cbomonquarter").val()
                        }),
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        var j = 0;
                        var gradesent = '';
                        for (var i=0; i < resp.gradescount; i++)
                        {
                            j++;
                            gradesent += j.toString() + '. ' + resp.gradesubjects[i].subject + ' ' +
                                resp.gradesubjects[i].description +
                                ' section ' + resp.gradesubjects[i].section + '\n';
                        }

                        var iasent = '';
                        for (var i=0; i < resp.iacount; i++)
                        {
                            j++;
                            iasent += j.toString() + '. ' + resp.iasubjects[i].subject + ' ' +
                                resp.iasubjects[i].description +
                                ' section ' + resp.iasubjects[i].section + '\n';
                        }

                        apputils.popsuccess('Reminder Sent.');
                    }
                 });
            }

           model.remindallprincipal = function ()
           {
                par_btnid = 'btnremindallprincipalsmoni';
                par_btnname = 'Remind All';
                model.ajaxCall({
                    resource: "report/submission/principal/remind/all",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid: $("#name-rightbadge").data('semid'),
                        quarter: $("#cbomonquarter").val()
                    }),
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);

                        if (resp.status !== 'OK') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        var princ = resp.results.length;

                        if (princ == 0)
                        {
                            apputils.popsuccess("No School is assigned to you.")
                            return;
                        }

                        var princename = '';
                        for (var i = 0; i < princ; i++)
                        {
                            princename += (i+1).toString() + "." +  resp.results[i].principalname + '\n';
                        }
                        apputils.popsuccess('Reminders were sent to the following principals:\n' + princename);
                    }
                });
           }

           model.computeaggrmps = function()
           {
                par_btnid = 'btncomputempsprincipalsmoni';
                par_btnname = 'Compute MPS';

                if (!confirm("Computing MPS can be done only once, click 'OK' to proceed." ))
               {
                   return;
               }

                model.ajaxCall({
                    resource: "report/mps/division",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid: $("#name-rightbadge").data('semid'),
                        quarter: $("#cbomonquarter").val()
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);

                        if (resp.status !== 'OK') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        apputils.popsuccess('Computation Done!')
                    }
                });
           }

           model.computeaggria = function()
           {
                par_btnid = 'btncomputeiaprincipalsmoni';
                par_btnname = 'Compute Item Analysis';

                if (!confirm("Computing Item Analysis can be done only once, click 'OK' to proceed." ))
               {
                   return;
               }

                model.ajaxCall({
                    resource: "report/ia/division",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid: $("#name-rightbadge").data('semid'),
                        quarter: $("#cbomonquarter").val()
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);

                        if (resp.status !== 'OK') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        apputils.popsuccess('Computation Done!')
                    }
                });
           }

           model.retrievempsdivision = function()
           {
               par_btnid = 'btnretreivempsdiv';
               par_btnname = 'OK';

               /*
                   window.open(
                       Flask.url_for('static', {filename:'downloads/' + $("#name-rightbadge").data("section") +
                        $("#name-rightbadge").data("grade") +
                        $("#name-rightbadge").data("schoolid") + $("#name-rightbadge").data("semid") + '.xlsx'})
                        , '_blank');

                */
                model.ajaxCall({
                    resource: "report/mps/division",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#cbomrtdivquarter").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            level: $("#cbomrtdivgrdlevel").val()
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        //'MPS' + semid + quarter + level + ".xlsx"
                        apputils.popsuccess("Downloading file.\nPlease make sure my.eskwela is\nauthorized to download in your browser.");
                         window.open(
                                   Flask.url_for(
                                       'static', {filename:'downloads/MPS' +
                                           $("#name-rightbadge").data("semid") +
                                           $("#cbomrtdivquarter").val() +
                                           $("#cbomrtdivgrdlevel").val() +
                                           '.xlsx'})
                                    , '_blank');
                    }
                 });
           }

           model.retrieveiadivision = function ()
           {
               par_btnid = 'btnretreiveiadiv';
               par_btnname = 'OK';

                model.ajaxCall({
                    resource: "report/ia/division",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#cboiadivquarter").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            level: $("#cboiadivgrdlevel").val()
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        //'MPS' + semid + quarter + level + ".xlsx"
                        apputils.popsuccess("Downloading file.\nPlease make sure my.eskwela is\nauthorized to download in your browser.");
                         window.open(
                                   Flask.url_for(
                                       'static', {filename:'downloads/IA' +
                                           $("#name-rightbadge").data("semid") +
                                           $("#cboiadivquarter").val() +
                                           $("#cboiadivgrdlevel").val() +
                                           '.xlsx'})
                                    , '_blank');
                    }
                 });
           }


            model.retrievesubjcoord = function ()
           {
               par_btnid = 'btngetsubjcoord';
               par_btnname = 'OK';
               /*
                in superintendent module the schoolid is the
                user's region of responsibility
               * */

                model.ajaxCall({
                    resource: "exam/coordinators",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            quarter: $("#cboquarter").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            level: $("#cbogrdlevel").val(),
                            subject:$("#cbosubjects").val(),
                            region: $("#name-rightbadge").data("schoolid")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        //'MPS' + semid + quarter + level + ".xlsx"

                        apputils.resettablerows("tblsubjcoord");

                        if (resp.size == 0)
                        {
                            apputils.poperror("Subject Coordinators is not yet assigned!")
                            return;
                        }

                        var loc_body = '';

                        for (var i = 0; i < resp.size; i++)
                        {
                            btnid = 'btnswitch'+$.sha1(resp.encoders[i].facultyid);
                            loc_body += view.composerow([
                                apputils.itempicsetting(resp.encoders[i].picsrc),
                                resp.encoders[i].fullname,
                                resp.encoders[i].schoolname,
                                function ()
                                {
                                   if (resp.encoders[i].enabled)
                                   {
                                       return view.buttonact(
                                           "warning btn-flat btn-xs",
                                           "Remove",
                                           "model.switchsubjectcoord('" + btnid +
                                           "', 'Remove', '" +
                                           resp.encoders[i].facultyid + "','" +
                                           resp.encoders[i].enabled.toString() + "')",
                                           btnid);
                                   }
                                   else
                                   {
                                       return view.buttonact(
                                           "success btn-flat btn-xs",
                                           "Add",
                                            "model.switchsubjectcoord('" + btnid +
                                           "', 'Add', '" +
                                           resp.encoders[i].facultyid + "','" +
                                           resp.encoders[i].enabled.toString() + "')",
                                           btnid);
                                   }
                                }()


                            ]);
                        }

                        //apputils.echo(loc_body);

                        $("#tblsubjcoord > tbody").append(loc_body);

                    }
                 });
           }

           model.switchsubjectcoord = function(par_btnid, par_label, par_facultyid, par_switchv)
           {
               /*
                 if switchv then disable
                 else enable


                    token = params["token"]
                    group = params["group"]
                    semid = params["semid"]
                    subject = params["subject"]
                    level = params["level"]
                    quarter = params["quarter"]
                    region = params["region"]
                    facultyid = params["facultyid"]
                    district = params["district"]
                    switchv = params["switchv"]


                */

                 model.ajaxCall({
                    resource: "exam/coordinators",
                    data:JSON.stringify({
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            semid: $("#name-rightbadge").data("semid"),
                            subject: $("#cbosubjects").val(),
                            level: $("#cbogrdlevel").val(),
                            quarter: $("#cboquarter").val(),
                            region: $("#name-rightbadge").data("schoolid"), //schoolid is the regionid for superintendent
                            facultyid: par_facultyid,
                            district: '*',
                            switchv: par_switchv
                        }),
                     contentType: 'application/json; charset=utf-8',
                    type: "PUT",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_label,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status.toUpperCase() === 'ERROR') {
                            apputils.poperror(resp.message);
                            return;
                        }
                        //assuming value is already switched
                        if (par_switchv == 'true')
                        {
                            $("#" + par_btnid)
                                .removeClass("btn-warning")
                                .addClass("btn-success")
                                .text("Add")
                                .attr("onclick",
                                    "model.switchsubjectcoord('" + par_btnid + "', 'Add'," +
                                    " '" + par_facultyid + "','false')");

                        }
                        else
                        {
                             $("#" + par_btnid)
                                .removeClass("btn-success")
                                .addClass("btn-warning")
                                .text("Remove")
                                .attr("onclick",
                                    "model.switchsubjectcoord('" + par_btnid + "', 'Remove'," +
                                    " '" + par_facultyid + "','true')");

                        }

                        //apputils.popsuccess("Lock operation successful!");

                    }
                 });


           }


           model.searchcoords = function ()
           {
               par_btnid = 'btnsrchteach';
               par_btnname = 'Search';
               /*
                in superintendent module the schoolid is the
                user's region of responsibility

                searchcoordinators(par_username text,
                                                      par_token text,
                                                      par_group text,
                                                      par_region text,
                                                      par_searchtext text)

               * */

                model.ajaxCall({
                    resource: "exam/coordinators/search",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            region: $("#name-rightbadge").data("schoolid"),
                            searchtext: $("#teachersearch").val()
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        //'MPS' + semid + quarter + level + ".xlsx"

                        apputils.resettablerows("tblmonteacherlist");

                        if (resp.size == 0)
                        {
                            apputils.poperror("Your query did not returned any results.")
                            return;
                        }

                        var loc_body = '';

                        for (var i = 0; i < resp.size; i++)
                        {
                            btnid = 'btnaddcoord'+$.sha1(resp.coords[i].facultyid);

                            loc_body += view.composerow([
                                apputils.itempicsetting(resp.coords[i].picsrc),
                                resp.coords[i].name,
                                resp.coords[i].school,
                                view.buttonact(
                                    "success btn-flat btn-xs",
                                           "Add",
                                           "model.addcoord('" + btnid +
                                           "', 'Add', '" +
                                           resp.coords[i].facultyid + "'," +
                                           "'" + resp.coords[i].name + "'," +
                                           "'" + resp.coords[i].school + "'," +
                                           "'" + resp.coords[i].picsrc + "'" +
                                    ")",
                                           btnid)
                                    ]);
                        }

                        apputils.echo(loc_body);

                        $("#tblmonteacherlist > tbody").append(loc_body);

                    }
                 });

           }




           model.addcoord = function(par_btnid, par_btnname, par_facultyid, par_fullname, par_school, par_pic)
            {
                /*
                    token = params["token"]
                    group = params["group"]
                    semid = params["semid"]
                    subjectid = params["subjectid"]
                    level = params["level"]
                    quarter = params["quarter"]
                    facultyid = params["facultyid"]
                    region = params["region"]
                    district = params["district"]
                 */
                model.ajaxCall({
                    resource: "exam/coordinators",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            semid: $("#name-rightbadge").data("semid"),
                            subjectid: $("#cbosubjects").val(),
                            level: $("#cbogrdlevel").val(),
                            quarter: $("#cboquarter").val(),
                            facultyid: par_facultyid,
                            region: $("#name-rightbadge").data("schoolid"),
                            district:'*'
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       if (resp.status !== 'OK') {
                           apputils.poperror(resp.message);
                           return;
                       }
                    var btnid = "btnswitch" + $.sha1(par_facultyid);
                    $("#tblsubjcoord > tbody").append(
                        view.composerow([
                                apputils.itempicsetting(par_pic),
                                par_fullname,
                                par_school,
                                view.buttonact(
                                           "warning btn-flat btn-xs",
                                           "Remove",
                                           "model.switchsubjectcoord('" + btnid +
                                           "', 'Remove', '" +
                                           par_facultyid + "','" +
                                            "true')",
                                           btnid)])
                    );
                    }
                });
            }

            model.getmysubjectcoord = function ()
            {
                model.ajaxCall({
                    resource: "exam/coordinators/me",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            semid: $("#name-rightbadge").data("semid"),
                            quarter: $("#name-rightbadge").data("quarter")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: "mnucoordinatorsubjects",
                    buttonlabel: "Coordinator Subjects",
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                             $("#main").html(view.excolumn(12,view
                                .simplebox({
                                    boxtype:"ERROR",
                                    title:"Subject Coordinator Load",
                                    body:"<h3>" + resp.message + "<h3>",
                                    footer:"Please consult proper authority."
                                })));
                            return;
                        }
                        //'MPS' + semid + quarter + level + ".xlsx"

                        apputils.resettablerows("tblmonteacherlist");

                        if (resp.size == 0)
                        {
                            $("#main").html(view.excolumn(12,view
                                .simplebox({
                                    boxtype:"info",
                                    title:"Subject Coordinator Load",
                                    body:"<h3>NO ASSIGNED SUBJECTS!<h3>",
                                    footer:"Please consult proper authority."
                                })));
                            return;
                        }

                       $("#main").html(view.rowdify(
                           resp.subjects,
                           view.boxnoprogress,
                           function (resp){
                               apputils.echo(resp);
                               btnid = "btnencode" + $.sha1(resp.subject+resp.level);
                              return {
                                  boxid: 'box' + resp.subject + resp.level,
                                  color: resp.color,
                                  icon: 'fa ' + resp.icon,
                                  idh: "hdr" + resp.description,
                                  header: resp.subject + ' ' +  resp.level +
                                        apputils.newline() +
                                          "Assigned by:" + apputils.newline() +
                                          resp.designated_by +
                                           apputils.newline() +
                                        view.buttonact(
                                                    'default btn-flat btn-xs',
                                                    'Manage',
                                                    " view.setupencodequestions('" +
                                                    resp.subject + "', " + resp.level + ")",
                                                    btnid),
                                  idh2: 'hdr2' + resp.designated_by,
                                  content: ''

                              }
                           },
                           "Subject Coordinator Load for Quarter " + $("#name-rightbadge").data("quarter")
                       ));

                    }
                 });
            }

            model.fetchexaminfo = function(par_btnid, par_btnname, par_subject, par_level, par_page)
            {
                /*
                        token = params["token"]
                        group = params["group"]
                        subjectid = params["subjectid"]
                        level = params["level"]
                        quarter = params["quarter"]
                        page = params["page"]
                 */

                if (par_btnname === 'Reset')
                {
                       $("#qlists").html("");
                }

                      model.ajaxCall({
                          resource: "exam/question",
                          data: {
                              token: $("#name-rightbadge").data("token"),
                              group: $("#name-rightbadge").data("usertype"),
                              subjectid: par_subject,
                              level: par_level,
                              quarter: $("#name-rightbadge").data("quarter"),
                              page: par_page
                          },
                          type: "GET",
                          dataType: "json",
                          buttonid: par_btnid,
                          buttonlabel: par_btnname,
                          error: function (e) {
                              apputils.poperror(e);
                          },
                          success: function (resp) {
                              apputils.echo(resp);
                              if (resp.status !== 'OK') {
                                  apputils.poperror(resp.message);
                              }

                              //view.setupencodequestions(par_subject, par_level);
                              //$("#taQuestion").wysihtml5({toolbar:{"image":false}});
                              if (resp.size == 0)
                              {
                                  apputils.poperror("No record has been retrieved. \n Click reset to start anew.");
                                  $("#divfetchbtn").remove();

                                  $("#qlists").append(
                                      view.exrow(
                                                            view.excolumn(4, "") +
                                                            view.excolumn(4, view.centerize(
                                                                view.buttonact("warning", "Reset",
                                                                    "model.fetchexaminfo('btnretrieveq', 'Reset', '" + par_subject +"', '" + par_level + "', 1)","btnretrieveq")
                                                            ),"divfetchbtn") +
                                                            view.excolumn(4, "")
                                                        )
                                  );
                                  return;
                              }
                              $("#divfetchbtn").remove();

                              for (var i=0; i < resp.size; i++)
                              {
                                  question = resp.questions[i];
                                  $("#qlists")
                                      .append(
                                          view.qeditable({ id: question.questionid,
                                                      skills: question.skill,
                                                      topic: question.topic,
                                                      difflevel: question.difficulty,
                                                      eta: question.time,
                                                      question: question.question,
                                                      a: question.a,
                                                      b: question.b,
                                                      c: question.c,
                                                      d: question.d,
                                                      answer: question.answer,
                                                      encoded_by: question.encodedbyname,
                                                      pic: question.pic,
                                                      difficulty_index: question.difficulty_index,
                                                      diff_interp: question.diff_interp,
                                                      discrimination_index: question.discrimination_index,
                                                      disc_interp: question.disc_interp,
                                                      qstatus: question.qstatus
                                                      }
                                                      )
                                      );

                                  $("#taQuestion" + question.questionid).wysihtml5({toolbar:{"image":false}})
                              }


                              if (resp.nextpage !== 0)
                              {
                                  $("#qlists").append(
                                      view.exrow(
                                                            view.excolumn(4, "") +
                                                            view.excolumn(4, view.centerize(
                                                                view.buttonact("success", "Retrieve",
                                                                    "model.fetchexaminfo('btnretrieveq', 'Retrieve', '" + par_subject +"', '" + par_level + "', " + resp.nextpage + ")","btnretrieveq")
                                                            ),"divfetchbtn") +
                                                            view.excolumn(4, "")
                                                        )
                                  );
                              }
                          }
                      });
            }


            model.storequestion = function (par_vals)
            {
                /*
                    token: $("#name-rightbadge").data("token"),
                    group: $("#name-rightbadge").data("usertype"),
                    subjectid:$("#spansubject").text(),
                    level:$("#spanlevel").text(),
                    question:$("#taQuestion").val(),
                    answer: $("#cboqanswer").val(),
                    a: $("#txtopta").val(),
                    b:$("#txtoptb").val(),
                    c:$("#txtoptc").val(),
                    d:$("#txtoptd").val(),
                    difficultylevel:$("#cboqlevel").val(),
                    itemtime: $("#txtqeta").val(),
                    points: 1,
                    topic: $("#txtqtopic").val(),
                    skillassessed: $("#txtqskills").val(),
                    semid: $("#name-rightbadge").data("semid"),
                    schoolid:$("#name-rightbadge").data("schoolid"),
                    quarter:$("#name-rightbadge").data("quarter"),
                    btnid:
                    btnname:
                 */
                par_btnid = "btnsaveq";
                par_btnname = "OK";
                model.ajaxCall({
                    resource:'exam/question',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                                    token: par_vals.token,
                                    group: par_vals.group,
                                    subjectid:par_vals.subjectid,
                                    level:par_vals.level,
                                    question:par_vals.question,
                                    answer: par_vals.answer,
                                    a: par_vals.a,
                                    b:par_vals.b,
                                    c:par_vals.c,
                                    d:par_vals.d,
                                    difficultylevel:par_vals.difficultylevel,
                                    itemtime: par_vals.itemtime,
                                    points: par_vals.points,
                                    topic: par_vals.topic,
                                    skillassessed: par_vals.skillassessed,
                                    semid: par_vals.semid,
                                    schoolid:par_vals.schoolid,
                                    quarter:par_vals.quarter
                    }),
                    type:"POST",
                    dataType: 'json',
                    buttonid:par_vals.btnid,
                    buttonlabel:par_vals.btnname,
                    error: function (e)
                    {},
                    success: function (resp) {
                        apputils.echo(resp);

                        if (resp.status !== 'OK') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        apputils.popsuccess("Question succesfully encoded.")
                        $("#txtqskills").val("");
                        $("#txtqtopic").val("");
                        view.combochange("cboqlevel", "--");
                        $("#txtqeta").val("");
                        $("#txtopta").val("");
                        $("#txtoptb").val("");
                        $("#txtoptc").val("");
                        $("#txtoptd").val("");
                        view.combochange("cboqanswer", "--");

                        $("#div4ta").html(
                           view.excolumn(12,
                            view.textarea(
                            {
                                id: "taQuestion",
                                rows: 5,
                                cols: 20,
                                wrap: 'hard',
                                placeholder: "Type your Questions Here."
                            }
                        )));
                        $("#taQuestion").wysihtml5({toolbar: {"image": false}});
                    }
                });



            }

            model.savequestion = function ()
            {
                model.storequestion({
                            token: $("#name-rightbadge").data("token"),
                            group: $("#name-rightbadge").data("usertype"),
                            subjectid:$("#spansubject").text(),
                            level:$("#spanlevel").text(),
                            question:$("#taQuestion").val(),
                            answer: $("#cboqanswer").val(),
                            a: $("#txtopta").val(),
                            b:$("#txtoptb").val(),
                            c:$("#txtoptc").val(),
                            d:$("#txtoptd").val(),
                            difficultylevel:$("#cboqlevel").val(),
                            itemtime: $("#txtqeta").val(),
                            points: 1,
                            topic: $("#txtqtopic").val(),
                            skillassessed: $("#txtqskills").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            schoolid:$("#name-rightbadge").data("schoolid"),
                            quarter:$("#name-rightbadge").data("quarter"),
                            btnid: "OK",
                            btnname: "btnsaveq"
                });
            }


            model.editedquestion = function (par_qid)
            {
                /*
                create or replace function updatequestion(
                       par_username text,
                       par_token text,
                       par_group text,
                       par_questionid text,
                       par_subjectid text,
                       par_level int,
                       par_question text,
                       par_answer text,
                       par_a text,
                       par_b text,
                       par_c text,
                       par_d text,
                       par_difficultylevel text, --evaluated difficulty level (easy, medium, hard)
                       par_itemtime numeric, -- in seconds
                       par_points numeric,
                       par_topic text,
                       par_skillassessed text,
                       par_quarter text
                    )
                 */

                par_btnid = "btnsaveq" + par_qid;
                par_btnname = "OK";

                apputils.echo(par_btnname);

                model.ajaxCall({
                            resource:'exam/question',
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify({
                                token: $("#name-rightbadge").data("token"),
                                group: $("#name-rightbadge").data("usertype"),
                                subjectid: $("#spansubject").text(),
                                level: $("#spanlevel").text(),
                                questionid: par_qid,
                                question: $("#taQuestion" + par_qid).val(),
                                answer: $("#cboqanswer" + par_qid).val(),
                                a: $("#txtopta" + par_qid).val(),
                                b: $("#txtoptb" + par_qid).val(),
                                c: $("#txtoptc" + par_qid).val(),
                                d: $("#txtoptd" + par_qid).val(),
                                difficultylevel: $("#cboqlevel" + par_qid).val(),
                                itemtime: $("#txtqeta" + par_qid).val(),
                                points: 1,
                                topic: $("#txtqtopic" + par_qid).val(),
                                skillassessed: $("#txtqskills" + par_qid).val(),
                                semid: $("#name-rightbadge").data("semid"),
                                schoolid: $("#name-rightbadge").data("schoolid"),
                                quarter: $("#name-rightbadge").data("quarter")
                            }),
                    type:"PUT",
                    dataType:'json',
                    buttonid: par_btnid,
                    buttonlabel:par_btnname,
                    error:function(e) {},
                    success: function (resp)
                    {
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message)
                            return;
                        }

                        apputils.popsuccess("Question successfully update!");
                    }
                });
            }


            model.retrieveexaminfo = function ()
            {
                par_btnid = "btnretrieveexam";
                par_btnname = "Retrieve Info";

                /*
                   token = params["token"]
            group = params["group"]
            subjectid = params["subjectid"]
            level = params["level"]
            quarter = params["quarter"]
            semid = params["semid"]
            schoolid = params["schoolid"]
                 */

            model.ajaxCall({
                    resource: "exam",
                    data: {
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        subjectid: $("#spansubject").text(),
                        level: $("#spanlevel").text(),
                        quarter: $("#name-rightbadge").data("quarter"),
                        semid:$("#name-rightbadge").data("semid"),
                        schoolid:$("#name-rightbadge").data("schoolid")
                    },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                         apputils.echo("retrieve exam info start");
                        apputils.echo(resp.estimated_duration);
                        apputils.echo("retrieve exam info start");
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (resp.totalquestions == 0)
                        {
                            $("#noqc").html("0");
                            apputils.poperror("No Initialized Exam.")
                            return;
                        }

                        $("#noqc").html(resp.totalquestions);
                        $("#noauths").html(resp.authors);
                        $("#oldq").html(resp.oldest); //oldest question
                        $("#newq").html(resp.newest); //newest question
                        $("#easyc").html(resp.difflevels[0]);
                        $("#averagec").html(resp.difflevels[1]);
                        $("#hardc").html(resp.difflevels[2]);
                        $("#txtstartex").val(resp.start_time);
                        $("#txtendex").val(resp.end_time);

                        $("#divedt").html(resp.estimated_duration);
                        var stat;
                        if (resp.publish === 'Published')
                        {
                            stat = view.smallbadge('green', resp.publish);
                        }
                        else
                        {
                            stat = view.smallbadge('gray', resp.publish);
                        }
                        $("#lblenabledstatus").html(stat);

                    }
                });
            }


            model.createexam = function()
            {
                par_btnid = "btncreateexam";
                par_btnname = "Create Exam";

                if (!confirm("Creating an exam can be done only once, click 'OK' to proceed." ))
               {
                   return;
               }

                model.ajaxCall({
                        resource:'exam',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify({
                            token: $("#name-rightbadge").data("token"),
                            group: $("#name-rightbadge").data("usertype"),
                            semid: $("#name-rightbadge").data("semid"),
                            schoolid: $("#name-rightbadge").data("schoolid"),
                            quarter: $("#name-rightbadge").data("quarter"),
                            subjectid: $("#spansubject").text(),
                            level: $("#spanlevel").text(),
                            starttime: $("#txtstartex").val(),
                            endtime: $("#txtendex").val()
                        }),
                        type:"POST",
                        dataType: 'json',
                        buttonid:par_btnid,
                        buttonlabel:par_btnname,
                        error: function (e)
                        {},
                        success: function (resp)
                        {
                            apputils.echo(resp);

                            if (resp.status !== 'OK')
                            {
                                apputils.poperror(resp.message);
                                return;
                            }
                            //do something here
                            $("#noqc").html(resp.examinfo.totalquestions);
                            $("#noauths").html(resp.examinfo.authors);
                            $("#oldq").html(resp.examinfo.oldest); //oldest question
                            $("#newq").html(resp.examinfo.newest); //newest question
                            $("#easyc").html(resp.examinfo.difflevels[0]);
                            $("#averagec").html(resp.examinfo.difflevels[1]);
                            $("#hardc").html(resp.examinfo.difflevels[2]);
                            $("#txtstartex").val(resp.examinfo.start_time);
                            $("#txtendex").val(resp.examinfo.end_time);
                            var stat;
                            if (resp.examinfo.publish === 'Published')
                        {
                            stat = view.smallbadge('green', resp.examinfo.publish);
                        }
                        else
                        {
                            stat = view.smallbadge('gray', resp.examinfo.publish);
                        }
                        $("#lblenabledstatus").html(stat);


                        }

                    });
            }



            model.downloadexam = function () {
                par_btnid = 'btndownloadexam';
                par_btnname = 'Download';
                model.ajaxCall({
                    resource: "exam/questions",
                    data: {
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        subjectid: $("#spansubject").text(),
                        level: $("#spanlevel").text(),
                        quarter: $("#name-rightbadge").data("quarter"),
                        semid: $("#name-rightbadge").data("semid"),
                        schoolid: $("#name-rightbadge").data("schoolid")
                    },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK') {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (resp.totalquestions == 0) {
                            $("#noqc").html("0");
                            apputils.poperror("No Initialized Exam.")
                            return;
                        }

                        window.open(
                            Flask.url_for('static',
                                {
                                    filename: 'downloads/' + 'EXAM' + $("#spansubject").text() +
                                        $("#spanlevel").text() +
                                        $("#name-rightbadge").data("quarter") +
                                        $("#name-rightbadge").data("schoolid") +
                                        $("#name-rightbadge").data("semid") + '.xlsx'
                                })
                            , '_blank');


                    }
                });
            }

            model.enableexam = function ()
            {
                /*
                 username = params["username"]
            token = params["token"]
            group = params["group"]
            semid = params["semid"]
            schoolid = params["schoolid"]
            quarter = params["quarter"]
            subjectid = params["subjectid"]
            level = params["level"]
                 */
                par_btnid = "btnpublishexam";
                par_btnname = "Publish";
                model.ajaxCall({
                    resource:'exam/publish',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        subjectid: $("#spansubject").text(),
                        level: $("#spanlevel").text(),
                        quarter: $("#name-rightbadge").data("quarter"),
                        semid: $("#name-rightbadge").data("semid"),
                        schoolid: $("#name-rightbadge").data("schoolid")
                    }),
                    type:"POST",
                    dataType: 'json',
                    buttonid:par_btnid,
                    buttonlabel:par_btnname,
                    error: function (e)
                    {},
                    success: function (resp)
                    {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        $("#lblenabledstatus").html(view.smallbadge('green', 'Published'));


                        apputils.popsuccess('Exam Published.')

                    }

                });



            }


             model.retrieveqbankinfo = function ()
            {
                par_btnid = "btnretrieveqbank";
                par_btnname = "Retrieve Info";

                /*
                    token = params["token"]
                    group = params["group"]
                    subjectid = params["subjectid"]
                    level = params["level"]
                    quarter = params["quarter"]
                    schoolid = params["schoolid"]
                 */

            model.ajaxCall({
                    resource: "question/bank/info",
                    data: {
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        subjectid: $("#spansubject").text(),
                        level: $("#spanlevel").text(),
                        quarter: $("#name-rightbadge").data("quarter"),
                        schoolid:$("#name-rightbadge").data("schoolid")
                    },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        if (resp.totalquestions == 0)
                        {
                            $("#noqc").html("0");
                            apputils.poperror("No Encoded Question.")
                            return;
                        }

                        $("#qnoqc").html(resp.totalquestions);
                        $("#qnoauths").html(resp.authors);
                        $("#qoldq").html(resp.oldest); //oldest question
                        $("#qnewq").html(resp.newest); //newest question
                        $("#qeasyc").html(resp.difflevels[0]);
                        $("#qaveragec").html(resp.difflevels[1]);
                        $("#qhardc").html(resp.difflevels[2]);
                        $("#qdivedt").html(resp.estimated_duration);
                    }
                });
            }


            model.computeoquizia = function ()
            {
                par_btnid = "btnexamitemanalysis";
                par_btnname = "Item Analysis and MPS";
                model.ajaxCall({
                    resource:'exam/online/itemanalysis',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        subjectid: $("#spansubject").text(),
                        level: $("#spanlevel").text(),
                        quarter: $("#name-rightbadge").data("quarter"),
                        semid: $("#name-rightbadge").data("semid"),
                        schoolid: $("#name-rightbadge").data("schoolid")
                    }),
                    type:"PUT",
                    dataType: 'json',
                    buttonid:par_btnid,
                    buttonlabel:par_btnname,
                    error: function (e)
                    {},
                    success: function (resp)
                    {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        //do something
                    }

                });

            }

            model.toggleqitembox = function (par_questionid, par_toggle)
            {
                par_btnid = "btnqtoggle" + par_questionid;
                model.ajaxCall({
                    resource:'exam/question/toggle',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        questionid: par_questionid,
                        toggle:par_toggle
                    }),
                    type:"PUT",
                    dataType: 'json',
                    buttonid:par_btnid,
                    buttonlabel:'',
                    error: function (e)
                    {},
                    success: function (resp)
                    {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }



                        if (par_toggle == 'false') {

                            $("#" + par_btnid)
                                 .removeClass('btn-danger')
                                 .addClass('btn-success')
                                 .text('Enable Question')
                                 .off("click")
                                 .click(
                                    function()
                                    {
                                        model.toggleqitembox(par_questionid, 'true');
                                    }
                                );
                            $("#lbltogglequestion"+par_questionid)
                                .removeClass('bg-green')
                                .addClass('bg-default')
                                .html("Disabled");

                        }
                        else
                        {
                            color = 'green';
                             $("#" + par_btnid)
                                 .removeClass('btn-success')
                                 .addClass('btn-danger')
                                 .text('Disable Question')
                                 .off("click")
                                 .click(
                                    function()
                                    {
                                        model.toggleqitembox(par_questionid, 'false');
                                    }
                                );

                             $("#lbltogglequestion"+par_questionid)
                                    .removeClass('bg-default')
                                    .addClass('bg-green')
                                    .html("Enabled");
                        }

                    }

                });
            }




             model.getmyexamsubjects = function ()
            {
                view.mainloading();
                model.ajaxCall({
                    resource: "exam/students/me",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            semid: $("#name-rightbadge").data("semid"),
                            quarter: $("#name-rightbadge").data("quarter")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: "",
                    buttonlabel: "Online Exam",
                    error: function (e) {
                        apputils.poperror(e);
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                             $("#main").html(view.excolumn(12,view
                                .simplebox({
                                    boxtype:"ERROR",
                                    title:"Subject Coordinator Load",
                                    body:"<h3>" + resp.message + "<h3>",
                                    footer:"Please consult proper authority."
                                })));
                            return;
                        }

                        if (resp.size == 0)
                        {
                            $("#main").html(view.excolumn(12,view
                                .simplebox({
                                    boxtype:"info",
                                    title:"Available Exams",
                                    body:"<h3>NO CREATED EXAMS!<h3>",
                                    footer:"Please consult proper authority."
                                })));
                            return;
                        }

                       $("#main").html(view.rowdify(
                           resp.subjects,
                           view.boxnoprogress,
                           function (resp){
                               apputils.echo(resp);
                               btnid = "btntakeexam" + $.sha1(resp.subject+resp.level);
                              return {
                                  boxid: 'box' + resp.subject + resp.level,
                                  color: resp.color,
                                  icon: 'fa ' + resp.icon,
                                  idh: "hdr" + resp.description,
                                  header: resp.subject + ' ' +  resp.level +
                                           apputils.newline() +
                                       "BEG:" + apputils.newline() +
                                          resp.start_time +
                                           apputils.newline() +
                                        "END:" + apputils.newline() +
                                          resp.end_time +
                                         apputils.newline() +
                                        view.buttonact(
                                                    'info btn-flat btn-xs',
                                                    'Take',
                                                    " model.takeexam('" +
                                                    resp.subject + "', " + resp.level + ", '" + resp.offeringid + "')",
                                                    btnid),
                                  idh2: 'hdr2' + resp.designated_by,
                                  content: ''

                              }
                           },
                           "Available Online Exams for Quarter " + $("#name-rightbadge").data("quarter")
                       ));

                    }
                 });
            }

            model.takeexam = function (par_subjectid, par_level, par_offeringid)
            {
                par_btnid = "btntakeexam" + $.sha1(par_subjectid+par_level);
                par_btnname = 'Take';


                model.ajaxCall({
                    resource: "exam/students/me/questions",
                    type: "GET",
                    data: {
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        subjectid: par_subjectid,
                        level: par_level,
                        quarter:$("#name-rightbadge").data("quarter"),
                        schoolid: $("#name-rightbadge").data("schoolid"),
                        semid: $("#name-rightbadge").data("semid")
                    },
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        view.studentexamiface(par_subjectid, par_level);
                        view.setquestionbox({
                                start_time: resp.start_time,
                                end_time: resp.end_time,
                                remaining: '',
                                question: resp.questions[0].question,
                                a:resp.questions[0].a,
                                b:resp.questions[0].b,
                                c:resp.questions[0].c,
                                d:resp.questions[0].d
                       });
                        //start timer
                        apputils.timeremain = parseInt(resp.remaining);

                        if (apputils.timerid.toString().length > 0)
                        {
                            clearInterval(apputils.timerid);
                        }

                        apputils.timerid = setInterval(
                                                    function() {

                                                                                apputils.timeremain = apputils.timeremain -1;
                                                                                if (apputils.timeremain > 60)
                                                                                {
                                                                                    $("#divremtime").html(view.smallbadge("green",
                                                                                                                    apputils.sec2HMS(apputils.timeremain), ''));
                                                                                }
                                                                                else
                                                                                {
                                                                                    $("#divremtime").html(view.smallbadge("red",
                                                                                                                    apputils.sec2HMS(apputils.timeremain), ''));
                                                                                }
                                                                                if (apputils.timeremain == 0)
                                                                                {
                                                                                    model.submitanswers();
                                                                                    clearInterval(apputils.timerid);
                                                                                }

                                                                     }, //end of interval function
                                                                1000
                        ); //end of setInterval
                       $("#name-rightbadge").data("oexam", resp);
                       $("#divqtotalol").html(resp.size);
                        $("#divqnoflash").html($("#name-rightbadge").data("oexam").questionno + 1);
                        $("#name-rightbadge").data("oexofferingid", par_offeringid);
                    }
                });
            }

            model.saveqanswer = function()
            {
                var answer = $("#cboqanswer").val();
                var examid = $("#name-rightbadge").data("oexam").questionno;

                $("#name-rightbadge")
                    .data("oexam")
                    .questions[parseInt($("#divqnoflash").html()) - 1]
                    .stuanswer = answer;

                apputils.popsuccess('Answer Saved!');


            }



             model.nextquestion = function ()
            {
                  var qsize = parseInt($("#divqtotalol").html());
                  var currentq = parseInt($("#divqnoflash").html());

                 apputils.echo('qsize' + qsize);
                 apputils.echo('currentq' + currentq);


                 if (currentq < qsize  )
                  {
                      currentq += 1;
                      $("#divqnoflash").html(currentq);

                  }
                  else
                  {
                      apputils.poperror('Last Question');
                      return;
                  }

                  $("#divqnoflash").html(currentq);
                  $("#divqtotalol").html(qsize);


                  view.combochange("cboqanswer",  $("#name-rightbadge").data("oexam").questions[currentq -1].stuanswer);

                  view.setquestionbox({
                                start_time:  $("#name-rightbadge").data("oexam").start_time,
                                end_time:  $("#name-rightbadge").data("oexam").end_time,
                                question:  $("#name-rightbadge").data("oexam").questions[currentq - 1].question,
                                a: $("#name-rightbadge").data("oexam").questions[currentq - 1].a,
                                b: $("#name-rightbadge").data("oexam").questions[currentq - 1].b,
                                c: $("#name-rightbadge").data("oexam").questions[currentq - 1].c,
                                d: $("#name-rightbadge").data("oexam").questions[currentq - 1].d
                       });



            }

            model.previousquestion = function ()
            {
                   var qsize = parseInt($("#divqtotalol").html());
                  var currentq = parseInt($("#divqnoflash").html());

                 apputils.echo('qsize' + qsize);
                 apputils.echo('currentq' + currentq);


                  if (currentq >  1)
                  {
                      currentq -= 1;
                      $("#divqnoflash").html(currentq);
                  }
                  else
                  {
                      apputils.poperror('Beginning Question!');
                      return;
                  }

                  view.combochange("cboqanswer",  $("#name-rightbadge").data("oexam").questions[currentq -1].stuanswer);
                  view.setquestionbox({
                                start_time:  $("#name-rightbadge").data("oexam").start_time,
                                end_time:  $("#name-rightbadge").data("oexam").end_time,
                                question:  $("#name-rightbadge").data("oexam").questions[currentq-1].question,
                                a: $("#name-rightbadge").data("oexam").questions[currentq-1].a,
                                b: $("#name-rightbadge").data("oexam").questions[currentq-1].b,
                                c: $("#name-rightbadge").data("oexam").questions[currentq-1].c,
                                d: $("#name-rightbadge").data("oexam").questions[currentq-1].d
                       });



            }


            model.submitanswers = function()
            {
                par_btnid = 'btnsubmitq';
                par_btnname = "Submit";
                var n = parseInt($("#name-rightbadge").data("oexam").size);

                var stuanswers = Array(n);

                for (var i=0; i < n; i++)
                {
                       index = $("#name-rightbadge").data("oexam").questions[i].itemnoq  - 1;
                       answer = $("#name-rightbadge").data("oexam").questions[i].stuanswer.replace('--', '-');

                       stuanswers[index] = answer;

                }
                textanswers = stuanswers.toString().replace(/\,/g,'');
                apputils.echo(textanswers);

                /*
                    token = params["token"]
                    group = params["group"]
                    sectioncode = params["sectioncode"]
                    answers = params["answers"]
                    quarter = params["quarter"]
                    schoolid = params["schoolid"]
                 */


                model.ajaxCall({
                    resource: "exam/students/me/answer",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            sectioncode: $("#name-rightbadge").data("oexofferingid"),
                            answers: textanswers,
                            quarter: $("#name-rightbadge").data("quarter"),
                            schoolid: $("#name-rightbadge").data("schoolid")

                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror("An unexpected Error Occured!");
                        view.showanswers(textanswers);
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       if (resp.status == 'error')
                       {
                           view.showanswers(textanswers);
                           apputils.poperror(resp.message);
                           return;
                       }

                       apputils.popsuccess("The result is " + resp.score + "/" + textanswers.length.toString());
                       clearInterval(apputils.timerid);
                       model.getmyexamsubjects();
                    }
                });

            }

            function addtblpricipalsaisa(resp)
            {
                var loc_body = '';
                        for (var i=0; i < resp.totalschools; i ++)
                        {
                             apputils.echo(i);
                             apputils.echo(resp);
                             apputils.echo('---');
                             tid = $.sha1(resp.submissions[i].principalid);
                             var colorize;
                             var rating = resp.submissions[i].rating;
                             if (rating.indexOf('(HP)') != -1)
                             {
                                 colorize = view.smallbadge('green', rating);
                             }
                             else if (rating.indexOf('(P)') != -1)
                             {
                                 colorize = view.smallbadge('blue', rating);
                             }
                             else if (rating.indexOf('(B)') != -1)
                             {
                                 colorize = view.smallbadge('aqua', rating);
                             }
                             else if (rating.indexOf('(BB)') != -1)
                             {
                                 colorize = view.smallbadge('yellow', rating);
                             }
                             else if (rating.indexOf('(NO)') != -1)
                             {
                                 colorize = view.smallbadge('red', rating);
                             }
                             else if (rating.indexOf('(NR)') != -1)
                             {
                                 colorize = view.smallbadge('gray', rating);
                             }


                             //resp.submissions[i].principalname
                             loc_body +=  view.composerow(
                                 [
                                     apputils.itempicsetting(resp.submissions[i].pic),
                                     view.buttonact("default btn-flat btn-sm", resp.submissions[i].principalname,
                                         "view.encodeaisa('btnencodeaisa"+tid+"', '"+
                                         resp.submissions[i].principalid + "'"+
                                         ",'" + resp.submissions[i].schoolid + "','" +
                                         resp.submissions[i].pic +
                                         "', '" +
                                         resp.submissions[i].schoolname +
                                          "', '" +
                                         resp.submissions[i].principalname +
                                         "', '" +
                                         resp.submissions[i].nrating.toString()
                                         +"', '" +
                                         resp.submissions[i].details
                                         +"', '" +
                                         resp.submissions[i].remarks
                                         +"')",
                                         "btnencodeaisa" + tid),
                                     view.centerize(resp.submissions[i].schoolid),
                                     resp.submissions[i].schoolname,
                                     view.centerize(colorize),
                                     view.buttonact("default btn-flat btn-sm", "Details",
                                         "view.encodeaisa('btnencodeaisa"+tid+"', '"+
                                         resp.submissions[i].principalid + "'"+
                                         ",'" + resp.submissions[i].schoolid + "','" +
                                         resp.submissions[i].pic +
                                         "', '" +
                                         resp.submissions[i].schoolname +
                                          "', '" +
                                         resp.submissions[i].principalname +
                                         "', '" +
                                         resp.submissions[i].nrating.toString()
                                         +"', '" +
                                         resp.submissions[i].details
                                         +"', '" +
                                         resp.submissions[i].remarks
                                         +"')",
                                         "btnencodeaisa" + tid)
                                 ]
                             );

                        }

                        $("#tblmonprincipallist > tbody").append(loc_body);
            }

            model.principalmonitoringisp = function (par_btnid, par_btnname)
            {
                model.ajaxCall({
                    resource: "aisa",
                    data:{
                            token:$("#name-rightbadge").data("token"),
                            group:$("#name-rightbadge").data("usertype"),
                            semid: $("#name-rightbadge").data("semid")
                        },
                    type: "GET",
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                        apputils.poperror('Internet Connection is out! \n But you can still encode ratings for the principals.\n Do not refresh this site.');
                        view.principalmonitoringisp('offline');
                        prin = apputils.ifundefined(
                                    $("#name-rightbadge")
                                        .data('principals'),
                                    $("#name-rightbadge")
                                        .data('principals'),
                                    []
                                );
                        addtblpricipalsaisa({
                            totalschools: prin.length,
                            submissions: prin
                        });
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        $("#tblmonprincipallist").find("tr:gt(0)").remove();

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            apputils.filltimeline();
                            return;
                        }

                        if (resp.totalschools == 0)
                        {
                            apputils.poperror('No School has been assigned\n to your region yet.');
                            apputils.filltimeline();
                            return;
                        }

                        view.principalmonitoringisp();

                        //$("#name-rightbadge").data("isqs", ['asd','asd']);// resp.isqs);

                        $("#name-rightbadge").data('isqs', resp.isqs);
                        $("#name-rightbadge").data('principals', resp.submissions);
                        addtblpricipalsaisa(resp);

                    }
                 });
            }

            model.saveisqrating = function (par_personid)
            {
                par_btnid = 'btnsaveisq';
                par_btnname = 'Save';

                var isqs = $("#name-rightbadge").data("isqs");
                var ratings = '';
                for (var i = 0; i < isqs.length; i++)
                {
                    if (!isqs[i].bold)
                    {
                        var index = isqs[i].item.replace(/\./g, '');
                        ratings += $("#cboisaitem" + index).val() + ",";
                    }

                }

                ratings += $("#taRemarksisqs").val();

                $('#name-rightbadge').data(par_personid, ratings);

                model.ajaxCall({
                    resource:'aisa',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid: $("#name-rightbadge").data("semid"),
                        ratings: $("#name-rightbadge").data(par_personid),
                        principalid: par_personid
                    }),
                    type:"POST",
                    dataType: 'json',
                    buttonid:par_btnid,
                    buttonlabel:par_btnname,
                    error: function (e)
                    {
                        apputils.poperror('Internet Connection is out! \n Storing ratings in your browser,\n try saving later!\n DO NOT REFRESH!');
                        },
                    success: function (resp)
                    {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        //$("#name-rightbadge").removeData(par_personid);
                        model.principalmonitoringisp(par_btnid, par_btnname);


                    }

                });
            }

            model.publishisqrating = function (par_personid)
            {
                par_btnid = "btnpublishisq";
                par_btnname = "Publish";
                model.ajaxCall({
                    resource:'aisa/publish',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid: $("#name-rightbadge").data("semid"),
                        principalid: par_personid
                    }),
                    type:"PUT",
                    dataType: 'json',
                    buttonid:par_btnid,
                    buttonlabel:par_btnname,
                    error: function (e)
                    {
                        apputils.poperror('Internet Connection is out! \n Try publishing later.');
                        },
                    success: function (resp)
                    {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }

                        apputils.popsuccess("Principal Evaluation is successfully published!")

                    }

                });
            }

            model.getprincipalevaluation = function ()
            {
                model.ajaxCall({
                    resource: "aisa/publish",
                    type: "GET",
                    data: {
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        semid: $("#name-rightbadge").data("semid")
                    },
                    dataType: "json",
                    buttonid: '',
                    buttonlabel: '',
                    error: function (e) {
                        apputils.echo(e);
                        $("#main").html(view.excolumn(12,view
                                .simplebox({
                                    boxtype:"info",
                                    title:"Instructional Supervisory Tool for School Heads",
                                    body:"<h3>Cannot connect to Server!<h3>",
                                    footer:"Please please check internet connection."
                                })))
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                            $("#main").html(view.excolumn(12,view
                                .simplebox({
                                    boxtype:"info",
                                    title:"Instructional Supervisory Tool for School Heads",
                                    body:"<h3>" + resp.message + "<h3>",
                                    footer:"Please consult proper authority."
                                })));
                            return;
                        }
                        //do something here
                        $("#name-rightbadge").data('isqs', resp.isqs);

                        view.displayprinceval(
                            resp.ratedby,
                            resp.publishedby,
                            resp.overall,
                            resp.overalldetails,
                            resp.ratingdetails,
                            resp.interp
                        );

                    }
                });
            }

            model.forwardtline = function (
                                                par_name, par_tltype,
                                                par_tldate, par_msg, par_picsrc,
                                                par_btnid
                                            )
            {
                loc_message = '<br/>Forwarded  ';

                if (par_msg.substring(0, 8) == 'You have')
                {
                    loc_message += ' from ' + par_name;
                }

                loc_message += ' last ' + par_tldate + ':<br/>' + par_msg;

                model.ajaxCall(
                    {
                        resource: 'forward',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(
                            {
                                schoolid:$("#name-rightbadge").data("schoolid"),
                                semid:$("#name-rightbadge").data("semid"),
                                message: loc_message,
                                token:$("#name-rightbadge").data("token"),
                                group: $("#name-rightbadge").data("usertype"),
                                tltype: par_tltype,
                                vroomid: $("#name-rightbadge").data("virtualroomid"),
                                name: $("#name-rightbadge").data("personname")
                            }),
                        buttonid: par_btnid,
                        buttonlabel: "Forward",
                        error: function (e)
                        {
                            apputils.poperror('Error Occured!')
                        },
                        success: function (resp)
                        {
                            apputils.echo(resp);
                            if (resp.status.toUpperCase() != 'OK')
                            {
                                apputils.poperror(resp.message);
                            }

                            apputils.popsuccess('Forward Successful.');
                            apputils.filltimeline();
                        }

                    }
                );
            }

            function populatecomments(par_comments, par_elid,
                                        par_initiator,
                                        par_receiver,
                                        par_timeline_ts,
                                        par_offset
                                      )
            {
                      for (var i=0; i < par_comments.size; i ++)
                            {

                                $("#lstcomments" + par_elid).append(
                                    view.boxcomment(
                                        par_comments.comments[i].src,
                                        par_comments.comments[i].byfullname,
                                        par_comments.comments[i].time,
                                        par_comments.comments[i].comment,
                                        par_comments.comments[i].id
                                    )

                                )
                            }

                            $("#lstcomments" + par_elid).append(
                              view.lastitempbox(
                                        par_initiator,
                                        par_receiver,
                                        par_timeline_ts,
                                        par_elid,
                                        par_offset + 3
                                    )
                            );

            }

            function populatereactions(par_reactions, par_elid)
            {


                           $("#lblreactok" + par_elid).html(par_reactions.ok);
                           $("#lblreacthappy" + par_elid).html(par_reactions.happy);
                           $("#lblreactsurprised" + par_elid).html(par_reactions.surprised);
                           $("#lblreactsad" + par_elid).html(par_reactions.sad);
                           $("#lblreactangry"+ par_elid).html(par_reactions.angry);
            }

            model.postcomment = function (
                                                par_initiator, par_receiver,
                                                par_timeline_ts,
                                                par_elid
                                            )
            {
                if ($("#tacomment" + par_elid).val().replace(/ /g, '').length == 0)
                {
                        apputils.poperror('Cannot proceed, comment is empty!');
                        return;
                }

                var files = '';
                var fileid = 'lblfilesattachmentfiles' + par_elid;

                if ($("#" + fileid).html() !== 'undefined')
                {
                    files = $("#" + fileid).html();
                }




                model.ajaxCall(
                    {
                        resource: 'comment',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(
                            {
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    initiatorid: par_initiator,
                                    receiverid: par_receiver,
                                    timelinets: par_timeline_ts,
                                    comment:$("#tacomment" + par_elid).val() +
                                        apputils.newline() +
                                        files,
                                    vroomid: $("#name-rightbadge").data("virtualroomid"),
                                    notif_msg: $("#tacomment" + par_elid).val()
                            }),
                        buttonid: 'btncomment' + par_elid,
                        buttonlabel: "Post",
                        error: function (e)
                        {
                            apputils.poperror('Error Occured!')
                        },
                        success: function (resp)
                        {
                            apputils.echo(resp);
                            if (resp.status.toUpperCase() != 'OK')
                            {
                                apputils.poperror(resp.message);
                            }
                            $("#tacomment" + par_elid).val("");
                            $("#lstcomments" + par_elid).html('');

                            populatecomments(
                                resp.comments,
                                par_elid,
                                par_initiator,
                                par_receiver,
                                par_timeline_ts,
                                0);

                            populatereactions(resp.reactions,
                                par_elid);

                        }

                    }
                );
            }

             model.getcomment = function (
                                                par_initiator, par_receiver,
                                                par_timeline_ts,
                                                par_elid, par_offset, par_btnlabel,
                                                par_btnid
                                            )
            {

                model.ajaxCall(
                    {
                        resource: 'comment',
                        type: "GET",
                        dataType: 'json',
                        data:
                            {
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    initiatorid: par_initiator,
                                    receiverid: par_receiver,
                                    timelinets: par_timeline_ts,
                                    offset: par_offset
                            },
                        buttonid: par_btnid + par_elid,
                        buttonlabel: par_btnlabel,
                        error: function (e)
                        {
                            apputils.poperror('Error Occured!')
                        },
                        success: function (resp)
                        {
                            apputils.echo(resp);
                            if (resp.size == 0)
                            {
                                return;
                            }
                            if (resp.status.toUpperCase() != 'OK')
                            {
                                apputils.poperror(resp.message);
                            }

                            $("#divgforbtn" + par_elid).remove();

                            //$("#lstcomments" + par_elid).html('');

                            if (par_offset == 0)
                            {
                                $("#lstcomments" + par_elid).html('');
                            }


                           /* for (var i=0; i < resp.size; i ++)
                            {

                                $("#lstcomments" + par_elid).append(
                                    view.boxcomment(
                                        resp.comments[i].src,
                                        resp.comments[i].byfullname,
                                        resp.comments[i].time,
                                        resp.comments[i].comment,
                                        resp.comments[i].id
                                    )

                                )
                            }

                            $("#lstcomments" + par_elid)
                                .append(
                                    view.lastitempbox(
                                        par_initiator,
                                        par_receiver,
                                        par_timeline_ts,
                                        par_elid,
                                        (parseInt(par_offset) + 3).toString()
                                    )
                                );//append
                            */
                           populatecomments(
                                resp.comments,
                                par_elid,
                                par_initiator,
                                par_receiver,
                                par_timeline_ts,
                                par_offset
                               );

                           populatereactions(resp.reactions,
                                par_elid);


                        }

                    }
                );
            }

            model.postreaction = function (
                                                par_initiator, par_receiver,
                                                par_timeline_ts,
                                                par_elid, par_reactionid,
                                                par_btnlabel
                                            )
            {
                var loc_btnid = "btnreact" + par_elid + par_reactionid;
                model.ajaxCall(
                    {
                        resource: 'reaction',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(
                            {
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    initiatorid: par_initiator,
                                    receiverid: par_receiver,
                                    timelinets: par_timeline_ts,
                                    reaction: par_reactionid,
                                    vroomid: $("#name-rightbadge").data("virtualroomid"),
                                    personname: $("#name-rightbadge").data("personname")
                                   
                            }),
                        buttonid: loc_btnid,
                        buttonlabel: par_btnlabel,
                        error: function (e)
                        {
                            apputils.poperror('Error Occured!')
                        },
                        success: function (resp)
                        {
                            apputils.echo(resp);
                            if (resp.status.toUpperCase() != 'OK')
                            {
                                apputils.poperror(resp.message);
                            }

                            for (var i=1; i <= 5; i ++)
                            {
                                            //remove color and switch back to default
                                $("#btnreact" + par_elid + i.toString())
                                    .removeClass('btn-info')
                                    .addClass('btn-default')
                            }

                            $("#lstcomments" + par_elid).html('');

                            populatecomments(
                                resp.comments,
                                par_elid,
                                par_initiator,
                                par_receiver,
                                par_timeline_ts);

                            populatereactions(resp.reactions,
                                par_elid);

                            $("#" + loc_btnid)
                                .removeClass('btn-default')
                                .addClass('btn-info');

                        }

                    }
                );
            }

            model.posthelpaccess = function (par_helptype, par_helpfcn, par_btnid, par_btnlabel)
            {
                model.ajaxCall(
                    {
                        resource: 'help',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(
                            {
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    helptype: par_helptype
                            }),
                        buttonid: par_btnid,
                        buttonlabel: par_btnlabel,
                        error: function (e)
                        {
                            apputils.poperror('Error Occured!')
                        },
                        success: function (resp)
                        {
                            apputils.echo(resp);
                            if (resp.status.toUpperCase() != 'OK')
                            {
                                apputils.poperror(resp.message);
                            }

                           par_helpfcn();

                        }

                    }
                );
            }


            model.getlevprofteacher = function (par_this)
            {
                par_btnid = '';
                par_btnlabel = '';
                $(par_this).html(view.spin() + " Pls Wait..");
                 model.ajaxCall(
                    {
                        resource: 'gradebook/report/levprof/teacher',
                        type: "GET",
                        dataType: 'json',
                        data:
                            {
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    offeringid: $("#name-rightbadge").data("sectionid"),
                                    quarter: $("#name-rightbadge").data("quarter")

                            },
                        buttonid: par_btnid,
                        buttonlabel: par_btnlabel,
                        error: function (e)
                        {
                            $(par_this).html("Level of Proficiency");
                            apputils.poperror('Error Occured!')
                        },
                        success: function (resp)
                        {
                            apputils.echo(resp);

                            if (resp.status.toUpperCase() != 'OK')
                            {
                                apputils.poperror(resp.message);
                                $(par_this).html("Level of Proficiency");
                                return;
                            }
                            $("#tablevelproficiency").bootstrapTable('removeAll');

                            var tabcontents = [];

                            //proflevel
                            //studentscount

                            tabcontents.push({proflevel:'Did Not Meet Expectations', studentscount:resp.beginning});
                            tabcontents.push({proflevel:'Fairly Satisfactory', studentscount:resp.developing});
                            tabcontents.push({proflevel:'Satisfactory', studentscount:resp.approaching_proficiency});
                            tabcontents.push({proflevel:'Very Satisfactory', studentscount:resp.proficient});
                            tabcontents.push({proflevel:'Outstanding', studentscount:resp.advance});


                            $("#tablevelproficiency").bootstrapTable('append', tabcontents);
                            $(par_this).html("Level of Proficiency");

                        }

                    }
                );
            }

             model.getlevperfprincipal = function()
             {
                 par_btnid = "btngetsubjcoord";
                 par_btnlabel = "OK";

                 model.ajaxCall(
                    {
                        resource: 'gradebook/report/levprof/principal',
                        type: "GET",
                        dataType: 'json',
                        data:
                            {
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    subject: $("#cbosubjects").val(),
                                    level: $("#cbogrdlevel").val(),
                                    schoolid: $("#name-rightbadge").data("schoolid"),
                                    quarter: $("#cboquarter").val(),
                                    semid: $("#name-rightbadge").data("semid")
                            },
                        buttonid: par_btnid,
                        buttonlabel: par_btnlabel,
                        error: function (e)
                        {
                            apputils.zeroreturn("perfdonutcontainer","Error Occured!");
                        },
                        success: function (resp)
                        {
                            apputils.echo(resp);

                            $("#tablevelproficiency").bootstrapTable('removeAll');
                            if (resp.status.toUpperCase() != 'OK')
                            {
                                apptuils.zeroreturn("perfdonutcontainer",resp.message);
                                return;
                            }

                            if (resp.size == 0)
                            {
                                apputils.zeroreturn("perfdonutcontainer","No Available Data.");
                                return;
                            }

                            var tabcontents = [];
                            var piecontents = [];
                            var beginning= 0;
                            var developing = 0;
                            var approaching_proficiency = 0;
                            var proficient = 0;
                            var advance = 0;

                            //proflevel
                            //studentscount

                            for (var i = 0; i < resp.size; i++)
                            {
                                /*
                                {
                                  "section": "GUAVA",
                                  "beginning": 0,
                                  "developing": 2,
                                  "approaching_proficiency": 15,
                                  "proficient": 28,
                                  "advance": 4
                                }
                                 */

                                beginning += resp.proflevels[i].beginning;
                                developing += resp.proflevels[i].developing;
                                approaching_proficiency += resp.proflevels[i].approaching_proficiency;
                                proficient += resp.proflevels[i].proficient;
                                advance += resp.proflevels[i].advance;

                                tabcontents.push({
                                    section:resp.proflevels[i].section,
                                    beginning: resp.proflevels[i].beginning,
                                    developing: resp.proflevels[i].developing,
                                    approaching_proficiency: resp.proflevels[i].approaching_proficiency,
                                    proficient: resp.proflevels[i].proficient,
                                    advance: resp.proflevels[i].advance
                                });
                            }

                            tabcontents.push(
                                {
                                    section:"TOTAL",
                                    beginning: beginning,
                                    developing: developing,
                                    approaching_proficiency: approaching_proficiency,
                                    proficient: proficient,
                                    advance: advance
                                });


                            result = apputils.topercentage([beginning, developing, approaching_proficiency, proficient, advance]);
                            /*
                            piecontents.push(
                                  {
                                     value: result[0],
                                     color: "#f56954",
                                     highlight: "#f56954",
                                     label: "Did Not Meet Expectations"
                                  },
                                 {
                                     value: result[1],
                                     color: "#00a65a",
                                     highlight: "#00a65a",
                                     label: "Fairly Satisfactory"
                                 },
                                {
                                     value: result[2],
                                     color: "#f39c12",
                                     highlight: "#f39c12",
                                     label: "Satisfactory"
                                },
                                {
                                     value: result[3],
                                     color: "#00c0ef",
                                     highlight: "#00c0ef",
                                     label: "Very Satisfactory"
                                },
                                {
                                    value: result[4],
                                    color: "#3c8dbc",
                                    highlight: "#3c8dbc",
                                    label: "Outstanding"
                                }
                                ); */


                            $("#tablevelproficiency").bootstrapTable('append', tabcontents);
                            //apputils.plotgraph("perfdonutcontainer",piecontents);
                           apputils.plotperfbardata("perfdonutcontainer", result);
                        }

                    }
                );

             }


              model.submitlevelprofreport = function ()
            {
                var loc_btnid = "btnsubmitperflevel";
                var par_btnlabel = "Submit";

                model.ajaxCall(
                    {
                        resource: 'gradebook/report/levprof/principal/submit',
                        type: "POST",
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(
                            {
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    subject: $("#cbosubjects").val(),
                                    level: $("#cbogrdlevel").val(),
                                    schoolid: $("#name-rightbadge").data("schoolid"),
                                    quarter: $("#cboquarter").val(),
                                    semid: $("#name-rightbadge").data("semid")
                            }),
                        buttonid: loc_btnid,
                        buttonlabel: par_btnlabel,
                        error: function (e)
                        {
                            apputils.poperror('Error Occured!')
                        },
                        success: function (resp)
                        {
                            apputils.echo(resp);
                            if (resp.status.toUpperCase() != 'OK')
                            {
                                apputils.poperror(resp.message);
                                return;
                            }
                            apputils.popsuccess("Report submitted.");
                        }

                    }
                );
            }

            model.changequartersuper10 = function (par_btnid, fcn)
            {
                $("#name-rightbadge").data("quarter", par_btnid);
                $("#bxquarter .box-body").html(
                            view.centerize(
                                view.setbtnsquartersuper10($("#name-rightbadge").data("fcnname"))
                            )
                );
                fcn();
            }


            model.getgenimpression = function ()
            {


                $("#perfdonutcontainer1").html(view.boxloading());
                $("#perfdonutcontainer2").html(view.boxloading());
                $("#perfdonutcontainer3").html(view.boxloading());
                $("#mathcoverage").html("");
                $("#sciencecoverage").html("");
                $("#englishcoverage").html("");

                 model.ajaxCall(
                    {
                        resource: 'dashboard/impression',
                        type:'GET',
                        data: {
                            token: $("#name-rightbadge").data("token"),
                            group: $("#name-rightbadge").data("usertype"),
                            semid:$("#name-rightbadge").data("semid"),
                            quarter: $("#name-rightbadge").data("quarter")

                        },
                        dataType:'json',
                        buttonid:'mnusuper10dboard',
                        buttonlabel:'Dashboard',
                        error: function (e) {
                            apputils.poperror(e);
                        },
                        success: function(resp)
                        {
                            apputils.echo(resp);

                            if (resp.status != 'OK')
                            {
                                apputils.poperror(resp.status);

                                return;
                            }

                            $("#perfdonutcontainer1").html("");
                            $("#perfdonutcontainer2").html("");
                            $("#perfdonutcontainer3").html("");

                            piecontents1 = [];
                            piecontents2 = [];
                            piecontents3 = [];
                            apputils.echo(resp.ENG);
                            apputils.echo(resp.MATH);
                            apputils.echo(resp.SCI);
                            $("#name-rightbadge").data("eng", resp.ENG);
                            $("#name-rightbadge").data("math", resp.MATH);
                            $("#name-rightbadge").data("sci", resp.SCI);


                            if (resp.ENG.size > 0)
                            {
                                result = apputils.topercentage([resp.ENG.beginning, resp.ENG.developing, resp.ENG.approaching_proficiency, resp.ENG.proficient, resp.ENG.advance]);
                                 piecontents3.push(
                                  {
                                     value: result[0],
                                     color: "#f56954",
                                     highlight: "#f56954",
                                     label: "Did Not Meet Expectations"
                                  },
                                 {
                                     value: result[1],
                                     color: "#00a65a",
                                     highlight: "#00a65a",
                                     label: "Fairly Satisfactory"
                                 },
                                {
                                     value: result[2],
                                     color: "#f39c12",
                                     highlight: "#f39c12",
                                     label: "Satisfactory"
                                },
                                {
                                     value: result[3],
                                     color: "#00c0ef",
                                     highlight: "#00c0ef",
                                     label: "Very Satisfactory"
                                },
                                {
                                    value: result[4],
                                    color: "#3c8dbc",
                                    highlight: "#3c8dbc",
                                    label: "Outstanding"
                                }
                                );
                                $("#englishcoverage").html(resp.ENG.size.toString() + apputils.space(3) + "students.")
                                //apputils.plotgraph("perfdonutcontainer3",piecontents3);
                                 apputils.plotperfbardata("perfdonutcontainer3", result);
                            }
                            else
                            {
                                $("#englishcoverage").html("0" + apputils.space(3) + "student.")
                                /*
                                {
                                     value: resp.ENG.beginning,
                                     color: "#f56954",
                                     highlight: "#f56954",
                                     label: "Beginning"
                                  }
                                  apputils.plotgraph("perfdonutcontainer3",piecontents3);
                                 */
                                $("#perfdonutcontainer3").html("None so far.");
                            }



                             if (resp.SCI.size > 0)
                            {
                                result = apputils.topercentage([resp.SCI.beginning, resp.SCI.developing, resp.SCI.approaching_proficiency, resp.SCI.proficient, resp.SCI.advance]);

                                piecontents2.push(
                                  {
                                     value: result[0],
                                     color: "#f56954",
                                     highlight: "#f56954",
                                     label: "Did Not Meet Expectations"
                                  },
                                 {
                                     value: result[1],
                                     color: "#00a65a",
                                     highlight: "#00a65a",
                                     label: "Fairly Satisfactory"
                                 },
                                {
                                     value: result[2],
                                     color: "#f39c12",
                                     highlight: "#f39c12",
                                     label: "Satisfactory"
                                },
                                {
                                     value: result[3],
                                     color: "#00c0ef",
                                     highlight: "#00c0ef",
                                     label: "Very Satisfactory"
                                },
                                {
                                    value: result[4],
                                    color: "#3c8dbc",
                                    highlight: "#3c8dbc",
                                    label: "Outstanding"
                                }
                                );
                                $("#sciencecoverage").html(resp.SCI.size.toString() + apputils.space(3) + "students.");
                                //apputils.plotgraph("perfdonutcontainer2",piecontents2);
                                apputils.plotperfbardata("perfdonutcontainer2", result);
                            }
                             else
                             {
                                 $("#sciencecoverage").html("0" + apputils.space(3) + "student.");
                                 $("#perfdonutcontainer2").html("None so far.");
                             }


                             if (resp.MATH.size > 0)
                            {
                                result = apputils.topercentage([resp.MATH.beginning, resp.MATH.developing, resp.MATH.approaching_proficiency, resp.MATH.proficient, resp.MATH.advance]);
                                 piecontents1.push(
                                  {
                                     value: result[0],
                                     color: "#f56954",
                                     highlight: "#f56954",
                                     label: "Did Not Meet Expectations"
                                  },
                                 {
                                     value: result[1],
                                     color: "#00a65a",
                                     highlight: "#00a65a",
                                     label: "Fairly Satisfactory"
                                 },
                                {
                                     value: result[2],
                                     color: "#f39c12",
                                     highlight: "#f39c12",
                                     label: "Satisfactory"
                                },
                                {
                                     value: result[3],
                                     color: "#00c0ef",
                                     highlight: "#00c0ef",
                                     label: "Very Satisfactory"
                                },
                                {
                                    value: result[4],
                                    color: "#3c8dbc",
                                    highlight: "#3c8dbc",
                                    label: "Outstanding"
                                }
                                );
                                $("#mathcoverage").html(resp.MATH.size.toString() + apputils.space(3) + "students.")
                                 //apputils.plotgraph("perfdonutcontainer1",piecontents1);
                                apputils.plotperfbardata("perfdonutcontainer1", result);
                            }
                            else
                            {
                                $("#mathcoverage").html("0" + apputils.space(3) + "student.");
                                $("#perfdonutcontainer1").html("None so far.");
                            }


                        }
                    }
                )
            }


            model.impressiondetails = function (par_subject)
            {

                view.genimpressiondetails();
                $("#boxtitledetails").html(par_subject);
                view.combochange("cbosubjects", par_subject);
                apputils.echo($("#name-rightbadge").data(par_subject.toLowerCase()));
                view.visualset($("#name-rightbadge").data(par_subject.toLowerCase()));

                model.perfdetailsfetch();

            }

            model.perfdetailsfetch = function ()
            {

                $("#datasrcdetails").html(view.boxloading());
                        model.ajaxCall(
                    {
                        resource: 'dashboard/impression/details',
                        type:'GET',
                        data: {
                            token: $("#name-rightbadge").data("token"),
                            group: $("#name-rightbadge").data("usertype"),
                            semid:$("#name-rightbadge").data("semid"),
                            quarter: $("#name-rightbadge").data("quarter"),
                            subject: $("#cbosubjects").val(),
                            gradelevel:$("#cbogrdlevel").val()

                        },
                        dataType:'json',
                        buttonid:'mnusuper10dboard',
                        buttonlabel:'Dashboard',
                        error: function (e) {
                            apputils.poperror(e);
                        },
                        success: function(resp) {
                            apputils.echo(resp);
                            view.visualset(resp.details);

                            elements = [];
                            for (var i=0; i< resp.district_size; i++)
                            {
                                   result = [
                                                                    resp.districtdetails[i].beginning,
                                                                    resp.districtdetails[i].developing,
                                                                    resp.districtdetails[i].approaching_proficiency,
                                                                    resp.districtdetails[i].proficient,
                                                                    resp.districtdetails[i].advance
                                                                    ];
                                    elements.push(
                                        {
                                            parent: "acddatasource",
                                            href: 'district' + (i+1).toString(),
                                            accordtitle: resp.districtdetails[i].district,
                                            body:
                                                view.exrow(

                                                    view.excolumn(12,
                                                        view.centerize(
                                                          function () {

                                                              if (resp.districtdetails[i].supervisor.size > 0)
                                                              {
                                                                   name = resp.districtdetails[i].supervisor.fullname;
                                                                   imgsrc = resp.districtdetails[i].supervisor.picsrc;
                                                                   apputils.echo(imgsrc);
                                                                   left = "";
                                                                   middle = '<h5 class="description=header">'+resp.districtdetails[i].supervisor.position+'</h5>';
                                                                   right = "";
                                                                   id = ""

                                                              }
                                                              else
                                                              {
                                                                  name = 'NOT ASSIGNED';
                                                                  imgsrc = "/static/dist/img/soon.jpg";
                                                                  left = "";
                                                                  middle = "";
                                                                  right = "";
                                                                  id = '';
                                                              }
                                                             return view.socialbadgecustom(
                                                                 {
                                                                      name:name,
                                                                      color: "bg-yellow",
                                                                      id:id,
                                                                      badgeid:i.toString(),
                                                                      imgsrc: imgsrc,
                                                                      left: left,
                                                                      middle: middle,
                                                                      right: right
                                                                 }
                                                             )
                                                          }()
                                                        )
                                                    )

                                                ) +


                                                view.exrow(
                                                view.excolumn(2,view
                                                        .boxnoprogress({color :"red",
                                                            icon:"fa fa-thumbs-o-up",
                                                            header:"Did Not Meet Expectations",
                                                            content:result[0],
                                                            idh:"boxbeg" +i.toString(),
                                                            idh2:"boxbegcount" + i.toString(),
                                                            boxid:"beg" + i.toString()}
                                                            )
                                                    ) +
                                                    view.excolumn(2,view
                                                        .boxnoprogress({color :"green",
                                                            icon:"fa fa-hand-pointer-o",
                                                            header:"Fairly Satisfactory",
                                                            content:result[1],
                                                            idh:"boxdev" +i.toString(),
                                                            idh2:"boxdevcount" + i.toString(),
                                                            boxid:"dev" + i.toString()}
                                                            )
                                                    ) +

                                                    view.excolumn(2,view
                                                            .boxnoprogress({color :"yellow",
                                                                icon:"fa fa-bookmark-o",
                                                                header:"Satisfactory",
                                                                content:result[2],
                                                                idh:"boxapro" +i.toString(),
                                                                idh2:"boxaprocount" + i.toString(),
                                                                boxid:"apro" + i.toString()}
                                                                )
                                                        ) +

                                                    view.excolumn(2,view
                                                                .boxnoprogress({color :"aqua",
                                                                    icon:"fa fa-flag-o",
                                                                    header:"Very Satisfactory",
                                                                    content:result[3],
                                                                    idh:"boxprof" +i.toString(),
                                                                    idh2:"boxprofcount" + i.toString(),
                                                                    boxid:"prof" + i.toString()}
                                                                    )
                                                            ) +
                                                  view.excolumn(2,view
                                                                .boxnoprogress({color :"light-blue",
                                                                    icon:"fa fa-star-o",
                                                                    header:"Outstanding",
                                                                    content:result[4],
                                                                    idh:"boxadv" +i.toString(),
                                                                    idh2:"boxadvcount" + i.toString(),
                                                                    boxid:"adv" + i.toString()}
                                                                    )
                                                            ) +
                                                 view.excolumn(2,view
                                                                .boxnoprogress({color :"gray",
                                                                    icon:"fa fa-pie-chart",
                                                                    header:"Coverage",
                                                                    content:resp.districtdetails[i].size + " students.",
                                                                    idh:"boxcov" +i.toString(),
                                                                    idh2:"boxcovcount" + i.toString(),
                                                                    boxid:"cov" + i.toString()}
                                                                    )
                                                            )
                                                         ) +
                                            view.exrow(
                                                view.excolumn(12,
                                                  view.centerize(
                                                        view.buttonact(
                                                            "success",
                                                            "View Schools",
                                                            " model.perfdetailsfetchdistrict('" + resp.districtdetails[i].district+"', " + i.toString() + ")",
                                                            "btnfetch" + i.toString())
                                                  )
                                                )
                                            ) +
                                                apputils.newline() +
                                                view.exrow(
                                                    view.excolumn(12,
                                                        view.table(
                                                                {
                                                                    id: "tbldistrictschools" + i.toString(),
                                                                    class: "tables-bordered",
                                                                    cols: ["",
                                                                            "Principal", "SchoolID", "School Name",
                                                                            "Did Not Meet Expectations", "Fairly Satisfactory",
                                                                            "Satisfactory",
                                                                            "Very Satisfactory", "Outstanding",
                                                                            "Coverage"
                                                                          ],
                                                                    tbodyclass: "tbodydistrictschools" + i.toString()
                                                                }
                                                            ))
                                                )
                                            , //row
                                            boxtype:"primary"
                                        }
                                        )
                            } //for
                            $("#datasrcdetails").html(
                                view.accordion({
                                         parent:"accordion",
                                         title:"Districts",
                                         elements:elements
                                         }));



                            $("#boxtitledetails").html($("#cbosubjects").val());

                        }
                    }
                    )
            }


              model.perfdetailsfetchdistrict = function (par_district, par_id) {


                  model.ajaxCall(
                      {
                          resource: 'dashboard/impression/details/district',
                          type: 'GET',
                          data: {
                              token: $("#name-rightbadge").data("token"),
                              group: $("#name-rightbadge").data("usertype"),
                              semid: $("#name-rightbadge").data("semid"),
                              quarter: $("#name-rightbadge").data("quarter"),
                              subject: $("#cbosubjects").val(),
                              gradelevel: $("#cbogrdlevel").val(),
                              district: par_district

                          },
                          dataType: 'json',
                          buttonid: 'btnfetch' + par_id,
                          buttonlabel: 'View Schools',
                          error: function (e) {
                              apputils.poperror(e);
                          },
                          success: function (resp) {
                              apputils.echo(resp);
                              apputils.resettablerows("tbldistrictschools" + par_id);

                              if (resp.status !== 'OK')
                              {
                                  apputils.poperror(resp.message);
                                  return;
                              }

                              if (resp.size == 0)
                              {
                                  apputils.poperror('No Available Data.')
                                  return;
                              }

                              rows = "";
                              for (var i =0; i < resp.size; i++)
                              {
                                  if (resp.schools[i].principal.size != 0)
                                  {
                                      picsrc = apputils.itempicsetting(resp.schools[i].principal.picsrc);
                                      pname = resp.schools[i].principal.fullname;
                                  }
                                  else
                                  {
                                      picsrc = '';
                                      pname = 'No Assigned';
                                  }
                                  rows += view.composerow([
                                      picsrc,
                                      pname,
                                      resp.schools[i].schoolid,
                                      resp.schools[i].schoolname,
                                      resp.schools[i].beginning,
                                      resp.schools[i].developing,
                                      resp.schools[i].approaching_proficiency,
                                      resp.schools[i].proficient,
                                      resp.schools[i].advance,
                                      resp.schools[i].total,
                                  ]);

                              }

                              $("#tbldistrictschools" + par_id + " > tbody").append(rows);
                          }
                      });
              }

                //REF: model.enrollsearch
                 model.retrievecardstusearch = function ()
                 {

                     if ($("#enrollsearch").val().length == 0)
                     {
                         apputils.poperror('Input a Lastname');
                         return;
                     }

                     model.ajaxCall(
                         {
                             resource: 'student/' + $("#enrollsearch").val(),
                             data: {
                                 token: $("#name-rightbadge").data("token")
                             },
                             type: "GET",
                             dataType: "json",
                             btnid: "btnerlsearch",
                             buttonlabel: "Search",
                             error: function (e) {
                                 alert(e);
                                 apputils.echo(e);
                             },
                             success: function (resp) {
                                 apputils.echo(resp);
                                 $("#erlsearchtab tbody").html("");
                                    $("#erlsearchtab tbody")
                                        .append("<tr>" +
                                            "<th> LRN No </th>" +
                                            "<th> Name </th>" +
                                            "</tr>");
                                    if (resp.status != "ok")
                                    {
                                        apputils.poperror("Something went wrong!");
                                        return;
                                    }

                                    if (resp.size == 0)
                                    {
                                        apputils.poperror("No Record!");
                                        return;
                                    }

                                    for (var i=0; i < resp.size; i++)
                                        {
                                            loc_row = '<tr>' +
                                                '<td>' +
                                                function(resp, i) {
                                                            widgt = view.buttonact(
                                                                        "success btn-xs",
                                                                        "Get Card",
                                                                        "model.retrievecardqry('" +
                                                                         resp.list[i].lrn + "','" +
                                                                        resp.list[i].fullname + "','" +
                                                                        resp.list[i].picurl + "','" +
                                                                        $("#name-rightbadge").data("schoolid") + "','" +
                                                                        "Get Card"
                                                                        + "','btngetcard" +
                                                                        resp.list[i].lrn +
                                                                        "'" +
                                                                        ")",
                                                                        'btngetcard' + resp.list[i].lrn
                                                                );

                                                    return widgt;
                                                }(resp, i) +
                                                '</td>' +
                                                '<td>' +
                                                resp.list[i].fullname +
                                                '</td>' +
                                                '</tr>';
                                                $("#erlsearchtab tbody").append(loc_row);
                                        }
                             }
                         }
                     );
                }

                model.retrievecardqry = function (par_lrn, par_name, par_picurl, par_semid, par_buttonlabel, par_buttonid)
                {
                    $(".profile-user-img").attr('src', par_picurl);
                    $(".profile-username").html(par_name);
                    $("#pboxlrn").html(par_lrn);
                  /*
                    model.ajaxCall({
                        resource: 'card/' + par_lrn + '/' + par_semid,
                        data: {
                            schoolid: $("#name-rightbadge").data("schoolid")
                        },
                        type: 'Get',
                        dataType:'json',
                        btnid:par_buttonid,
                        buttonlabel: par_buttonlabel,
                             error: function (e) {
                                 alert(e);
                                 apputils.echo(e);
                             },
                             success: function (resp)
                             {
                                apputils.echo(resp);



                             }
                    }); */
                }



                model.postbcast = function(par_btnid, par_btnlabel)
                {
                    //var roomid = apputils.roomid();

                    /*
                        semid = params["semid"] -- OK
                        level = params["level"] -- OK
                        section = params["section"]
                        schoolid = params["schoolid"] -- OK
                        group = params["group"] -- ok
                        token = params["token"] -- ok
                     */

                    model.ajaxCall(
                         {
                             resource: 'virtualroom',
                             data: JSON.stringify({
                                    schoolid:$("#name-rightbadge").data("schoolid"),
                                    semid:$("#name-rightbadge").data("semid"),
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    level:$("#name-rightbadge").data("grade"),
                                    section: $("#name-rightbadge").data("section"),
                                    name: $("#name-rightbadge").data("personname"),
                                    offid: ''
                                }),
                             contentType: "application/json; charset=utf-8",
                             type: "POST",
                             dataType: "json",
                             btnid: par_btnid,
                             buttonlabel: par_btnlabel,
                             error: function (e) {
                                 alert(e);
                                 apputils.echo(e);
                             },
                             success: function (resp)
                             {
                                    apputils.echo(resp);
                                    if (resp.status.toUpperCase() !== 'OK')
                                     {
                                         apputils.poperror(resp.message);
                                         return;
                                     }

                                    apputils.joinvideoconf(resp.virtualroomid);
                                    $("#announce").html("");
                             }
                         });
                }

                model.postsubjectbcall = function (par_btnid)
                {


                           model.ajaxCall(
                         {
                             resource: 'virtualroom',
                             data: JSON.stringify({
                                    schoolid:$("#name-rightbadge").data("schoolid"),
                                    semid:$("#name-rightbadge").data("semid"),
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    level:$("#name-rightbadge").data("grade"),
                                    section: $("#name-rightbadge").data("section"),
                                    offid: function (x) {
                                                      scode = '';
                                                      loads = $("#name-rightbadge").data("subjects");
                                                      for (i = 0; i < loads.length; i++)
                                                      {
                                                          if (loads[i].label === x)
                                                          {
                                                              return loads[i].sectionid;
                                                          }

                                                      }
                                                      return scode;
                                              }($("#selassignment").val())
                                }),
                             contentType: "application/json; charset=utf-8",
                             type: "POST",
                             dataType: "json",
                             btnid: par_btnid,
                             buttonlabel: "Start Video Conference",
                             error: function (e) {
                                 alert(e);
                                 apputils.echo(e);
                             },
                             success: function (resp)
                             {
                                    apputils.echo(resp);
                                    if (resp.status.toUpperCase() !== 'OK')
                                     {
                                         apputils.poperror(resp.message);
                                         return;
                                     }

                                    apputils.joinvideoconf(resp.virtualroomid);
                                    $("#announce").html("");
                             }
                         });
                }





                model.searchpersons = function ()
                   {
                       par_btnid = 'btnsrchteach';
                       par_btnname = 'Search';


                        model.ajaxCall({
                            resource: "person",
                            data:{
                                    token:$("#name-rightbadge").data("token"),
                                    searchkey: $("#txtpersonsearch").val()
                                },
                            type: "GET",
                            dataType: "json",
                            buttonid: "btnsrchteach",
                            buttonlabel: "Search",
                            error: function (e) {
                                apputils.poperror(e);
                            },
                            success: function (resp) {
                                apputils.echo(resp);
                                if (resp.status !== 'OK')
                                {

                                    apputils.poperror(resp.message);
                                    return;
                                }
                                //'MPS' + semid + quarter + level + ".xlsx"

                                apputils.resettablerows("tblmonteacherlist");

                                if (resp.size == 0)
                                {
                                    apputils.poperror("Your query did not returned any results.")
                                    return;
                                }

                                var loc_body = '';
                                /*
                                  "cols": [
                                              "", //picture
                                              "Full Name",
                                              "Type",
                                              "" //button personid
                                           ]
                                 */

                                for (var i = 0; i < resp.size; i++)
                                {
                                    btnid = 'btnaddcoord'+$.sha1(resp.list[i].lrn);

                                    loc_body += view.composerow([
                                        apputils.itempicsetting(resp.list[i].picurl),
                                        resp.list[i].fullname,
                                        resp.list[i].type,
                                        view.buttonact(
                                            "success btn-flat btn-xs",
                                                   "Add",
                                                   "view.putsomerow('"+resp.list[i].picurl+"','" +
                                                                  resp.list[i].fullname + "','" +
                                                                  resp.list[i].type + "','" +
                                                                  resp.list[i].pid + "')",
                                                   btnid)
                                            ]);
                                }

                                apputils.echo(loc_body);
                                //tabdetailsmonpop
                                $("#tblmonteacherlist > tbody").append(loc_body);

                            }
                         });

                   }

                   model.confinvite = function ()
                   {
                       var roomid = apputils.roomid();
                       //get rows from table retrieve
                       var person = '';
                       $('#tblerresults tr').each(
                           function() {
                                         var personID = $(this).find("td").eq(3).html(); //console.log(customerId);

                                         if ( typeof personID !== 'undefined')
                                         {
                                             person += personID + ",";
                                         }
                                    });

                        model.ajaxCall(
                        {
                            resource:'message',
                            type: 'POST',
                            data: JSON.stringify({
                                  message: "Join the  " + view.buttonact("success", "Video Conference", "model.joinvideocall('" + roomid + "')", "btnjoin" + roomid),
                                  persons: person,
                                  token: $("#name-rightbadge").data("token"),
                                  group: $("#name-rightbadge").data("usertype"),
                                  semid: $("#name-rightbadge").data("semid"),
                                  schoolid: $("#name-rightbadge").data("schoolid")
                                 }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            btnid: 'btnstartconfchosen',
                            buttonlabel: 'Start Video Conference',
                            error: function (e) {
                                     alert(e);
                                     apputils.echo(e);
                                 },
                            success: function (resp)
                                 {

                                     if (resp.status !== 'OK')
                                     {
                                         apputils.poperror(resp.message);
                                         return;
                                     }

                                        apputils.joinvideoconf(roomid);
                                 }
                        });

                   }



             model.joinvideocall = function(par_roomid)
             {
                    model.ajaxCall(
                        {
                            resource:'log',
                            type: 'POST',
                            data: JSON.stringify({
                                  message: "Joined " + par_roomid + " for Video Conference.",
                                  token: $("#name-rightbadge").data("token"),
                                  group: $("#name-rightbadge").data("usertype")
                                 }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            btnid: 'btnjoin' + par_roomid,
                            buttonlabel: 'Video Conference',
                            error: function (e) {
                                     alert(e);
                                     apputils.echo(e);
                                 },
                            success: function (resp)
                                 {

                                     if (resp.status !== 'OK')
                                     {
                                         apputils.poperror(resp.message);
                                         return;
                                     }
                                        apputils.joinvideoconfclient(par_roomid);
                                 }
                        });

             }

             model.uploadprofilepic = function (par_buttonid)
             {
                  var num_files = $('#file-input').get(0).files.length;
                              if (num_files == 0)
                              {
                                alert('No file selected');
                                return;
                              }

                            var data = new FormData();

                             for (var i = 0; i < num_files; i++)
                             {
                                //console.log($('#file-input').get(0).files[i]);
                                var file = $('#file-input').get(0).files[i];
                                if (file.size > 5 * 1024 * 1024)
                                {
                                    alert("File too large, keep it below 5MB!");
                                    return;
                                }
                                data.append('file', file);
                             }

                             var loc_lrn = '';
                             if ($("#name-rightbadge").data("usertype") == "faculty")
                                { loc_lrn = $("#imguploadlrn").val(); }
                            else
                                { loc_lrn = ''; }
                             data.append('lrn', loc_lrn);
                             data.append('token',  $("#name-rightbadge").data("token"));
                             data.append('group', $("#name-rightbadge").data("usertype"));
                             data.append('username', $("#name-rightbadge").data("username"));

                            $.ajax({
                               xhr: function() {
                                    var xhr = new window.XMLHttpRequest();
                                    xhr.upload.addEventListener("progress", function(evt) {
                                        if (evt.lengthComputable) {
                                            var percentComplete = evt.loaded / evt.total;
                                            apputils.echo(percentComplete * 100.0);
                                            $(".progress-bar").attr('style', 'width:'+ (percentComplete * 100.0) +'%');
                                        }
                                   }, false);

                                   xhr.addEventListener("progress", function(evt) {
                                       if (evt.lengthComputable) {
                                           var percentComplete = evt.loaded / evt.total;
                                           apputils.echo(percentComplete * 100.0)
                                           $(".progress-bar").attr('style', 'width:'+ (percentComplete * 100.0) +'%');
                                       }
                                   }, false);

                                   return xhr;
                                },
                               url: apputils.rest + '/image',
                               type:"POST",
                               data:data,
                                processData:false,
                                contentType:false,
                                enctype: 'multipart/form-data',
                               success: function(resp)
                               {
                                   $("#imguploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                                   $(".progress-bar").attr('style', 'width:0%');
                                   $("#imgprogressmessage").html("");

                                   apputils.echo(resp);

                                   if (resp.status.toLowerCase() == 'error')

                                            { $("#imgprogressmessage").html(resp.status);
                                                $(".progress-bar").attr('style', 'width:0%');
                                              return;
                                            }

                                   if ($("#imguploadlrn").val() == undefined)
                                    {
                                        view.setprofimg(resp.message);
                                        $("#imgprogressmessage").html("Done.");
                                        return;
                                    }

                                    if ($("#imguploadlrn").val().length == 0)
                                    {
                                        view.setprofimg(resp.message);
                                        $("#imgprogressmessage").html("Done.");
                                        return;
                                    }
                               },
                               error: function(e)
                              {
                                  //$("#imgprogressmessage").html(re.message);
	                              $(".progress-bar").attr('style', 'width:0%');
                                   apputils.echo(e);
                              },
                                beforeSend: function (xhrObj) {
                                    //view.setspin(pars.buttonid);
                                    $(".progress-bar").attr('style', 'width:0%');
                                    $("#imguploadicon").removeClass('fa-upload').addClass('fa-refresh fa-spin');
                                    $("#imgprogressmessage").html("Uploading..")
                                    xhrObj.setRequestHeader("Authorization",
                                        "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                                }
                        }); //ajax
             }


           model.fileuploadajax = function (par_config)
           {
               /*
                 model.fileuploadajax(
                     {
                         url: "files",
                         data:data,
                         progressbarid:progressbarid,
                         id:id,
                         fcn:fcn
                     }
                 )
                */
                                    $.ajax({
                               xhr: function() {
                                    var xhr = new window.XMLHttpRequest();
                                    xhr.upload.addEventListener("progress", function(evt) {
                                        if (evt.lengthComputable) {
                                            var percentComplete = evt.loaded / evt.total;
                                            apputils.echo(percentComplete * 100.0);
                                                $("#" + par_config.progressbarid).attr('style', 'width:'+ (percentComplete * 100.0) +'%');
                                        }
                                   }, false);

                                   xhr.addEventListener("progress", function(evt) {
                                       if (evt.lengthComputable) {
                                           var percentComplete = evt.loaded / evt.total;
                                           apputils.echo(percentComplete * 100.0)
                                           $("#" + par_config.progressbarid).attr('style', 'width:'+ (percentComplete * 100.0) +'%');
                                       }
                                   }, false);

                                   return xhr;
                                },
                               url: apputils.rest + '/' + par_config.url,
                               type:"POST",
                               data: par_config.data,
                                processData:false,
                                contentType:false,
                                enctype: 'multipart/form-data',
                               success: function(resp)
                               {
                                   $("#" + par_config.progressbarid).attr('style', 'width:0%');
                                   $("#imgprogressmessage").html("");

                                   apputils.echo(resp);

                                   if (resp.status.toLowerCase() == 'error')

                                            {
                                                apputils.poperror(resp.status);
                                                return;
                                            }

                                   par_config.fcn(resp);

                               },
                               error: function(e)
                              {
                                  //$("#imgprogressmessage").html(re.message);
	                              $("#" + par_config.progressbarid).attr('style', 'width:0%');
                                   apputils.echo(e);
                              },
                                beforeSend: function (xhrObj) {
                                    //view.setspin(pars.buttonid);
                                    $("#" + par_config.progressbarid).attr('style', 'width:0%');
                                    xhrObj.setRequestHeader("Authorization",
                                        "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
                                }
                        }); //ajax
           }


           model.uploadfilesbb  = function(par_id)
             {
                 //apputils.poperror("File Upload is Temporarily Disabled!");
                 //return;
                  var fileid = par_id;
                  var progressbarid = "prg" + par_id;
                   var num_files = $('#' + fileid).get(0).files.length;
                              if (num_files == 0)
                              {
                                alert('No file selected');
                                return;
                              }

                            var data = new FormData();

                             for (var i = 0; i < num_files; i++)
                             {
                                //console.log($('#' + fileid).get(0).files[i]);
                                var file = $('#' + fileid).get(0).files[i];
                                if (file.size > 5 * 1024 * 1024)
                                {
                                    apputils.poperror("File too large, keep it below 5MB!");
                                    return;

                                }
                                else data.append('file', file);
                             }

                             data.append('token',  $("#name-rightbadge").data("token"));
                             data.append('group', $("#name-rightbadge").data("usertype"));
                             data.append('username', $("#name-rightbadge").data("username"));

                              model.fileuploadajax(
                             {
                                 url: "file",
                                 data:data,
                                 progressbarid:progressbarid,
                                 id:par_id,
                                 fcn:function(resp)
                                        {
                                            if (resp.status !== 'OK')
                                            {
                                                apputils.poperror('Something went wrong!');
                                                return;
                                            }
                                            //apputils.popsuccess(resp.status);
                                            //work here --? view.getFile
                                            var links = resp.links;
                                            var btns = "";
                                            for (var i=0; i< links.length; i++)
                                            {
                                                btns += view.buttonact("default fa fa-file",
                                                    apputils.space(3) + resp.filenames[i],
                                                    "view.getFile('"+ links[i]  +"')",
                                                    "btnfile"+i) + apputils.space(3);
                                            }

                                            var prevcontent = '';

                                           if ($("#lblfilesattachment" + par_id).html() !== 'undefined')
                                           {
                                               prevcontent = $("#lblfilesattachment" + par_id).html();
                                           }
                                           else
                                           {
                                               $("#lblfilesattachment" + par_id).html('');
                                           }

                                           $("#lblfilesattachment" + par_id).html(prevcontent + apputils.space(3) + btns);
                                           apputils.popsuccess("Done! Post now.")
                                        }
                                   }
                                );
             }


             model.joinonlineclass = function()
             {
                 /*
                 view.buttonact(
                                                "primary btn-lg ",
                                                "Attend Class",
                                               "model.joinonlineclass()",
                                               "btnjoinvclass"
                                               )
                  */
                         model.ajaxCall(
                         {
                             resource: 'virtualroom/join',
                             data: JSON.stringify({
                                    schoolid:$("#name-rightbadge").data("schoolid"),
                                    semid:$("#name-rightbadge").data("semid"),
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    level:$("#name-rightbadge").data("grade"),
                                    section: $("#name-rightbadge").data("section")
                                }),
                             contentType: "application/json; charset=utf-8",
                             type: "POST",
                             dataType: "json",
                             btnid: 'btnjoinvclass',
                             buttonlabel: "Attend Class",
                             error: function (e) {
                                 alert(e);
                                 apputils.echo(e);
                             },
                             success: function (resp)
                             {
                                    apputils.echo(resp);
                                    if (resp.status.toUpperCase() !== 'OK')
                                     {
                                         apputils.poperror(resp.message);
                                         return;
                                     }
                                    apputils.joinvideoconfclient(resp.virtualroomid);
                                    $("#announce").html("");
                             }
                         });
             }


             model.getmyassignments = function(par_btnid, par_label)
{
    var subject = $("#sel").val();
    var offset = $("#name-rightbadge").data("c_assign");




    if (subject == 'All')
        subject = '';

     if (par_btnid == 'nexttimes') {
         $("#nexttimes").removeClass('fa-sort-amount-asc');
         $("#nexttimes").addClass('fa-refresh fa-spin');
     } else
     {

          $("#user-timeline1").html("");
          $("#btnfilterview").html(view.spin() + " Pls Wait..");
     }
         model.ajaxCall(
                         {
                             resource: 'assignment/student',
                             data: {
                                    token: $("#name-rightbadge").data("token"),
                                    group: $("#name-rightbadge").data("usertype"),
                                    schoolid: $("#name-rightbadge").data("schoolid"),
                                    semid: $("#name-rightbadge").data("semid"),
                                    subjectidsection: subject,
                                    rowskip: offset
                                },
                             contentType: "application/json; charset=utf-8",
                             type: "GET",
                             dataType: "json",
                             btnid: par_btnid,
                             buttonlabel: par_label,
                             error: function (e) {
                                 alert(e);
                                 apputils.echo(e);
                                  if (par_btnid == "nexttimes") {
                                  $("#nexttimes").removeClass('fa-refresh fa-spin');
                                  $("#nexttimes").addClass('fa-sort-amount-asc');
                              }
                              else
                              {
                                  $("#btnfilterview").html("Search");
                              }
                             },
                             success: function (resp)
                             {
                              if (par_btnid == "nexttimes") {
                                  $("#nexttimes").removeClass('fa-refresh fa-spin');
                                  $("#nexttimes").addClass('fa-sort-amount-asc');
                              }
                              else
                              {
                                  $("#btnfilterview").html("Search");
                              }
                                    apputils.echo(resp);
                                    if (resp.status.toUpperCase() !== 'OK')
                                     {
                                         apputils.poperror(resp.message);
                                         return;
                                     }

                                     if (resp.size == 0  && $("#name-rightbadge").data("c_assign") == 0)
                                      {
                                          $("#user-timeline1").html(view.timelineitem(
                                              {btnicolor:'fa fa-remove',
                                                  theader:'No Activity Yet'}, '',
                                              'You will see assignments here soon.',
                                              '...')
                                          );
                                          return;
                                      }

                                    if (resp.size > 0)
                                    { offset = offset + 5;}
                                    $("#name-rightbadge").data("c_assign", offset);
                                    $("#nexttimes").unbind("click");
                                    $("#user-timeline1 li:last").remove();

                                    for (var i=0; i < resp.size; i++)
                                    {
                                      apputils.echo(resp.timelines[i]);
                                      var ts = resp.timelines[i].tstamp;
                                      var dispDate = ts;
                                       if ($("#name-rightbadge").data("dow") != dispDate)
                                      {
                                          $("#user-timeline1").append(view.labeldate(dispDate));
                                          $("#name-rightbadge").data("dow", dispDate);
                                      }

                                      var pbox = view.postbox(
                                          {
                                              btnicolor: apputils.getbutton(resp.timelines[i].tltype),
                                              theader: resp.timelines[i].owner,
                                              imgsrc: $(resp.timelines[i].pic).attr('src')
                                          },
                                          resp.timelines[i].tstamp,
                                          resp.timelines[i].body,
                                          resp.timelines[i].tltype,
                                          resp.timelines[i]
                                          );


                                      $("#user-timeline1").append(
                                          pbox
                                      );

                                    }

                                   $("#user-timeline1").append(view.timenext())
                                    $("#nexttimes").click(function () {
                                        model.getmyassignments('nexttimes', '');
                                    });

                                    $('img').error(function () {
                                        $(this).attr('src', '/static/dist/img/soon.jpg');
                                    })

                                    //model.gettimeline

                             }
                         });
                }


                model.getassignmentsmonitoring = function(par_offeringid,par_btnid, par_label, par_rowskip)
                {
                         apputils.echo(par_offeringid);
                         apputils.echo(par_btnid);
                         apputils.echo(par_label);
                         apputils.echo(par_label);
                         model.ajaxCall(
                                         {
                                             resource: 'assignment/faculty',
                                             data: {
                                                    token: $("#name-rightbadge").data("token"),
                                                    group: $("#name-rightbadge").data("usertype"),
                                                    offeringid: par_offeringid,
                                                    rowskip: par_rowskip
                                                },
                                             contentType: "application/json; charset=utf-8",
                                             type: "GET",
                                             dataType: "json",
                                             buttonid: par_btnid,
                                             buttonlabel: par_label,
                                             error: function (e) {
                                                 alert(e);
                                                 apputils.echo(e);

                                             },
                                             success: function (resp)
                                             {

                                                    apputils.echo(resp);
                                                    if (resp.status.toUpperCase() !== 'OK')
                                                     {
                                                         apputils.poperror(resp.message);
                                                         return;
                                                     }

                                                    if (resp.size == 0)
                                                    {
                                                        apputils.popsuccess("No Posts Available!")
                                                        return;
                                                    }

                                                    var assignments = "";
                                                    for (var i = 0; i < resp.size; i++)
                                                                {
                                                                    var bodyparts = resp.timelines[i].body.split('@due:');
                                                                    //apputils.echo(bodyparts);
                                                                    apputils.echo(view.labelelcls("dd", bodyparts[1], "success"));
                                                                    var duedate = bodyparts[1];
                                                                    assignments +=
                                                                        view.exrow(
                                                                       view.flatboxsimple(
                                                                           {
                                                                               type: "warning",
                                                                               body:
                                                                                    view.labelelcls("dd",  resp.timelines[i].tstamp, "info") + apputils.newline() +
                                                                                   "Instructions:"  + bodyparts[0] +
                                                                                   view.labelelcls("dd", "Due Date: " + duedate, "default")
                                                                               +
                                                                                   apputils.newline() +
                                                                                      apputils.newline() +
                                                                                       view.excolumn(12, view.excolumn(12,
                                                                            view.flatboxsimple({
                                                                                                    type: "info",
                                                                                                    body:
                                                                                                        view.exrow( //fa fa-thumbs-up
                                                                                                                view.excolumn(2, view.centerize(view.iconize("fa-newspaper-o"))) +
                                                                                                                view.excolumn(2, view.centerize(view.iconize("fa-thumbs-up"))) +
                                                                                                                view.excolumn(2, view.centerize(view.iconize("fa-smile-o"))) +
                                                                                                                view.excolumn(2, view.centerize(view.iconize("fa-gift"))) +
                                                                                                                view.excolumn(2, view.centerize(view.iconize("fa-frown-o"))) +
                                                                                                                view.excolumn(2, view.centerize(view.iconize("fa-exclamation")))

                                                                                                        ) +
                                                                                                        view.exrow(

                                                                                                                view.excolumn(2, view.centerize(resp.timelines[i].comments + "/" +resp.timelines[i].classsize)) +
                                                                                                                view.excolumn(2, view.centerize(resp.timelines[i].reactions.okc)) +
                                                                                                                view.excolumn(2, view.centerize(resp.timelines[i].reactions.happyc)) +
                                                                                                                view.excolumn(2, view.centerize(resp.timelines[i].reactions.surprisedc)) +
                                                                                                                view.excolumn(2, view.centerize(resp.timelines[i].reactions.sadc)) +
                                                                                                                view.excolumn(2, view.centerize(resp.timelines[i].reactions.angryc))

                                                                                                      )
                                                                                                }) +
                                                                                                        view.exrow(
                                                                                                          view.centerize(
                                                                                                            view.buttonact("default fa fa-get-pocket",
                                                                                                                apputils.space(3) + "Check",
                                                                                                                "model.getsubmissions('" + par_offeringid + "','" + duedate + "','" + resp.timelines[i].initiatorid + "', '" + resp.timelines[i].tlts + "', '" + 'btncheckanswers' +
                                                                                                                $.sha1(resp.timelines[i].tlts) + "', '"+
                                                                                                                 bodyparts[0].replace(/"/gi,'<>')
                                                                                                                     .replace(/'/gi, '>>') + "','" + resp.timelines[i].tstamp+"')",
                                                                                                                "btncheckanswers" + $.sha1(resp.timelines[i].tlts)
                                                                                                                )
                                                                                                          )
                                                                                                        )


                                                                        ))//details
                                                                           })
                                                                        )
                                                                }



                                                    var oldare = $("#assignmentsarea").html();


                                                    if (typeof oldare == 'undefined')
                                                    {
                                                        oldare = '';
                                                    }

                                                    $("#main").html(
                                                        view.excolumn(12,
                                                            view.excolumn(12,

                                                                view.simplediv("assignmentsarea", oldare) +

                                                               view.centerize(view.simplediv("buttonarea", ""))


                                                                )
                                                            ) //outer column

                                                    ); //main

                                                 $("#assignmentsarea").append(assignments);

                                                 $("#buttonarea").html(view.buttonact("info fa fa-sort-amount-asc",
                                                                                        apputils.space(3) + "Load More",
                                                                                        "model.getassignmentsmonitoring('" +
                                                                                        par_offeringid +
                                                                                        "', '" + par_btnid + "', 'Load More', "+  (par_rowskip + 5) +")",
                                                                                        par_btnid
                                                                                    ));




                                             }
                                         });
                }

             model.getsubmissions = function(par_offeringid, par_duedate, par_initiatorid, par_ts, par_btnid, par_instructions,  par_tstamp)
             {
                 /*
                        token = params["token"]
                        group = params["group"]
                        offeringid = params["sectionid"]
                        duedate = params["duedate"]
                        initiatorid = params["personid"]
                        ts = params["ts"]
                        bodyparts --> 0 -- message
                                      1 -- duedate
                                      view.labelelcls("dd", "Due Date: " + par_bodyparts[1], "default")
                  */
                                   model.ajaxCall(
                                       {
                                           resource: 'assignment/faculty/submissions',
                                           data: {
                                               token: $("#name-rightbadge").data("token"),
                                               group: $("#name-rightbadge").data("usertype"),
                                               sectionid: par_offeringid,
                                               duedate: par_duedate,
                                               initiator: par_initiatorid,
                                               ts: par_ts
                                           },
                                           contentType: "application/json; charset=utf-8",
                                           type: "GET",
                                           dataType: "json",
                                           buttonid: par_btnid,
                                           buttonlabel: "",
                                           error: function (e) {
                                               alert(e);
                                               apputils.echo(e);

                                           },
                                           success: function (resp) {






                                               apputils.echo(resp);
                                               if (resp.status.toUpperCase() !== 'OK') {
                                                   apputils.poperror(resp.message);
                                                   return;
                                               }

                                               if (resp.size == 0) {
                                                   apputils.popsuccess("No Enrolled Students!")
                                                   return;
                                               }

                                                view.setupgradesubmit();
                                                $("#backbutton").html(
                                                    view.centerize(
                                                            view.buttonact("info fa fa-backward",
                                                                                       apputils.space(3) + "Back",
                                                                                        "model.getassignmentsmonitoring('" +
                                                                                        par_offeringid +
                                                                                        "', 'btn" + $.sha1(par_offeringid) + "', 'Back', 0)",
                                                                                        "btn" + $.sha1(par_offeringid)
                                                                                    )
                                                    )

                                                );


                                                $("#savescorelink").html(
                                                     view.buttonact("success fa fa-save",
                                                         apputils.space(3) + "Save",
                                                         "model.savescorelinkentry('"+par_offeringid+"', '"+par_ts+"')", "btnsavestuscore")
                                                );

                                                //model.associatetimelinetoscore = function (par_sectionid, par_ts)
                                                $("#buttonplaceholder").html(
                                                  view.centerize(
                                                       view.buttonact("success fa fa-save", "&nbsp;&nbsp;Set",
                                                           "model.associatetimelinetoscore('"+ par_offeringid +"', '"+ par_ts +"')", "btnlinkpostentry")
                                                  )

                                                );

                                               $("#instructions").html(
                                                   view.labelelcls("dd",  par_tstamp, "info") + apputils.newline() +
                                                   "Instructions:"  + par_instructions.replace(/<>/gi,'\"').replace(/>>/gi, "'") +
                                                   view.labelelcls("dd", "Due Date: " + par_duedate, "default")
                                               );

                                               /*
                                               view.flatboxsimple({
                                                          type: "success, //info, warning, danger
                                                          body:''
                                                      });
                                                */

                                               var qresults = resp.results[0];

                                               apputils.echo(qresults);

                                               $("#cbogradecategories").val(qresults.entryname);
                                               $("#cbogradecount").val(qresults.entryid);
                                               $("#txtTotScore").val(qresults.max_score);

                                               var stuentries =
                                                   view.flatboxsimple(
                                                       {
                                                           type:"success",
                                                           body: view.exrow(
                                                               view.excolumn(1,
                                                                   ""
                                                               ) +
                                                               view.excolumn(4, "Name") +
                                                               view.excolumn(2, "Status") +
                                                               view.excolumn(2, view.centerize("Score")) +
                                                               view.excolumn(2, "")
                                                           )
                                                       }
                                                   );

                                              for (var i=0; i < qresults.size; i++)
                                              {
                                                  var status = view.labelelcls("dd",  "NO SUBMIT", "default");

                                                  if (qresults.submissions[i].status.length !== 0)
                                                  {

                                                      if (qresults.submissions[i].status == 'ON-TIME')
                                                         status = view.labelelcls("dd",  "ON-TIME", "success");
                                                      else
                                                          status = view.labelelcls("dd",  qresults.submissions[i].status, "danger");

                                                  }

                                                  stuentries +=
                                                      view.flatboxsimple(
                                                          {
                                                              type:"default",
                                                              body:
                                                                view.exrow(
                                                                    view.excolumn(1,
                                                                        view.imagify(qresults.submissions[i].src)
                                                                        ) +
                                                                    view.excolumn(4,qresults.submissions[i].fullname) +
                                                                    view.excolumn(2,status) +
                                                                    view.excolumn(2,view.centerize(qresults.submissions[i].score), "divstuscore" + $.sha1(qresults.submissions[i].lrn)) +
                                                                    view.excolumn(2,view.buttonact("default btn-xs fa fa-eye", apputils.space(3) + "See",
                                                                        "model.seesubmission('" + par_offeringid + "','"+
                                                                        qresults.submissions[i].lrn +"','" + qresults.submissions[i].fullname +
                                                                        "'," + qresults.submissions[i].score + ",'" + qresults.submissions[i].src + "', '"+par_ts+"')", "btnsee" + $.sha1(qresults.submissions[i].lrn)))
                                                                )
                                                          }
                                                      );


                                              }
                                              apputils.echo(stuentries);
                                              $("#divstudentresponses").html(stuentries);
                                           }
                                       });
             }


             /*
               "model.seesubmission('" + par_offeringid + "','"+
                                       qresults.submissions[i].lrn +"','" +
                                       qresults.submissions[i].fullname +
                                       "'," + qresults.submissions[i].score + ",'" +
                                       qresults.submissions[i].src + "')", "btnsee" + $.sha1(qresults.submissions[i].lrn)))
              */

             model.seesubmission = function(par_offeringid, par_lrn, par_fullname, par_score, par_src, par_ts)
            {
                var btnid = "btnsee" + $.sha1(par_lrn);
                var scoreid = "divstuscore" +  $.sha1(par_lrn);
                var score = $("#" + scoreid).html().split("<div style=\"text-align: center;\">")[1].split("</div>")[0]
                $("#studentpic").html(view.imagify(par_src));
                $("#studentlrn").html(par_lrn);
                $("#studentfname").html(par_fullname);
                $("#divcommentdetails").html("");
                $("#txtstuscore").val(score);

                /*
                @app.route("/assignment/faculty/submissions/student", methods=["GET"])
                @auth.login_required
                def getsubmissions():

                    params = request.args
                    username = auth.username()
                    token = params["token"]
                    group = params["group"]
                    ts = params["ts"]
                    studentid = params["lrn"]
                 */

                 model.ajaxCall(
                     {
                         resource: 'assignment/faculty/submissions/student',
                         data: {
                             token: $("#name-rightbadge").data("token"),
                             group: $("#name-rightbadge").data("usertype"),
                             ts: par_ts,
                             lrn: par_lrn
                         },
                         contentType: "application/json; charset=utf-8",
                         type: "GET",
                         dataType: "json",
                         buttonid: btnid,
                         buttonlabel: apputils.space(3) + "See",
                         error: function (e) {
                             alert(e);
                             apputils.echo(e);

                         },
                         success: function (resp) {


                             apputils.echo(resp);
                             if (resp.status.toUpperCase() !== 'OK') {
                                 apputils.poperror(resp.message);
                                 return;
                             }

                             if (resp.size == 0) {
                                 apputils.popsuccess("No Submission!")
                                 return;
                             }

                             var submissions = '';
                             for (var i = 0; i < resp.size; i++)
                             {
                                    submissions +=
                                        view.flatboxsimple(
                                            {
                                             type:"default",
                                             body:   view.simplediv('" class="box-comment', '<p class="message">' +
                                                    '<a href="#" class="name">' +
                                                    '<small class="text-muted pull-right">' +
                                                    '<i class="fa fa-clock-o"></i>' +
                                                    resp.results[i].comment_ts +
                                                    '</small>' +
                                                    resp.results[i].commenter_name +
                                                    '</a>' +
                                                    apputils.newline() +
                                                    resp.results[i].comment +
                                                    '</p>'
                                                )
                                            }
                                        )

                             }

                             $("#divcommentdetails").html(submissions);

                         }
                     });

            }


            model.associatetimelinetoscore = function (par_sectionid, par_ts)
            {
                //in focus: model.savegradeentry('savegradeentry')
               /*
                    token = params["token"]
                    group = params["group"]
                    ts = params["ts"]
                    offeringid = params["sectionid"]
                    entryname = params["entryname"]
                    maxscore = params["maxscore"]
                    periodid = params["periodid"]
                    categoryid = params["categoryid"]
                    semid = params["semid"]
                */
                model.ajaxCall({
                    resource: "assignment/faculty/link",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            periodid: $("#name-rightbadge").data("quarter"),
                            sectionid: par_sectionid,
                            entryname: $("#cbogradecount").val(),
                            maxscore: $("#txtTotScore").val(),
                            categoryid: $("#cbogradecategories").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            ts: par_ts
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: "btnlinkpostentry",
                    buttonlabel: apputils.space(3) + "Set",
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);

                       if (resp.status.toUpperCase() !== "OK")
                       { apputils.poperror(resp.message);
                         return;
                       }
                      apputils.popsuccess("Done!");
                    }
                });
            }

            model.savescorelinkentry = function(par_sectionid, par_ts)
            {
                /*
                @app.route("/assignment/faculty/link/score", methods=["POST"])

                username = auth.username()
                params = request.get_json()
                token = params["token"]
                group = params["group"]
                lrn = params["studentid"]
                entryname = params["entryname"]
                score = params["score"]
                periodid = params["periodid"]
                categoryid = params["categoryid"]
                semid = params["semid"]
                ts = params["ts"]
                offeringid = params["sectionid"]

                 */

                model.ajaxCall({
                    resource: "assignment/faculty/link/score",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            token: $("#name-rightbadge").data('token'),
                            group: $("#name-rightbadge").data('usertype'),
                            studentid: $("#studentlrn").html(),
                            entryname: $("#cbogradecount").val(),
                            score: $("#txtstuscore").val(),
                            periodid: $("#name-rightbadge").data("quarter"),
                            categoryid: $("#cbogradecategories").val(),
                            semid: $("#name-rightbadge").data("semid"),
                            sectionid: par_sectionid,
                            ts: par_ts,
                            sectionid: par_sectionid
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: "btnsavestuscore",
                    buttonlabel: apputils.space(3) + "Save",
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);

                       if (resp.status.toUpperCase() !== "OK")
                       { apputils.poperror(resp.message);
                         return;
                       }
                       $("#divstuscore" + $.sha1($("#studentlrn").html())).html(view.centerize($("#txtstuscore").val()));
                      apputils.popsuccess("Done!");
                    }
                });
            }


            model.getonlineclasses = function ()
            {
                /*
                     token = params["token"]
                     schoolid = params["schoolid"]
                     semid = params["offeringid"]
                     date_ = params["date_"]
                     group = params["group"]
                 */
                model.ajaxCall(
                     {
                         resource: 'virtualroom/monitor',
                         data: {
                             token: $("#name-rightbadge").data("token"),
                             group: $("#name-rightbadge").data("usertype"),
                             schoolid: $("#name-rightbadge").data("schoolid"),
                             semid: $("#name-rightbadge").data("semid"),
                             date_: $("#txtdatemon").val()
                         },
                         contentType: "application/json; charset=utf-8",
                         type: "GET",
                         dataType: "json",
                         buttonid: 'btnretrievemonitoronlineclass',
                         buttonlabel: apputils.space(3) + "Monitor",
                         error: function (e) {
                             alert(e);
                             apputils.echo(e);

                         },
                         success: function (resp) {

                             apputils.echo(resp);
                             $("#divlistmonitor").html(
                                 view.excolumn(12,view
                                .simplebox({
                                    boxtype:"info",
                                    title:"",
                                    body:"<h3>NO ONLINE CLASSES!<h3>",
                                    footer:""
                                }))

                             );
                             if (resp.status.toUpperCase() !== 'OK') {
                                 apputils.poperror(resp.message);
                                 return;
                             }

                             if (resp.size == 0) {
                                 apputils.popsuccess("No Online Classes!")
                                 return;
                             }

                         $("#divlistmonitor").html(
                             view.rowdify(resp.onlineclasses.videoclass, view.socialbadgecustom,
                                    function (classes)
                                    {
                                        apputils.echo(classes);

                                        return {
                                            name:classes.lastname + ", " + classes.firstname ,
                                            color: "bg-aqua",
                                            id: classes.mi,
                                            badgeid:classes.roomid,
                                            imgsrc: classes.picsrc,
                                            left:
                                              '<div class="description-block">' +
                                                '<h5 class="description-header">' + classes.attendees + '</h5>' +
                                            '<span class="description-text"> Attendees </span>' +
                                            '</div>',
                                            middle: '',
                                            right: classes.virtualclassroom
                                        }
                                    }
                    ,"Online Class(es)"));

                         }
                     });

            }

            model.createqrcode = function()
            {
                model.ajaxCall({
                    resource: "qrcode",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            group: $("#name-rightbadge").data('usertype'),
                            name: $("#name-leftbadge").text()
                    }),
                    type: "POST",
                    dataType: "json",
                    buttonid: "mnuqrcode",
                    buttonlabel: "QR Code",
                    error: function (e) {
                    },
                    success: function (resp) {
                       apputils.echo(resp);
                       $("#qrcodepic").attr('src', apputils.rest + "/file?link=" + resp.message);
                       
                       $("#downloadqr").html(
                              view.centerize(
                            view.buttonact(
                                "success",
                                "Download",
                                "view.getFile('" +resp.message + "')",
                                 "btnqrdownload"
                            )
                        )
                       )
                    
                    
                    }
                });
            }

            model.removeload = function (par_sectionid)
            {
                if (!confirm(
                    "WARNING!\n" +
                    "This will permanently remove the subject in your load \n" +
                    "from 1st to last grading period.\n\n" +
                    "Are you sure you want to proceed?\n"
                ))
                {
                    return;
                }

                model.ajaxCall({
                    resource: "offering",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            group: $("#name-rightbadge").data('usertype'),
                            offeringid: par_sectionid,
                            level: $("#name-rightbadge").data('grade'),
                            semswitch: $("#name-rightbadge").data('semswitch')
                    }),
                    type: "DELETE",
                    dataType: "json",
                    buttonid: 'btnremove' + $.sha1(par_sectionid).substring(0,5),
                    buttonlabel: "",
                    error: function (e) {
                    },
                    success: function (resp) {
                        apputils.echo(resp);

                        if (resp.status === 'error')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        model.getuserload();
                    }
                });
            }

            model.setupencode = function()
            {
                 model.ajaxCall(
                     {
                         resource: 'subjects',
                         data: {
                             group: $("#name-rightbadge").data("usertype")
                         },
                         contentType: "application/json; charset=utf-8",
                         type: "GET",
                         dataType: "json",
                         buttonid: 'btnaddsubject',
                         buttonlabel: "Start Here",
                         error: function (e) {
                             alert(e);
                             apputils.echo(e);

                         },
                         success: function (resp) {
                             apputils.echo(resp);

                             if (resp.status == 'error')
                             {
                                 apputils.poperror(resp.message);
                                 return;
                             }
                             $("#name-rightbadge").data("encsubjectsapi", resp.result);

                             $("#main").html(
                                 view.excolumn(3, "") +
                                 view.excolumn(6,
                                          view.simplebox(
                                              {
                                                  boxtype: 'primary',
                                                  title: "Open a Subject",
                                                  body: view.exformgroup(view.exinputtext(
                                                                "Description", "text",
                                                                "txtsubjdescapi" ,
                                                                "")) +
                                                            view.exformgroup(view.exinputtext(
                                                                "Abbreviation", "text",
                                                                "txtabbrevapi",
                                                                "")),
                                                  footer: view.centerize(
                                                      view.buttonact("success", "Open", "model.createoff()", 'btnopenoff')
                                                  )
                                              })

                                     ) +
                                 view.excolumn(3, "")
                             );
                             var autoitems = [];
                             var automapper = {};
                             resp = resp.result;
                             for (var i=0; i < resp.subjects.length; i++)
                             {
                                 autoitems.push(resp.subjects[i].description);
                                 automapper[resp.subjects[i].description.toUpperCase()] = resp.subjects[i].subjectid;
                             }

                             $("#txtsubjdescapi").autocomplete({
                                          source: autoitems
                                        });

                             $("#txtsubjdescapi").on('change', function (e)
                                 {

                                         var it = automapper[$("#txtsubjdescapi").val().toUpperCase()];

                                         if (it == 'undefined')
                                         {
                                             return;
                                         }
                                         $("#txtabbrevapi").val(it);
                                 }


                             )

                         }
                     });

            }

            model.createoff = function ()
            {
                //btnopenoff
                /*
                  par_subjectid text,
	              par_level integer,
	              par_semid text,
	              par_section text,
	              par_schoolid text,
	              par_sem text
                 */

                var semswitch = $("#name-rightbadge").data("semswitch");

                model.ajaxCall({
                    resource: "offering",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            subjectid: $("#txtabbrevapi").val(),
                            description: $("#txtsubjdescapi").val(),
                            level: $("#name-rightbadge").data("grade"),
                            semid: $("#name-rightbadge").data("semid"),
                            semswitch: semswitch,
                            section: $("#name-rightbadge").data("section"),
                            schoolid: $("#name-rightbadge").data("schoolid"),
                            group: $("#name-rightbadge").data("usertype")
                        }
                    ),
                    type:"POST",
                    dataType: 'json',
                    buttonid: "btnopenoff",
                    buttonlabel: "Open",
                    error: function(e)
                    {

                    },
                    success: function(resp)
                    {
                            if (resp.status == "error")
                            {
                                apputils.poperror(resp.message);
                                return;
                            }
                            model.getuserload(semswitch);
                    }
                })
            }

            //model.last
            /*
            model.switchsection = function (par_section, par_grade, btnid)
            {
                ///<int:quarter>/<string:section>/<int:yearlevel>/<string:schoolid>/<string:semid>/<string:token>
                model.ajaxCall({
                    resource: "",
                    type: "GET",
                    data: {},
                    dataType: "json",
                    buttonid: par_btnid,
                    buttonlabel: par_btnname,
                    error: function (e) {
                    },
                    success: function (resp) {
                        apputils.echo(resp);
                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        //do something here
                    }
                });
            }


                   model.ajaxCall({
                    resource:'',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({}),
                    type:"POST",
                    dataType: 'json',
                    buttonid:par_btnid,
                    buttonlabel:par_btnname,
                    error: function (e)
                    {},
                    success: function (resp)
                    {
                        apputils.echo(resp);

                        if (resp.status !== 'OK')
                        {
                            apputils.poperror(resp.message);
                            return;
                        }
                        //do something here

                    }

                });


            */
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
                 placeholder:"kani",
                 value: ""
                 }
                 */

                value = apputils.ifundefined(par_txtarea.value, par_txtarea.value, "");

                return   '<textarea class="form-control" id="'+
                    par_txtarea.id+'" rows="'+par_txtarea.rows+'" '+
                    apputils.ifundefined(par_txtarea.cols,
                        ' cols="' + par_txtarea.cols + '"' ,
                        '') +
                    apputils.ifundefined(par_txtarea.wrap,
                        ' wrap="' + par_txtarea.wrap + '"' ,
                        '') +
                    ' placeholder="'+
                    par_txtarea.placeholder + '">' + value +   '</textarea>';
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
                      data: [feelingcount.hcount, feelingcount.sadcount, feelingcount.angrycount, feelingcount.surprisedcount]
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

            view.postbox = function (titem, tstamp, tbody, tltype, titemdetails)
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
                 "this body",
                 'type',
                 {timelinedetails...}
                 ))
                 */

               var loc_footer = "";
               usertype = $("#name-rightbadge").data("usertype");
               apputils.echo(titemdetails);

               var f = [];
               for (var x = 0; x < 5; x++)
               {
                   f[x] = 'btn-default';
               }

               if (titemdetails.comments.reaction > 0)
                {
                    f[parseInt(titemdetails.comments.reaction) - 1] = 'btn-info';
                }



                var tlid = $.sha1(titem.theader + titemdetails.tlts + tstamp + tbody + titemdetails.receiverid).substring(0,7);
                //apputils.echo("i have room");
                return  "<li>" +
                    '<i class="'+ titem.btnicolor + '"></i>' +
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fa fa-clock-o"></i>'+tstamp+'</span>' +
                    '<h3 class="timeline-header">' +
                    '<img style="margin-top: -6px;" class="img-rounded img-sm pull-left" ' +
                    ' src="' + titem.imgsrc + '" alt="user image">  &nbsp; ' +
                    '  <a href="#">' + titem.theader + '</a></h3>' +
                    '<div class="timeline-body"> ' + tbody +
                     '</div>' +
                    '<div class="timeline-footer" id="' + tlid + '">' +
                     function () {

                         loc_btnid = 'btnforward' + tlid;
                         return view.exrow(
                            view.excolumn(12,
                                   function () {
                                      if (usertype == 'students' || usertype == 'parents')
                                      {
                                          return '';
                                      }
                                      return  view.buttonact("btn btn-default btn-sm fa fa-share pull-left", apputils.space(3) + "Forward",
                                           "model.forwardtline('" + titem.theader +
                                           "', '" + tltype + "', '" +
                                           tstamp + "', '" + tbody.replace(/"/g, "&#34;").replace(/'/g, "&#34;") + "', '" +
                                           titem.imgsrc + "','" + loc_btnid + "'"
                                           + ")", loc_btnid)
                                   }()

                                       +
                                           '<div class="pull-right">' +
                                            //OK

                                                view.buttonact("btn " + f[0] + " btn-sm fa fa-thumbs-up",
                                                    "Like",
                                                    "model.postreaction('"+
                                                                    titemdetails.initiatorid + "','" +
                                                                    titemdetails.receiverid + "','" +
                                                                    titemdetails.tlts + "','" +
                                                                    tlid + "', '1', 'Like'"
                                                                    + ")"
                                                    ,
                                                    "btnreact" + tlid + "1") +
                                                    view.labelelcls("lblreactok" + tlid, titemdetails.reactions.okc, "default")

                                             +
                                                apputils.space(2) +
                                            //happy

                                                view.buttonact("btn " + f[1] + " btn-sm fa fa-smile-o",
                                                    "Happy",
                                                     "model.postreaction('"+
                                                                    titemdetails.initiatorid + "','" +
                                                                    titemdetails.receiverid + "','" +
                                                                    titemdetails.tlts + "','" +
                                                                    tlid + "', '2', 'Happy'"
                                                                    + ")"
                                                    ,
                                                    "btnreact" + tlid + "2") +
                                                    view.labelelcls("lblreacthappy" + tlid,
                                                                    titemdetails.reactions.happyc,
                                                                    "default")
                                             +
                                            //surprised
                                                apputils.space(2) +
                                                view.buttonact("btn " + f[4] + " btn-sm fa fa-gift",
                                                    "Surprised",
                                                    "model.postreaction('"+
                                                                    titemdetails.initiatorid + "','" +
                                                                    titemdetails.receiverid + "','" +
                                                                    titemdetails.tlts + "','" +
                                                                    tlid + "', '5', 'Surprised'"
                                                                    + ")"
                                                    ,
                                                    "btnreact" + tlid + "5") +
                                                    view.labelelcls("lblreactsurprised" + tlid,
                                                                    titemdetails.reactions.surprisedc,
                                                                    "default")
                                             +
                                            //sad
                                                apputils.space(2) +
                                                view.buttonact("btn " + f[2] + " btn-sm fa fa-frown-o ",
                                                    "Sad",
                                                    "model.postreaction('"+
                                                                    titemdetails.initiatorid + "','" +
                                                                    titemdetails.receiverid + "','" +
                                                                    titemdetails.tlts + "','" +
                                                                    tlid + "', '3', 'Sad'"
                                                                    + ")"
                                                    ,
                                                    "btnreact" + tlid + "3") +
                                                    view.labelelcls("lblreactsad" + tlid,
                                                                    titemdetails.reactions.sadc,
                                                                    "default")
                                             +
                                            //angry
                                                apputils.space(2) +
                                                view.buttonact("btn " + f[3] + " btn-sm fa fa-exclamation ",
                                                    "Angry",
                                                    "model.postreaction('"+
                                                                    titemdetails.initiatorid + "','" +
                                                                    titemdetails.receiverid + "','" +
                                                                    titemdetails.tlts + "','" +
                                                                    tlid + "', '4', 'Angry'"
                                                                    + ")"
                                                    ,
                                                    "btnreact" + tlid + "4") +
                                                    view.labelelcls("lblreactangry" + tlid,
                                                                 titemdetails.reactions.angryc,
                                                                    "default")
                                            + '</div>'
                            )//excolumn

                         ) // exrow;

                     }()
                    +
                    view.exrow('<hr/>') +
                    view.exrow(
                       view.excolumn(8,
                              '<img class="img-responsive img-circle img-sm" src="' + $("#img-leftbadge").attr('src') + '">' +
                              '<div class="img-push">' +
                               view.textarea(
                                   {
                                       id: 'tacomment' + tlid,
                                       rows: 1,
                                       cols:10,
                                       wrap:'hard',
                                       placeholder: "Type your comment here"
                                   }
                               ) +
                             '</div>' +
                           apputils.newline() +
                           view.flatboxsimple({
                                              type: "success", //info, warning, danger
                                              body:view.fileuploadpair({
                                                                            btnid: 'files' + tlid,
                                                                            buttontype: 'success btn-xs',
                                                                            fileplaceid: 'files' + tlid, //id
                                                                            restrict: "", //'accept="image/jpeg, image/png"',
                                                                            selectmode: "multiple", //"multiple" or ""
                                                                            fcn:"model.uploadfilesbb",
                                                                            buttonlabel:"Upload Files",
                                                                            prsize:'xxs',
                                                                            addpair:true
                                                                        })

                                          })

                           ) +
                        view.excolumn(4,
                                    view.buttonact('success btn-flat btn-sm',
                                        "Post",
                                        "model.postcomment('" +
                                        titemdetails.initiatorid + "','" +
                                        titemdetails.receiverid + "','" +
                                        titemdetails.tlts + "'," +
                                        "'" + tlid +"' )",
                                        'btncomment' + tlid)
                            ))
                    +
                    view.exrow(apputils.space(1)) +
                    view.exrow(
                        view.excolumn(
                                    12,
                                   '<div id="'+'lstcomments' + tlid+'" class="box-footer box-comments">' +
                                     function () {
                                        if (titemdetails.comments.size == 0)
                                        {
                                            return '';
                                        }

                                        var comments = '';
                                        for (var j =0; j < titemdetails.comments.size; j++)
                                                {

                                                   comments +=     view.boxcomment(
                                                            titemdetails.comments.comments[j].src,
                                                            titemdetails.comments.comments[j].byfullname,
                                                            titemdetails.comments.comments[j].time,
                                                            titemdetails.comments.comments[j].comment,
                                                            titemdetails.comments.comments[j].id
                                                        )


                                                }
                                        return comments;
                                     }() +

                                    view.lastitempbox(
                                        titemdetails.initiatorid,
                                        titemdetails.receiverid,
                                        titemdetails.tlts,
                                        tlid,
                                        3) +
                                    '</div>' +
                                     '<hr />'
                                    ,
                                    ''
                            )
                    ) +

                    '</div>' +
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

                /*
                $("#calendar").fullCalendar({
                    header: {
                        left:'today',
                        center: "title",
                        right: 'month' //,basicWeek,basicDay
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
               */
                view.calendarset();

            }
            view.initnotif = function (notif, ts, initid, receiveid, tlts)
            {   
                $("#main").html(column(12, view.simplebox({
                    boxtype:"primary",
                    title:"Notifications",
                    body:`<div id="messages">
                        <h3>${notif}</h3>
                        <small>${ts}</small>
                       
                        <ul style="margin-top:1em !important" id="notif_postbox" class="p-5 timeline">
                            <li>${view.boxloading()}</li>
                        </ul>
                    </div>`,
                    footer:''
                })));
                model.notif_getpost(notif, ts, initid, receiveid, tlts)
                
                
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
                         if ($("#name-rightbadge").data("usertype") == "faculty" ||
                             $("#name-rightbadge").data("usertype") == "admin" ||
                             $("#name-rightbadge").data("usertype") == "subadmin" ||
                             $("#name-rightbadge").data("usertype") == "super10" ||
                             $("#name-rightbadge").data("usertype") == "mande" ||
                             $("#name-rightbadge").data("usertype") == "bisor" ||
                             $("#name-rightbadge").data("usertype") == "ispeval" ||
                             $("#name-rightbadge").data("usertype") == "students" ||
                             $("#name-rightbadge").data("usertype") == "parents"
                         ) {
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
                            minDate:now?
                                now:false
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
                        apputils.echo(gsec);
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
                                    "',"+apputils.kto0(gsec[1])+",'" + 'btn' + gsec[0] + gsec[1] + "')", 'btn' + gsec[0] + gsec[1])
                        }

                    }
                    ,"Assigned Section(s)"));

                /* $("#main").html(column(12, view.boxify("listsections", "Assigned Sections",
                 boxes, "", "")
                 ));*/

            }

            view.compose = function (data, init)
            {


                 if ($("#name-rightbadge").data("usertype") === "parents" &&
                       init
                 )
                 {
                     return;
                 }


                /*


                view.buttonact(
                                                "primary btn-lg ",
                                                "Attend Class",
                                               "model.joinonlineclass()",
                                               "btnjoinvclass"
                                               )
                * */


                $("#user-timeline li").remove();
                view.inittimeline();



                $("#name-rightbadge").data("offset", 0);
                $("#nexttimes").click(function () {model.gettimeline()});
                //if ($("#name-rightbadge").data("usertype") != 'parents')
                 model.gettimeline();


                 if ($("#name-rightbadge").data("usertype") === "students" /*||
                     $("#name-rightbadge").data("usertype") === "faculty"*/)
                 {
                     $("#announce").html(
                            view.excolumn(12,
                                view.excolumn(12,

                                   view.simplebox({
                                           boxtype: "primary",
                                           title: "Shortcut to Online Class",
                                           body:
                                             view.centerize(
                                                           view.buttonact(
                                                           "primary btn-lg ",
                                                           "Attend Class",
                                                           "model.joinonlineclass()",
                                                           "btnjoinvclass"
                                                    )),
                                          footer: ""
                                       }
                                   )
                                )
                            )
                     );
                 }


            }



            function addmenuitem(mnudata, clickfcn, nestedmenu, par_labelid)
            {
                nestedmenu = typeof nestedmenu !== 'undefined' ? ' ' + nestedmenu : "";
                labelid = typeof par_labelid !== 'undefined' ? 'id="' + par_labelid +'"' : "";
                $("#user-menus").append('<li id="umnu'+ mnudata.id +
                    '"><a href="#"><i class="'+ mnudata.ico +
                    '"></i> <span ' + labelid +'>'+ mnudata.label +'</span></a>'+
                    nestedmenu + '</li>');

                $("#umnu" + mnudata.id).click(clickfcn);

            }


            view.sidemenu = function (persontype)
            {
                $("#user-menus").html("");
                $("#user-menus").append('<li class="header">Options</li>');

                addmenuitem(apputils.mnunotif,
                    function () {
                        view.initnotif();
                    }
                    );
                switch(persontype)
                {

                    case "ispeval":
                        addmenuitem(    {
                                            ico: "fa fa-dashboard",
                                            label:"Dashboard",
                                            id:"mnusuper10dboard"
                                        },
                            function ()
                            {
                               view.gradegendboard();
                               model.getgenimpression();
                            });

                        addmenuitem(apputils.mnutimeline);
                        $("#umnu" + apputils.mnutimeline.id)
                            .click(function () {
                                view.mainloading();
                                apputils.filltimeline();
                            });

                        addmenuitem(apputils.mnucalendar, function () {
                                view.mainloading();
                                view.initcalendar();
                            });

                                        addmenuitem({
                                        ico: "fa fa-check-square-o",
                                        label:"Monitoring",
                                        id:"mnuadminmonitoring"
                                    },
                                    function()
                                    {
                                        view.principalmonitoring();
                                        model.principalmonitoring();
                                    });

                        addmenuitem({
                                     ico: "fa fa-bar-chart",
                                        label:"Performance Rating",
                                        id:"aisamonitoring"
                            },
                            function ()
                            {

                                view.mainloading();
                                model.principalmonitoringisp('', 'Monitoring');
                            });

                        addmenuitem(apputils.mnuchangesem,
                                    function () {
                                        view.changeschoolyear();
                                    }
                                    );

                        addmenuitem({ico: "fa fa-video-camera",
                                      label: "Video Conference",
                                      id:"mnuvideoconfset"},
                                function()
                                {
                                    view.createvideoconference();
                                });

                        break;


                    case "bisor":
                        addmenuitem(apputils.mnutimeline);
                        $("#umnu" + apputils.mnutimeline.id)
                            .click(function () {
                                view.mainloading();
                                apputils.filltimeline();
                            });


                        addmenuitem(apputils.mnucalendar, function () {
                                view.mainloading();
                                view.initcalendar();
                            });

                        addmenuitem({
                                        ico: "fa fa-pencil-square-o",
                                        label:"Manage Online Exam",
                                        id:"mnumanageonlineexam"
                                    }, view.manageonlineexam);

                        addmenuitem(apputils.mnuchangesem,
                                    function () {
                                        view.changeschoolyear();
                                    }
                                    );

                        addmenuitem({ico: "fa fa-video-camera",
                                      label: "Video Conference",
                                      id:"mnuvideoconfset"},
                                        function()
                                        {
                                            view.createvideoconference();
                                        });

                        break;
                    case "faculty":

                        addmenuitem({
                                        ico: "fa fa-question",
                                        label:"Help",
                                        id:"mnumainhelp"
                                    },
                              function ()
                              {

                                   model.posthelpaccess("Main Tutorial",
                                       view.menututor,
                                       'spinnerarea', "Help");
                              }, undefined, "spinnerarea"
                              );

                        addmenuitem(apputils.mnutimeline,
                                    function () {
                                            view.mainloading();
                                            apputils.filltimeline();
                                        }
                            );

                        addmenuitem(apputils.mnucalendar,
                                    function () {
                                        view.mainloading();
                                        view.initcalendar();
                                    }
                            );




                        if ($("#name-rightbadge").data("grade") !== "none") {

                            addmenuitem(apputils.mnuenroll,
                                        function () {
                                            view.enroll();
                                        }
                            );


                            addmenuitem(apputils.mnuregister, function () {
                                    $("#name-rightbadge")
                                        .data("enrlrn", "");
                                    view.regdetail();
                                });

                           /* addmenuitem(apputils.mnuswitchsection,
                                        function () {
                                            view.listsections();
                                        }
                                );*/

                            addmenuitem(apputils.mnusclasslist,
                                        function () {
                                            model
                                                .classlist
                                                ("umnu" +
                                                    apputils.mnusclasslist.id);
                                        }
                                        );

                           }

                        addmenuitem(apputils.mnussubjects,
                                    function () {
                                        model.getuserload();
                                    }
                                    );

                        addmenuitem(
                            {
                                ico:"fa fa-calendar-check-o",
                                label:"Retrieve Assignments",
                                id:"retrieveassignments"
                            },
                            function()
                            {
                                view.retrieveanswers();
                            }
                            );
                        addmenuitem({
                                        ico: "fa fa-pencil-square-o",
                                        label:"Coordinator Subjects",
                                        id:"mnucoordinatorsubjects"
                                    },
                                    function()
                                    {
                                        model.getmysubjectcoord();
                                    });

                        addmenuitem(apputils.mnuactivate,
                                    function () {
                                        view.activateacct();
                                    }
                                    );

                        addmenuitem(apputils.mnuchangesem,
                                    function () {
                                        view.changeschoolyear();
                                    }
                                    );

                        addmenuitem({ico: "fa fa-video-camera",
                                      label: "Video Conference",
                                      id:"mnuvideoconfset"},
                                function()
                                {
                                    view.createvideoconference();
                                });


                        addmenuitem(
                            {
                                ico: "fa fa-qrcode",
                                label: "QR Code",
                                id: "mnuqrcode"
                            },
                            function ()
                            {
                                view.qrcode();
                                model.createqrcode();
                            }
                        );

                        break;

                    case "students":

                        addmenuitem(apputils.mnutimeline,
                                    function () {
                                        view.mainloading();
                                        apputils.filltimeline();
                                    }
                                    );

                        addmenuitem(apputils.mnucalendar, function () {
                                view.mainloading();
                                view.initcalendar();
                            });

                         addmenuitem(    {
                                            ico: "fa fa-calendar-check-o",
                                            label:"Assignments",
                                            id:"mnuassignmentslike"
                                        },
                            function ()
                            {
                                $("#name-rightbadge").data("c_assign", 0);
                                view.setupassignmentiface();
                                model.getmyassignments("btnfilterview", "Search");
                                $("#sel").change(function()
                                {
                                    $("#name-rightbadge").data("c_assign", 0);
                                    $("#user-timeline1").html(view.timelineitem(
                                              {btnicolor:'fa fa-remove',
                                                  theader:''}, '',
                                              'Click Search...',
                                              '...')
                                          );
                                });
                            });

                        addmenuitem(apputils.mnuclasscard,
                                function () {
                                    model.profile($("#name-rightbadge").data("lrn"),
                                        "umnu" + apputils.mnuclasscard.id,
                                       '');
                                });


                        addmenuitem(
                            {
                                ico: "fa fa-qrcode",
                                label: "QR Code",
                                id: "mnuqrcode"
                            },
                            function ()
                            {
                                view.qrcode();
                                model.createqrcode();
                            }
                        );
                            
                        addmenuitem(    {
                                            ico: "fa fa-check-square-o",
                                            label:"Online Exam",
                                            id:"mnuonlineexam"
                                        },
                            function ()
                            {
                               model.getmyexamsubjects();
                            });

                        
                        


                        break;

                    case "parents":
                         addmenuitem(apputils.mnutimeline);
                        $("#umnu" + apputils.mnutimeline.id)
                            .click(function () {
                                view.mainloading();
                                apputils.filltimeline();
                            });

                        addmenuitem(apputils.mnumykids,
                                function () {
                                    view.mykids();
                                }
                                );
                        break;

                    case "admin": case "principal":
                        addmenuitem(apputils.mnutimeline,
                                function () {
                                    view.mainloading();
                                    apputils.filltimeline();
                                }
                                );

                        addmenuitem({
                                     ico: "fa fa-eye",
                                        label:"Monitor Online Class",
                                        id:"mononlineclass"
                            },
                            function ()
                            {
                                view.onlineclassmon();
                                model.getonlineclasses();
                            });

                         addmenuitem(apputils.mnucalendar,
                                 function () {
                                    view.mainloading();
                                    view.initcalendar();
                                }
                                );

                         addmenuitem({
                                        ico: "fa fa-check-square-o",
                                        label:"Monitoring",
                                        id:"mnuadminmonitoring"
                                    },
                                    function()
                                    {
                                        view.teachermonitoring();
                                        model.teachermonitoring();
                                    });

                         addmenuitem({
                                     ico: "fa fa-pie-chart",
                                        label:"Performance",
                                        id:"aisaperfreport"
                            },
                            function ()
                            {

                                view.mainloading();
                                model.getprincipalevaluation();
                            });


                         addmenuitem({
                             ico: "fa fa-calendar-check-o",
                             label: "Deadlines",
                             id: "mnudeadlines"

                         },function()
                         {
                             view.deadline();
                         });

                           addmenuitem({
                                ico:"fa fa-pencil",
                                label: "Subject Coordinator",
                                id: "mnuexamencoders"
                             },
                             function ()
                             {
                                view.assigntestsubjects();
                             });

                            addmenuitem({
                                ico:"fa fa-line-chart",
                                label: "Performance Level",
                                id: "mnuperflevelprincipal"
                             },
                             function ()
                             {
                                view.perflevel();
                             });

                            addmenuitem(apputils.mnuchangesem,
                                    function () {
                                        view.changeschoolyear();
                                    }
                                    );

                        break;


                    case 'subadmin':
                        addmenuitem(apputils.mnutimeline,
                                function () {
                                    view.mainloading();
                                    apputils.filltimeline();
                                }
                                );

                         addmenuitem(apputils.mnucalendar,
                                 function () {
                                    view.mainloading();
                                    view.initcalendar();
                                }
                                );

                         addmenuitem({
                                        ico: "fa fa-check-square-o",
                                        label:"Monitoring",
                                        id:"mnuadminmonitoring"
                                    },
                                    function()
                                    {
                                        view.teachermonitoring();
                                        model.teachermonitoring();
                                    });


                         addmenuitem({
                             ico: "fa fa-calendar-check-o",
                             label: "Deadlines",
                             id: "mnudeadlines"

                         },function()
                         {
                             view.deadline();
                         });

                           addmenuitem({
                                ico:"fa fa-pencil",
                                label: "Subject Coordinator",
                                id: "mnuexamencoders"
                             },
                             function ()
                             {
                                view.assigntestsubjects();
                             });

                        addmenuitem({
                                ico:"fa fa-line-chart",
                                label: "Performance Level",
                                id: "mnuperflevelprincipal"
                             },
                             function ()
                             {
                                view.perflevel();
                             });

                        addmenuitem(apputils.mnuchangesem,
                                    function () {
                                        view.changeschoolyear();
                                    }
                                    );

                        addmenuitem({ico: "fa fa-video-camera",
                                      label: "Video Conference",
                                      id:"mnuvideoconfset"},
                                function()
                                {
                                    view.createvideoconference();
                                });

                        break;

                    case "super10":
                        addmenuitem(    {
                                            ico: "fa fa-dashboard",
                                            label:"Dashboard",
                                            id:"mnusuper10dboard"
                                        },
                            function ()
                            {
                               view.gradegendboard();
                               model.getgenimpression();
                            });

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

                         addmenuitem({
                                        ico: "fa fa-check-square-o",
                                        label:"Monitoring",
                                        id:"mnuadminmonitoring"
                                    },
                                    function()
                                    {
                                        view.principalmonitoring();
                                        model.principalmonitoring();
                                    });

                               addmenuitem(apputils.mnuchangesem,
                                    function () {
                                        view.changeschoolyear();
                                    }
                                    );

                            /*
                         addmenuitem({
                                        ico: "fa fa-th",
                                        label:"MPS",
                                        id:"mnudivisionmps"
                                    },
                                    function()
                                    {
                                        view.retrievempsdivision();
                                    });

                         addmenuitem({
                                        ico: "fa fa-bar-chart",
                                        label:"Item Analysis",
                                        id:"mnudivisionia"
                                    },
                                    function()
                                    {
                                        view.retrieveiadivision();
                                    });
                                */
                         addmenuitem({
                                ico:"fa fa-pencil",
                                label: "Subject Coordinator",
                                id: "mnuexamencoders"
                             },
                             function ()
                             {
                                view.assigntestsubjects();
                             });

                         addmenuitem(apputils.mnuchangesem,
                                    function () {
                                        view.changeschoolyear();
                                    }
                                    );
                         addmenuitem({ico: "fa fa-video-camera",
                                      label: "Video Conference",
                                      id:"mnuvideoconfset"},
                                    function()
                                    {
                                        view.createvideoconference();
                                    });

                        break;

                    case 'mande':

                         addmenuitem(    {
                                            ico: "fa fa-dashboard",
                                            label:"Dashboard",
                                            id:"mnusuper10dboard"
                                        },
                            function ()
                            {
                               view.gradegendboard();
                               model.getgenimpression();
                            });

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

                        addmenuitem({ico: "fa fa-video-camera",
                                      label: "Video Conference",
                                      id:"mnuvideoconfset"},
                            function()
                            {
                                view.createvideoconference();
                            });

                         /*
                         addmenuitem({
                                        ico: "fa fa-check-square-o",
                                        label:"Monitoring",
                                        id:"mnuadminmonitoring"
                                    },
                                    function()
                                    {
                                        view.principalmonitoring();
                                        model.principalmonitoring();
                                    });

                         addmenuitem({
                                        ico: "fa fa-th",
                                        label:"MPS",
                                        id:"mnudivisionmps"
                                    },
                                    function()
                                    {
                                        view.retrievempsdivision();
                                    });

                         addmenuitem({
                                        ico: "fa fa-bar-chart",
                                        label:"Item Analysis",
                                        id:"mnudivisionia"
                                    },
                                    function()
                                    {
                                        view.retrieveiadivision();
                                    });

                         addmenuitem({
                                ico:"fa fa-pencil",
                                label: "Subject Coordinator",
                                id: "mnuexamencoders"
                             },
                             function ()
                             {
                                view.assigntestsubjects();
                             }); */

                         addmenuitem(apputils.mnuchangesem,
                                    function () {
                                        view.changeschoolyear();
                                    }
                                    );

                        break;

                }


                addmenuitem(apputils.mnuchangepass,
                            function () {
                                view.initchangepass();
                            }
                            );

                addmenuitem(apputils.mnuuploadpic,
                    function () {
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
                        $(this).attr('src', '/static/dist/img/soon.jpg');
                    })
                    .attr('src', ref);
                $("#img-rightbadge").error(function () {
                        $(this).attr('src', '/static/dist/img/soon.jpg');
                    })
                    .attr('src', ref);
                $("#img-downbadge").error(function () {
                        $(this).attr('src', '/static/dist/img/soon.jpg');
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
                $("#announce").html("");
            }


            view.resetall = function ()
            {   
                $("#notifbell").hide()
                $("#name-rightbadge").html("");
                $("#name-downbadge").html("");
                $("#name-leftbadge").html("");
                $("#name-schoolyear").html("");
                $("#user-position").html("");
                $("#schoolname").html("Your");
                $("#user-menus").html("");
                $("#main").html("");
                view.setprofimg("/static/dist/img/avatar04.png");
                //model.sysout();
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

            view.showNotif = function(msg){
                    if (msg.type == 'Bulletin Board' || msg.type == 'comment' || msg.type == 'reaction') {
                        document.getElementById('messages').innerHTML += `
                        <div class="card m-3 " style="border:solid 1px black; margin:0.5em; padding:0.5em; border-radius:10px;">
                            <div class="card-body">
                            <h5 class="card-title">${msg.poster}</h5>
                            <h3 class="card-text">${msg.text}</h3>
                            <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="text-muted"><strong>Post Type:</strong> ${msg.type}<br><strong>Username:</strong> ${msg.username}<br><strong>User Type:</strong> ${msg.user_type}</p>
                            </div>
                            <div class="card-footer text-muted">
                            ${msg.timestamp}
                            </div>
                        </div>
                    
                    
                    `
                    } else if (msg.type == 'assignment') {
                        document.getElementById('messages').innerHTML += `
                        <div class="card m-3 style="border:solid 1px black; margin:0.5em; padding:0.5em; border-radius:10px;">
                            <div class="card-body">
                            <h5 class="card-title">${msg.poster}</h5>
                            <h3 class="card-text">${msg.text}</h3>
                            <p class="text-muted"><strong>Post Type:</strong> ${msg.type} <strong>Assignment Section:</strong> ${msg.section} <strong>Due Date:</strong> ${msg.due_date}<br><strong>Username:</strong> ${msg.username}<br><strong>User Type:</strong> ${msg.user_type}</p>
                            </div>
                            <div class="card-footer text-muted">
                            ${msg.timestamp}
                            </div>
                        </div>
                    
                    
                    `
                    } else if (msg.type == 'event') {
                        document.getElementById('messages').innerHTML += `
                        <div class="card m-3 style="border:solid 1px black; margin:0.5em; padding:0.5em; border-radius:10px;">
                            <div class="card-body">
                            <h5 class="card-title">${msg.poster}</h5>
                            <h3 class="card-text">${msg.text}</h3>
                            <p class="text-muted"><strong>Post Type:</strong> ${msg.type} <strong>Start Date:</strong> ${msg.start_date} <strong>End Date:</strong> ${msg.due_date}<br><strong>Username:</strong> ${msg.username}<br><strong>User Type:</strong> ${msg.user_type}</p>
                            </div>
                            <div class="card-footer text-muted">
                            ${msg.timestamp}
                            </div>
                        </div>
                    
                    
                    `
                    
                }
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

            view.inputtextonly = function (id, extension)
            {
                return '<input type="text" ' +
                          'class="form-control"'+
                    '  id="' + id + '" '+ extension + '>';
            }

            view.exinputtext = function (label, inputtype, id, extension)
            {
                return inputtext(label, inputtype, id, extension);
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

            view.selectsetsel = function(par_prop)
            {
                /*{
                   id:
                   moreclass:
                   cboonly:
                   values: [],
                   thisel:
                }*/
                moreclass = typeof par_prop.moreclass !== 'undefined' ? ' ' + par_prop.moreclass : "";
                cboonly = typeof par_prop.moreclass !== 'undefined' ? par_prop.cboonly : false;
                thisel = apputils.ifundefined(par_prop.thisel, par_prop.thisel, '');
                options = '';

                if (moreclass.length > 0)
                {
                    start = 1;
                    options += '<option selected="selected">' + par_prop.values[0] + '</option>';
                }
                else
                {
                    start = 0;
                }



                for (i=start; i < par_prop.values.length; i++)
                {
                   if (thisel === par_prop.values[i])
                   {
                          options += '<option selected="selected">' + par_prop.values[i] + '</option>';
                   }
                   else {
                       options += '<option>' + par_prop.values[i] + '</option>';
                   }

                }
                select = '<select id="'+par_prop.id+'" class="form-control'+
                    moreclass + '">' + options + '</select>';

                if (par_prop.cboonly)
                {
                    return select;
                }

                return '<label>'+par_prop.label+'</label>' + select;
            }


            function label (caption, id)
            {
                id = typeof id !== 'undefined' ? 'id="' + id +'"' : "";
                return '<label '+id+'>'+ caption +'</label>';
            }

            view.exlabel = function(id, caption)
            {
                return label(caption, id);
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

                fathermi	= formgroup(inputtext("Father Middle Name",
                    "text", "stufmname",
                    'placeholder="Father Middle Name"'));

                motherlname = formgroup(inputtext("Mother Last Name",
                    "text", "stumlname",
                    'placeholder="Mother Last Name"'));

                motherfname = formgroup(inputtext("Mother First Name",
                    "text", "stumfname",
                    'placeholder="Mother First Name"'));

                mothermi	= formgroup(inputtext("Mother Middle Name",
                    "text", "stummname",
                    'placeholder="Mother Middle Name"'));

                guardlname = formgroup(inputtext("Guard Last Name",
                    "text", "stuglname",
                    'placeholder="Guard Last Name"'));

                guardfname = formgroup(inputtext("Guard First Name",
                    "text", "stugfname",
                    'placeholder="Guard First Name"'));

                guardmi	= formgroup(inputtext("Guard Middle Name",
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
                {$("#lrn").val($("#name-rightbadge").data("freeid"));}
            }

            view.regautofill = function (par_id, eventer)
            {
                $("#name-rightbadge")
                    .data("enrlrn",
                        eventer);
                view.regdetail();
                model.getstudetails(par_id, $("#name-rightbadge").data("schoolid"));
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
                var tbdclass ='';

                if (par_prop.tbodyclass.length > 0)
                {
                    tbdclass = 'id="' + par_prop.tbodyclass + '"';
                }



                return '<table id="' + par_prop.id + '" class="table '+par_prop.class+'">' +
                    '<tbody ' + tbdclass + '>' +
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
                                                       view.centerize(view.buttonact("primary fa fa-cubes btn-lg", "&nbsp;Activate All", "model.getuseraccounts()", 'btngenerateallaccounts')) +
                                                       apputils.newline() +
                                                       '<div id="fortableusername"></div>' +
                                                       apputils.newline() +
                                                       '<hr />' +

                                                       view.centerize(
                                                            view.bslabel("info", "&nbsp;&nbsp;&nbsp;O  R&nbsp;&nbsp;&nbsp;"))+
                                                       '<hr />' +
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
                        ) + column(6, apputils.fileupload('form 1 (xlsx) ', 'form1upload'))
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


               view.socialbadgecustom = function (par_badge)
            {
                 /*
                 socialbadge(
                 {"name":"Orven E. Llantos",
                 "id":"2012-2015",
                 badgeid:
                 "imgsrc":"",
                 left: content,
                 middle: content,
                 right: content,
                 color: color
                 */

                //name, color,id, imgsrc,btn1, btnact1,btn2, btnact2, btn3, btnact3
                //bg-aqua-active ---> male
                //bg-maroon-active ---> female
                return' <div class="box box-widget widget-user"> ' +
                    ' <div class="widget-user-header '+par_badge.color+' "> ' +
                    ' <h3 id="uname' + par_badge.badgeid + '" class="widget-user-username">'+par_badge.name+'</h3> ' +
                    '  <h5 id="num'+ par_badge.badgeid +'" class="widget-user-desc">'+par_badge.id+'</h5> ' +
                    '</div> ' +
                    '<div class="widget-user-image"> ' +
                    '   <img class="img-circle" src="' + par_badge.imgsrc + '" alt="file not uploaded"> ' +
                    '</div> ' +
                    ' <div class="box-footer"> ' +
                    '    <div class="row"> ' +
                    '          <div id="left'  + par_badge.badgeid + '" class="col-sm-4 border-right"> ' +
                                        '<div class="description-block">' +
                                                par_badge.left +
                                        '</div>' +
                    '          </div> ' +


                    '          <div id="middle'+ par_badge.badgeid +'" class="col-sm-4 border-right"> ' +
                                        '<div class="description-block">' +
                                                par_badge.middle +
                                        '</div>' +
                    '          </div> '+

                    '          <div id="right'+ par_badge.badgeid + '" class="col-sm-4"> ' +
                                        '<div class="description-block">' +
                                                par_badge.right +
                                        '</div>' +
                    '          </div> ' +
                    '     </div> ' +
                    ' </div> ' +
                    '</div>';


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
                    ' id="btn1' +par_badge.id+'" ' +
                    ' onclick="'+par_badge.btnact1  +'">'+
                    par_badge.btn1 + '</button>' +
                    '          </div> ' +
                    '          <div class="col-sm-4 border-right"> ' +
                    '<button class="btn btn-warning btn-xs" '+
                    ' id="Edit'+par_badge.id+'" ' +
                    ' onclick="'+par_badge.btnact2+'">' +
                    par_badge.btn2 + '</button>' +
                    '          </div> ' +
                    '          <div class="col-sm-4"> ' +
                    '<button class="btn btn-danger btn-xs" ' +
                    ' id="btn3' +par_badge.id+'" ' +
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

                if ($("#name-rightbadge").data("usertype") == 'faculty') {
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
                    '<p id="pboxlrn" class="text-muted text-center">' +
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
                var boxid = typeof par_aboutme.id !== 'undefined' ? 'id = ' + par_aboutme.id : "";
                var id;
                for (i=0; i < par_aboutme.aboutme.length; i++)
                {
                    if (typeof par_aboutme.aboutme[i].id !== 'undefined')
                    {
                        id = ' id="' + par_aboutme.aboutme[i].id + '" ';
                    }
                    else
                    {
                        id = '';
                    }
                    entries = entries +
                        '<strong><i class="' + par_aboutme
                            .aboutme[i]
                            .icon + '"></i>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;' +
                        par_aboutme
                            .aboutme[i]
                            .label + '</strong>' +
                        '<p class="text-muted" ' + id + '>'+
                        par_aboutme
                            .aboutme[i]
                            .value +
                        '</p>' +
                        '<hr>';
                }



                return '<div ' + boxid + ' class="box box-primary">' +
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
                        center: "title",
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


                if ($("#name-rightbadge").data("usertype") == 'parents')
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





                    $("#name-rightbadge").data("timelrn", profile.lrn);

                }


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


                if ($("#name-rightbadge").data("usertype") == "parents")
                {
                    model.gettimeline("getchild");
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
                   /* else if ($(this).text() == "Calendar")
                    {

                    } */
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

            view.left = function (element)
            {
                return '<div style="text-align: left;">' +
                        element +
                        '</div>';
            }

            view.labelel = function (labelid, caption)
            {
                return '<span id="' +
                    labelid + '" class="label">'+caption+'</span>';
            }

            view.labelelcls = function (labelid, caption, color)
            {
                return '<span id="' +
                    labelid + '" class="label label-' + color + '">'+caption+'</span>';
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
                        view.boxembodiement({
                        boxcolor: "teal",
                        name: "",
                        idno: "",
                        picsrc:"",
                        embodiement: "<li></li>..."
                        })
                 */





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

            view.smallbadge = function(par_color, par_content, par_id)
            {
                loc_id = apputils.ifundefined(par_id, 'id="' + par_id + '"', "");
                return '<span ' + loc_id + ' class="badge bg-'+par_color+'">'+par_content+'</span>';
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
                    action = 'onclick="' + par_properties.action + '"';
                }

                apputils.echo(action);

                return '<a class="btn btn-app" '+action+'>' +
                    emphasis +
                    '<i class="fa ' + par_properties.icon + '"></i>' +
                    par_properties.label +
                    '</a>';

            }

            view.setbtnsquarter = function ()
            {
                currquarter = $("#name-rightbadge").data("quarter");
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
                            view.centerize(view.setbtnsquarter()),
                            "",
                            "")
                    ) +
                    view.excolumn(4, '')
                );
            }


            view.forgradeentry = function(addbutton, fcnstr, buttonon, showlockstatus)
            {

                addbutton = typeof addbutton !== 'undefined' ? addbutton : view.buttonact('success fa fa-save',
                    'Save All', "model.batchsavescores('btngradesaveall')",
                    "btngradesaveall");
                fcnstr = typeof fcnstr !== 'undefined' ? fcnstr : "model.savestudentscore";
                buttonon = apputils.ifundefined(buttonon, buttonon, true);
                showlockstatus = apputils.ifundefined(showlockstatus, showlockstatus, false);

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
                                    cols:
                                        (
                                        function ()
                                        {
                                          if (showlockstatus)
                                            return ['Locked:<p id="isgradelocked"></p>','Published:<p id="isgradepublished"></p>', '', '','','']
                                          else
                                              return ['','', '', '','','']
                                        }
                                        )()
                                    ,
                                    tdconfig: ['','style="vertical-align:middle"',
                                        'style="vertical-align:middle"',
                                        'style="width:70px;vertical-align:middle"',
                                        'style="vertical-align:middle"',
                                        'style="vertical-align:middle"'],
                                    rows:
                                        (
                                        function ()
                                        {
                                            _rows = [];
                                            _rows.push(['','<b>LRN No</b>', '<b>Name</b>', '<b>Entry</b>','', '']);
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
                                                        ['PRESENT',
                                                            'LATE', 'ABSENT'], "", true)
                                                    ,
                                                    view.buttonact('warning btn-flat fa fa-hand-peace-o',
                                                        '',
                                                        "model." +
                                                        "recordattendance('btnlate"+
                                                        instance.id +"', '" +
                                                        instance.id + "', 'LATE')",
                                                        "btnlate" + instance.id) +
                                                    view.buttonact('success btn-flat fa fa-thumbs-o-up',
                                                        '',
                                                        "model."+
                                                        "recordattendance('btnontime"+
                                                        instance.id +"', '" +
                                                        instance.id + "', 'PRESENT')",
                                                        "btnontime" + instance.id) +
                                                    view.buttonact('danger btn-flat fa fa-bed',
                                                        '',
                                                        "model."+
                                                        "recordattendance('btnabsent"+
                                                        instance.id +"', '" +
                                                        instance.id + "', 'ABSENT')",
                                                        "btnabsent" + instance.id),
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
                                                        ['PRESENT',
                                                            'LATE', 'ABSENT'], "", true),
                                                    view.buttonact('warning btn-flat fa fa-hand-peace-o',
                                                        '',
                                                        "model." +
                                                        "recordattendance('btnlate"+
                                                        instance.id +"', '" +
                                                        instance.id + "', 'LATE')",
                                                        "btnlate" + instance.id) +
                                                    view.buttonact('success btn-flat fa fa-thumbs-o-up',
                                                        '',
                                                        "model."+
                                                        "recordattendance('btnontime"+
                                                        instance.id +"', '" +
                                                        instance.id + "', 'PRESENT')",
                                                        "btnontime" + instance.id) +
                                                    view.buttonact('danger btn-flat fa fa-bed',
                                                        '',
                                                        "model."+
                                                        "recordattendance('btnabsent"+
                                                        instance.id +"', '" +
                                                        instance.id + "', 'ABSENT')",
                                                        "btnabsent" + instance.id),
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
                                content: view.aboutmebox({aboutme:
                                        [{
                                            icon: "fa fa-graduation-cap",
                                            label:"Data Entry",
                                            value:
                                            view.
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
                                                                "model.savegradeentry('savegradeentry')", "savegradeentry") +
                                                        apputils.newline() +
                                                        apputils.newline() +
                                                        apputils.space(3) +
                                                        view.buttonact("default fa fa-question", apputils.space(2) + "How to Encode New Entry", "model.posthelpaccess('Encode Score Tutorial', view.newscoreentrytut,  'btnnewskortut', '&nbsp;&nbsp;How to Encode New Entry')", "btnnewskortut") +
                                                        apputils.space(3) +
                                                        view.buttonact("default fa fa-question", apputils.space(2) + "How to Retrieve Encoded Entries", "model.posthelpaccess('Retrieve Score Tutorial', view.getscoreentrytut,  'btngetskortut', '&nbsp;&nbsp; How to Retrieve Encoded Entries')", "btngetskortut")
                                                    ) +
                                                '</div>')
                                        }]},
                                    "")
                            },
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
                                                            .buttonact("success fa fa-save", "&nbsp;&nbsp;Retrieve",
                                                                "model.retrieveattendance('retrieveattendance')",
                                                                "retrieveattendance")) +
                                                '</div>')
                                        }
                                        ]},"")
                            },
                            {
                                label: "Co-Teacher",
                                assoc: "forcoteachers",
                                content: '<table id="tabcoteacher" ' +
                                    ' data-search-align="left" ' +
                                    ' ></table>'

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

            view.composerow = function (par_cols, par_color)
            {
                loc_row = '<tr>';
                loc_color = apputils.ifundefined(par_color,'bgcolor="' + par_color + '"', '');

                for (var i = 0; i < par_cols.length; i++)
                {
                    loc_row += '<td ' + loc_color + '>' +
                        par_cols[i] +
                        '</td>';
                }
                loc_row += '</tr>';
                return loc_row;
            }

            view.subjectmanagement = function (par_subject)
            {


                $("#name-rightbadge").data("tracker", par_subject.label);
                $("#name-rightbadge").data("sectionid", par_subject.sectionid);
                $("#main").html(
                    column(12,
                        row(
                            column(3,
                                view.aboutmebox({
                                        id: "abtsubjdetails",
                                        aboutme: [
                                            {
                                                icon: "fa fa-hand-pointer-o",
                                                label: "Need Help?",
                                                value:
                                                    view.centerize(
                                                    view.buttonact
                                                                ("default fa fa-question",
                                                                    apputils.space(2) + "Click Me",
                                                                    "   model.posthelpaccess('Subject Mgt Tutorial'," +
                                                                    "    view.managesubjtut," +
                                                                    "    'btnmgtsubjtut', '&nbsp;&nbsp;Click Me');"
                                                                    , "btnmgtsubjtut"))

                                            },
                                            {
                                                icon: par_subject.icon,
                                                label: par_subject.label,
                                                value: par_subject.value,
                                                id: "subjectdescription"
                                            },
                                            {
                                                icon: "fa fa-cubes",
                                                label: "Grading Quarter",
                                                value: $("#name-rightbadge").data("quarter"),
                                                id: "aboutmequarter"
                                            },
                                            {
                                                icon: "fa fa-calendar",
                                                label: "School Year",
                                                value: $("#name-rightbadge").data("semid").substring(0,4) + "-" +
                                                $("#name-rightbadge").data("semid").substring(4,8),
                                                id:"abtschoolyear"
                                            },
                                            {
                                                icon: "",
                                                label: "Summative Report",
                                                value: '<div class="text-center">' +
                                                view.buttonact('success fa fa-line-chart',
                                                    'View Grades',
                                                    "model.retrievegrades()",
                                                    "btnviewgradesubmission") +
                                                     apputils.space(4) +
                                                view.buttonact('warning fa fa-list-alt',
                                                    'Quarterly Assessment',
                                                    "{view.quarterlyassessment(); " +
                                                    "model.getquarterlyassessment('btnquarterlyassessment','Quarterly Assessment');}",
                                                    'btnquarterlyassessment') +
                                                '</div>'
                                            },
                                                {
                                                    icon:"",
                                                    label:"File Operation",
                                                    value:'<div class="text-center">' + view.buttonact('success fa fa-upload',
                                                        'Upload',
                                                        "view.uploadclassrecord()",
                                                        "btnviewuploadclassrecord") + '</div>'
                                                }
                                        ]
                                    },
                                    "About"
                                ) +
                                view.aboutmebox({
                                        aboutme:
                                            [{
                                                id:"abtmesubjects",
                                                icon:"",
                                                label:"",
                                                value: (function (arrsubjects) {
                                                    loc_currsubjects = $("#name-rightbadge").data("tracker");
                                                    btns = '';
                                                    for (var i = 0; i < arrsubjects.length; i++) {
                                                        var btnobject = {
                                                            label: arrsubjects[i].label,
                                                            action: "model.getstudentssubject(" +
                                                            (function (x) {
                                                                return "$('#name-rightbadge').data('subjects')["+x+"]";
                                                            })(i) + ")",

                                                            icon: arrsubjects[i].icon
                                                        };

                                                        if (arrsubjects[i].label === $("#name-rightbadge").data("tracker"))
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
                                            } /*,
                                                {icon:"",
                                                    label:"File Operation",
                                                    value:'<div class="text-center">' + view.buttonact('success fa fa-upload',
                                                        'Upload',
                                                        "view.uploadclassrecord()",
                                                        "btnviewuploadclassrecord") + '</div>'
                                                }*/]
                                    },
                                    "Subjects")
                            )
                            +
                            column(9,
                            row(
                                column(12,
                                '<div id="managesubjectright">' +
                                fornavtabs()
                                +
                                '</div>')
                              )+
                            row( column(12,
                                '<div id="studentperfentries">' +
                                //view.forgradeentry()
                                + '</div>',
                                "grademain"
                                )) // this is the window that lists all students for grade(item entry..)

                            ) //column9

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
                        $("#studentperfentries").html(forattendanceentry());
                    }
                    else if (target === "#forcoteachers")
                    {
                         view.populationcoteachers();
                    }
                    else if (target === "#forclassrecord")
                    {
                        $("#studentperfentries").html("");
                    }
                    else
                    {
                        $("#studentperfentries").html(view.forgradeentry());
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

            }

            view.forgradesubmission = function()
            {
                $("#managesubjectright").html("");
                $("#studentperfentries").html("");
                $("#managesubjectright").html(


                    view.navtab(
                        {
                            tabs:[
                                {
                                    label: "Grade",
                                    assoc: "navtabgradeentry",
                                    content:
                                            view.forgradeentry(
                                                view.buttonact('success fa fa-floppy-o',
                                                    '&nbsp;&nbsp;Save',
                                                    " model.savequartergroupgrade('btnsavegrade')",
                                                    "btnsavegrade"
                                                ) +
                                                apputils.space(4) +
                                                view.buttonact("warning fa fa-lock", "&nbsp;&nbsp; Lock",
                                                    "model.lockgrades('btnlockgrades', '&nbsp;&nbsp; Lock')",
                                                    "btnlockgrades"
                                                ) +
                                                apputils.space(4) +
                                                view.buttonact("info fa fa-eye", "&nbsp;&nbsp;Publish",
                                                    "model.publishgrades('btnpublish', '&nbsp;&nbsp;Publish')", 'btnpublish') +
                                                apputils.space(4) +
                                                view.buttonact("default fa fa-backward", "&nbsp;&nbsp;Back",
                                                    "model.getstudentssubject(apputils.getSubjectFromOffID('" + $("#name-rightbadge").data("sectionid") + "'))", 'btnback')
                                                ,
                                                "model.savequarterstugrade", false, true)
                                }, //first element
                                {
                                    label: "Level of Proficiency",
                                    assoc: "navtablevelproficiency",
                                    content: '<table id="tablevelproficiency" ' +
                                            ' data-search="true" ' +
                                            ' data-search-align="left" ' +
                                            ' ></table>' + '<br />' +//row
                                            row(
                                                column(4,'') +
                                                column(4,view.buttonact("success fa fa-download","Download",
                                                    "apputils.tabtoexcel('tablevelproficiency', 'levelproficiency"+
                                                    $("#name-rightbadge").data("sectionid") +"')",
                                                    "btnprevcard")) +
                                                column(4,'')
                                            )
                                }
                            ] //tabs array
                        }//navtabs beginning
                    ) //navtab
                );

                $("#tablevelproficiency").bootstrapTable({
                    columns: [
                            {
                                field: 'proflevel',
                                title: 'Proficiency Level'
                            },
                            {
                                field: 'studentscount',
                                title: 'Students'
                            }

                    ]});

                $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    var target = $(e.target).attr("href") // activated tab

                     if (target === "#navtablevelproficiency")
                    {
                          model.getlevprofteacher(this);
                    }
                });


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
                        footer: row(column(3, view.buttonact("info fa fa-backward", "&nbsp;&nbsp;Back",
                            "{model.getstudentssubject(apputils.getcurrentsubjectbuttonprops()); "+
                            " $('#xlsxfile').unbind('change');$('#xlsxfile').unbind('click');}",
                            "btnsubmitxls")
                        ) + column(3, '') +
                         column(6, "Download a compatible " +
                             view.buttonact("btn btn-success fa fa-file-excel-o",
                                 "&nbsp; &nbsp;Excel File", "model.getxcelcrformat()", "btnxclcompat"))
                        )
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
                        if ($("#name-rightbadge").data("usertype") == "faculty")
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
                                text1: column(12, row("Image Upload (JPEG (.jpg) Only)" +
                                    view.exrow(
                                        view.excolumn(12,
                                                        view.fileuploadpair({
                                                                                 btnid: 'profile',
                                                                                 buttontype: 'default',
                                                                                 fileplaceid: 'file-input',
                                                                                 restrict: 'accept="image/jpeg, image/png"',
                                                                                 selectmode: "",
                                                                                 prsize:"sm",
                                                                                 fcn:"model.uploadprofilepic", buttonlabel:"Upload"
                                                                              })

                                            ))
                                    )
                                    +
                                    row(view.labelel("imgprogressmessage", ""))),

                                text2:"",
                                idt1:"",
                                idt2:"",
                                iconid:"imguploadicon"
                                        }) +
                                    function () {

                                       if ($("#name-rightbadge").data("usertype") == "faculty")
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
                //var dropbox = $("#dropbox"),
                //    message = $('.message', dropbox);
                $(".progress-bar").attr('style', 'width:0%')
                //var imglrn = ;
               //

               /* $("#userprofileid").change(function () {
                    //--------

                    //--------
                });

                $("#userprofileid").click(function() {$("#userprofileid").val("");});

                dropbox.filedrop({
                    fallback_id:'btnimagepass',
                    paramname:'file',
                    maxfiles: 1,
                    data :
                        {
                            lrn:function () {
                                if ($("#name-rightbadge").data("usertype") == "faculty")
                                    { return $("#imguploadlrn").val(); }
                                else
                                    { return ''; }
                                },
                        token: $("#name-rightbadge").data("token"),
                        group: $("#name-rightbadge").data("usertype"),
                        username: $("#name-rightbadge").data("username")
                        },
                    maxfilesize:2,
                    allowedfiletypes:['image/jpeg'],
                    allowedfileextensions:['.jpg','.jpeg'],
                    url: apputils.rest + '/image',
                    uploadFinished:function (i, file, response) {

                        $("#imguploadicon").removeClass('fa-refresh fa-spin').addClass('fa-upload');
                        //$.data(file).addClass('fa-upload');
                        $("#dropbox").html('<span class="message">DROP FILE HERE (.jpg only).</span>');
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
                            if ($("#name-rightbadge").data("usertype") == "faculty")
                            { return $("#imguploadlrn").val(); }
                            else
                            { return ''; }
                        },
                            token: $("#name-rightbadge").data("token"),
                            group: $("#name-rightbadge").data("usertype"),
                            username: $("#name-rightbadge").data("username")
                        }
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
                   */


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
                            placeholder: "Type your announcement here."
                        })
                        + apputils.newline() +

                      view.flatbox(
                          {
                                type: "info",
                                title: "Select and upload files",
                                body: view.fileuploadpair({
                                                         btnid: 'bboard',
                                                         buttontype: 'success',
                                                         fileplaceid: 'bboard', //id
                                                         restrict: "", //'accept="image/jpeg, image/png"',
                                                         selectmode: "multiple", //"multiple" or ""
                                                         fcn:"model.uploadfilesbb",
                                                         buttonlabel:"Upload Files",
                                                         addpair:true
                                                })
                            }
                      )

                    ),
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

                                 return x[i].label.replace('none', '');
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
                        inputtext("Due Date",  "text",
                            "txtassignduedate", 
                            'placeholder="mm/dd/yyyy"')
                        + apputils.newline() +
                         view.flatbox(
                          {
                                type: "info",
                                title: "Select and upload files",
                                body: view.fileuploadpair({
                                                         btnid: 'howofiles',
                                                         buttontype: 'success',
                                                         fileplaceid: 'howofiles', //id
                                                         restrict: "", //'accept="image/jpeg, image/png"',
                                                         selectmode: "multiple", //"multiple" or ""
                                                         fcn:"model.uploadfilesbb",
                                                         buttonlabel:"Upload Files",
                                                         addpair:true
                                                })
                            }
                      )

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
                        }) + apputils.newline() +
                        apputils.newline() +
                         view.flatbox(
                          {
                                type: "info",
                                title: "Select and upload files",
                                body: view.fileuploadpair({
                                                         btnid: 'eventfiles',
                                                         buttontype: 'success',
                                                         fileplaceid: 'eventfiles', //id
                                                         restrict: "", //'accept="image/jpeg, image/png"',
                                                         selectmode: "multiple", //"multiple" or ""
                                                         fcn:"model.uploadfilesbb",
                                                         buttonlabel:"Upload Files",
                                                         addpair:true
                                                })
                            }
                      )

                    ),
                    footer: view.labelel("lblErrorEvent") +
                    view.buttonact("success pull-right", "Post",
                        "model.postevent('btnpostEvent')", "btnpostEvent")
                });
            }


            view.timepostbox = function ()
            {
                return column(12, view.navtab(
                    {
                        tabs:
                           function () {
                               if ($("#name-rightbadge").data("usertype") == "students" ||
                                   $("#name-rightbadge").data("usertype") == "parents"
                               )
                               {
                                     return [
                                                {
                                                    label: "Bulletin",
                                                    assoc: "tlpostbulletin",
                                                    content: view.initbulletinboard()
                                                }
                                           ]
                               }
                               else if ($("#name-rightbadge").data("grade") !== 'none') {
                                   return [{
                                               label: "Bulletin",
                                               assoc: "tlpostbulletin",
                                               content: view.initbulletinboard()
                                           },
                                           {
                                               label: "Assignment",
                                               assoc: "tlpostassignment",
                                               content: view.initassignment()
                                           },
                                           {
                                               label: "Event",
                                               assoc: "tlevent",
                                               content: view.initevent()
                                           }
                                        ]
                               }
                               else if ($("#name-rightbadge").data("usertype") == "admin" ||
                                        $("#name-rightbadge").data("usertype") == "subadmin" ||
                                        $("#name-rightbadge").data("usertype") == "super10" ||
                                        $("#name-rightbadge").data("usertype") == "bisor" ||
                                        $("#name-rightbadge").data("usertype") == "mande" ||
                                        $("#name-rightbadge").data("usertype") == "ispeval"
                               )

                               {
                                   return [{
                                               label: "Bulletin",
                                               assoc: "tlpostbulletin",
                                               content: view.initbulletinboard()
                                           },
                                           {
                                               label: "Event",
                                               assoc: "tlevent",
                                               content: view.initevent()
                                           }
                                        ]
                               }
                               else // this is for the co-teacher
                               {
                                   return [
                                       {
                                               label: "Assignment",
                                               assoc: "tlpostassignment",
                                               content: view.initassignment()
                                       }
                                   ]
                               }
                        }()
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
                            "<h3>" +
                            $("#name-rightbadge").data("semid").slice(0, $("#name-rightbadge").data("semid").length / 2) +
                            "-" +
                            $("#name-rightbadge").data("semid").slice($("#name-rightbadge").data("semid").length / 2, $("#name-rightbadge").data("semid").length) +
                            "</h3>" + "<br />" +
                            view.buttonact("success", "Change", "view.changeschoolyear()")
                        ),
                        footer:""
                    })
                );
            }

            view.setsemid = function (semid)
            {
                $("#name-schoolyear").html(
                     view.bslabel("warning", "SY: " + semid.substring(0, 4) + '-' + semid.substring(4,8)));
            }

            view.addcoteacher = function ()
            {
              $("#studentperfentries").html(
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

                            )
                        )
                        , "", "")
                ));
            }

            view.populationcoteachers = function ()
            {
                                view.addcoteacher();
                        $("#tabcoteacher").html(
                            view
                                .tablewithrows(
                                    {
                                        id:'tblcoteacher',
                                        class: '',
                                        cols: ['', '','Name', ''],
                                        tdconfig: ['','','style="vertical-align:middle"', 'style="vertical-align:middle"'],
                                        rows: function ()
                                        {
                                            sectionid = $("#name-rightbadge").data("sectionid").replace('-', '');
                                            _rows = [];
                                           for (i = 0; i < $("#name-rightbadge").data()[sectionid].length; i++)
                                           {
                                               _idnum = $("#name-rightbadge").data()[sectionid][i].idnum;
                                               if (_idnum !== '""')
                                               {
                                                   _rows.push([
                                                        '<img width="60px;" height="60px"  class="img-circle img-bordered-sm"'+
                                                         ' src=' + $("#name-rightbadge").data()[sectionid][i].pic + '>', '&nbsp;&nbsp;&nbsp;',
                                                               $("#name-rightbadge").data()[sectionid][i].fullname.replace(/\"/g, ''),
                                                       view.buttonact("danger btn-xs",
                                                         "Remove",
                                                      "model.removecoteacher('"+"removecollab"+_idnum+"','"+_idnum+"')",
                                                           "removecollab"+_idnum)])
                                               }

                                           }

                                           return _rows;
                                        }()
                                    }
                                    )
                        );
            }


            view.quarterlyassessment = function ()
            {
                var addbutton = '';
                $("#managesubjectright").html("");
                $("#studentperfentries").html("");
                $("#managesubjectright").html(
                    view.aboutmebox({
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
                                    cols: [view.buttonact("info fa fa-key", 'Answer Key', "{view.answerkey(); model.getanswerkey();}", "btnanswerkey"),
                                        'Total Items:<p id="aktotalitems"></p>', '', '','','', '', ''],
                                    tdconfig: ['','style="vertical-align:middle"',
                                        'style="vertical-align:middle"',
                                        'style="width:70px;vertical-align:middle"',
                                        'style="vertical-align:middle"',
                                        'style="vertical-align:middle"',
                                        'style="vertical-align:middle"',
                                        'style="vertical-align:middle"'],
                                    rows:
                                        (
                                        function ()
                                        {
                                            _rows = [];
                                            _rows.push(['','<b>LRN No</b>', '<b>Name</b>', '<b>Raw Score</b>',apputils.bold('Action'), apputils.bold('PS'), apputils.bold('Mastery'), '']);
                                            _rows.push(['<strong>Male</strong>','','','','', '', '', '']);

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
                                                    view.expar("raw_score"+ instance.id, ""),
                                                    view.buttonact('success  btn-flat fa fa-indent',
                                                               apputils.space(2) + 'Encode Answer', "view.encodeanswer('"+"btnencodeanswer" +
                                                                instance.id+"','"+ instance.id +"', '" + instance.name.toUpperCase() + "', '"
                                                                 +

                                                                'src\=' + instance.imgsrc

                                                                     + "', function(){return $('#raw_score" + instance.id + "').text();}())",
                                                                "btnencodeanswer" + instance.id),
                                                    view.expar("ps"+ instance.id, ""),
                                                    view.expar("ml" + instance.id, ""),
                                                    view.expar("error" + instance.id, "")
                                                ]);
                                            }

                                            _rows.push(['<strong>Female</strong>','','','','', '', '', '']);

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
                                                    view.expar("raw_score"+ instance.id, ""),
                                                    view.buttonact('success  btn-flat fa fa-indent',
                                                               apputils.space(2) + 'Encode Answer', "view.encodeanswer('"+"btnencodeanswer" +
                                                                instance.id+"','"+ instance.id +"', '" + instance.name.toUpperCase() + "', '"
                                                                 +
                                                                     'src\=' + instance.imgsrc
                                                        + "', function(){return $('#raw_score" + instance.id + "').text();}())",
                                                                "btnencodeanswer" + instance.id),
                                                    //view.exgendiv = function (par_class, par_content)
                                                    view.expar("ps"+ instance.id, ""),
                                                    view.expar("ml" + instance.id, ""),
                                                    view.expar("error" + instance.id, "")
                                                ]);
                                            }

                                            //_rows.push(['','', addbutton + "&nbsp;&nbsp;" + '']);//label("", "errorallarea"),'','', '']);
                                            return _rows;
                                        }
                                    )()


                                });
                            }
                        )() +
                            view.exrow(
                                view.centerize(
                                    view.excolumn(12,

                                                    view.buttonact("success fa fa-cloud-download",
                                                       apputils.space(3) + "Item Analysis and MPS Reports",
                                                        "model.downloadiamps()",
                                                        "btndownloadreport") +
                                                        apputils.space(3) +
                                                        view.buttonact("info fa fa-bar-chart",
                                                       apputils.space(3) +"View Raw Score and Mastery Level",
                                                       "model.getquarterlyassessment('btngetquarterassess', 'View Raw Score and Mastery Level');",
                                                       "btngetquarterassess"
                                                       )

                                                  )

                               )
                            )
                    }]
                }, "")
                );
            }

            view.answerkey = function()
            {
                var choices = ['-', 'A', 'B', 'C', 'D'];
                $("#managesubjectright").html("");
                $("#studentperfentries").html("");
                $("#managesubjectright").html(
                   view.exrow(
                    view.aboutmebox(
                        {aboutme:
                                [
                                    {
                                        icon: '',
                                        label: view.exrow(
                                                 view.excolumn(2,
                                                    "Total Score") +
                                                view.excolumn(1,'<input type="text" ' +
                                                    'class="form-control"'+
                                                    '  id="txtqatotalscore">')

                                        ),
                                        value:view.tablewithrows(
                                            {
                                                id: 'tblanswerkeys',
                                                class: '',
                                                cols: [
                                                    view.centerize("Item No"),
                                                    'Answer', view.centerize("Item No"), 'Answer'],
                                                tdconfig: [
                                                    'style="vertical-align:middle"',
                                                    'style="vertical-align:middle"',
                                                    'style="vertical-align:middle"',
                                                    'style="vertical-align:middle"'
                                                ],
                                                rows:

                                                       function () {
                                                      var res = [];
                                                      for (var i = 1; i <= 25; i++) {
                                                          res.push([apputils.bold(view.centerize(i.toString())), view.select('answer' + i.toString(), '', choices),
                                                              apputils.bold(view.centerize((i+25).toString())), view.select('answer' + (i + 25).toString(), '', choices)
                                                          ])
                                                      }
                                                      return res;
                                                  }()
                                            }

                                            ) +
                                            view.exrow(
                                                view.excolumn(
                                                    4, ''
                                                ) +
                                                view.excolumn(4,
                                                  view.centerize(
                                                    view.buttonact("success fa fa-save",
                                                       apputils.space(3) + "Save",
                                                        "model.saveanswerkey()",
                                                        "btnsaveanswerkey") +
                                                      apputils.space(3) +
                                                      view.buttonact("warning fa fa-lock", apputils.space(3) + "Lock",
                                                          "model.lockanswerkey()", "btnlockak") +
                                                      apputils.space(3) +
                                                      view.buttonact("info fa fa-backward",
                                                       apputils.space(3) + "Back",
                                                        "{view.quarterlyassessment();}",
                                                        "btnsaveanswerkey")


                                                  )) +
                                                view.excolumn(4, "")
                                            )
                                    }
                                    ]
                        },'Answer Key')

                )
                );

            }

            view.encodeanswer = function (par_btnid, par_lrn, par_fname, par_picsrc, par_raw_score)
            {
                 //'btnencodeanswer128081150421','128081150421', 'CARLOMAN, ARIANNE NOREEN BENEGILDO', 'src=/static/dist/img/soon.jpg')
                var choices = ['-', 'A', 'B', 'C', 'D'];
                $("#managesubjectright").html("");
                $("#studentperfentries").html("");
                $("#managesubjectright").html(
                   view.exrow( //main exrow
                    view.aboutmebox(
                        {aboutme:
                                [
                                    {
                                        icon: '',
                                        label:
                                           view.exrow(
                                               view.excolumn(1, '') +
                                               view.excolumn(2, '<img width="90px;" height="90px"  class="img-circle img-bordered-sm"'+
                                                    ' src="' + par_picsrc.split("src=")[1] + '">') +
                                               view.exrow(
                                                   view.excolumn(2,
                                                       par_lrn + apputils.newline() +
                                                       "Total Items" + apputils.newline() +
                                                         view.expar("","Raw Score")) +
                                                   view.excolumn(4, par_fname + apputils.newline() +
                                                       $("#name-rightbadge").data("aktotalitems") + apputils.newline() +
                                                       view.expar("txtstudentrawscore", par_raw_score))
                                               )
                                        ),
                                        value:view.tablewithrows(
                                            {
                                                id: 'tblanswerkeys',
                                                class: '',
                                                cols: [
                                                    view.centerize("Item No"),
                                                    'Answer', view.centerize("Item No"), 'Answer'],
                                                tdconfig: [
                                                    'style="vertical-align:middle"',
                                                    'style="vertical-align:middle"',
                                                    'style="vertical-align:middle"',
                                                    'style="vertical-align:middle"'
                                                ],
                                                rows:

                                                       function () {
                                                      var res = [];
                                                      for (var i = 1; i <= 25; i++) {
                                                          res.push([apputils.bold(view.centerize(i.toString())), view.select('answer' + i.toString(), '', choices),
                                                              apputils.bold(view.centerize((i+25).toString())), view.select('answer' + (i + 25).toString(), '', choices)
                                                          ])
                                                      }
                                                      return res;
                                                  }()
                                            }

                                            ) +
                                            view.exrow(
                                                view.excolumn(
                                                    4, ''
                                                ) +
                                                view.excolumn(4,
                                                  view.centerize(
                                                    view.buttonact("success fa fa-save",
                                                       apputils.space(3) + "Save",
                                                        "model.savestudentanswer('" + par_lrn + "')",
                                                        "btnsavestudentanswer") +
                                                      apputils.space(3) +
                                                      view.buttonact("info fa fa-backward",
                                                       apputils.space(3) + "Back",
                                                        "{view.quarterlyassessment();}",
                                                        "btnsaveanswerkey")


                                                  )) +
                                                view.excolumn(4, "")
                                            )
                                    }
                                    ]
                        },'Encoded Answer')
                ) //main exrow
                );

                model.getencodedstuanswers(par_lrn, "lblerror");

            }

            view.exgendiv = function (par_class, par_content)
            {
                return gendiv(par_class, par_content);
            }

            view.expar = function (par_id, par_content)
            {
                return '<p id="' + par_id + '">' + par_content + '</p>';
            }

            view.combochange = function (par_id, par_value)
            {
                $("#" + par_id).val(par_value);
                $("#" + par_id).change();
            }

            view.teachermonitoring = function ()
                {
                    //$("#managesubjectright").html("");
                    //$("#studentperfentries").html("");
                     $("#main").html(
                     view.excolumn(12,
                       view.exrow(
                           view.excolumn(12,
                                        view.aboutmebox({
                                                aboutme: [
                                                    {
                                                        "icon": "",
                                                        "label": '',
                                                        "value": row(
                                                            column(12,
                                                                    view.table({
                                                                        "id": "xxx",
                                                                        "class": "tables-bordered",
                                                                        "cols": ["Grade Level",
                                                                                  view.select(
                                                                                            'cbogmonradelevel',
                                                                                            '',
                                                                                            [1,2,3,4,5,6,7,8,9,10,11,12],
                                                                                            '',
                                                                                            true),
                                                                                 view.centerize(
                                                                                        "Quarter"),
                                                                                 view.left(
                                                                                        view.select(
                                                                                            'cbomonquarter',
                                                                                            '',
                                                                                            [1,2,3,4],
                                                                                            '',
                                                                                            true)
                                                                                    ),
                                                                                 view.buttonact("success",
                                                                                                "OK",
                                                                                                "{$('#name-rightbadge').data('mongrd', $('#cbogmonradelevel').val());" +
                                                                                                 " $('#name-rightbadge').data('monqrt', $('#cbomonquarter').val());" +
                                                                                                    "model.teachermonitoring();}",
                                                                                                "btnretrievereport")],
                                                                        "tbodyclass": ''
                                                                    })

                                                                )
                                                            ) +
                                                            boxwithminimize("boxmonitorclose", "Search Teacher",
                                                            column(12,
                                                                row(column(6, inputtext("", "text", "teachersearch",
                                                                    'placeholder="Type Last Name"')) +
                                                                    column(6,
                                                                        apputils.newline() +
                                                                        view.buttonact("info", "Search",
                                                                            "model.teachersearchmonitoring()",
                                                                            "btnsrchteach")
                                                                    )
                                                                )
                                                            )
                                                            , "", "collapsed-box") +
                                                            row(
                                                                column(12,
                                                                     view.table({
                                                                        "id": "tblmonteacherlist",
                                                                        "class": "tables-bordered",
                                                                        "cols": [
                                                                            "",
                                                                            "Full Name",
                                                                            view.centerize(
                                                                                "Grade " + apputils.newline()
                                                                                + "(%age compliance)"),
                                                                            view.centerize("Item Analysis " +
                                                                            apputils.newline() +
                                                                            "(%age compliance)"),
                                                                            ""
                                                                                 ],
                                                                        "tbodyclass": 'tabdetailsmonpop'
                                                                    })
                                                                    )

                                                            )
                                                    }/*,
                                                    {
                                                        "icon":"",
                                                        "label":"",
                                                        "value":""
                                                    }*/
                                                ]
                                            }, "Grade Report Monitoring"
                                        )//aboutme
                            )//column
                        )//row
                     )//column
                     ); //main.html

                }

                view.teacherreportdetails = function ()
                {
                    $("#main").html(
                      view.excolumn(12,
                        view.aboutmebox(
                                            {
                                            aboutme: [
                                                                {
                                                                    "icon": "",
                                                                    "label": "",
                                                                    "value": view.exrow(
                                                                        view.excolumn(2, view.exgendiv("rmdpic", "")) +
                                                                        view.excolumn(4,
                                                                                view.exrow(view.span("rmdname", "")) +
                                                                                view.exrow(view.span("rmdrank", "")) +
                                                                                view.exrow(view.span("rmdadviserof", "")) +
                                                                                view.exrow(view.span("", "Load As Of " + apputils.noww())) +
                                                                                view.exrow(view.span("rmclasssize", ""))
                                                                            )
                                                                        ) +
                                                                        apputils.newline()
                                                                        +
                                                                        view.exrow(
                                                                            view.excolumn(12,
                                                                                view.table({
                                                                                    "id":"tblrmddetails",
                                                                                    "class": "tables-bordered",
                                                                                    "cols":[
                                                                                        "Subject",
                                                                                        "Section",
                                                                                        "Descriptive Title",
                                                                                        "Grade Submission",
                                                                                        "IA Submission",
                                                                                        "Co-Teacher"
                                                                                    ],
                                                                                    "tbodyclass":""
                                                                                })
                                                                                )
                                                                        ) +
                                                                        view.exrow(
                                                                            view.centerize(
                                                                             /*view.excolumn(3, view.buttonact('danger fa ',
                                                                                                             "Remind All",
                                                                                                             "model.sendreminderall();",
                                                                                                             'btnremindallmonitoring')
                                                                             ) +*/
                                                                             view.excolumn(12,
                                                                                view.buttonact('danger fa ',
                                                                                                             "Remind All",
                                                                                                             "model.sendreminderall();",
                                                                                                             'btnremindallmonitoring') +
                                                                                 apputils.space(3) +
                                                                                view.buttonact("info fa fa-backward",
                                                                                    apputils.space(3) + "Back",
                                                                                    "{\n" +
                                                                                    "                                view.teachermonitoring();\n" +
                                                                                    " view.combochange('cbomonquarter', $('#name-rightbadge').data('monqrt')); " +
                                                                                    "    view.combochange('cbogmonradelevel', $('#name-rightbadge').data('mongrd')); " +
                                                                                    "                                model.teachermonitoring();\n" +
                                                                                    "                            }", 'btnbackrprtdetails')
                                                                             )//excolumn back button

                                                                            )//centerize


                                                                        )
                                                                 }
                                                        ]
                                          }, "Teacher Report Submission Details"
                                        ))
                    );
                }

                view.span = function (id, content)
                {
                    return '<span id="'+id+'">'+ content +'</span>';
                }

                view.deadline = function ()
                {
                    $("#main").html(
                        view.excolumn(12,
                            view.aboutmebox(
                                {
                                    aboutme: [
                                                  {
                                                      "icon": "",
                                                      "label": "",
                                                      "value":
                                                          view.exrow(
                                                            view.excolumn(3, "Quarter") +
                                                              view.excolumn(3, view.select(
                                                                                      'cbodlnquarter',
                                                                                      '',
                                                                                      [1,2,3,4],
                                                                                      '',
                                                                                      true))
                                                          ) +
                                                          apputils.newline() +
                                                          view.exrow(
                                                              view.excolumn(3, "Deadline for") +
                                                              view.excolumn(3, view.select(
                                                                                      'cbodlntype',
                                                                                      '',
                                                                                      ['Grade','Item Analysis'],
                                                                                      '',
                                                                                      true))) +
                                                           apputils.newline() +
                                                           view.exrow(
                                                               view.excolumn(3, "Date") +
                                                               view.excolumn(3, view.inputtextonly("txtdlndate", ''))
                                                           ) +
                                                          apputils.newline() +

                                                                  view.exrow(
                                                                          view.excolumn(3, "") +
                                                                          view.excolumn(3,
                                                                                view.centerize(
                                                                              view.buttonact("success",
                                                                                  "OK",
                                                                                  "model.setdeadline()",
                                                                                  "btnsetdeadline"))
                                                                          )
                                                                  )


                                                  }
                                                ]
                                  }
                            , "Deadlines")
                        )//excolumn
                    );

                    $("#txtdlndate").datetimepicker(
                                                        {format:'m-d-Y',
                                                            timepicker:false}
                                                            );

                }




                view.principalmonitoring = function ()
                {
                    //$("#managesubjectright").html("");
                    //$("#studentperfentries").html("");
                     $("#main").html(
                     view.excolumn(12,
                       view.exrow(
                           view.excolumn(12,
                                        view.aboutmebox({
                                                aboutme: [
                                                    {
                                                        "icon": "",
                                                        "label": '',
                                                        "value": row(
                                                            column(12,
                                                                    view.table({
                                                                        "id": "xxx",
                                                                        "class": "tables-bordered",
                                                                        "cols": [
                                                                                 view.centerize(
                                                                                        "Quarter"),
                                                                                 view.left(
                                                                                        view.select(
                                                                                            'cbomonquarter',
                                                                                            '',
                                                                                            [1,2,3,4],
                                                                                            '',
                                                                                            true)
                                                                                    ),
                                                                                 view.buttonact("success",
                                                                                                "OK",
                                                                                                 "{$('#name-rightbadge').data('monqrt', $('#cbomonquarter').val());" +
                                                                                                    "model.principalmonitoring();}",
                                                                                                "btnretrievereport")],
                                                                        "tbodyclass": ''
                                                                    })

                                                                )
                                                            )  +
                                                            row(
                                                                column(12,
                                                                     view.table({
                                                                        "id": "tblmonprincipallist",
                                                                        "class": "tables-bordered",
                                                                        "cols": [
                                                                            "",
                                                                            "Full Name",
                                                                            "School ID",
                                                                            "School Name",
                                                                            view.centerize(
                                                                                "Grade " + apputils.newline()
                                                                                + "(%age compliance)"),
                                                                            view.centerize("Item Analysis " +
                                                                            apputils.newline() +
                                                                            "(%age compliance)"),
                                                                            ""
                                                                                 ],
                                                                        "tbodyclass": 'tabdetailsmonpop'
                                                                    })
                                                                    )

                                                            ) +
                                                                        view.exrow(
                                                                            view.centerize(
                                                                             view.excolumn(12,
                                                                                view.buttonact('danger btn-flat',
                                                                                               "Remind All",
                                                                                                "model.remindallprincipal();",
                                                                                                'btnremindallprincipalsmoni') +
                                                                             apputils.space(3) +
                                                                              view.buttonact('info btn-flat',
                                                                                               "Compute MPS",
                                                                                                "model.computeaggrmps();",
                                                                                                'btncomputempsprincipalsmoni')
                                                                            + //Compute MPS
                                                                             apputils.space(3) +
                                                                                  view.buttonact('default btn-flat  ',
                                                                                               "Compute Item Analysis",
                                                                                                "model.computeaggria();",
                                                                                                'btncomputeiaprincipalsmoni')

                                                                            )//centerize


                                                                        ))
                                                    }/*,
                                                    {
                                                        "icon":"",
                                                        "label":"",
                                                        "value":""
                                                    }*/
                                                ]
                                            }, "Grade Report Monitoring"
                                        )//aboutme
                            )//column
                        )//row
                     )//column
                     ); //main.html

                }


                view.retrievempsdivision = function ()
                {
                    $("#main").html(
                        view.excolumn(12,
                            view.exrow(
                                view.excolumn(2, '') +
                                view.excolumn(8,
                                    view.simplebox({
                                      boxtype: "primary",
                                      title: "Retrieve MPS Report",
                                      body:
                                                    view.excolumn(3,
                                                            view.select(
                                                                        'cbomrtdivgrdlevel',
                                                                        'Grade Level',
                                                                        [1,2,3,4, 5, 6, 7, 8, 9, 10, 11, 12],
                                                                        '',
                                                                        false)) +
                                                    apputils.space(3) +
                                                          view.excolumn(4,
                                                             view.select(
                                                                        'cbomrtdivquarter',
                                                                        'Quarter',
                                                                        [1,2,3,4],
                                                                        '',
                                                                        false)) +
                                                    view.excolumn(3,
                                                                        apputils.newline() +
                                                                        view.buttonact("success",
                                                                               "OK",
                                                                              "{" + "model.retrievempsdivision();}",
                                                                              "btnretreivempsdiv"))

                                        ,
                                      footer: ''
                                    }) //simplebox

                                ) + //inner excolumn
                              view.excolumn(2, '')
                            ) //exrow
                        ) //outer excolumn

                    );

                }

                view.retrieveiadivision = function ()
                {
                    $("#main").html(
                        view.excolumn(12,
                            view.exrow(
                                view.excolumn(2, '') +
                                view.excolumn(8,
                                    view.simplebox({
                                      boxtype: "primary",
                                      title: "Retrieve Item Analysis Report",
                                      body:
                                                    view.excolumn(3,
                                                            view.select(
                                                                        'cboiadivgrdlevel',
                                                                        'Grade Level',
                                                                        [1,2,3,4, 5, 6, 7, 8, 9, 10, 11, 12],
                                                                        '',
                                                                        false)) +
                                                    apputils.space(3) +
                                                          view.excolumn(4,
                                                             view.select(
                                                                        'cboiadivquarter',
                                                                        'Quarter',
                                                                        [1,2,3,4],
                                                                        '',
                                                                        false)) +
                                                    view.excolumn(3,
                                                                        apputils.newline() +
                                                                        view.buttonact("success",
                                                                               "OK",
                                                                              "{" + "model.retrieveiadivision();}",
                                                                              "btnretreiveiadiv"))

                                        ,
                                      footer: ''
                                    }) //simplebox

                                ) + //inner excolumn
                              view.excolumn(2, '')
                            ) //exrow
                        ) //outer excolumn

                    );

                }



                view.assigntestsubjects = function ()
                {
                    $("#main").html(
                        view.excolumn(12,
                                view.exrow(
                                view.excolumn(2, "") +
                                view.excolumn(8, view.simplebox(
                                    {
                                        boxtype: "primary",
                                        title: "Subject Coordinator",
                                        body:
                                          view.exrow(
                                            view.excolumn(3,
                                                view.select(
                                                    'cbosubjects',
                                                    "Subjects",
                                                    ['--'].concat(
                                                    [
                                                        'ARPAN',
                                                        'ENG', 'EPP', 'FIL', 'MT',
                                                        'PE', 'E.L.S.', 'MATH', 'KOMUNIKASYON',
                                                        'SCI', 'TLE', 'MUS', 'ESP', 'LD', 'PHILO',
                                                        'HE', 'CAD', 'CID', 'CVD', 'HWMD',
                                                        'MEDIA-IT', 'OC', 'CONTEMPORARY','HLT', 'LIT',
                                                        'ARTS', 'GEN. MATH.', 'PEH',
                                                        'CUL.SOC.POL.', 'READWRITE'
                                                    ].sort()),
                                                    '',
                                                    false)
                                            ) +
                                            apputils.space(3) +
                                            view.excolumn(3,
                                                            view.select(
                                                                        'cbogrdlevel',
                                                                        'Grade Level',
                                                                        [1,2,3,4, 5, 6, 7, 8, 9, 10, 11, 12],
                                                                        '',
                                                                        false
                                                            )) +
                                            apputils.space(3) +
                                            view.excolumn(3,
                                                  view.select(
                                                                        'cboquarter',
                                                                        'Quarter',
                                                                        [1,2,3,4],
                                                                        '',
                                                                        false
                                                            )
                                                ) +

                                                view.excolumn(3,
                                                                        view.buttonact("success",
                                                                               "OK",
                                                                              "{" + "model.retrievesubjcoord()}",
                                                                              "btngetsubjcoord")
                                                            )
                                          )  + //first row
                                            apputils.newline() +
                                          view.exrow(
                                            view.excolumn(12,
                                              view.boxify("boxcoteachenclose", "Search Teacher",
                                                        view.excolumn(12,
                                                            view.exrow(view.excolumn(6,view.exinputtext("", "text", "teachersearch",
                                                                    'placeholder="Type Last Name"')) +
                                                                view.excolumn(6,
                                                                    apputils.newline() +
                                                                    view.buttonact("info", "Search",
                                                                        " model.searchcoords();",
                                                                        "btnsrchteach")
                                                                )
                                                            ) + '<br />' +
                                                            view.exrow(view.boxify("coteachsrchbox", "Search Results",
                                                                view.table({
                                                                        "id": "tblmonteacherlist",
                                                                        "class": "tables-bordered",
                                                                        "cols": [
                                                                            "", //id
                                                                            "Full Name",
                                                                            "School",
                                                                            ""
                                                                                 ],
                                                                        "tbodyclass": 'tabdetailsmonpop'
                                                                    }) //end table

                                                            ,"", ""
                                                                )//boxwithminimize

                                                        ))
                                              , "", "collapsed-box")//boxwithminimize



                                            )


                                          ) + //second row
                                            view.exrow(
                                                   view.excolumn(12,view.table({
                                                       "id": "tblsubjcoord",
                                                       "class": "tables-bordered",
                                                       "cols": [
                                                           "", //pictureid
                                                           "Full Name",
                                                           'School',
                                                           ""
                                                       ],
                                                       "tbodyclass": 'tblsubjcoorddata'
                                                   }))
                                               ) //third row
                                        , //end body
                                        footer:""
                                    })) +
                                view.excolumn(2, "")
                            )  //exrow
                        ) //excolumn
                    );
                }


                view.questionbox = function ()
                {


                    return  view.excolumn(12,
                              view.boxsolidonly(
                                {
                                    boxtype: "primary",
                                    title: "",
                                    body: view.exrow( //main row
                                                     view.exrow(
                                                         view.excolumn(12,
                                                         view.excolumn(2, "Start Time:", "") +
                                                         view.excolumn(2, "", "divstarttime") +
                                                         view.excolumn(2, "End Time:", "") +
                                                         view.excolumn(2, "", "divendtime") +
                                                         view.excolumn(2, "Remaining Time") +
                                                         view.excolumn(2, "", "divremtime")
                                                         )
                                                     ) +
                                                    apputils.newline() +
                                                    view.exrow(
                                                         view.excolumn(12,
                                                         view.excolumn(2, "Question No:", "1") +
                                                         view.excolumn(2, "", "divqnoflash") +
                                                         view.excolumn(2, "Total Questions:", "") +
                                                         view.excolumn(2, "", "divqtotalol") +
                                                         view.excolumn(2, "") +
                                                         view.excolumn(2, "", "")
                                                         )
                                                     ) +
                                                    apputils.newline() +
                                                    view.exrow(
                                                     view.excolumn(12,
                                                      view.excolumn(12,
                                                          view.boxsolidonly(
                                                              {
                                                                  boxtype: 'default',
                                                                  title: 'Question',
                                                                  body: view.simplediv("taQuestion", ""),
                                                                  footer:''
                                                              })

                                                    ))) + //exrow
                                                    apputils.newline() +
                                                    view.excolumn(12, //col123

                                                            view.exrow(
                                                               view.excolumn(3,
                                                                     "Option A"
                                                                   ) +
                                                                view.excolumn(9, view.simplediv('lblopta', ""))
                                                                ) +
                                                                    apputils.newline() +
                                                                    view.exrow(
                                                                       view.excolumn(3,
                                                                             "Option B"
                                                                           ) +
                                                                        view.excolumn(9, view.simplediv('lbloptb', ""))
                                                                ) +
                                                                    apputils.newline() +
                                                                    view.exrow(
                                                                       view.excolumn(3,
                                                                             "Option C"
                                                                           ) +
                                                                        view.excolumn(9, view.simplediv('lbloptc', ""))
                                                                ) +
                                                                    apputils.newline() +
                                                                    view.exrow(
                                                                       view.excolumn(3,
                                                                             "Option D"
                                                                           ) +
                                                                        view.excolumn(9, view.simplediv('lbloptd', ""))
                                                                ) +
                                                                    apputils.newline() +
                                                                    view.exrow(
                                                                        view.excolumn(3, "Answer") +
                                                                        view.excolumn(3, view.select("cboqanswer","", ["--","A", "B", "C", "D"], '',true)) +
                                                                        view.excolumn(3,
                                                                                         view.buttonact("success btn-flat", "Save", "model.saveqanswer()", "btnsaveq")
                                                                        )
                                                                    ) +
                                                                    apputils.newline() +
                                                                    '<hr />' +
                                                                    view.exrow(  view.excolumn(12,
                                                                        view.excolumn(3, view.buttonact("success btn-flat", "Back", "model.previousquestion()", 'btnbackq')) +
                                                                        view.excolumn(6, view.centerize(
                                                                                                view.buttonact("info btn-flat",
                                                                                                    "Submit", "model.submitanswers()",
                                                                                                    'btnsubmitq'))) +
                                                                         view.excolumn(2, "") +
                                                                       view.excolumn(1, view.buttonact("success btn-flat", "Next", "model.nextquestion()", 'btnnextq'))))
                                                    ) //col123
                                    ), //end main row
                                   footer:
                                     ""
                             })
                    )
                }


                view.setupencodequestions = function (par_subject, par_level)
                {
                    $("#main").html(
                       view.excolumn(12, //excol b
                        view.exrow( //exrow a
                        view.excolumn(12, //excol a
                            view.simplebox(
                                {
                                    boxtype: "primary",
                                    title: "Manage Questions",
                                    body:
                                    view.exrow(
                                        view.excolumn(3, "Subject") +
                                        view.excolumn(3, view.smallbadge('green',par_subject, "spansubject")) +
                                        view.excolumn(3, "Level") +
                                        view.excolumn(3, view.smallbadge('green',par_level, "spanlevel"))
                                    ) +
                                     /*   apputils.newline() +
                                        view.exrow(
                                        view.excolumn(3, "Question Start") +
                                        view.excolumn(3, view.inputtextonly("txtqstart","placeholder='Starting Question Number.'")) +
                                        view.excolumn(3, "Question End") +
                                        view.excolumn(3, view.inputtextonly("txtqend","placeholder='Ending Question Number.'"))
                                    )  + */
                                        apputils.newline() +
                                        function () {

                                            if ($("#name-rightbadge").data("usertype") !== 'bisor')
                                            {
                                                return '';
                                            }

                                           return  boxwithminimize("boxmanageexams", "Manage Exam",
                                                view.simplebox({
                                                    boxtype: "warning",
                                                    title: "",
                                                    body: view.exrow(
                                                        view.excolumn(12, //begin column
                                                            view.exrow(
                                                                view.excolumn(3, "Status") +
                                                                view.excolumn(3,
                                                                    view.simplediv('lblenabledstatus', '')
                                                                )
                                                            ) +
                                                            apputils.newline()
                                                            +
                                                            view.exrow(
                                                                view.excolumn(3, "No of Questions") +
                                                                view.excolumn(3, view.simplediv("noqc", "")) +
                                                                view.excolumn(3, "No of Authors") +
                                                                view.excolumn(3, view.simplediv("noauths", ""))
                                                            ) +
                                                            view.exrow(
                                                                view.excolumn(3, "Oldest Question") +
                                                                view.excolumn(3, view.simplediv("oldq", "")) +
                                                                view.excolumn(3, "Newest Question") +
                                                                view.excolumn(3, view.simplediv("newq", ""))
                                                            ) +
                                                            apputils.newline() +
                                                            '<hr />' +
                                                            view.exrow(
                                                                view.excolumn(12, view.centerize("Question Categories"))
                                                            ) +
                                                            view.exrow(
                                                                view.excolumn(2, "Easy") +
                                                                view.excolumn(2, view.simplediv("easyc", "")) +
                                                                view.excolumn(2, "Average") +
                                                                view.excolumn(2, view.simplediv("averagec", "")) +
                                                                view.excolumn(2, "Hard") +
                                                                view.excolumn(2, view.simplediv("hardc", ""))
                                                            ) +
                                                            '<hr />' +
                                                            apputils.newline() +
                                                            view.exrow(
                                                                view.excolumn(3, "Estimated Duration Time") +
                                                                view.excolumn(3, view.simplediv("divedt", ""))
                                                            ) +
                                                            apputils.newline() +
                                                            view.exrow(
                                                                view.excolumn(3, "Start Date/Time") +
                                                                view.excolumn(3, view.inputtextonly("txtstartex", 'placeholder="mm-dd-yyyy hh:mm"')) +
                                                                view.excolumn(3, "End Date/Time") +
                                                                view.excolumn(3, view.inputtextonly("txtendex", 'placeholder="mm-dd-yyyy hh:mm"'))
                                                            ) +
                                                            apputils.newline() +
                                                            view.exrow(
                                                                view.excolumn(12, view.centerize(
                                                                    view.buttonact("info btn-xs btn-flat", "Retrieve Info", "model.retrieveexaminfo()", "btnretrieveexam") +
                                                                    apputils.space(4) +
                                                                    view.buttonact("success btn-xs btn-flat", "Create Exam", "model.createexam()", "btncreateexam") +
                                                                    apputils.space(4) +
                                                                    view.buttonact("default btn-xs btn-flat", "Publish", "model.enableexam()", 'btnpublishexam') +
                                                                    apputils.space(4) +
                                                                    view.buttonact("warning btn-xs btn-flat", "Download", "model.downloadexam()", 'btndownloadexam')
                                                                    /*apputils.space(4) +
                                                                    view.buttonact("danger btn-xs btn-flat", 'Item Analysis and MPS', "model.computeoquizia()", 'btnexamitemanalysis')*/
                                                                ))
                                                            )
                                                            ,
                                                            '') // end column

                                                    ),
                                                    footer: ""
                                                }), "", "collapsed-box");

                                            }() +

                                        boxwithminimize("boxencodequestions", "Encode Questions",
                                        view.simplebox({
                                            boxtype: "danger",
                                            title:"Question Bank Info",
                                            body:view.excolumn(12, //begin column
                                                       view.exrow(
                                                                view.excolumn(3, "No of Questions") +
                                                                view.excolumn(3, view.simplediv("qnoqc", "")) +
                                                                view.excolumn(3, "No of Authors") +
                                                                view.excolumn(3, view.simplediv("qnoauths", ""))
                                                        ) +
                                                        view.exrow(
                                                                view.excolumn(3, "Oldest Question") +
                                                                view.excolumn(3, view.simplediv("qoldq", "")) +
                                                                view.excolumn(3, "Newest Question") +
                                                                view.excolumn(3, view.simplediv("qnewq", ""))
                                                        ) +
                                                        apputils.newline() +
                                                        '<hr />' +
                                                        view.exrow(
                                                            view.excolumn(12, view.centerize("Question Categories"))
                                                        ) +
                                                        view.exrow(
                                                            view.excolumn(2, "Easy") +
                                                            view.excolumn(2, view.simplediv("qeasyc", "")) +
                                                            view.excolumn(2, "Average") +
                                                            view.excolumn(2, view.simplediv("qaveragec", "")) +
                                                            view.excolumn(2, "Hard") +
                                                            view.excolumn(2, view.simplediv("qhardc", ""))
                                                        ) +
                                                         '<hr />' +
                                                        apputils.newline() +
                                                        view.exrow(
                                                             view.excolumn(3, "Estimated Duration Time") +
                                                             view.excolumn(3, view.simplediv("qdivedt",""))
                                                        ) +
                                                        apputils.newline() +
                                                        view.exrow(
                                                            view.excolumn(12, view.centerize(
                                                                view.buttonact("info btn-xs btn-flat", "Retrieve Info", "model.retrieveqbankinfo()", "btnretrieveqbank")
                                                            ))
                                                        )
                                                        ,
                                                        ''),
                                            footer:""
                                        }) +
                                        view.simplebox(
                                            {
                                                boxtype: "success",
                                                title: "Question Encoding",
                                                body:
                                                    view.exrow(
                                                    view.excolumn(3, "Skills Assessed") +
                                                    view.excolumn(3, view.inputtextonly("txtqskills","")) +
                                                    view.excolumn(3, "Topic") +
                                                    view.excolumn(3, view.inputtextonly("txtqtopic",""))
                                                ) +
                                                    apputils.newline() +
                                                    view.exrow(
                                                        view.excolumn(3, "Perceived Difficulty Level") +
                                                        view.excolumn(3, view.select("cboqlevel","", ["--","EASY", "AVERAGE", "DIFFICULT"], '',true)) +
                                                        view.excolumn(3, "Estimated Time to Answer (in Seconds)") +
                                                        view.excolumn(3, view.inputtextonly("txtqeta",""))
                                                    ) +
                                                    apputils.newline() +
                                                    view.exrow(
                                                        '<div id="div4ta">' +
                                                        view.excolumn(12, view.textarea(
                                                            {
                                                                id: "taQuestion",
                                                                rows:5,
                                                                cols:20,
                                                                wrap:'hard',
                                                                placeholder:"Type your Questions Here."
                                                            }
                                                        )) + '</div>'
                                                    ) + //exrow
                                                    apputils.newline() +
                                                    view.exrow(
                                                       view.excolumn(3,
                                                             "Option A"
                                                           ) +
                                                        view.excolumn(9, view.inputtextonly("txtopta", ""))
                                                ) +
                                                    apputils.newline() +
                                                    view.exrow(
                                                       view.excolumn(3,
                                                             "Option B"
                                                           ) +
                                                        view.excolumn(9, view.inputtextonly("txtoptb", ""))
                                                ) +
                                                    apputils.newline() +
                                                    view.exrow(
                                                       view.excolumn(3,
                                                             "Option C"
                                                           ) +
                                                        view.excolumn(9, view.inputtextonly("txtoptc", ""))
                                                ) +
                                                    apputils.newline() +
                                                    view.exrow(
                                                       view.excolumn(3,
                                                             "Option D"
                                                           ) +
                                                        view.excolumn(9, view.inputtextonly("txtoptd", ""))
                                                ) +
                                                    apputils.newline() +
                                                    view.exrow(
                                                        view.excolumn(3, "Answer") +
                                                        view.excolumn(3, view.select("cboqanswer","", ["--","A", "B", "C", "D"], '',true)) +
                                                        view.excolumn(3,
                                                                         view.buttonact("success btn-flat", "OK", "model.savequestion();", "btnsaveq")
                                                        )
                                                    ) +
                                                    apputils.newline() +
                                                    boxwithminimize("boxencodedq", "Question Bank",
                                                        view.exrow(
                                                            view.excolumn(4, "") +
                                                            view.excolumn(4, view.centerize(
                                                                view.buttonact("success", "Retrieve",
                                                                    "model.fetchexaminfo('btnretrieveq', 'Retrieve', '" + par_subject +"', '" + par_level + "', 1)","btnretrieveq")
                                                            ),"divfetchbtn") +
                                                            view.excolumn(4, "")
                                                        )
                                                        +
                                                        apputils.newline() +
                                                        view.exrow(
                                                        '<div id="qlists"></div>'
                                                    ), '', 'collapsed-box')
                                                ,
                                                footer:""
                                            }
                                            )//end inner simplebox
                                            , "", "collapsed-box")

                                    ,
                                    footer:""
                                }
                            )

                            ,'') //excol a
                    ) //exrow a

                       )   //excol b
                    );

                    $("#taQuestion").wysihtml5({toolbar:{"image":false}});
                    $("#txtstartex").datetimepicker({format: 'm-d-Y H:i', timepicker:true});
                    $("#txtendex").datetimepicker({format: 'm-d-Y H:i', timepicker:true});
                }

                view.simplediv = function (id, content)
                {
                    return '<div id="' + id + '">' + content + '</div>';
                }

                view.setquestionbox = function (par_attribs)
                {
                    /*
                    {
                       start_time:
                       end_time:
                       remaining:
                       question:
                       a:
                       b:
                       c:
                       d:
                    }
                     */

                        $("#divstarttime").html(par_attribs.start_time);
                        $("#divendtime").html(par_attribs.end_time);
                        //$("#divremtime").html(par_attribs.remaining);
                        $("#taQuestion").html(par_attribs.question);
                        $("#lblopta").html(par_attribs.a);
                        $("#lbloptb").html(par_attribs.b);
                        $("#lbloptc").html(par_attribs.c);
                        $("#lbloptd").html(par_attribs.d);

                }

            view.listitem = function(content)
            {
               return '<li>' +
                        content +
                      '</li>'
            }


            view.unorderedlist = function (id, lists)
            {
                return '<ul>' +
                        function ()
                        {
                            var ilist = '';

                            for (var i = 0; i < lists.length; i++)
                            {
                                ilist += view.listitem(lists[i]);
                            }

                            return ilist;
                        }()+
                        '</ul>';
            }

            view.qeditable = function (par_subject)
            {

               /*
                      id: par_id.
                      skills: par_skills,
                      topic: par_topic,
                      difflevel: par_difflevel,
                      eta: par_eta,
                      question: par_question,
                      a: par_a,
                      b: parb,
                      c: par_c,
                      d: par_d,
                      answer: par_answer,
                      isExam: par_isExam,
                      enabled: for_question status if enabled meaning included in the exam
                      encoded_by:
                      isQuestion:
                      difficulty_index:
                      diff_interp:
                      discrimination_index:
                      disc_interp:

                      qstatus:
                                          */


                apputils.echo("begin test");
                apputils.echo(par_subject);
                apputils.echo("end test");
                return view.excolumn(12, //excol b
                        view.exrow( //exrow a
                        view.excolumn(12, //excol a
                             view.boxsolidonly(
                                 {
                                     boxtype:"warning",
                                     title:"",
                                     body:
                                         view.exrow( //topmost
                                                view.excolumn(4,
                                                    view.boxembodiement({
                                                        boxcolor: "teal",
                                                        name: par_subject.encoded_by,
                                                        idno: "Encoder",
                                                        picsrc: par_subject.pic,
                                                        embodiement:
                                                                     view.listitem('<a href="#">Status ' +

                                                                         function () {
                                                                             var qstatus = par_subject.qstatus;
                                                                             var color = '';
                                                                             if (qstatus == 'Enabled')
                                                                                 color = 'green';
                                                                             else
                                                                                 color = 'default';

                                                                             return view.smallbadge(color + ' pull-right', qstatus, 'lbltogglequestion' + par_subject.id)
                                                                         }()
                                                                         +'</a>') /*+
                                                                                             view.listitem('<a href="#">Difficulty Index ' + view.smallbadge('blue pull-right',par_subject.difficulty_index, 'lbldi' + par_subject.id) +'</a>') +
                                                                                             view.listitem('<a href="#">Interpretation ' + view.smallbadge('blue pull-right', par_subject.diff_interp.substring(1, 23), 'lbldinterp' + par_subject.id) +'</a>') +
                                                                                             view.listitem('<a href="#">Discrimination Index ' + view.smallbadge('orange pull-right',par_subject.discrimination_index, 'lbldiscri' + par_subject.id) +'</a>') +
                                                                                             view.listitem('<a href="#">Interpretation ' + view.smallbadge('orange pull-right', par_subject.disc_interp.substring(1, 23), 'lbldiscriinterp' + par_subject.id) +'</a>')
                                                                                      */

                                                    }) +
                                                    view.centerize(
                                                        function () {
                                                           if (par_subject.qstatus === 'Enabled')
                                                            return view.buttonact("danger btn-xs btn-flat",
                                                                "Disable Question",
                                                                "model.toggleqitembox('" + par_subject.id + "', 'false')",
                                                                "btnqtoggle" + par_subject.id);
                                                           else
                                                               return view.buttonact("success btn-xs btn-flat",
                                                                "Enable Question",
                                                                "model.toggleqitembox('" + par_subject.id + "', 'true')",
                                                                "btnqtoggle" + par_subject.id)
                                                        }()
                                                    )

                                                    )



                                         +

                                         view.excolumn(8,
                                           view.excolumn(12,
                                             view.boxsolidonly(
                                                 {
                                                     boxtype:"default",
                                                     title:"Question Details",
                                                     body:
                                                     view.exrow(
                                                     view.excolumn(3, "Skills Assessed") +
                                                     view.excolumn(3, view.inputtextonly("txtqskills" + par_subject.id, ' value="' + par_subject.skills + '"')) +
                                                     view.excolumn(3, "Topic") +
                                                     view.excolumn(3, view.inputtextonly("txtqtopic" + par_subject.id, ' value="' + par_subject.topic + '"'))
                                                     ) +
                                                 apputils.newline() +
                                                 view.exrow(
                                                     view.excolumn(3, "Perceived Difficulty Level") +
                                                     //view.excolumn(3, view.select("cboqlevel" + par_subject.id,"", ["--","EASY", "AVERAGE", "DIFFICULT"], '',true)) +
                                                     view.excolumn(3, view.selectsetsel(
                                                         {
                                                             id: "cboqlevel" + par_subject.id,
                                                             moreclass: "",
                                                             values: ["--", "EASY", "AVERAGE", "DIFFICULT"],
                                                             cboonly: true,
                                                             label: "",
                                                             thisel: par_subject.difflevel
                                                         })) +
                                                     view.excolumn(3, "Estimated Time to Answer (in Seconds)") +
                                                     view.excolumn(3, view.inputtextonly("txtqeta" + par_subject.id, ' value="' + par_subject.eta + '"'))
                                                 ) +
                                                 apputils.newline() +
                                                 view.exrow(
                                                     '<div id="div4ta"' + par_subject.id + '>' +
                                                     view.excolumn(12, view.textarea(
                                                         {
                                                             id: "taQuestion" + par_subject.id,
                                                             rows: 5,
                                                             cols: 20,
                                                             wrap: 'hard',
                                                             placeholder: "Type your Questions Here.",
                                                             value: par_subject.question
                                                         }
                                                     )) + '</div>'
                                                 ) + //exrow
                                                 apputils.newline() +
                                                 view.exrow(
                                                     view.excolumn(3,
                                                         "Option A"
                                                     ) +
                                                     view.excolumn(9, view.inputtextonly("txtopta" + par_subject.id, ' value="' + par_subject.a + '"'))
                                                 ) +
                                                 apputils.newline() +
                                                 view.exrow(
                                                     view.excolumn(3,
                                                         "Option B"
                                                     ) +
                                                     view.excolumn(9, view.inputtextonly("txtoptb" + par_subject.id, ' value="' + par_subject.b + '"'))
                                                 ) +
                                                 apputils.newline() +
                                                 view.exrow(
                                                     view.excolumn(3,
                                                         "Option C"
                                                     ) +
                                                     view.excolumn(9, view.inputtextonly("txtoptc" + par_subject.id, ' value="' + par_subject.c + '"'))
                                                 ) +
                                                 apputils.newline() +
                                                 view.exrow(
                                                     view.excolumn(3,
                                                         "Option D"
                                                     ) +
                                                     view.excolumn(9, view.inputtextonly("txtoptd" + par_subject.id, ' value="' + par_subject.d + '"'))
                                                 ) +
                                                 apputils.newline() +
                                                 view.exrow(
                                                     view.excolumn(3, "Answer") +
                                                     view.excolumn(3, view.selectsetsel(
                                                         {
                                                             id: "cboqanswer" + par_subject.id,
                                                             moreclass: "",
                                                             values: ["--", "A", "B", "C", "D"],
                                                             cboonly: true,
                                                             label: "",
                                                             thisel: par_subject.answer
                                                         })) +
                                                     view.excolumn(3,
                                                         view.buttonact("success btn-flat", "OK", "model.editedquestion('" + par_subject.id + "')", "btnsaveq" + par_subject.id)
                                                     )
                                                 ),
                                                     footer:""
                                            }
                                         ) //boxonly
                                           )//excolumn 8
                                         , '') //side column 8

                                            ) //topmost row
                                    })

                                           ,'' )//end excol a


                    ) //exrow a

                       );  //excol b
            }


            view.boxsolidonly = function (par_prop) //no close button
            {
                return '<div class="box box-solid box-' + par_prop.boxtype + '">' +
                            '<div class="box-header with-border">' +
                              '<h3 class="box-title">' + par_prop.title + '</h3>' +
                            '</div>' +
                            '<div class="box-body">'+
                                   par_prop.body +
                            '</div>' +
                    '</div>';
            }


             view.socialbadgeonly = function (par_badge)
            {
                /**
                 *socialbadgeonly({"name":"Orven E. Llantos",
                 *"id":"2012-2015",
                 *"imgsrc":"",
                 *content1: "",
                 *content2: "",
                 *content3: "",
                 *"color": "bg-lime-active"})
                 */


                return' <div class="box box-widget widget-user"> ' +
                    ' <div class="widget-user-header ' + par_badge.color + ' "> ' +
                    ' <h3 id="uname' + par_badge.id + '" class="widget-user-username">'+par_badge.name+'</h3> ' +
                    '  <h5 id="num'+ par_badge.id +'" class="widget-user-desc">'+par_badge.id+'</h5> ' +
                    '</div> ' +
                    '<div class="widget-user-image"> ' +
                    '   <img class="img-circle" src="' + par_badge.imgsrc + '" alt="file not uploaded"> ' +
                    '</div> ' +
                    ' <div class="box-footer"> ' +
                    '    <div class="row"> ' +
                    '          <div class="col-sm-4 border-right"> ' +
                        par_badge.content1 +
                    '          </div> ' +
                    '          <div class="col-sm-4 border-right"> ' +
                        par_badge.content2 +
                    '          </div> ' +
                    '          <div class="col-sm-4"> ' +
                         par_badge.content3 +
                    '          </div> ' +
                    '     </div> ' +
                    ' </div> ' +
                    '</div>';


            }

            view.boxonly = function (par_content)
            {
                return '<div class="box">' + par_content +'</div>';
            }


            view.studentexamiface = function (par_subjectid, par_level)
            {
                $("#main").html(
                    view.exrow(//row.main
                        view.excolumn(12, //col.main
                            view.exrow( //row.qbox
                                 view.excolumn(12, //col.qbox
                                    view.questionbox() //questionbox
                                 )//col.qbox
                            ) //row.qbox

                        ) //col.main
                    )//row.main
                );
            }

            view.showanswers = function(par_answertext)
            {
                    $("#main").html(
                        view.excolumn(12,
                            view.excolumn(12,
                                      view.exrow( //main exrow
                                          view.aboutmebox(
                                    {aboutme:
                                            [
                                                {
                                                    icon: '',
                                                    label:'Please copy your answers on the paper provided.',
                                                    value:view.tablewithrows(
                                                        {
                                                            id: 'tblanswerkeys',
                                                            class: '',
                                                            cols: [
                                                                view.centerize("Item No"),
                                                                'Answer', view.centerize("Item No"), 'Answer'],
                                                            tdconfig: [
                                                                'style="vertical-align:middle"',
                                                                'style="vertical-align:middle"',
                                                                'style="vertical-align:middle"',
                                                                'style="vertical-align:middle"'
                                                            ],
                                                            rows:

                                                                   function () {
                                                                  var res = [];
                                                                  for (var i = 1; i <= 25; i++) {
                                                                      res.push([apputils.bold(view.centerize(i.toString())), view.simplediv('answer' + i.toString(), 'N/A'),
                                                                          apputils.bold(view.centerize((i+25).toString())), view.simplediv('answer' + (i + 25).toString(), 'N/A')
                                                                      ])
                                                                  }

                                                                  return res;
                                                              }()
                                                        }

                                                        )
                                                }
                                                ]
                                    },'Answers')
                            ) //main exrow
                            ) //inner excolumn
                        ) //outer excolumn
                    );

                    for (var i = 0; i < par_answertext.length; i++)
                    {
                        $("#answer" + (i + 1).toString()).html(
                          apputils.fontsize(4,  apputils.bold(par_answertext.substr(i, 1)))
                        );
                    }
            }

            view.manageonlineexam = function()
            {
                $("#main").html(
                            view.excolumn(12,
                              view.simplebox({

                                      boxtype: "primary",
                                      title: "Manage Online Exam",
                                      body:
                                          view.exrow(
                                              view.excolumn(3,

                                                  view.select(
                                                      'cbosubjects',
                                                      "Subjects",
                                                      ['--'].concat(
                                                          [
                                                              'ARPAN',
                                                              'ENG', 'EPP', 'FIL', 'MT',
                                                              'PE', 'E.L.S.', 'MATH', 'KOMUNIKASYON',
                                                              'SCI', 'TLE', 'MUS', 'ESP', 'LD', 'PHILO',
                                                              'HE', 'CAD', 'CID', 'CVD', 'HWMD',
                                                              'MEDIA-IT', 'OC', 'CONTEMPORARY', 'HLT', 'LIT',
                                                              'ARTS', 'GEN. MATH.', 'PEH',
                                                              'CUL.SOC.POL.', 'READWRITE'
                                                          ].sort()),
                                                      '',
                                                      false)
                                              ) +
                                              apputils.space(3) +
                                              view.excolumn(3,
                                                  view.select(
                                                      'cbogrdlevel',
                                                      'Grade Level',
                                                      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                                      '',
                                                      false
                                                  )) +
                                              apputils.space(3) +
                                              view.excolumn(3,
                                                  view.select(
                                                      'cboquarter',
                                                      'Quarter',
                                                      [1, 2, 3, 4],
                                                      '',
                                                      false
                                                  )
                                              ) +

                                              view.excolumn(3,
                                                  view.buttonact("success",
                                                      "OK",
                                                      "{}",
                                                      "btngetsubjcoord")
                                              )
                                          ),
                                      footer: ""
                                  }
                              )
                            )
                );
                //{$("#name-rightbadge").data('quarter', " + $("#cboquarter").val() + ")" + " view.setupencodequestions('" + $("#cbosubjects").val() + "', " + $("#cbogrdlevel").val() + ")}"
                $("#btngetsubjcoord")
                    .off("click")
                    .click(
                        function ()
                        {
                            $("#name-rightbadge").data('quarter',  $("#cboquarter").val());
                            view.setupencodequestions($("#cbosubjects").val(),
                                $("#cbogrdlevel").val());
                        }
                    )

            }


            view.principalmonitoringisp = function (par_status)
                {
                    //$("#managesubjectright").html("");
                    //$("#studentperfentries").html("");

                    status = apputils.ifundefined(par_status, view.smallbadge('default', 'offline'), '');


                     $("#main").html(
                     view.excolumn(12,
                       view.exrow(
                           view.excolumn(12,
                                        view.aboutmebox({
                                                aboutme: [
                                                    {
                                                        "icon": "",
                                                        "label": '',
                                                        "value":
                                                            row(
                                                                column(12,
                                                                     view.table({
                                                                        "id": "tblmonprincipallist",
                                                                        "class": "tables-bordered",
                                                                        "cols": [
                                                                            "",
                                                                            "Full Name",
                                                                            "School ID",
                                                                            "School Name",
                                                                            view.centerize(
                                                                                "Rating"),
                                                                            ""
                                                                                 ],
                                                                        "tbodyclass": 'tabdetailsmonpop'
                                                                    })
                                                                    )
                                                            )
                                                    }/*,
                                                    {
                                                        "icon":"",
                                                        "label":"",
                                                        "value":""
                                                    }*/
                                                ]
                                            }, "Principal Rating"
                                        )//aboutme
                            )//column
                        )//row
                     )//column
                     ); //main.html

                }

                view.encodeaisa = function (
                    par_btnid,
                    par_personid,
                    par_schoolid,
                    par_pic,
                    par_schoolname,
                    par_principalname,
                    par_overall,
                    par_details,
                    par_ispdetails
                )
                {
                    apputils.echo(par_overall);
                    apputils.echo(par_details);

                    var isqs = apputils.ifundefined(
                    $("#name-rightbadge").data('isqs'),
                    $("#name-rightbadge").data('isqs'),
                    []);
                ;
                apputils.echo('isqs');
                apputils.echo(isqs);
                apputils.echo($("#name-rightbadge").data('isqs'))
                var loc_body = '';
                var loc_options = ['--', '4','3', '2', '1', '0'];
                var loc_ratingdetails =
                    apputils.ifundefined(
                                            $("#name-rightbadge").data(par_personid),
                                            $("#name-rightbadge").data(par_personid),
                                            par_ispdetails
                    ).split(',');
                var isqs_content = {};
                var loc_mapper = 0;
                var remarks ='';




                if (
                    apputils
                        .ifundefined(
                            $('#name-rightbadge')
                                .data(par_personid),
                            $('#name-rightbadge')
                                .data(par_personid),
                            '')
                    === '') {

                    $('#name-rightbadge').data(par_personid.replace(/\-/g, ''), par_ispdetails);
                }
                if (loc_ratingdetails.length == 44)
                {
                    for (var i = 0; i < isqs.length; i ++)
                    {
                        var cboid = isqs[i].item.replace(/\./g, '');
                        if (!isqs[i].bold)
                        {
                            isqs_content[cboid] = loc_ratingdetails[loc_mapper];
                            loc_mapper = loc_mapper + 1;
                        }

                    }

                    remarks = loc_ratingdetails[43];
                }

                var colorit = function (par_rating)
                {
                    if (parseFloat(par_rating) < 3.0)
                    {
                        return 'orange';
                    }
                    else
                    {
                        return 'teal';
                    }
                }

                var colormain = function (par_rating)
                {
                    par_overall = parseFloat(par_rating);
                            if (par_overall >= 3.61)
                             {
                                 return 'green';
                             }
                             else if (par_overall >= 2.71)
                             {
                                 return 'blue';
                             }
                             else if (par_overall >= 1.81)
                             {
                                 return 'aqua';
                             }
                             else if (par_overall >= 0.91)
                             {
                                 return 'yellow';
                             }
                             else if (par_overall > 0.0)
                             {
                                 return 'red';
                             }
                             else
                             {
                                 return 'gray';
                             }

                }
                        $("#main").html(
                            view.excolumn(12, //1 excolumn
                                view.simplebox( //simplebox
                                    {
                                        boxtype: "primary",
                                        title: 'Instructional Supervisory Tool for School Heads',
                                        body:
                                             view.exrow(
                                                view.excolumn(12, //2 excolumn
                                                view.excolumn(4, //boxid
                                                    view.boxembodiement({
                                                        idno: par_schoolid + apputils.newline() + par_schoolname,
                                                        name: par_principalname,
                                                        picsrc: par_pic,
                                                        boxcolor: 'info',
                                                        embodiement: view.listitem(
                                                                                '<a >' +
                                                                                    apputils.bold('Overall Rating') +
                                                                                    view.smallbadge(
                                                                                        colormain(par_overall) + ' pull-right',
                                                                                        par_overall
                                                                                    ) +
                                                                                '</a>'
                                                                                ) +
                                                                        function ()
                                                                                {
                                                                                    var ilist = '';
                                                                                    lists = par_details.split(',');
                                                                                    ilist += view.listitem('<a >' +
                                                                                                '1. ISP&I' +
                                                                                                view.smallbadge(
                                                                                                        colorit(lists[0]) + ' pull-right',
                                                                                                        lists[0]
                                                                                                    ) +
                                                                                            '</a>');
                                                                                    ilist += view.listitem('<a >' +
                                                                                                '2. SHIWT' +
                                                                                                view.smallbadge(
                                                                                                        colorit(lists[1]) + ' pull-right',
                                                                                                        lists[1]
                                                                                                    ) +
                                                                                            '</a>');

                                                                                    ilist += view.listitem('<a >' +
                                                                                                '3. CITIP' +
                                                                                                view.smallbadge(
                                                                                                        colorit(lists[2]) + ' pull-right',
                                                                                                        lists[2]
                                                                                                    ) +
                                                                                            '</a>');

                                                                                    ilist += view.listitem('<a >' +
                                                                                                '4. LE' +
                                                                                                view.smallbadge(
                                                                                                        colorit(lists[3]) + ' pull-right',
                                                                                                        lists[3]
                                                                                                    ) +
                                                                                            '</a>');

                                                                                    return ilist;
                                                                                }()
                                                    })) + //boxid
                                                view.excolumn(8, //questionnaire
                                                  view.exrow(
                                                    view.table({
                                                        "id":"tblaisatool",
                                                        "class":"tables-bordered",
                                                        "cols": [
                                                            'Item',
                                                            'Description',
                                                           apputils.space(3) + 'Rating' + apputils.space(3)
                                                        ],
                                                        "tbodyclass": 'tblaisatool'
                                                    })
                                                  ) +  //exrow table
                                                    view.exrow(
                                                        view.boxsolidonly(
                                                            {
                                                                boxtype: "default",
                                                                title: "Remarks",
                                                                body: view
                                                                .textarea(
                                                                    {
                                                                        id: "taRemarksisqs",
                                                                        rows: 4,
                                                                        placeholder: "Evaluation Remarks",
                                                                        value:remarks
                                                                    }
                                                                ),
                                                                footer: ""
                                                            }
                                                        )//boxsolidonly
                                                    ) + //exrow textarea
                                                    view.exrow(
                                                        view.centerize(
                                                                view.buttonact(
                                                                    "success btn-flat btn-sm fa fa-save",
                                                                    apputils.space(2) + "Save",
                                                                    "model.saveisqrating('" + par_personid + "')",
                                                                    "btnsaveisq"
                                                                ) + apputils.space(4) +
                                                                view.buttonact(
                                                                    "info btn-flat btn-sm fa fa-eye",
                                                                    apputils.space(2) + "Publish",
                                                                    "model.publishisqrating('" + par_personid + "')",
                                                                    "btnpublishisq"
                                                                )
                                                        )
                                                    )

                                                ) //questionnaire
                                                )//2 excolumn
                                             ) + //row
                                            view.exrow(
                                                ''

                                            ) //row
                                        , //body

                                        footer: ''
                                    }
                                ) //simplebox

                            ) //1 excolumn
                        );



                for (var i=0; i < isqs.length; i++)
                {
                    loc_body += view.composerow([
                        isqs[i].item,
                        function ()
                        {
                          if (isqs[i].bold) {
                           return  apputils.bold(isqs[i].desc);
                          }
                          return isqs[i].desc;
                        }(),
                                function ()
                                {
                                    var this_sel = '--';
                                    var cboid = isqs[i].item.replace(/\./g, '');

                                    if (loc_ratingdetails.length == 44)
                                    {
                                        this_sel = isqs_content[cboid];
                                    }

                                    if (!isqs[i].bold) {



                                        return   view.selectsetsel(
                                            {
                                                id: "cboisaitem" + cboid,
                                                moreclass: "",
                                                values: loc_options,
                                                cboonly: true,
                                                label: "",
                                                thisel: this_sel
                                            }
                                        )
                                    }

                                    return '';

                                }()

                    ],
                     function ()
                     {
                         if (!isqs[i].bold) {
                             var cboid = isqs[i].item.replace(/\./g, '');
                             if (parseFloat(isqs_content[cboid]) < 3.0)
                             {
                                 return '#F5A188';
                             }
                             return '';
                         }
                         return '';
                     }()
                        );
                }

                $("#tblaisatool > tbody").append(loc_body);
                $("#taRemarksisqs").wysihtml5({toolbar:{"image":false}})






                }


                view.displayprinceval = function (
                    par_ratedby, //{name,d8t, pic}
                    par_publishedby, //{name,d8t, pic}
                    par_overall,
                    par_details,
                    par_ispdetails,
                    par_interp
                )
                {
                    var isqs = $("#name-rightbadge").data('isqs');

                var loc_body = '';
                var loc_ratingdetails = par_ispdetails.split(',');
                var isqs_content = {};
                var loc_mapper = 0;
                var remarks ='';

                if (loc_ratingdetails.length == 44)
                {
                    for (var i = 0; i < isqs.length; i ++)
                    {
                        var cboid = isqs[i].item.replace(/\./g, '');
                        if (!isqs[i].bold)
                        {
                            isqs_content[cboid] = loc_ratingdetails[loc_mapper];
                            loc_mapper = loc_mapper + 1;
                        }

                    }

                    remarks = loc_ratingdetails[43];
                }

                var colorit = function (par_rating)
                {
                    if (parseFloat(par_rating) < 3.0)
                    {
                        return 'orange';
                    }
                    else
                    {
                        return 'teal';
                    }
                }

                var colormain = function (par_rating)
                {
                    par_overall = parseFloat(par_rating);
                            if (par_overall >= 3.61)
                             {
                                 return 'green';
                             }
                             else if (par_overall >= 2.71)
                             {
                                 return 'blue';
                             }
                             else if (par_overall >= 1.81)
                             {
                                 return 'aqua';
                             }
                             else if (par_overall >= 0.91)
                             {
                                 return 'yellow';
                             }
                             else if (par_overall > 0.0)
                             {
                                 return 'red';
                             }
                             else
                             {
                                 return 'gray';
                             }

                }
                        $("#main").html(
                            view.excolumn(12, //1 excolumn
                                view.simplebox( //simplebox
                                    {
                                        boxtype: "primary",
                                        title: 'Instructional Supervisory Tool for School Heads',
                                        body:
                                             view.exrow(
                                                view.excolumn(12, //2 excolumn
                                                view.excolumn(4, //boxid
                                                    view.boxembodiement({ //par_ratedby, //{name,d8t, pic}
                                                        idno: 'Date: ' + par_ratedby.d8t,
                                                        name: 'Rated by:' + par_ratedby.name,
                                                        picsrc: par_ratedby.pic,
                                                        boxcolor: 'info',
                                                        embodiement:
                                                                        view.listitem(
                                                                                '<a >' +
                                                                                    apputils.bold('Descriptive Rating') +
                                                                                    view.smallbadge(
                                                                                        colormain(par_overall) + ' pull-right',
                                                                                        par_interp
                                                                                    ) +
                                                                                '</a>'
                                                                                ) +
                                                                        view.listitem(
                                                                                '<a >' +
                                                                                    apputils.bold('Overall Rating') +
                                                                                    view.smallbadge(
                                                                                        colormain(par_overall) + ' pull-right',
                                                                                        par_overall
                                                                                    ) +
                                                                                '</a>'
                                                                                ) +
                                                                        function ()
                                                                                {
                                                                                    var ilist = '';
                                                                                    lists = par_details.split(',');
                                                                                    ilist += view.listitem('<a >' +
                                                                                                '1. ISP&I' +
                                                                                                view.smallbadge(
                                                                                                        colorit(lists[0]) + ' pull-right',
                                                                                                        lists[0]
                                                                                                    ) +
                                                                                            '</a>');
                                                                                    ilist += view.listitem('<a >' +
                                                                                                '2. SHIWT' +
                                                                                                view.smallbadge(
                                                                                                        colorit(lists[1]) + ' pull-right',
                                                                                                        lists[1]
                                                                                                    ) +
                                                                                            '</a>');

                                                                                    ilist += view.listitem('<a >' +
                                                                                                '3. CITIP' +
                                                                                                view.smallbadge(
                                                                                                        colorit(lists[2]) + ' pull-right',
                                                                                                        lists[2]
                                                                                                    ) +
                                                                                            '</a>');

                                                                                    ilist += view.listitem('<a >' +
                                                                                                '4. LE' +
                                                                                                view.smallbadge(
                                                                                                        colorit(lists[3]) + ' pull-right',
                                                                                                        lists[3]
                                                                                                    ) +
                                                                                            '</a>');

                                                                                    return ilist;
                                                                                }()
                                                    })) + //boxid
                                                view.excolumn(8, //questionnaire
                                                  view.exrow(
                                                    view.table({
                                                        "id":"tblaisatool",
                                                        "class":"tables-bordered",
                                                        "cols": [
                                                            'Item',
                                                            'Description',
                                                            'Rating'
                                                        ],
                                                        "tbodyclass": 'tblaisatool'
                                                    })
                                                  ) +  //exrow table
                                                    view.exrow(
                                                        view.boxsolidonly(
                                                            {
                                                                boxtype: "default",
                                                                title: "Remarks",
                                                                body:
                                                                    view.boxsolidonly({
                                                                            boxtype: "info",
                                                                            title: "",
                                                                            body: remarks,
                                                                            footer: ''
                                                                        }),
                                                                footer: ""
                                                            }
                                                        )//boxsolidonly
                                                    )

                                                ) //questionnaire
                                                )//2 excolumn
                                             )
                                        , //body

                                        footer: ''
                                    }
                                ) //simplebox

                            ) //1 excolumn
                        );



                for (var i=0; i < isqs.length; i++)
                {
                    loc_body += view.composerow([
                        isqs[i].item,
                        function ()
                        {
                          if (isqs[i].bold) {
                           return  apputils.bold(isqs[i].desc);
                          }
                          return isqs[i].desc;
                        }(),
                                function ()
                                {

                                    var cboid = isqs[i].item.replace(/\./g, '');
                                    var this_sel = isqs_content[cboid];


                                    if (!isqs[i].bold) {
                                        return '<h4>' + apputils.bold(this_sel) + '</h4>';
                                    }

                                    return '';

                                }()

                    ],
                     function ()
                     {
                         if (!isqs[i].bold) {
                             var cboid = isqs[i].item.replace(/\./g, '');
                             if (parseFloat(isqs_content[cboid]) < 3.0)
                             {
                                 return '#F5A188';
                             }
                             return '';
                         }
                         return '';
                     }()
                        );
                }

                $("#tblaisatool > tbody").append(loc_body);
                }

                view.boxcomment = function (par_srcimage, par_username, par_time, par_message, par_id)
                {
                    return '<div class="box-comment">'+
                           '<img class="img-circle img-sm" src="'+ par_srcimage + '" alt="Image">' +
                          '<div class="comment-text">' +
                          '<span class="username">' +
                             par_username +
                            '<span class="text-muted pull-right">' +
                             par_time +
                          '</span>' +
                        '</span>' +
                            par_message +
                           '</div>' +
                          '</div>';

                }

                view.lastitempbox = function (initiator, receiver, tstamp, elid, offset)
                {
                    return view.simplediv(
                                "divgforbtn" + elid,
                                apputils.newline() +
                                view.excolumn(12,
                                    view.centerize(
                                    view.buttonact(
                                        'warning btn-flat btn-sm ',
                                        "Refresh",
                                        "model.getcomment('" +
                                        initiator + "','" +
                                        receiver + "','" +
                                        tstamp + "'," +
                                        "'" + elid +"', 0, 'Refresh', 'btnrefreshcomment')",
                                        "btnrefreshcomment" + elid
                                     ) + //button
                                    apputils.space(3) +
                                    view.buttonact(
                                        'info btn-flat btn-sm',
                                        "Load More..",
                                        "model.getcomment('" +
                                        initiator + "','" +
                                        receiver + "','" +
                                        tstamp + "'," +
                                        "'" + elid +"', " + offset +", 'Load More..', 'btnloadmore')",
                                        "btnloadmore" + elid
                                     ) //button
                                    ) //centerize
                                    ,"") //excolumn
                            ); //simplediv
                }

                view.newscoreentrytut = function ()
                {
                    var intro = introJs();
                    intro.setOptions(
                        {
                            steps: [
                                {
                                    intro: "Hello " +  $("#name-leftbadge").html() + "!\n" +
                                        "Welcome to my.eskwela Encoding New Scores Tutorial! To Continue, click Next."
                                },
                                {
                                    element: "#cbogradecategories",
                                    intro: "Select the Score Category by clicking this Combo Box."
                                },
                                {
                                    element: "#cbogradecount",
                                    intro: "Select the appropriate entry count, if first time select 1."
                                },
                                {
                                    element: "#txtTotScore",
                                    intro: "Type the Maximum Total Score"
                                },
                                {
                                    element:"#savegradeentry",
                                    intro: "Click this button to save the entry."
                                },
                                {
                                    element: "#studentperfentries",
                                    intro: "Encode the individual student score for the box provided." +
                                        "You can encode all the scores and save later or individually save " +
                                        "the score on the button provided next to the score box."
                                },
                                {
                                    element: "#btngradesaveall",
                                    intro: "Click this button to save all the entries."
                                }
                            ]
                        }
                    );
                    intro.start();

                }

                view.getscoreentrytut = function ()
                {
                    /*
                        cbogradecategories
                        cbogradecount
                        savegradeentry
                        studentperfentries
                     */

                     var intro = introJs();
                    intro.setOptions(
                        {
                            steps: [
                                {
                                    intro: "Hello " +  $("#name-leftbadge").html() + "!\n" +
                                            "Welcome to my.eskwela Retrieving Encoded Scores Tutorial! To Continue, click Next."
                                },
                                {
                                    element: "#cbogradecategories",
                                    intro: "Select the Score Category by clicking this Combo Box."
                                },
                                {
                                    element: "#cbogradecount",
                                    intro: "Select the appropriate entry count."
                                },
                                {
                                    element:"#savegradeentry",
                                    intro: "Click this button to retrieve the entry, " +
                                        "the maximum score will automatically be filled based on the score you encoded." +
                                        "Student scores will also be automatically filled below."
                                },
                                {
                                    element: "#studentperfentries",
                                    intro: "See the encoded scores." +
                                        "You can also edit the scores and save later or individually edit and save " +
                                        "the score on the button provided next to the score box."
                                },
                                {
                                    element: "#btngradesaveall",
                                    intro: "Click this button to save all the changes in the entries."
                                }
                            ]
                        }
                    );
                    intro.start();


                }

                 view.managesubjtut = function ()
                {
                     var intro = introJs();
                     var tabs = $(".nav-tabs").children();
                    intro.setOptions(
                        {
                            steps: [
                                {
                                    intro: "Hello " +  $("#name-leftbadge").html() + "!\n" +
                                            "Welcome to my.eskwela Manage Subject Tutorial! To Continue, click Next."
                                },
                                {
                                    intro: "You will first be acquainted with the basic components of this feature and then followed by some introductory details." +
                                        "Click Next to continue."
                                },
                                {
                                    element: tabs[0],
                                    intro: "Select the Score Category by clicking this Combo Box."
                                }
                            ]
                        }
                    );
                    intro.start();


                }

                view.managesubjtut = function ()
    {
         var intro = introJs();
         var tabs = $(".nav-tabs").children();
        intro.setOptions(
            {
                steps: [
                    {
                        intro: "Hello " +  $("#name-leftbadge").html() + "!\n" +
                                "Welcome to my.eskwela Manage Subject Tutorial! To Continue, click Next."
                    },
                    {
                        intro: "You will first be acquainted with the basic components of this feature and then followed by some introductory details." +
                            "Click Next to continue."
                    },
                    {
                        element: "#abtsubjdetails",
                        intro: "This is the box that contains information about the subject along with other information. Like "

                    },
                    {
                        element: "#subjectdescription",
                        intro: "Subject Description"
                    },
                    {
                        element: "#aboutmequarter",
                        intro: "The current quarter or grading period."

                    },
                    {
                        element: "#abtschoolyear",
                        intro: "The school year."
                    },
                    {
                        element: "#btnviewgradesubmission",
                        intro:"And operations .."
                    },
                    {
                        element: "#btnviewgradesubmission",
                        intro: " to view, edit, lock and publish student grades. This button is also the shortcut if you want to submit final grades only,"
                    },
                    {
                        element: "#btnquarterlyassessment",
                        intro: "to encode student answers and retrieve reports for MPS and Item Analysis, and "
                    },
                    {
                        element: "#btnviewuploadclassrecord",
                        intro: "to upload your E-Class Record."
                    },
                    {
                        element: "#abtmesubjects",
                        intro: "Next.."
                    },
                    {
                        element:"#abtmesubjects",
                        intro: "This box contains buttons that allows you to activate subject for managing. The button with 'current' label is the one your managing right now. You can switch to another subject by simply clicking the corresponding button."
                    },
                    {
                        intro: "Moving On.."
                    },
                    {
                        element: tabs[0],
                        intro: "This tab when activated, allows you to encode student scores."
                    },
                    {
                        element: tabs[1],
                        intro: "This tab when activated, allows you to encode student attendance."
                    },
                    {
                        element: tabs[2],
                        intro: "This tab when activated, allows you to designate the subject teacher for this subject."
                    },
                    {
                        element: tabs[3],
                        intro: "This tab when activated, loads all the entries for the class record which you can then download for safekeeping."
                    },
                    {
                        intro: "Finally.."
                    },
                    {
                        element: "#grademain",
                        intro: "This box may appear or not, depending on the activated tab."
                    }
                ]
            }
        );
        intro.setOption('showProgress', true).start();

    }

     view.menututor = function()
    {
        var intro = introJs();
        var tutgreet = {
                            intro: "Hello " +  $("#name-leftbadge").html() + "!\n" +
                                    "Welcome to my.eskwela, this tutorial aims to familiarize you with the interface elements."
                        };
        var tuttimeline = {
                position: "right",
                element: "#umnumnutimeline",
                intro:"This is the menu item that will load the timeline for you to Post announcement or statuses and interact with the Posts from your community."
        };

        var tutcalendar = {
            position: "right",
            element: "#umnumnucalendar",
            intro: "The Calendar is an organized view of the Posts from your timeline. You can also use this as reference for activity planning to avoid conflict of schedules."
        };

        var tutchangepass = {
            position: "right",
            element: "#umnumnuchangepass",
            intro: "Got difficulty in remembering the default password? You can change the password here."
        };

        var tutuploadpics = {
            element: "#umnumnuuploadpic",
            intro: "Personalize your my.eskwela account by uploading your profile picture."
        };

        var steps = [];

        view.mainloading();
        apputils.filltimeline();

        steps.push(tutgreet);
        steps.push({
            element: "#name-leftbadge",
            intro: "When you login, basic information like your name is automatically set. Along with.."
        });

        steps.push({
            element: "#name-userops",
            intro: "Assigned Grade and Section (if applicable)"
        });

        steps.push({
            element: "#name-schoolyear",
            intro: "Current School Year"
        });

        steps.push({
            element: "#img-leftbadge",
            intro: "And your profile picture."
        });

        //name-rightbadge
        steps.push({
            element: "#name-rightbadge",
            intro: "When this is clicked, it will display your information and a button that allows you to logout. "
        });

        steps.push(tuttimeline); steps.push(tutcalendar);
        switch ($("#name-rightbadge").data("usertype"))
        {
            case "faculty":
                    steps.push({
                        position: "right",
                        element: "#umnumnuEnroll",
                        intro: "This will give you features to enroll students in your advisory. Commonly used feauture is the Upload SF 1 from LIS."
                    });

                    steps.push({
                        position: "right",
                        element:"#umnumnuRegister",
                        intro: "Add or Edit student data here."
                    });

                    steps.push({
                        position: "right",
                        element:"#umnumnuswitchsxn",
                        intro: "If you have multiple advisories, you can activate the section here."
                    });

                    steps.push({
                        position: "right",
                        element:"#umnumnuclasslist",
                        intro: "If there is a need for you to drop, transfer or re-assign students you can do it here."
                    });

                    steps.push({
                        position: "right",
                        element:"#umnumnusubjects",
                        intro: "In most of the situations, you will spend more time here to encode scores, grades, and attendance. In addition, you can also assign a co-teacher or the subject adviser and download your class record."
                    });

                    steps.push({
                        position: "right",
                        element:"#umnumnucoordinatorsubjects",
                        intro: "If you are designated as the Subject Coordinator, you need to access this menu for you to encode multiple choice type questions. Your questions are directly submitted to the Division Office."
                    });

                    steps.push({
                        position: "right",
                        element:"#umnumnuActivate",
                        intro: "In order for the students and parents access the system, you need to activate their accounts."
                    });

                    steps.push({
                        position: "right",
                        element: "#umnumnuchangesemester",
                        intro: "Browse previous records by setting the school year here."
                    });

                    steps.push(tutchangepass);
                    steps.push(tutuploadpics);

                    steps.push({
                        position: "top",
                        element: ".nav-tabs-custom",
                        intro: "This box allows you to post to the timeline, there are options for your posts." +
                                "And delivery is guaranteed to students and parents only."
                    });

                    var tabs = $(".nav-tabs").children();
                    steps.push({
                        element: tabs[0],
                        intro: "[Option 1] The bulletin board allows to post announcements."
                    });

                    steps.push({
                        element: tabs[1],
                        intro: "[Option 2] The assignment allows to post instructions for take home activity in a given subject."
                    });

                    steps.push({
                        element: tabs[2],
                        intro: "[Option 3] This allows you to post events that will take more than one day to complete."
                    });



                    steps.push({
                        element: "#user-timeline",
                        intro: "This the timeline where posts from the community is displayed. You can interact each posts by reacting and commenting on it." +
                               "A maximum of 5 timeline items are loaded everytime and is arranged from most current posts down to the oldest post."
                    });

                    steps.push({
                                intro: "When there are more than 5 posts in your timeline, the \"Load More\" " +
                                '<img src="' +
                                Flask.url_for('static', {filename:'dist/img/load-more.png'}) +
                                '" class="img-circle">' +
                                " button will appear at the bottom for you to click in order to load older posts."
                    });

                    steps.push({
                                intro: "Thank you " +  $("#name-leftbadge").html() + ", for your time."
                    });

                    break;
        }

        intro.setOptions({
            steps: steps,
            'showBullets': false,
            'showProgress': true
        }).start();
    }

     view.perflevel = function ()
                {
                    $("#main").html(
                        view.excolumn(12,
                            view.exrow(

                                view.excolumn(10, view.simplebox(
                                    {
                                        boxtype: "primary",
                                        title: "Performance Level" + apputils.space(3) + view.buttonact("default fa fa-question btn btn-sm btn-flat", "Help", "{ model.posthelpaccess('Tutorial on Level of Performance Monitoring', view.perflevelprincipal, 'btnperfleveltut', 'Help');}", "btnperfleveltut"),
                                        body:
                                          view.exrow(
                                            view.excolumn(3,
                                                view.select(
                                                    'cbosubjects',
                                                    "Subjects",
                                                    ['--'].concat(
                                                    [
                                                        'ARPAN',
                                                        'ENG', 'EPP', 'FIL', 'MT',
                                                        'PE', 'E.L.S.', 'MATH', 'KOMUNIKASYON',
                                                        'SCI', 'TLE', 'MUS', 'ESP', 'LD', 'PHILO',
                                                        'HE', 'CAD', 'CID', 'CVD', 'HWMD',
                                                        'MEDIA-IT', 'OC', 'CONTEMPORARY','HLT', 'LIT',
                                                        'ARTS', 'GEN. MATH.', 'PEH',
                                                        'CUL.SOC.POL.', 'READWRITE'
                                                    ].sort()),
                                                    '',
                                                    false)
                                            ) +
                                            apputils.space(3) +
                                            view.excolumn(3,
                                                            view.select(
                                                                        'cbogrdlevel',
                                                                        'Grade Level',
                                                                        [1,2,3,4, 5, 6, 7, 8, 9, 10, 11, 12],
                                                                        '',
                                                                        false
                                                            )) +
                                            apputils.space(3) +
                                            view.excolumn(3,
                                                  view.select(
                                                                        'cboquarter',
                                                                        'Quarter',
                                                                        [1,2,3,4],
                                                                        '',
                                                                        false
                                                            )
                                                ) +

                                                view.excolumn(3,
                                                                        view.buttonact("success",
                                                                               "OK",
                                                                              "model.getlevperfprincipal()",
                                                                              "btngetsubjcoord")
                                                            )
                                          )  + //first row
                                            apputils.newline() +
                                            view.excolumn(12,
                                              view.excolumn(8,
                                                view.simplebox({
                                                                        boxtype:"primary",
                                                                        title: "Details",
                                                                        body: '<table id="tablevelproficiency" ' +
                                                                                ' data-search="true" ' +
                                                                                ' data-search-align="left" ' +
                                                                                ' ></table>',
                                                                        footer:''
                                                                    })

                                              ) +
                                                view.excolumn(4,
                                                    view.exrow(

                                                       view.simplebox({
                                                                        boxtype:"primary",
                                                                        title: "Visualization Area",
                                                                        body: view.centerize(
                                                                               view.simplediv("perfdonutcontainer","None so far.")),
                                                                        footer:''
                                                                    }))) +
                                                apputils.newline()  +
                                                view.excolumn(4,
                                                          'Legend:' +
                                                          apputils.newline() +
                                                          '<ul class="chart-legend clearfix">' +
                                                               '<li class="fa fa-circle-o text-red"> </li> Did Not Meet Expectations' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-green"> </li> Fairly Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-yellow"> </li> Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-aqua"> </li> Very Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-light-blue"> </li> Outstanding' +
                                                          '</ul>'
                                                      )
                                                +
                                            view.exrow(
                                               view.centerize(
                                                view.excolumn(8,
                                                    apputils.newline() +
                                                    view.buttonact("success fa fa-download","Download",
                                                                    "apputils.tabtoexcel('tablevelproficiency', 'levelproficiency"+
                                                                    $("#name-rightbadge").data("sectionid") +"')",
                                                                    "btnprevcard") + apputils.space(3)
                                                    //view.buttonact("warning fa fa-check-square-o", "Submit", "{model.submitlevelprofreport();}","btnsubmitperflevel")

                                                   ))
                                                )) +
                                            apputils.newline()
                                        , //end body
                                        footer:""
                                    })) +
                                view.excolumn(2, "")
                            )  //exrow
                        ) //excolumn
                    );


                    /*
                       "section": "GUAVA",
                       "beginning": 0,
                       "developing": 2,
                       "approaching_proficiency": 15,
                       "proficient": 28,
                       "advance": 4
                     */

                    $("#tablevelproficiency").bootstrapTable({
                    columns: [
                            {
                                field: 'section',
                                title: 'Section'
                            },
                            {
                                field: 'beginning',
                                title: 'Did Not Meet Expectations'
                            },
                            {
                                field: 'developing',
                                title: 'Fairly Satisfactory'
                            },
                            {
                                field: 'approaching_proficiency',
                                title: 'Satisfactory'
                            },
                            {
                                field: 'proficient',
                                title: 'Very Satisfactory'
                            },
                            {
                                field: 'advance',
                                title: 'Outstanding'
                            },
                    ]});

                }



                view.perflevelprincipal = function()
                    {
                        var intro = introJs();
                        var tutgreet = {
                                            intro: "Hello " +  $("#name-leftbadge").html() + "!\n" +
                                                    "Welcome to my.eskwela, this tutorial aims to familiarize you with the Performance Level Report Feature."
                                        };



                        var steps = [];

                        steps.push(tutgreet);

                        steps.push({
                            intro: "This module allows you to monitor teachers submission of Performance Level Report for evey subject. "
                        });

                        steps.push({
                            intro: "You can also use this module to check which sections have published a subject grade by looking at the table below. If section is not listed,then the grades for that section is not published."
                        });

                        steps.push({
                            intro: "To retrieve the report you need to provide 3 pieces of information: Subject, Grade Level and Quarter."
                        });

                        steps.push({
                            element: '#cbosubjects',
                            intro: "Choose the subject of interest by clicking this box."
                        });


                        steps.push({
                            element: '#cbogrdlevel',
                            intro: "Then, choose the grade level by clicking this box."
                        });

                        steps.push({
                            element: "#cboquarter",
                            intro: "Finally, choose the quarter (or the grading period)."
                        });

                        steps.push({
                            element: "#btngetsubjcoord",
                            intro: "Click this button to request the report."
                        });



                        steps.push({
                            element: "#tablevelproficiency",
                            intro: "If my.eskwela finds any record it will be listed here. Take note that for each record, a section is indicated. This listing also means the list of section(s) have already published their grade."
                        });
                        //perfdonutcontainer

                        steps.push({
                            element: "#perfdonutcontainer",
                            intro: "A donut graph also appears to sum the percentages on the levels of proficiency."
                        });

                        steps.push({
                            element: "#btnprevcard",
                            intro: "You can download a copy of the text data."
                        });

                        steps.push({
                            element: "#btnsubmitperflevel",
                            intro: "You have to submit the report so it can be seen by your supervisor."
                        });


                        intro.setOptions({
                            steps: steps,
                            'showBullets': false,
                            'showProgress': true
                        }).start();
                    }

                view.chatmessagethem = function (par_config)
                {
                    /*
                      {
                        name:
                        ts:
                        imgsrc:
                        message"
                     */


                    return '<div class="direct-chat-msg">' +
                        '<div class="direct-chat-info clearfix">' +
                            '<span class="direct-chat-name pull-left">' + par_config.name +'</span>' +
                            '<span class="direct-chat-timestamp pull-right">' + par_config.ts + '</span>' +
                        '</div>' +
                        '<img class="direct-chat-img" src="' + par_config.imgsrc + '" alt="Message User Image"> ' +
                        '<div class="direct-chat-text">' +
                            par_config.message +
                       '</div>' +
                    '</div>'
                }

                 view.chatmessageme = function (par_config)
                {
                    /*
                      {
                        name:
                        ts:
                        imgsrc:
                        message:
                     */


                    return '<div class="direct-chat-msg right">' +
                        '<div class="direct-chat-info clearfix">' +
                            '<span class="direct-chat-name pull-right">' + par_config.name +'</span>' +
                            '<span class="direct-chat-timestamp pull-left">' + par_config.ts + '</span>' +
                        '</div>' +

                        '<img class="direct-chat-img" src="' + par_config.imgsrc + '" alt="Message User Image"> ' +
                        '<div class="direct-chat-text">' +
                            par_config.message +
                       '</div>' +
                    '</div>'
                }



                view.chatbox = function (par_config)
                {
                    /*
                      {
                         title:
                         chatbodyid:
                      }
                     */
                    return '<div class="box box-primary direct-chat direct-chat-primary">' +
                                '<div class="box-header with-border">' +
                                 '<h3 class="box-title">' + par_config.title + '</h3>' +
                                 '<div class="box-tools pull-right">' +
                                '</div>' +
                            '</div>' +
                        '<div class="box-body">' +
                            '<div id="bodycbox' + par_config.chatbodyid + '" class="direct-chat-msg">' +
                            '</div>' +
                        '</div>' +
                        '<div class="box-footer">' +
                           view.textarea(
                            {
                                id: "txtcbox" + par_config.chatbodyid,
                                rows: 3,
                                cols: 5,
                                wrap: 'hard',
                                placeholder: "Type Message..."
                            }
                        ) +
                        apputils.newline() +
                        view.centerize(
                                view.buttonact("primary btn-flat", "Send", "alert('send')", "btncboxsend" + par_config.chatbodyid) +
                                apputils.space(5) +
                                view.buttonact("warning btn-flat", "Refresh", "alert('ref')", "btncboxrefresh" + par_config.chatbodyid)
                            ) +
                        '</div>'
                }

                view.makechatbox = function(par_targetid, par_config)
                {
                    $("#" + par_targetid).html(view.excolumn(12, view.chatbox(par_config)));
                    $("#txtcbox" + par_config.chatbodyid).wysihtml5({toolbar:{"image":false}});
                }


                view.messages = function ()
                {

                    $("#main").html("");

                    $("#main").html(
                        view.excolumn(12,
                            view.simplebox({
                                        boxtype:"primary",
                                        title: "Messages",
                                        body: view.excolumn(12,

                                        view.excolumn(3,
                                                    view.exrow(
                                                        view.centerize(
                                                                view.buttonact("info fa fa-envelope-square",
                                                                    apputils.space(3) + "Create",
                                                                    "alert('dfd')",
                                                                    "btncreatemessage"
                                                                ))
                                                    ) +
                                                    view.exrow('<div id="chatlist"></div>')
                                        ) +
                                        view.excolumn(9, "", "chatboxarea")
                                    ),
                                        footer:''
                                    })
                            )
                      )
                 //$("#chatlist").append(view.buttonact("default btn-block", "B", "alert('B')", "btnB"));
                }

                view.createchatchannel = function ()
                {
                    $("#chatboxarea").html(view.simplebox({
                        boxtype: "primary",
                        title: "Chat Channel",
                        body: "",
                        footer: ""
                    }));
                }


                view.setbtnsquartersuper10 = function (fcn)
            {
                currquarter = $("#name-rightbadge").data("quarter");
                $("#name-rightbadge").data("fcnname", fcn);

                btns = '';
                for (var i=1; i<=4; i ++)
                {
                    var appbtn_obj = {
                        label: i,
                        action:"model.changequartersuper10(" + i + ", " + fcn + ");"
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

            view.gradegendboard = function()
                {
                    $("#main").html(
                       view.excolumn(12,
                        view.exrow(
                            view.excolumn(12,
                                view.boxify("bxquarter",
                                "Quarter",
                                view.centerize(
                                view.setbtnsquartersuper10("model.getgenimpression")
                                ),
                                "",
                                "")
                            )
                        ) +

                        view.exrow(

                              view.excolumn(12,
                                  view.simplebox(
                                      {
                                          boxtype:"primary",
                                          title: "General Impression",
                                          body:
                                              view.excolumn(4,
                                                       view.excolumn(8,
                                                           view.centerize(
                                                                view.simplebox({
                                                                                    boxtype:"primary",
                                                                                    title:"Math",
                                                                                    body:view.simplediv("perfdonutcontainer1","None so far."),
                                                                                    footer:'Coverage:' + view.simplediv("mathcoverage", "")
                                                                                }))) +
                                                      view.excolumn(4,
                                                          'Legend:' +
                                                          apputils.newline() +
                                                          '<ul class="chart-legend clearfix">' +
                                                               '<li class="fa fa-circle-o text-red"> </li> Did Not Meet Expectations' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-green"> </li> Fairly Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-yellow"> </li> Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-aqua"> </li> Very Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-light-blue"> </li> Outstanding' +
                                                          '</ul>' +
                                                          apputils.newline() +
                                                          view.buttonact("success", "Details", "model.impressiondetails('MATH')", "btndetailsmath")
                                                      )

                                              ) +

                                                    view.excolumn(4,
                                                       view.excolumn(8,
                                                           view.centerize(
                                                                view.simplebox({
                                                                                    boxtype:"primary",
                                                                                    title:"Science",
                                                                                    body:view.simplediv("perfdonutcontainer2","None so far."),
                                                                                    footer:'Coverage:' + view.simplediv("sciencecoverage", "")
                                                                                }))) +
                                                      view.excolumn(4,
                                                          'Legend:' +
                                                          apputils.newline() +
                                                          '<ul class="chart-legend clearfix">' +
                                                               '<li class="fa fa-circle-o text-red"> </li> Did Not Meet Expectations' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-green"> </li> Fairly Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-yellow"> </li> Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-aqua"> </li> Very Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-light-blue"> </li> Outstanding' +
                                                          '</ul>' +
                                                          apputils.newline() +
                                                          view.buttonact("success", "Details", "model.impressiondetails('SCI')", "btndetailsscience")
                                                      )

                                              )  +
                                                  view.excolumn(4,
                                                       view.excolumn(8,
                                                           view.centerize(
                                                                view.simplebox({
                                                                                    boxtype:"primary",
                                                                                    title:"English",
                                                                                    body:view.simplediv("perfdonutcontainer3","None so far."),
                                                                                    footer:'Coverage:' + view.simplediv("englishcoverage", "")
                                                                                }))) +
                                                      view.excolumn(4,
                                                          'Legend:' +
                                                          apputils.newline() +
                                                          '<ul class="chart-legend clearfix">' +
                                                               '<li class="fa fa-circle-o text-red"> </li> Did Not Meet Expectations' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-green"> </li> Fairly Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-yellow"> </li> Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-aqua"> </li> Very Satisfactory' +
                                                               apputils.newline() +
                                                               '<li class="fa fa-circle-o text-light-blue"> </li> Outstanding' +
                                                          '</ul>' +
                                                          apputils.newline() +
                                                          view.buttonact("success", "Details", "model.impressiondetails('SCI')", "btndetailsscience")
                                                      )

                                              )


                                          ,
                                          footer:""
                                      }

                                  )
                                  )

                        ) //row
                       ,"genimpressiondiv")//column
                    );
                }


                view.genimpressiondetails = function ()
                {
                    $("#main").html(
                       view.excolumn(12,
                        view.exrow(
                            view.excolumn(12,
                                view.boxify("bxquarter",
                                "Quarter",
                                view.centerize(
                                view.setbtnsquartersuper10("model.perfdetailsfetch")
                                ),
                                "",
                                "")
                            )

                        ) + //row

                        view.exrow(
                            view.excolumn(12,

                                                       view.excolumn(4,
                                                           view.centerize(
                                                                view.simplebox({
                                                                                    boxtype:"primary",
                                                                                    title: view.simplediv('boxtitledetails', ''),
                                                                                    body:view.simplediv("perfdonutcontainerdetails","None so far."),
                                                                                    footer:'Coverage:' + view.simplediv("detailscoverage", "")
                                                                                }))) +
                                                      view.excolumn(2,
                                                          view.simplebox(
                                                              {
                                                                  boxtype:"primary",
                                                                  title: "Legend",
                                                                  body:
                                                                            '<ul class="chart-legend clearfix">' +
                                                                                 '<li class="fa fa-circle-o text-red"> </li> Did Not Meet Expectations' +
                                                                                 apputils.newline() +
                                                                                 '<li class="fa fa-circle-o text-green"> </li> Fairly Satisfactory' +
                                                                                 apputils.newline() +
                                                                                 '<li class="fa fa-circle-o text-yellow"> </li> Satisfactory' +
                                                                                 apputils.newline() +
                                                                                 '<li class="fa fa-circle-o text-aqua"> </li> Very Satisfactory' +
                                                                                 apputils.newline() +
                                                                                 '<li class="fa fa-circle-o text-light-blue"> </li> Outstanding' +
                                                                            '</ul>',
                                                                  footer:''
                                                              })
                                                      ) +

                                                    view.excolumn(6,
                                                        view.simplebox(
                                                            {
                                                                boxtype:"primary",
                                                                title: "Browse Subjects",
                                                                body: view.excolumn(4,
                                                                        view.select(
                                                                            'cbosubjects',
                                                                            "Subjects",
                                                                            ['--'].concat(
                                                                            [
                                                                                'ARPAN',
                                                                                'ENG', 'EPP', 'FIL', 'MT',
                                                                                'PE', 'E.L.S.', 'MATH', 'KOMUNIKASYON',
                                                                                'SCI', 'TLE', 'MUS', 'ESP', 'LD', 'PHILO',
                                                                                'HE', 'CAD', 'CID', 'CVD', 'HWMD',
                                                                                'MEDIA-IT', 'OC', 'CONTEMPORARY','HLT', 'LIT',
                                                                                'ARTS', 'GEN. MATH.', 'PEH',
                                                                                'CUL.SOC.POL.', 'READWRITE'
                                                                            ].sort()),
                                                                            '',
                                                                                    false)
                                                                            ) +
                                                                            view.excolumn(4,
                                                                                            view.select(
                                                                                                        'cbogrdlevel',
                                                                                                        'Grade Level',
                                                                                                        ['All',1,2,3,4, 5, 6, 7, 8, 9, 10, 11, 12],
                                                                                                        '',
                                                                                                        false
                                                                                            )
                                                                            ) +
                                                                            apputils.newline() +
                                                                            view.excolumn(4,view.buttonact("success",
                                                                               "OK",
                                                                              "{" + "model.perfdetailsfetch()}",
                                                                              "btngetsubjcoord"))
                                                                    ,
                                                                    footer: ""
                                                                                    }
                                                                                )
                                                                            )



                                )
                        ) +
                           view.exrow(
                               view.excolumn(12,
                                   view.simplebox(
                                       {
                                           boxtype: "primary",
                                           title: "Data Source",
                                           body: view.simplediv("datasrcdetails",""),
                                           footer:""
                                       }
                                       )
                                   )
                           )

                       )  //column
                    )
                }


                view.visualset = function (params) {
                    if (params.size > 0) {
                        $("#detailscoverage").html(params.size + apputils.space(3) + "students.");
                        result = apputils.topercentage([params.beginning, params.developing, params.approaching_proficiency, params.proficient, params.advance]);
                        apputils.plotperfbardata("perfdonutcontainerdetails", result);
                        /* apputils.plotgraph("perfdonutcontainerdetails",[{
                                                                         value: result[0],
                                                                         color: "#f56954",
                                                                         highlight: "#f56954",
                                                                         label: "Did Not Meet Expectations"
                                                                      },
                                                                     {
                                                                         value: result[1],
                                                                         color: "#00a65a",
                                                                         highlight: "#00a65a",
                                                                         label: "Fairly Satisfactory"
                                                                     },
                                                                    {
                                                                         value: result[2],
                                                                         color: "#f39c12",
                                                                         highlight: "#f39c12",
                                                                         label: "Satisfactory"
                                                                    },
                                                                    {
                                                                         value: result[3],
                                                                         color: "#00c0ef",
                                                                         highlight: "#00c0ef",
                                                                         label: "Very Satisfactory"
                                                                    },
                                                                    {
                                                                        value: result[4],
                                                                        color: "#3c8dbc",
                                                                        highlight: "#3c8dbc",
                                                                        label: "Outstanding"
                                                                    }]);*/

                    } else {
                        $("#detailscoverage").html("0" + apputils.space(3) + "student.");
                        $("#perfdonutcontainerdetails").html("None so far.");
                    }
                }

                view.initializeprofile = function ()
                {

                        tabscontent = [];

                        tabscontent.push({
                                label: "Current Performance",
                                assoc : "performance",
                                content:
                                view.exrow(
                                    view.excolumn(12,
                                        '<table id="nowcard" ' +
                                        'data-search="false"> </table>')
                                ) + '<br />' +//view.exrow
                                view.exrow(
                                    view.excolumn(4,'') +
                                    view.excolumn(4,view.buttonact("success fa fa-download","Download",
                                        "apputils.tabtoexcel('nowcard', 'nowcard')",
                                        "btnnowcard")) +
                                    view.excolumn(4,'')
                                )
                            });

                            tabscontent.push({
                                label:"Previous Performance",
                                assoc:"prevperformance",
                                content:view.exrow(
                                    view.excolumn(12,
                                        '<table id="prevcard" ' +
                                        'data-search="false"> </table>')
                                )+ '<br />' +//view.exrow
                                view.exrow(
                                    view.excolumn(4,'') +
                                    view.excolumn(4,view.buttonact("success fa fa-download","Download",
                                        "apputils.tabtoexcel('prevcard', 'prevcard')",
                                        "btnprevcard")) +
                                    view.excolumn(4,'')
                                )
                            });


                        $("#main").html(
                            view.excolumn(12,
                                     view.exrow(
                                        view.excolumn(12,
                                        view.simplebox({
                                                        boxtype:"primary",
                                                        title: "Retrieve Record",
                                                        body:view.excolumn(12,
                                                                                    view.exrow(view.excolumn(4,view.inputtextonly("enrollsearch",
                                                                                            'placeholder="Type Last Name"')

                                                                                            ) +

                                                                                            view.buttonact("info",
                                                                                                            "Search", "model.retrievecardstusearch()",
                                                                                                                    "btnerlsearch")

                                                                                        ) + //end row
                                                                                       '<br />' + apputils.newline() +
                                                                                    view.exrow(view.excolumn(12,
                                                                                    view.simplebox({
                                                                                                    boxtype:"primary",
                                                                                                    title: "Search Result(s)",
                                                                                                    body:view.table({
                                                                                                                        "id":"erlsearchtab",
                                                                                                                        "class":"tables-bordered",
                                                                                                                        "cols": ["LRN No", "Name"],
                                                                                                                        "tbodyclass":''
                                                                                                                    }),
                                                                                                    footer:''
                                                                                                })
                                                                                            ) //column
                                                                                    )),
                                                        footer:''
                                                    }
                                            ))
                                    ) +
                                    apputils.newline() +
                                    view.exrow(
                                        view.excolumn(12,
                                        view.excolumn(3,
                                        view.simplediv("divrtrvprofilebox",
                                                view.profilebox({
                                                                    moredetails: [
                                                                                {col: ["Grade", ""]},
                                                                                {col: ["Section", ""]},
                                                                                {col: ["Adviser", ""]},
                                                                    ],
                                                                    img: "/static/dist/img/soon.jpg",
                                                                    name: "",
                                                                    lrn:"",
                                                                    btns: []
                                                                }
                                                                )) +
                                        view.simplediv("divrtrvaboutmebox",
                                         view.aboutmebox({
                                                 id: 'boxrtrvstugrades',
                                                 aboutme: [
                                                     {
                                                         icon:"fa fa-ambulance",
                                                         label: "Nutritional Status",
                                                         value: ""
                                                     },
                                                     {
                                                         icon:"fa fa-ruble",
                                                         label: "Conditional Transfer",
                                                         value: ""
                                                     },
                                                     {
                                                         icon:"fa fa-wheelchair",
                                                         label: "Disability",
                                                         value: ""
                                                     },
                                                     {
                                                         icon:"fa fa-home margin-r-5",
                                                         label: "Address",
                                                         value: ""
                                                     },
                                                     {
                                                         icon:"fa fa-bank margin-r-5",
                                                         label: "Father",
                                                         value: ""
                                                     },
                                                     {
                                                         icon:"fa fa-heart margin-r-5",
                                                         label: "Mother",
                                                         value: ""
                                                     },
                                                     {
                                                         icon:"fa fa-user-secret margin-r-5",
                                                         label: "Guardian",
                                                         value: ""
                                                     },
                                                 ]
                                        }))

                                        ) +

                                         view.excolumn(9,

                                                    view.simplediv("divrtrvnavtables",
                                                        view.navtab(
                                                            {
                                                                tabs: tabscontent //array of singleton objects
                                                            } //end object navtab
                                                         )
                                                    )
                                            )
                                        )
                                    )
                            )
                        );

                        $("#nowcard").bootstrapTable({columns:perf_cols});
                $("#prevcard").bootstrapTable({columns:perf_cols});
                $('.nav-tabs a').click(function(){
                    if ($(this).text() == 'Current Performance')
                    {
                        //model.getclassrecorddata(this);
                        //model.getcard(profile.lrn, false, this, "nowcard");
                        alert('cjrr');
                    }
                    else if ($(this).text() == "Previous Performance")
                    {
                        //model.getcard(profile.lrn, true, this, "prevcard");
                        alert('past');
                    }
                   /* else if ($(this).text() == "Calendar")
                    {

                    } */
                });

                }

                view.setupconfinterface = function()
                {
                    $("#main").html(
                        view.excolumn(12,
                            view.simplebox({
                                boxtype:"primary",
                                title: "Video Conference",
                                body:
                                 view.centerize(
                                    view.simplediv('meet', ''))
                                ,
                                footer:''
                            })
                        )
                    );
                }

                view.bcasttutor = function()
            {
                var intro = introJs();
                var tutgreet = {
                                    intro: "Hello " +  $("#name-leftbadge").html() + "!\n" +
                                            "Welcome to my.eskwela, this tutorial aims to familiarize you with the interface elements."
                                };

                var steps = [];

                steps.push(tutgreet);

                if ($("#name-rightbadge").data("usertype") !== 'faculty' || $("#name-rightbadge").data("section").length > 0)
                        steps.push({
                            element: "#btnbcast",
                            intro: "This button starts a video conference for your constituents."
                        });


                    if ($("#name-rightbadge").data("usertype") == 'faculty')
                            steps.push({
                                element: "#btnbcasttosubject",
                                intro: "This button starts a video conference for students enrolled in a subject."
                            });

                steps.push({
                    element: "#btnbcasttopersons",
                    intro: "This button starts a video conference for your chosen persons."
                });


                intro.setOptions({
                    steps: steps,
                    'showBullets': false,
                    'showProgress': true
                }).start();

            }

                view.createvideoconference = function ()
                {
                    $("#main").html(
                       view.excolumn(12,
                        view.simplebox({
                                            boxtype: "primary",
                                            title: "Setup Video Conference",
                                            body:
                                              view.centerize(
                                                function () {
                                                    if (
                                                            $("#name-rightbadge").data("usertype") !== 'faculty' ||
                                                            $("#name-rightbadge").data("section").length > 0
                                                       ) {
                                                        return view.buttonact('success', 'Broadcast', "model.postbcast('btnbcast', 'Broadcast')", "btnbcast") +
                                                            apputils.space(3)
                                                    }
                                                    return '';
                                                }()
                                                     +
                                                  function ()
                                                  {
                                                      if ($("#name-rightbadge").data("usertype") !== 'faculty')
                                                          return '';

                                                      return view.buttonact('info', 'Broadcast to Subject', "view.setupsubjectsbcall()", "btnbcasttosubject") +
                                                      apputils.space(3);
                                                  }()
                                                +
                                                  view.buttonact('warning', 'Broadcast to Person(s)', "view.setsearchpersonbchat()", "btnbcasttopersons")
                                                + apputils.space(3) +
                                                view.buttonact('default', "Which button?", "model.posthelpaccess('Main Tutorial', " +
                                                    " view.bcasttutor, " +
                                                    " 'btnbcasthelp', 'Which button?');", 'btnbcasthelp')
                                                )
                                                ,
                                            footer: ""
                                        })
                       )
                    );
                }



                view.setupsubjectsbcall = function ()
                {
                    $("#main").html(
                      view.excolumn(12,
                        view.simplebox({
                            boxtype:"info",
                            title:"Assignment",
                            body: view.exformgroup(
                                view.selectize($("#name-rightbadge").data("subjects"),
                                    function(x,i) {

                                         return x[i].label.replace('none', '');
                                    },
                                    "selassignment",
                                    "",
                                    "selassignment") + '<br />'
                            ) + apputils.newline() +

                               view.centerize(
                                view.buttonact("success fa",
                                               "Start Video Conference",
                                               "model.postsubjectbcall('btnpostsubjbcall')",
                                                "btnpostsubjbcall") + apputils.space(3) +
                                view.buttonact("default fa fa-backward",
                                                "&nbsp;&nbsp;Back",
                                                "view.createvideoconference()",
                                                'btnback')

                               ),
                                    footer: ""

                                })
                    ));
                }

                view.setsearchpersonbchat = function()
                {

                    /*
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
                     */
                    $("#main").html(
                        view.excolumn(12,
                            view.simplebox(
                                {
                                    boxtype: "primary",
                                    title: "Search Anyone you wanted to Video Conference",
                                    body:view.boxify("boxsearchpersonbcast", "Search ..",
                                                        view.excolumn(12,
                                                            view.exrow(view.excolumn(6,view.exinputtext("", "text", "txtpersonsearch",
                                                                    'placeholder="Type Last Name"')) +
                                                                view.excolumn(6,
                                                                    apputils.newline() +
                                                                    view.buttonact("info", "Search",
                                                                        "model.searchpersons();",
                                                                        "btnsrchteach")
                                                                )
                                                            ) + '<br />' +
                                                            view.exrow(view.boxify("coteachsrchbox", "Search Results",
                                                                view.table({
                                                                        "id": "tblmonteacherlist",
                                                                        "class": "tables-bordered",
                                                                        "cols": [
                                                                            "", //picture
                                                                            "Full Name",
                                                                            "Type",
                                                                            "" //button personid
                                                                                 ],
                                                                        "tbodyclass": 'tabdetailsmonpop'
                                                                    }) //end table

                                                            ,"", ""
                                                                )//boxwithminimize

                                                        ))
                                              , "", "collapsed-box") //boxify
                                            + apputils.newline() +
                                        view.table({

                                            id:"tblerresults",
                                            class:"table-striped",
                                            tbodyclass:'',
                                            cols: ["", "FullName","Type","System ID"]
                                        }) + apputils.newline() +
                                        view.centerize(
                                            view.buttonact("success", "Start Video Conference",
                                                                        "model.confinvite()",
                                                                        "btnstartconfchosen")
                                        )
                                     ,
                                    footer:""
                                }

                            )//simplebox


                        )

                    );
                }

                view.putsomerow = function (pic, fullname, type, pid)
                            {
                                $('#tblerresults > tbody').append(view.composerow([apputils.itempicsetting(pic), fullname, type, pid]));
                            }



                view.fileuploadpair = function (par_config)
                {
                    /*
                      view.fileuploadpair({
                        btnid: 'profile',
                         buttontype: 'default',
                         fileplaceid: 'file-input',
                         restrict: 'accept="image/jpeg, image/png"',
                         selectmode: "", //"multiple" or ""
                         fcn:"model.uploadprofilepic", buttonlabel:"Upload",
                         addpair: true
                      });

                   */
                    var btnid = "btnfup" + par_config.btnid;
                    var tail = typeof par_config.addpair !== 'undefined' ? par_config.addpair : false;
                    return '<input class="pull-left" type="file"  ' + par_config.restrict + ' id="' + par_config.fileplaceid + '"  ' + par_config.selectmode + ' /> ' +
                            view.excolumn(4, view.buttonact(
                                                              par_config.buttontype + " pull-left fa fa-cloud-upload",
                                                               apputils.space(3) + par_config.buttonlabel,
                                                              par_config.fcn + '(\'' + par_config.btnid + '\')',
                                                              btnid
								  )
	                      ) +
                        function () {

                           if (tail) {
                             return    apputils.newline() +
                               apputils.newline() +
                               view.progressbar({
                                   size: par_config.prsize, // sm - small, xs extra small, xxs super small
                                   type: "success",
                                   id: "prg" + par_config.btnid
                               }) +
                               apputils.newline() +
                               view.labelel("lblfilesattachment" + par_config.btnid);
                           } else
                               return '';

                        }()
                }

                view.flatbox = function (par_config) {
               /*
            view.flatbox({
                      type: "success, //info, warning, danger
                      title: "",
                      body:''
                  });

                */


               return  '<div class="box box-' + par_config.type + ' box-solid">' +
                '<div class="box-header">' +
                '<h3 class="box-title">' + par_config.title + '</h3>' +
                '</div>' +
                    '<div class="box-body">' +
                       par_config.body +
                    '</div>' +
                '</div>'
            }

            view.progressbar = function(par_config)
            {
                /*
                   view.progressbar({
                       size: "sm", // sm - small, xs extra small, xxs super small
                       type: "success",
                       id:
                   })
                   $("#progtest").attr('style', 'width:' + '50%')
                 */
                return '<div  class="progress progress-' + par_config.size + ' active">' +
                            '<div id="'+par_config.id+'" class="progress-bar progress-bar-' + par_config.type + ' progress-bar-striped'+
                            '" role="progressbar" style="width: 0%">' +
                            '</div>' +
                        '</div>';
            }

            view.flatboxsimple = function (par_config) {
               /*
            view.flatboxsimple({
                      type: "success, //info, warning, danger
                      body:''
                  });

                */


               return  '<div class="box box-' + par_config.type + ' box-solid">' +
                    '<div class="box-body">' +
                       par_config.body +
                    '</div>' +
                '</div>'
            }

            view.getFile = function(par_link)
            {
                //apputils.echo("https://" + apputils.rest.split("://")[1] + "/file?link=" + par_link);
                //https://mega.co.nz/#!

                if (par_link.substring(0, 5) !== 'my.e.')
                     window.open("https://mega.co.nz/#!" + par_link, '_blank');
                else
                     window.open(apputils.rest + "/file?link="+ par_link, '_blank');
            }


            view.setupassignmentiface = function()
                            {
                                var subj = $("#name-rightbadge").data("subjects").slice(); //clone array
                                subj.unshift({icon: '', label:'All ', sectionid: '', value:''});
                                 $("#main").html(
                                   view.excolumn(12,
                                        view.excolumn(12,
                                            view.excolumn(12,
                                                  view.exrow(
                                                      view.simplebox({
                                                                       boxtype: "primary",
                                                                       title: "Filter Assignment Display",
                                                                       body:
                                                                       view.centerize(
                                                                         view.excolumn(12,
                                                                         view.excolumn(4,
                                                                           view.selectize(subj,
                                                                                    function(x,i) {

                                                                                        return x[i].label.slice(0, -1);
                                                                                    },
                                                                                    "selsubjects",
                                                                                    "",
                                                                                    "sel")
                                                                                    ) +
                                                                                    view.excolumn(4,
                                                                                       view.buttonact(
                                                                                       "primary  pull-left",
                                                                                       "Search",
                                                                                       "model.getmyassignments('btnfilterview', 'Search')",
                                                                                       "btnfilterview"
                                                                                )
                                                                                )
                                                                         )
                                                                                ),
                                                                      footer: ""
                                                                   }
                                                               )
                                                  ) +
                                                  view.exrow(
                                                    view.simplebox({
                                                                       boxtype: "primary",
                                                                       title: "Assignment Post",
                                                                       body: '<ul  id="user-timeline1" class="timeline">' +
                                                                             '<li>' + view.boxloading() + '</li>' +
                                                                              '</ul>',
                                                                       footer: ''
                                                    })
                                                  )
                                            )
                                        )
                                 )
                                 );


                                 $("#name-rightbadge").data("dow", '');
                                 $("#name-rightbadge").data("c_assign", 0);
                            }


                            view.retrieveanswers = function()
                            {
                                            $("#main").html(
                                                                    view.simplediv("viewsubmissions",
                                                                        view.rowdify(
                                                                            $("#name-rightbadge").data("subjects"),
                                                                            view.boxnoprogress,
                                                                            function(resp)
                                                                            {
                                                                                return {
                                                                                    boxid: 'box' + $.sha1(resp.sectionid),
                                                                                    color: resp.color,
                                                                                    icon: "fa " + resp.icon,
                                                                                    idh:"hdr" + $.sha1(resp.sectionid),
                                                                                    header: resp.label, //.split(resp.section)[0],
                                                                                    idh2: "hdr2" + $.sha1(resp.sectionid),
                                                                                    text2: resp.sectionid,
                                                                                    content: view.buttonact("default",
                                                                                        "View Submissions ",
                                                                                        "model.getassignmentsmonitoring('" +
                                                                                        resp.sectionid +
                                                                                        "', 'btn" + $.sha1(resp.sectionid) + "', 'View Submissions', 0)",
                                                                                        "btn" + $.sha1(resp.sectionid)
                                                                                    )
                                                                                }

                                                                            },
                                                                            "Retrieve Submissions"
                                                                        )
                                                                    ) //simplediv
                                            );
                            }

                            view.iconize = function(par_icon)
                            {
                                return '<i class="fa ' + par_icon + '"></i>';
                            }


                            view.setupgradesubmit = function ()
                            {
                                $("#main").html(
                                  view.excolumn(12,
                                      view.excolumn(12,
                                          view.navtab(
                                                           {
                                                               tabs:[
                                                                   {
                                                                       label: "Activity Details",
                                                                       assoc: "gradedcomments",
                                                                       content: view.aboutmebox({aboutme:
                                                                                                [{
                                                                                                    icon: "fa fa-graduation-cap",
                                                                                                    label:"Data Entry",
                                                                                                    value:
                                                                                                    view.
                                                                                                    exformgroup(
                                                                                                        view.select(
                                                                                                            'cbogradecategories',
                                                                                                            'Categories',
                                                                                                            [
                                                                                                                '',
                                                                                                                'WRITTEN WORKS',
                                                                                                                'PERFORMANCE TASKS',
                                                                                                                'QUARTERLY ASSESSMENT'
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
                                                                                                                    f = [''];
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
                                                                                                        '<div id="buttonplaceholder" class="text-center">' +
                                                                                                        '</div>')
                                                                                                        +
                                                                                                   apputils.newline() +
                                                                                                   view.excolumn(12,
                                                                                                    apputils.newline() +
                                                                                                    view.simplebox(
                                                                                                        {
                                                                                                            boxtype: "warning",
                                                                                                            title: "Instructions",
                                                                                                            body: view.simplediv("instructions",""),
                                                                                                            footer:""
                                                                                                        }
                                                                                                    )

                                                                                                   )
                                                                                                }]},
                                                                                            "For Quarter " + $("#name-rightbadge").data("quarter"))
                                                                   },
                                                                   {
                                                                       label: "Student Responses",
                                                                       assoc: "sturesponses",
                                                                       content:
                                                                         view.exrow(
                                                                           view.excolumn(8,
                                                                                view.simplediv("divstudentresponses", "")) +
                                                                           view.excolumn(4,
                                                                               view.simplebox(
                                                                                   {
                                                                                       boxtype: "success",
                                                                                       title: "Responses",
                                                                                       body:
                                                                                           view.simplediv('" class="user-panel" style="height:auto;"',
                                                                                             view.exrow(
                                                                                               view.excolumn(4,

                                                                                                 view.simplediv('studentpic" class="pull-left image user-header"',
                                                                                                     ""
                                                                                                     )) //column 4
                                                                                               +
                                                                                                view.excolumn(8,
                                                                                                 view.simplediv('" class="pull-left info"',
                                                                                                     view.exlabel('studentlrn', "") +
                                                                                                     apputils.newline() +
                                                                                                     view.exlabel('studentfname', "")
                                                                                                     )
                                                                                                ) // column 8
                                                                                                )
                                                                                               ) +
                                                                                           apputils.newline() +
                                                                                           view.exinputtext(
                                                                                                            "Score", "text",
                                                                                                            "txtstuscore",
                                                                                                            "") +
                                                                                           apputils.newline() +
                                                                                           view.centerize(
                                                                                              view.simplediv("savescorelink", "")
                                                                                               ) +
                                                                                              apputils.newline() +
                                                                                              view.centerize("Student's Submissions") +
                                                                                              view.simplediv("divcommentdetails", ""),
                                                                                       footer:""

                                                                                   }
                                                                               )
                                                                           )
                                                                         )
                                                                   }

                                                               ]

                                                           }

                                                        ) +
                                          view.simplediv("backbutton", "")

                                          )
                                      )
                                );
                            }

                            view.imagify = function(src)
                                {
                                    return '<img style="margin-top: -6px;" class="img-circle img-sm pull-left" ' +
                                    ' src="' + src + '" alt="user image">';
                                }

                view.onlineclassmon = function()
                {
                    $("#main").html(
                        view.exrow(
                          view.excolumn(12,
                              view.excolumn(12,
                                view.aboutmebox({
                                  aboutme: [
                                      {
                                          icon: "",
                                          label: "",
                                          value:
                                              view.exrow(
                                                  view.excolumn(12,
                                                      view.table(
                                                          {
                                                              id: "",
                                                              class: "tables-bordered",
                                                              tbodyclass:"",
                                                              cols: [
                                                                  "Date",
                                                                  view.inputtextonly("txtdatemon", ""),
                                                                  view.buttonact(
                                                                      "success",
                                                                      apputils.space(3) + "Monitor",
                                                                      "model.getonlineclasses()",
                                                                      "btnretrievemonitoronlineclass"
                                                                  )
                                                              ]
                                                          }
                                                      )
                                                  )
                                              )
                                      }
                                  ]
                              }, "Online Class Monitor"))
                              )
                        ) +

                        view.exrow(
                         view.excolumn(12,
                           view.simplediv("divlistmonitor", view.boxloading())
                         )
                        )


                    );

                    $("#txtdatemon").val(apputils.now().replace(/-/g, "/"))
                    $("#txtdatemon").datetimepicker({format:'m/d/Y', timepicker:false});
                }

                view.qrcode = function()
                {
                    $("#main").html(
                        view.excolumn(2, "") +
                        view.excolumn(8, 
                               view.simplebox({
                                    boxtype: "success",
                                    title: "QR Code", 
                                    body: '<div>'+
                                           view.centerize('<img id="qrcodepic">') +
                                    '</div>',
                                    footer:
                                       '<div id="downloadqr"></div>'

                               })
                            ) +
                        view.excolumn(2, "")


                    );
                }


                view.filledbox = function(par_options)
                {
                    /*
                    {
                       color: 'gray',
                       title: 'Add Subject',
                       description: 'Add subject in your load.',
                       icon: 'fa-plus',
                       footer: 'hehe',
                       id:
                       }
                     */

                    return '<div id="' + par_options.id + '" class="small-box bg-' + par_options.color + '">' +
                             '<div class="inner">' +
                               '<h3>' + par_options.title + '</h3>' +
                               '<p>' + par_options.description + '</p>' +
                             '</div>' +
                            '<div class="icon">'+
                            '<i class="fa ' + par_options.icon + '"></i>' +
                            '</div>' +
                                 par_options.footer +
                                 '</div>'
                        ;
                }

                view.togglebuttons = function(par_properties)
                {
                    /*
                        tootip: "Semester",
                        buttons: [
                            {id: "button",
                            color:"default"
                            label:
                            fcn:
                            },
                            {}
                        ]
                     */
                    return '<div class="box-tools '+ par_properties.pullright + '" data-toggle="tooltip" title="' + par_properties.tooltip + '">' +
                                   '<div class="btn-group" data-toggle="btn-toggle">' +
                        function()
                        {
                            var btns = "";
                            for (i = 0; i < par_properties.buttons.length; i++)
                            {

                                    btns += view.buttonact(
                                        par_properties.buttons[i].color + " " + par_properties.buttons[i].size + " " + par_properties.buttons[i].active,
                                        par_properties.buttons[i].label, par_properties.buttons[i].fcn,
                                        par_properties.buttons[i].id
                                    );
                            }
                            return btns;
                        }
                            ()+
                                   '</div>' +
                               '</div>';
                }

                //view.last
           
        }( window.view = window.view || {}, jQuery ));


        function makeHTTPS()
        {
            var urlwindow = window.location.origin;

            if (urlwindow.split("://")[1].indexOf("0.0.0.0") == 0
                || urlwindow.split("://")[1].indexOf("127.0.0.1") == 0)
            {

                return;
            }

            if (urlwindow.split("://")[0] == 'http')
            {
                window.location = 'https://'+ urlwindow.split("://")[1];
            }
        }


        function init()
        {


            if (apputils.islogin())
            {
                model.verify($("#name-rightbadge").data("username"), $("#name-rightbadge").data("key"));
            }
            else
            {
                view.resetall();
            }
        }

        makeHTTPS();
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
         "Basic " + btoa($("#name-rightbadge").data("username") + ":" + $("#name-rightbadge").data("key")));
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
