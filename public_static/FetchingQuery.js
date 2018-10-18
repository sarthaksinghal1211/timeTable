
$(()=> {
    console.log("hi")
        var RoomType, Semester, Branch, RoomNumber, ClassGroup, Day, StartTime, EndTime, CourseName
        var queryask=[]
        RemoveRoomNo()
        RemoveCourses()
        RemoveTeacherName()
        Branch = $("#sbranch").val()
        RoomType = $("#sroomtype").val()
        Semester = $("#ssemester").val()
        CourseName = $("#scoursename").val()
        GetQueryRooms(Branch, RoomType)
        GetQueryCourses(Branch, RoomType, Semester)
        GetQueryTeachers(Branch, CourseName)


        $("#delete").click(function () {
            $.ajax({
                type: "POST",
                url: "/FetchingQuery/QueryDelete",
                data: {
                    sbranch: $("#sbranch").val(),
                    ssemester: $("#ssemester").val(),
                    sroomtype: $("#sroomtype").val(),
                    sroomno: $("#sroomno").val(),
                    sclassgroup: $("#sclassgroup").val(),
                    sstarttime: $("#sstarttime").val(),
                    sendtime: $("#sendtime").val(),
                    sday:$("#sday").val(),
                    scoursename: $("#scoursename").val(),
                    steachername: $("#steachername").val()
                },
                success: function (data) {
                    console.log(data)
                    alert(data)
                }
            })
        })




        $("#sbranch").change(() => {
                RemoveRoomNo()
                RemoveCourses()
                RemoveTeacherName()
                Branch = $("#sbranch").val()
                RoomType = $("#sroomtype").val()
                Semester = $("#ssemester").val()
                CourseName = $("#scoursename").val()
                GetQueryRooms(Branch, RoomType)
                GetQueryCourses(Branch, RoomType, Semester)
                GetQueryTeachers(Branch, CourseName)
            }
        )
        $("#ssemester").change(() => {
            RemoveCourses()
            RemoveTeacherName()
            Branch = $("#sbranch").val()
            RoomType = $("#sroomtype").val()
            Semester = $("#ssemester").val()
            GetQueryCourses(Branch, RoomType, Semester)
            CourseName = $("#scoursename").val()
            GetQueryTeachers(Branch, CourseName)

        })

        $("#sroomtype").change(() => {
            RemoveCourses()
            RemoveTeacherName()
            RemoveRoomNo()
            Branch = $("#sbranch").val()
            RoomType = $("#sroomtype").val()
            Semester = $("#ssemester").val()

            GetQueryRooms(Branch, RoomType)
            GetQueryCourses(Branch, RoomType, Semester)
            CourseName = $("#scoursename").val()
            GetQueryTeachers(Branch, CourseName)


        })

        $("#scoursename").change(() => {
            RemoveTeacherName()
            Branch = $("#sbranch").val()
            CourseName = $("#scoursename").val()
            GetQueryTeachers(Branch, CourseName)
        })


        function GetQueryTeachers(Branch, coursename) {
            // console.log(Branch)
            $.get("/FetchingQuery/GetTeachers", {
                Teacherbranch: Branch,
                Coursename: coursename,

            }, (Teachers) => {
                // console.log(Teachers)

                for (i = 0; i < Teachers.length; i++) {
                    $("#steachername").append(
                        $("<option>").attr("class", "tempoptionteachername").text(Teachers[i].TeacherName)
                    )
                }
            })
        }


        function GetQueryCourses(Branch, coursetype, semester) {
            // console.log(Branch)

            if (coursetype == "Tutorial") {
                coursetype = "Lecture"
            }
            $.get("/FetchingQuery/GetCourses", {
                Coursebranch: Branch,
                Coursetype: coursetype,
                Coursesemester: semester
            }, (Courses) => {
                // console.log(Courses)
                for (i = 0; i < Courses.length; i++) {
                    $("#scoursename").append(
                        $("<option>").attr("class", "tempoptioncourse").text(Courses[i].CourseName)
                    )
                }
            })
        }


        function GetQueryRooms(Branch, Roomtype) {
            //console.log(Branch,Roomtype)
            if (Roomtype == "Tutorial") {
                Roomtype = "Lecture"
            }
            $.get("/FetchingQuery/GetRooms", {
                RoomBranch: Branch,
                RoomType: Roomtype
            }, (RoomNo) => {
                // console.log(RoomNo)
                for (i = 0; i < RoomNo.length; i++) {
                    $("#sroomno").append(
                        $("<option>").text(RoomNo[i].RoomId).attr("class", "temproomid")
                    )
                }
            })
        }


        function RemoveRoomNo() {
            $(".temproomid").remove();
        }

        function RemoveCourses() {
            $(".tempoptioncourse").remove();
        }

        function RemoveTeacherName() {
            $(".tempoptionteachername").remove();
        }

        $('#dataquerys').submit(function () {
            Branch = $("#sbranch").val()
            RoomType = $("#sroomtype").val()
            Semester = $("#ssemester").val()
            CourseName = $("#scoursename").val()


            $(".clr").text("");
            $(".clr").removeAttr("colspan")
            $(".clr").removeAttr("hidden")
            $(".clr").removeAttr("rowspan")
            $("#mainqueryresult").text("")

            console.log(!$(".dayshow").attr("hidden"))

                if (!$(".dayshow").attr("hidden")) {
                    $(".dayshow").attr("hidden", "true")
                }


            $.ajax({
                type: 'POST',
                url: "/FetchingQuery/QuerySearch",
                data: $(this).serialize(),

                success: function (data) {
                    $("#mainresult").removeAttr("hidden");

                        // console.log(data)
                    // console.log(data[0].TeacherId)

                        queryask = data[1]

                        ShowTable(data[0])

                }
            })
            $('html, body').animate({
                scrollTop: $("#mainqueryresult").offset().top
            }, 1000);
            return false;
        })

    function ShowTable (result){
       // console.log(queryask.day)


                var tableid
        if( $("#sbranch").val()=="IT") {
            if (queryask.classgroup == 'All' && queryask.teachername == 'All' && queryask.roomno == 'All') {
                console.log("Different tables")

                createTablewhencombinegroup("5IT123")
                createTablewhencombinegroup("5IT456")
                createTablewhencombinegroup("5IT789")


                fordisplayingqueriesofcombinedgroup(result, tableid)


            } else if ((queryask.classgroup == 'IT-123' || queryask.classgroup == 'IT-456' || queryask.classgroup == 'IT-789') && queryask.teachername == 'All' && queryask.roomno == 'All') {
                console.log("one table")
                tableid = queryask.classgroup
                console.log(tableid)
                createTablewhencombinegroup(tableid)
                fordisplayingqueriesofcombinedgroup(result, tableid)
            } else {
                tableid = 'uniquetabledesignforeach'
                uniquetabledesignforsinglegroup(tableid)

                fordisplayingqueriesofsinglegroup(result, tableid)
            }

        }

    //


    }


    function fordisplayingqueriesofcombinedgroup(result,tableid) {
        if(queryask.day=='All'){
            $(".dayshow").removeAttr("hidden")
        }else{
            $("."+queryask.day).removeAttr("hidden")

        }
        for(i=0;i<result.length;i++){
            var resultobject = {
                resultstarttime : result[i].StartTime,
                resultendtime : result[i].EndTime,
                resultclassgroup : result[i].Group_,
                resultclasssemester : result[i].Semester,
                resultteachername : result[i].TeacherName,
                resultcoursename : result[i].CourseName,
                resultclasstype : result[i].ClassType,
                resultday : result[i].Day,
                resultroomno : result[i].RoomId,
                resultteacherid : result[i].TeacherId,
                resultcoursecode : result[i].CourseCode

            }
            // console.log(resultobject)
            ShowEntryforcombinedgroups(resultobject,tableid)
        }
    }


    function ShowEntryforcombinedgroups(resultobject,tableid){
            var starttime = resultobject.resultstarttime
            var endtime = resultobject.resultendtime
            var classgroup = resultobject.resultclassgroup
            var classsemester = resultobject.resultclasssemester
            var teachername = resultobject.resultteachername
            var coursename = resultobject.resultcoursename
            var classtype = resultobject.resultclasstype
            var day = resultobject.resultday
            var roomno =resultobject.resultroomno
            var teacherid = resultobject.resultteacherid
            var coursecode = resultobject.resultcoursecode

            var t = starttime.split(":")
                var timeslot = t[0]+""+t[1]+t[2]
                var classtypesymbol = classtype.substring(0,3)
        // console.log(classtypesymbol)
        var checkinglecture = $("." + day + "  ."+timeslot+" ."+classsemester+coursecode+teacherid+roomno)
        if(queryask.classgroup=='All' && queryask.teachername=='All'&&queryask.roomno=='All'){
            var classgroupid
            if(classgroup=='IT-1'||classgroup=='IT-2'||classgroup=='IT-3'){
                classgroupid="IT123"
            }else if(classgroup=='IT-4'||classgroup=='IT-5'||classgroup=='IT-6'){
                classgroupid="IT456"
            }else if(classgroup=='IT-9'||classgroup=='IT-8'||classgroup=='IT-7'){
                classgroupid="IT789"
            }else{
                classgroupid="C111213"
            }

            tableid="5"+classgroupid
        }

        if(classtype=="Lab" || classtype=="Tutorial") {
            if (classtype == "Lab") {
                console.log("lab")
                // console.log("." + day + " ."+classgroup.split("-")[1]+ " ."+timeslot)

                $("#"+tableid+" ." + day + " ." + classgroup.split("-")[1] + " ." + timeslot).append(
                    displaydynamiclabdata()
                ).attr("colspan", "2").next().attr("hidden", "true")
            } else {
                $("#"+tableid+" ." + day + " ." + classgroup.split("-")[1] + " ." + timeslot).append(
                    displaydynamiclabdata()
                )
                $("#"+tableid+" ." + day + " ." + classgroup.split("-")[1] + " ." + timeslot).addClass("tut")
            }
            $("#"+tableid+" ." + day + " ." + classgroup.split("-")[1] + " ." + timeslot).addClass("filledlab")

        }else
        // if  (classtype=="Lecture")

        {
            var classgroupnumber = classgroup.split("-")[1]
            var groupentryrow



            //".lect class wo wali hai jisme lecture ki classes jayengi
            if( checkinglecture.length==0) {
                $("#"+tableid+" ." + day + " .lect" + " ." + timeslot).append(
                    displaydynamiclecturedata()
                ).attr("rowspan","3")

                $("#"+tableid+" ." + day + " .lect" + " ." + timeslot).addClass("pract")
            }
            else{
                // console.log("." + day + " .lect" +  "  ." + " ."+timeslot+" ."+classsemester+coursecode+teacherid+roomno+" ."+classgroup.substring(0,1))
                $("#"+tableid+" ." + day + " .lect" +  "  ." +timeslot+" ."+classsemester+coursecode+teacherid+roomno+" ."+classgroup.substring(0,1)).append((queryask.classgroup=='All'?`${classgroup.split("-")[1]}`:'')+

                    `</div>`)

                $("#"+tableid+" ."+day+" .comblect ."+timeslot).attr("hidden",true)
            }
            $("#"+tableid+" ." + day + " .lect" + " ." + timeslot).addClass("filledlab")
        }


        function displaydynamiclecturedata(){
            return  `<div class="${classsemester}${coursecode}${teacherid}${roomno}   align="center">`+



                            (queryask.coursename=='All'?`<span class="${coursecode}">${coursename}</span>`:'')+
                            (queryask.roomtype=='All'?`<span class="${classtype}"> (${classtypesymbol})</span>`:'') +
                            (queryask.teachername=='All'?`<div class="${teacherid}"> ${teachername}</div>`:'')+
                            (queryask.roomno=='All' ? `<div class="${roomno}"> ${roomno} </div>`:'')+

                      ` </div> <br>`
        }

        function displaydynamiclabdata(){
            return  `<div class="${classsemester}${coursecode}${teacherid}${roomno}" >`+
                (queryask.semester=='All'
                    ?
                    `<span class="${classgroup.substring(0,1)}"> `+
                    (queryask.semester=='All' ?
                        `${classsemester}`:'')+
                    `${classgroup},`

                    +

                    `</span>`
                    :'')
                +


                (queryask.coursename=='All'?`<span class="${coursecode}">${coursename}</span>`:'')+
                (queryask.roomtype=='All'?`<span class="${classtype}"> (${classtypesymbol}),</span>`:'') +
                (queryask.teachername=='All'?`<span class="${teacherid}"> ${teachername},</span>`:'')+
                (queryask.roomno=='All' ? `<span class="${roomno},"> ${roomno} </span>`:'')+

                ` </div> <br>`
        }

        }


    function createTablewhencombinegroup(tableid){
        var tablegroup = tableid.split('')
        $("#mainqueryresult").append(
            `
            <font size="1" face="Courier New" >

    <table id="${tableid}" border="1" height="100%" width="100%">
          <caption><h2 align="center">TimeTable of ${tableid}</h2></caption>
        <thead >
        <td class="heading"></td>
        <td class="heading">9:15-10:05</td>
        <td class="heading">10:05-10:55</td>
        <td class="heading">10:55-11:45</td>
        <td class="heading">11:45-12:35</td>
        <td class="heading">1:15-2:05</td>
        <td class="heading">2:05-2:55</td>
        <td class="heading">2:55-3:45</td>
        <td class="heading">3:45-4:35</td>
        </thead>

        <tbody class="Monday dayshow" hidden >

        <tr class="1 4 7 11 lect" >
            <td rowspan="3" class="heading" valign="centre" >Monday</td>
            <td class="091500 clr "></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr "></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="2 5 8 12 comblect">

            <td class="091500 clr"></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr"></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="3 6 9 13 comblect bott">

            <td class="091500 clr "></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr "></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>

       </tbody>
        <tbody class="Tuesday dayshow" hidden >
        <tr class="1 4 7 11 lect">
            <td rowspan="3" class="heading">Tuesday</td>
            <td class="091500 clr"></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr "></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="2 5 8 12 comblect">

            <td class="091500 clr"></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr"></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="3 6 9 13 comblect bott">

            <td class="091500 clr "></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr "></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        </tbody>
        <tbody class="Wednesday dayshow"  hidden>
        <tr class="1 4 7 11 lect">
            <td rowspan="3" class="heading">Wednesday</td>
            <td class="091500 clr "></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr "></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="2 5 8 12 comblect">

            <td class="091500 clr"></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr"></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="3 6 9 13 comblect bott">

            <td class="091500 clr " ></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr " ></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        </tbody>
        <tbody class="Thursday dayshow"  hidden>
        <tr class="1 4 7 11 lect">
            <td rowspan="3" class="heading">Thursday</td>
            <td class="091500 clr "></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr "></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="2 5 8 12 comblect">

            <td class="091500 clr"></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr"></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="3 6 9 13 comblect bott">

            <td class="091500 clr " ></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr "></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        </tbody>
        <tbody class="Friday dayshow" hidden >
        <tr class="1 4 7 11 lect">
            <td rowspan="3" class="heading">Friday</td>
            <td class="091500 clr "></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr "></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class="2 5 8 12 comblect">

            <td class="091500 clr"></td>
            <td class="100500 clr"> </td>
            <td class="105500 clr"></td>
            <td class="114500 clr"></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr"></td>
        </tr>
        <tr class=" 3 6 9 13 comblect bott">

            <td class="091500 clr "></td>
            <td class="100500 clr"></td>
            <td class="105500 clr"></td>
            <td class="114500 clr " ></td>

            <td class="131500 clr"></td>
            <td class="140500 clr"></td>
            <td class="145500 clr"></td>
            <td class="153500 clr" ></td>
        </tr>
        </tbody>

    </table>
    </font>
    <br>
    <br>
    <br>
    
            `
        )
    }


        // singlegroup means one group c1 or c2 or c3 or c4 or c5
    function uniquetabledesignforsinglegroup(tableid){
        $("#mainqueryresult").append(`
         <font size="1" face="Courier New" >
    <table id="${tableid}" width="100%" height="100%" border="2">
    <caption id="tablecaption"><h2 align="center">Result:-</h2></caption>
   
    <thead >
    <td class="heading"></td>
    <td class="heading">9:15-10:05</td>
    <td class="heading">10:05-10:55</td>
    <td class="heading">10:55-11:45</td>
    <td class="heading">11:45-12:35</td>
    
    <td class="heading">1:15-2:05</td>
    <td class="heading">2:05-2:55</td>
    <td class="heading">2:55-3:45</td>
    <td class="heading">3:45-4:35</td>

    </thead>
     
     <tbody>
    <tr class="Monday dayshow bott" hidden>
    <td class="heading">Monday</td>
    <td class="091500 clr"></td>
    <td class="100500 clr"></td>
    <td class="105500 clr"></td>
    <td class="114500 clr"></td>
    <td class="131500 clr"></td>
    <td class="140500 clr"></td>
    <td class="145500 clr"></td>
    <td class="153500 clr"></td>
    </tr>

    <tr class="Tuesday dayshow bott" hidden>
    <td class="heading">Tuesday</td>
    <td class="091500 clr"></td>
    <td class="100500 clr"></td>
    <td class="105500 clr"></td>
    <td class="114500 clr" ></td>

    <td class="131500 clr"></td>
    <td class="140500 clr"></td>
    <td class="145500 clr"></td>
    <td class="153500 clr"></td>
    </tr>
    <tr class="Wednesday dayshow bott" hidden>
    <td class="heading">Wednesday</td>
    <td class="091500 clr"></td>
    <td class="100500 clr"></td>
    <td class="105500 clr"></td>
    <td class="114500 clr"></td>

    <td class="131500 clr"></td>
    <td class="140500 clr"></td>
    <td class="145500 clr"></td>
    <td class="153500 clr"></td>
    </tr>
    <tr class="Thursday dayshow bott" hidden>
    <td class="heading">Thursday</td>
    <td class="091500 clr"></td>
    <td class="100500 clr"></td>
    <td class="105500 clr"></td>
    <td class="114500 clr"></td>

    <td class="131500 clr"></td>
    <td class="140500 clr"></td>
    <td class="145500 clr"></td>
    <td class="153500 clr"></td>
    </tr>
    <tr class="Friday dayshow bott" hidden>
    <td class="heading">friday</td>
    <td class="091500 clr" ></td>
    <td class="100500 clr" ></td>
    <td class="105500 clr"></td>
    <td class="114500 clr"></td>

    <td class="131500 clr"></td>
    <td class="140500 clr"></td>
    <td class="145500 clr"></td>
    <td class="153500 clr"></td>
    </tr>
    </tbody>
    </table>
    </font>
    

        
        `)

    }

    function fordisplayingqueriesofsinglegroup(result,tableid) {
        if(queryask.day=='All'){
            $(".dayshow").removeAttr("hidden")
        }else{
            $("."+queryask.day).removeAttr("hidden")

        }
        for(i=0;i<result.length;i++){
            var resultobject = {
                resultstarttime : result[i].StartTime,
                resultendtime : result[i].EndTime,
                resultclassgroup : result[i].Group_,
                resultclasssemester : result[i].Semester,
                resultteachername : result[i].TeacherName,
                resultcoursename : result[i].CourseName,
                resultclasstype : result[i].ClassType,
                resultday : result[i].Day,
                resultroomno : result[i].RoomId,
                resultteacherid : result[i].TeacherId,
                resultcoursecode : result[i].CourseCode

            }
            // console.log(resultobject)
            ShowEntryforsinglegroups(resultobject,tableid)
        }
    }



    function ShowEntryforsinglegroups(resultobject,tableid){
        var starttime = resultobject.resultstarttime
        var endtime = resultobject.resultendtime
        var classgroup = resultobject.resultclassgroup
        var classsemester = resultobject.resultclasssemester
        var teachername = resultobject.resultteachername
        var coursename = resultobject.resultcoursename
        var classtype = resultobject.resultclasstype
        var day = resultobject.resultday
        var roomno =resultobject.resultroomno
        var teacherid = resultobject.resultteacherid
        var coursecode = resultobject.resultcoursecode

        var t = starttime.split(":")
        var timeslot = t[0]+""+t[1]+t[2]
        var classtypesymbol = classtype.substring(0,3)
        // console.log(classtypesymbol)
        var checkinglecture = $("#"+tableid+" ." + day + "  ."+timeslot+" ."+classsemester+coursecode+teacherid+roomno)

        // console.log("." + day + "  ."+timeslot+" ."+classsemester+coursecode+teacherid+roomno)

        if(classtype=="Lecture") {

            if (checkinglecture.length == 0) {
                // console.log("if")
                $("#" + tableid + " ." + day + "  ." + timeslot).append(
                    displaydynamiclecturedata()
                )

            } else {
                // console.log("else")
                $("#" + tableid + " ." + day + "  ." + timeslot + " ." + classsemester + coursecode + teacherid + roomno + " ." + classgroup.substring(0, 1)).append(classgroup.split("-")[1])
            }
        }else{
            if(classtype=="Lab"){
                $("#" + tableid + " ." + day + "  ." + timeslot).append(
                    displaydynamiclabdata()
                ).attr("colspan","2").next().attr("hidden","true")
            }else{
                $("#" + tableid + " ." + day + "  ." + timeslot).append(
                    displaydynamiclabdata()
                )
            }
        }




        function displaydynamiclecturedata(){
            return  `<div class="${classsemester}${coursecode}${teacherid}${roomno}" align="center">`+
                (queryask.semester=='All'||queryask.classgroup=='All'
                    ?
                    `<div class="${classgroup.substring(0,1)}"> `+
                    (queryask.semester=='All' ?
                        `${classsemester}`:'')+
                    (queryask.classgroup=='All'?`-${classgroup}`:
                            (classtype=='Lab'||classtype=='Tutorial'?`${classgroup} ${console.log("jaskakjja")}`:'')
                    )+

                    `</div>`
                    :'')
                +


                (queryask.coursename=='All'?`<span class="${coursecode}">${coursename}</span>`:'')+
                (queryask.roomtype=='All'?`<span class="${classtype}"> (${classtypesymbol})</span>`:'') +
                (queryask.teachername=='All'?`<div class="${teacherid}"> ${teachername}</div>`:'')+
                (queryask.roomno=='All' ? `<div class="${roomno}"> ${roomno} </div>`:'')+

                ` </div> <br>`
        }

        function displaydynamiclabdata(){
            return  `<div class="${classsemester}${coursecode}${teacherid}${roomno}">`+
                (queryask.semester=='All'
                    ?
                    `<span class="${classgroup.substring(0,1)}"> `+
                    (queryask.semester=='All' ?
                        `${classsemester}`:'')+
                    `${classgroup},`

                    +

                    `</span>`
                    :'')
                +


                (queryask.coursename=='All'?`<span class="${coursecode}">${coursename}</span>`:'')+
                (queryask.roomtype=='All'?`<span class="${classtype}"> (${classtypesymbol}),</span>`:'') +
                (queryask.teachername=='All'?`<span class="${teacherid}"> ${teachername},</span>`:'')+
                (queryask.roomno=='All' ? `<span class="${roomno},"> ${roomno} </span>`:'')+

                ` </div> <br>`
        }

    }








})
