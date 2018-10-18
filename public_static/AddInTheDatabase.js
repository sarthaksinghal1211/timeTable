$(function () {
    var RoomType,Semester

           $("#qsemester").change(()=>{

            RemoveCourses();
             RoomType = $("#qroomtype").val()
            Semester = $("#qsemester").val()
            if(RoomType=="Tutorial"){
                RoomType="Lecture"
            }
            GetCourses(Semester,RoomType)
        })
//When we change the room type
    $("#qroomtype").change(()=>{
        RemoveCourses()
        RemoveRoomNo()
       RemovedClassGroup()

        RoomType = $("#qroomtype").val()
        Semester = $("#qsemester").val()
        if(RoomType=="Tutorial"){
            RoomType="Lecture"
        }
        GetRoomNumber(RoomType)
        GetCourses(Semester,RoomType)

  // for lab 11:45 & 2:55 is disable
        if (RoomType == "Lab") {
            $('.labdisabled').attr("disabled", "true")
        } else {
            $('.labdisabled').removeAttr("disabled")
        }
     //


        if($("#qroomtype").val()=="Lecture"){
            $("#qclassgroup").append(
                $("<option>").text("IT-123").attr("class","tempclassgroup")
            )
            $("#qclassgroup").append(
                $("<option>").text("IT-456").attr("class","tempclassgroup")
            )
            $("#qclassgroup").append(
                $("<option>").text("IT-789").attr("class","tempclassgroup")
            )

        } else {

            for(i=1;i<=9;i++){
                if(i!=10) {
                    $("#qclassgroup").append(
                        $("<option>").text("IT-" + i).attr("class", "tempclassgroup")
                    )
                }
            }
        }
// startTime
        $('.strthide').removeAttr("hidden");
//On change of start time
        $("#qstarttime").change(() => {

            RemoveEndTime()
            var starttime = $("#qstarttime").val();

            ShowEndTime(RoomType,starttime)



        })


    })

    $("#qcoursename").change(()=>{
        CourseName = $("#qcoursename").val();
       RemoveTeacherName()
        GetTeacherName(CourseName)
    })

    function RemoveEndTime() {
        $(".tempoptionendtime").remove();
    }
    function GetTeacherName(coursename)
    {
       // console.log(coursename)
        $.get('/AddInTheDatabase/TeacherName',{
            CourseName : coursename
        } , (Teachers) => {
            // console.log(Teachers)

            for (i = 0; i < Teachers.length; i++) {
                $("#qteachename").append(
                    $("<option>").attr("class", "tempoptionteachername").text(Teachers[i].TeacherName)
                )
            }
        })
    }

    function GetCourses(semestervalue,coursetype) {
        $.get('/AddIntheDatabase/CourseName',{Semester : semestervalue,
        CourseType : coursetype
        } , (Courses) => {

            for (i = 0; i < Courses.length; i++) {
                $("#qcoursename").append(
                    $("<option>").attr("class", "tempoptioncourse").text(Courses[i].CourseName)
                )
            }
        })
    }

    function GetRoomNumber(roomtype) {
        $.get('/AddInTheDatabase/RoomNumber',{RoomType : roomtype},(RoomNo)=>{
            for (i = 0; i < RoomNo.length; i++) {
                    $("#qroomno").append(
                        $("<option>").text(RoomNo[i].RoomId).attr("class", "temproomid")
                    )
                }

        })
    }

    function RemoveRoomNo() {
        $(".temproomid").remove();
    }

    function RemoveCourses(){
        $(".tempoptioncourse").remove();
    }

    function RemovedClassGroup(){
        $(".tempclassgroup").remove();
    }

    function ShowEndTime(RoomType,starttime) {
        var endtime;
        valuesofstrttime = starttime.split(':').map(function (i) {
            return parseInt(i, 10);
        });

        if (RoomType == "Tutorial" || RoomType == "Lecture") {

            if (valuesofstrttime[1] != 5) {
                valuesofstrttime[1] -= 10;
                valuesofstrttime[0] += 1;

                if (parseInt(valuesofstrttime[1] / 10) == 0) {
                    valuesofstrttime[1] = "0" + valuesofstrttime[1].toString();
                }


            } else {
                valuesofstrttime[1] = "55";

            }
            valuesofstrttime[2] = "0" + valuesofstrttime[2].toString()
            endtime = valuesofstrttime[0] + ":" + valuesofstrttime[1] + ":" + valuesofstrttime[2]

            //console.log(valuesofstrttime[0] + " hd " + valuesofstrttime[1])
        }

        else{
            if(valuesofstrttime[1]==15){
                valuesofstrttime[0]+=1;
                valuesofstrttime[1]=55;

            }else if(valuesofstrttime[1]==5){
                valuesofstrttime[0]+=1;
                valuesofstrttime[1]=45;
            }else {
                valuesofstrttime[0]+=2;
                valuesofstrttime[1]=35;
            }
            valuesofstrttime[2] = "0" + valuesofstrttime[2].toString();
            endtime = valuesofstrttime[0] + ":" + valuesofstrttime[1] + ":" + valuesofstrttime[2]



        }
        $("#qendtime").append(
            $("<option>").attr({class: "tempoptionendtime", selected: true}).text(endtime)
        )
    }

    function RemoveTeacherName() {
        $(".tempoptionteachername").remove();
    }



    $("#dataentry").submit(function () {
        // console.log("after click submit ")
        $.ajax({
            type : "POST",
            url : "/AddInTheDatabase/add",
            followAllRedirects: true,
            data : $(this).serialize(),


            success : function(data) {

                showalert(data)
            }

        })
        return false;
        }
    )


    function showalert(message){
        alert(message.result)
        if(message.token == 1){
            $('#dataentry').trigger("reset")
        }
    }


})
