var userModal;
var user = null;
var baseURL = "./api";
let page = 1;
let pageSize = 5;
let sortBy = "name";
let sortDir = "asc";
let allDataList = [];
let filteredDataList = [];
let allEventDataList = [];
let filteredEventDataList = [];
let allCommentDataList = [];
let filteredCommentDataList = [];
let allAuthorDataList = [];
let filteredAuthorDataList = [];
let uniqueCategories = [];
let uniqueLocations = [];
let uniqueOrganizers = [];
let savedTheme = null;
let savedBackgroundImage = null;
let savedFont = null;

document.addEventListener('DOMContentLoaded', function () {
    
    userModal = document.getElementById("userModal");
    savedTheme = localStorage.getItem("savedTheme");
    savedBackgroundImage = localStorage.getItem("savedBackgroundImage");
    const savedFont = localStorage.getItem("savedFont");
    
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        $("#themeChanger").val(savedTheme);
    }

    if (savedBackgroundImage) {
        document.body.style.backgroundImage = `url('${savedBackgroundImage}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        $("#bgImage").val(savedBackgroundImage);
    }

    if (savedFont) {
        document.documentElement.style.setProperty("--app-font", savedFont);
        loadGoogleFont(savedFont);
        $("#fontChanger").val(savedFont);
    }

    userLoginToggle();

    if (user != null) {
        loadAllContactSubmissions();
        loadAllEvents();
        loadAllComments();
        loadAllAuthors();
        setTimeout(function () {
            homePageSlider();
        }, 2000);
        setTimeout(function () {
            eventShowcase();
        }, 2000);
        setTimeout(function () {
            eventDetail();
        }, 2000);
    }

    $("#ContactSubmissionListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();

        filteredDataList = allDataList.filter(ev =>
            ev.fullname.toLowerCase().includes(q) ||
            ev.email.toLowerCase().includes(q) ||
            ev.phone.toLowerCase().includes(q) ||
            ev.content.toLowerCase().includes(q)
        );

        page = 1;
        renderTable(filteredDataList, "contactSubmissionTableBody");
        renderPagination(filteredDataList, "contactSubmissionTablePagination", "contactSubmissionTableBody");
    });

    $("#contactSubmissionTable thead th").on("click", function () {
        let col = $(this).data("sort");
        if (!col) return;

        if (sortBy === col) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortBy = col;
            sortDir = "asc";
        }

        filteredDataList.sort((a, b) => {
            let x = a[col].toString().toLowerCase();
            let y = b[col].toString().toLowerCase();

            if (sortDir === "asc") return x > y ? 1 : -1;
            return x < y ? 1 : -1;
        });

        page = 1;
        renderTable(filteredDataList, "contactSubmissionTableBody");
        renderPagination(filteredDataList, "contactSubmissionTablePagination", "contactSubmissionTableBody");
    });

    $("#eventListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();
        
        filteredEventDataList = allEventDataList.filter(ev =>
            ev.category.toLowerCase().includes(q) ||
            ev.title.toLowerCase().includes(q) ||
            ev.description.toLowerCase().includes(q) ||
            ev.location.toLowerCase().includes(q) ||
            ev.eventDate.toLowerCase().includes(q)
        );

        page = 1;
        renderTable(filteredEventDataList, "eventTableBody");
        renderPagination(filteredEventDataList, "eventTablePagination", "eventTableBody");
    });

    $("#eventTable thead th").on("click", function () {
        let col = $(this).data("sort");
        if (!col) return;

        if (sortBy === col) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortBy = col;
            sortDir = "asc";
        }

        filteredEventDataList.sort((a, b) => {
            let x = a[col].toString().toLowerCase();
            let y = b[col].toString().toLowerCase();

            if (sortDir === "asc") return x > y ? 1 : -1;
            return x < y ? 1 : -1;
        });

        page = 1;
        renderTable(filteredEventDataList, "eventTableBody");
        renderPagination(filteredEventDataList, "eventTablePagination", "eventTableBody");
    });

    $("#commentListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();

        filteredCommentDataList = allCommentDataList.filter(ev =>
            ev.author.toLowerCase().includes(q) ||
            ev.content.toLowerCase().includes(q)
        );

        page = 1;
        renderTable(filteredCommentDataList, "commentTableBody");
        renderPagination(filteredCommentDataList, "commentTablePagination", "commentTableBody");
    });

    $("#commentTable thead th").on("click", function () {
        let col = $(this).data("sort");
        if (!col) return;

        if (sortBy === col) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortBy = col;
            sortDir = "asc";
        }

        filteredCommentDataList.sort((a, b) => {
            let x = a[col].toString().toLowerCase();
            let y = b[col].toString().toLowerCase();

            if (sortDir === "asc") return x > y ? 1 : -1;
            return x < y ? 1 : -1;
        });

        page = 1;
        renderTable(filteredCommentDataList, "commentTableBody");
        renderPagination(filteredCommentDataList, "commentTablePagination", "commentTableBody");
    });

    $("#authorListSearchBox").on("input", function () {
        let q = $(this).val().toLowerCase();

        filteredAuthorDataList = allAuthorDataList.filter(ev =>
            ev.fullname.toLowerCase().includes(q) ||
            ev.email.toLowerCase().includes(q)
        );

        page = 1;
        renderTable(filteredAuthorDataList, "authorTableBody");
        renderPagination(filteredAuthorDataList, "authorTablePagination", "authorTableBody");
    });

    $("#authorTable thead th").on("click", function () {
        let col = $(this).data("sort");
        if (!col) return;

        if (sortBy === col) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortBy = col;
            sortDir = "asc";
        }

        filteredAuthorDataList.sort((a, b) => {
            let x = a[col].toString().toLowerCase();
            let y = b[col].toString().toLowerCase();

            if (sortDir === "asc") return x > y ? 1 : -1;
            return x < y ? 1 : -1;
        });

        page = 1;
        renderTable(filteredAuthorDataList, "authorTableBody");
        renderPagination(filteredAuthorDataList, "authorTablePagination", "authorTableBody");
    });

    $('#contactForm').submit(function (event) {
        event.preventDefault();
        ContactSubmission();
    });

    $('#eventForm').submit(function (event) {
        event.preventDefault();
        EventSubmission();
    });

    $('#eventCommentForm').submit(function (event) {
        event.preventDefault();
        commentSubmission();
    }); 

    $("#themeChanger").on("change", function () {
        const selectedTheme = $(this).val();
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem("savedTheme", selectedTheme);
    });

    $("#bgImage").on("change", function () {
        const selectedBackgroundImage = $(this).val();

        if (selectedBackgroundImage) {
            document.body.style.backgroundImage = `url('${selectedBackgroundImage}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            localStorage.setItem("savedBackgroundImage", selectedBackgroundImage);
        } else {
            document.body.style.background = "";
            localStorage.removeItem("savedBackgroundImage");
        }
    });

    $("#fontChanger").on("change", function () {
        const selectedFont = $(this).val();
        document.documentElement.style.setProperty("--app-font", selectedFont);
        loadGoogleFont(selectedFont);
        localStorage.setItem("savedFont", selectedFont);
    });

});

function userLoginToggle() {
    
    user = JSON.parse(localStorage.getItem("userSession"));
    
    if (user != null) {

        if (userModal != null) {
            userModal.close();
        }
        
        $(".loginMenuText").text(user.fullname + " | Logout");
        $(".loginSubMenu").children("li").removeClass("hidden");
        $("#contact_FullName").val(user.fullname);

    } else {

        if (userModal != null) {
            userModal.showModal();
            $(".loginSubMenu").children("li").addClass("hidden");
        }
        
    }
}

function userLogin() {

    let id = $("#userId").val();
    let fullname = $("#userName").val();

    if ((id == null || id == 0 || id == "") && (fullname != null && fullname != "")) {

        let postData = JSON.stringify(
            {
                "id": null,
                "fullname": fullname,
                "token": null
            });

        $.ajax({
            url: baseURL + "/Auth",
            method: "POST",
            contentType: "application/json",
            data: postData,
            success: function (res) {
                localStorage.setItem("userSession", JSON.stringify(res));
                user = res;
                alert("Successfully Login");

                return res;
            },
            error: function (xhr) {
                console.log("API error:", xhr.status, xhr.responseText);
                return "";
            }
        });

    }
    else {
        alert("Please enter the login name");
    }

}

function ContactSubmission() {
    
    let fullname = $("#contact_FullName").val();
    let email = $("#contact_Email").val();
    let content = $("#contact_Content").val();
    let phone = $("#contact_Phone").val();
    
    if ((fullname != null && fullname != "") && (email != null && email != "") && (content != null && content != "")) {

        let postData = JSON.stringify(
            {
                "id": null,
                "fullname": fullname,
                "email": email,
                "phone": phone,
                "content": content
            }
        );

        $.ajax({
            url: baseURL + "/Messages",
            method: "POST",
            contentType: "application/json",
            data: postData,
            success: function (res) {
                alert("Thank you! Your message has been sent. We will back to you soon.");
                $('#contactForm')[0].reset();
                return res;
            },
            error: function (xhr) {
                console.log("API error:", xhr.status, xhr.responseText);
                return "";
            }
        });

    }
    else {
        alert("Following fields are mandatory to submit contact form. \n - Full Name \n - Email \n - Content");
    }

}

function EventSubmission() {

    let postData = JSON.stringify(
        {
            "id": null,
            "category": $("#event_Category").val(),
            "title": $("#event_Title").val(),
            "description": $("#event_Description").val(),
            "location": $("#event_Location").val(),
            "eventDate": formatFullDate(new Date($("#event_Date").val())),
            "imageUrls": $("#event_ImageUrl").val(),
            "organizer": {
                "id": $("#event_Organizer option:selected").val(),
                "fullname": $("#event_Organizer option:selected").attr("data-fullname"),
                "email": $("#event_Organizer option:selected").attr("data-email"),
                "imageUrl": $("#event_Organizer option:selected").attr("data-imageurl"),
            },
            "comments": [],
            "images": [
                $("#event_ImageUrl").val()
            ]
        }
    );

    $.ajax({
        url: baseURL + "/Events",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        contentType: "application/json",
        data: postData,
        success: function (res) {
            alert("Your event have been submitted successfully.");
            $('#eventForm')[0].reset();
            return res;
        },
        error: function (xhr) {
            console.log("API error:", xhr.status, xhr.responseText);
            return "";
        }
    });

}

function renderTable(dataSet, tableBodyId) {
    let start = (page - 1) * pageSize;
    let pageData = dataSet.slice(start, start + pageSize);
    let rows = "";

    if (pageData.length == 0) {
        rows = '<tr><td colspan="3" class="text-center text-gray-500">No data found</td></tr>';
    } else {

        if (tableBodyId == "contactSubmissionTableBody") {
            pageData.forEach(ev => {
                rows += '<tr><td>' + ev.fullname + '</td><td>' + ev.email + '</td><td>' + ev.phone + '</td><td>' + ev.content + '</td></tr>';
            })
        }
        else if (tableBodyId == "eventTableBody") {
            pageData.forEach(ev => {
                rows += '<tr><td>' + ev.category + '</td><td>' + ev.title + '</td><td>' + ev.description + '</td><td>' + ev.location + '</td><td>' + new Date(ev.eventDate).toDateString() + '</td></tr>';
            });
        }
        else if (tableBodyId == "commentTableBody") {
            pageData.forEach(ev => {
                rows += '<tr><td>' + ev.author + '</td><td>' + ev.content + '</td></tr>';
            });
        }
        else if (tableBodyId == "authorTableBody") {
            pageData.forEach(ev => {
                rows += '<tr><td>' + ev.fullname + '</td><td>' + ev.email + '</td><td><img src="' + ev.imageUrl + '" alt="' + ev.fullname + '" title="' + ev.fullname + '" /></td></tr>';
            });
        }
    }

    $("#" + tableBodyId).html(rows);
}

function renderPagination(dataSet, tablePaginationId, tableBodyId) {
    let totalPages = Math.ceil(dataSet.length / pageSize);
    let html = '<div class="join">';

    for (let i = 1; i <= totalPages; i++) {
        let btnactiveClass = i == page ? "btn-active" : "";
        html += '<button onclick="goToPage(' + i + ', \'' + tableBodyId + '\', \'' + tablePaginationId + '\')" class="join-item btn ' + btnactiveClass +'"> ' + i + ' </button>';
    }

    html += '</div>';

    $("#" + tablePaginationId).html(html);
}

function goToPage(p, tableBodyId, tablePaginationId) {
    page = p;
    let dataSet = null;

    if (tableBodyId == "contactSubmissionTableBody") {
        dataSet = filteredDataList;
    }
    else if (tableBodyId == "eventTableBody") {
        dataSet = filteredEventDataList;
    }
    else if (tableBodyId == "commentTableBody") {
        dataSet = filteredCommentDataList;
    }
    else if (tableBodyId == "authorTableBody") {
        dataSet = filteredAuthorDataList;
    }

    renderTable(dataSet, tableBodyId);
    renderPagination(dataSet, tablePaginationId, tableBodyId);
}

function loadAllEvents() {
    let _category = "";
    let _title = "";
    let _description = "";
    let _location = "";
    let _searchKeyword = "";
    let eventParams = "Category=" + _category + "&Title=" + _title + "&Description=" + _description + "&Location=" + _location + "&Search=" + _searchKeyword;

    $.ajax({
        url: baseURL + "/Events?" + eventParams,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        success: function (res) {
            allEventDataList = res;
            filteredEventDataList = res;
            renderTable(filteredEventDataList, "eventTableBody");
            renderPagination(filteredEventDataList, "eventTablePagination", "eventTableBody");
        },
        error: function (err) {
            $("#eventTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function loadAllContactSubmissions() {
    $("#contactSubmissionTableBody").html('<tr> <td colspan="3" class="text-center"> <span class="loading loading-spinner loading-md"></span> </td> </tr>');

    $.ajax({
        url: baseURL + "/Messages",
        method: "GET",
        success: function (res) {
            allDataList = res;
            filteredDataList = res;
            renderTable(filteredDataList, "contactSubmissionTableBody");
            renderPagination(filteredDataList, "contactSubmissionTablePagination", "contactSubmissionTableBody");
        },
        error: function (err) {
            $("#contactSubmissionTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function loadAllComments() {
    let _withRelated = "";
    let commentParams = "withRelated=" + _withRelated;

    $.ajax({
        url: baseURL + "/Comments?" + commentParams,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        success: function (res) {
            allCommentDataList = res;
            filteredCommentDataList = res;
            renderTable(filteredCommentDataList, "commentTableBody");
            renderPagination(filteredCommentDataList, "commentTablePagination", "commentTableBody");
        },
        error: function (err) {
            $("#commentTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function loadAllAuthors() {
    let _withRelated = "";
    let authorParams = "withRelated=" + _withRelated;

    $.ajax({
        url: baseURL + "/Organizers?" + authorParams,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        success: function (res) {
            allAuthorDataList = res;
            filteredAuthorDataList = res;
            renderTable(filteredAuthorDataList, "authorTableBody");
            renderPagination(filteredAuthorDataList, "authorTablePagination", "authorTableBody");
        },
        error: function (err) {
            $("#authorTableBody").html('<tr><td colspan="3" class="text-center text-red-600">Error loading data</td></tr>');
        }
    });
}

function userLogout() {
    localStorage.removeItem("userSession");
    location.reload();
}

function homePageSlider() {

    let sliderHtml = "";
    let sliderCounter = 1;
    let nextCounter = 1;
    let previousCounter = 1;
    allEventDataList.forEach(item => {

        nextCounter = (sliderCounter + 1);
        previousCounter = (previousCounter - 1);

        if (nextCounter > allEventDataList.length) {
            nextCounter = 1;
        }

        if (previousCounter <= 0) {
            previousCounter = allEventDataList.length;
        }

        sliderHtml += '<div id="slide' + sliderCounter + '" class="carousel-item relative w-full">'
            + '<a href="events.html?eventId=' + item.id + '" title="' + item.title + '">'
            + '<img src="' + item.imageUrls + '" alt="' + item.title + '" title="' + item.title + '" class="w-full h-full object-cover" />'
            + '</a>'
            + '<div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">' +
            '<a href="#slide' + previousCounter +'" class="btn btn-circle">❮</a>' +
            '<a href="#slide' + nextCounter +'" class="btn btn-circle">❯</a>' +
            '</div>' +
            '</div >';

        sliderCounter++;

    });

    $("#slider").html(sliderHtml);

}

function eventShowcase() {

    let eventShowcaseHTML = "";
    let categoryWiseEvents = Object.groupBy(allEventDataList, item => item.category);
    uniqueCategories = Object.keys(categoryWiseEvents);
    let locationWiseEvents = Object.groupBy(allEventDataList, item => item.location);
    uniqueLocations = Object.keys(locationWiseEvents);
    let OrganizerWiseEvents = Object.groupBy(allEventDataList, item => item.organizerId ?? -1);

    $.each(OrganizerWiseEvents, function (OrganizerWiseEvents, allEventDataList) {

        let item = allEventDataList[Math.floor(Math.random() * allEventDataList.length)];

        if (item != null && item.organizer != null) {
            uniqueOrganizers.push(item.organizer);
        }

    });

    if (uniqueCategories != null) {

        $("#event_Category").append($("<option></option>").val("").text("Select an option").prop("disabled", true).prop("selected", true));

        uniqueCategories.forEach(opt => {
            if (opt != null) {
                $("#event_Category").append(
                    $("<option></option>").val(opt).text(opt)
                );
            }
        });

    }

    if (uniqueLocations != null) {

        $("#event_Location").append($("<option></option>").val("").text("Select an option").prop("disabled", true).prop("selected", true));

        uniqueLocations.forEach(opt => {
            if (opt != null) {
                $("#event_Location").append(
                    $("<option></option>").val(opt).text(opt)
                );
            }
        });

    }

    if (uniqueOrganizers != null) {

        $("#event_Organizer").append($("<option></option>").val("").text("Select an option").prop("disabled", true).prop("selected", true));

        uniqueOrganizers.forEach(opt => {

            if (opt != null) {
                $("#event_Organizer").append(
                    $("<option></option>").val(opt.id).text(opt.fullname).attr("data-fullname", opt.fullname).attr("data-email", opt.email).attr("data-imageUrl", opt.imageUrl)
                );
            }
            
        });

    }

    if (categoryWiseEvents != null) {

        $.each(categoryWiseEvents, function (categoryWiseEvents, allEventDataList) {

            let item = allEventDataList[Math.floor(Math.random() * allEventDataList.length)];

            if (item != null) {
                eventShowcaseHTML += '<div class="card bg-base-100 shadow border border-gray-200">'
                    + '<figure>'
                    + '<img src="' + item.imageUrls + '" alt="' + item.title + '" />'
                    + '</figure>'
                    + '<div class="card-body">'
                    + '<h3 class="card-title">' + item.category + '</h3>'
                    + '<p>' + item.description + '</p>'
                    + '<a href="events.html?eventId=' + item.id + '" class="btn btn-outline btn-primary mt-2">View Details</a>'
                    + '</div>'
                    + '</div>';
            }
            
        });

    }

    $("#eventShowcase").html(eventShowcaseHTML);

}

function eventDetail() {

    const eventId = new URLSearchParams(window.location.search).get("eventId");

    if (eventId != null) {
        let eventArray = allEventDataList.filter(item => item.id == eventId);

        if (eventArray != null && eventArray.length > 0) {
            let event = eventArray[0];
            $("#eventImage").attr("src", event.imageUrls);
            $("#eventTitle").text(event.title);
            $("#eventCategory").text(event.category);
            $("#eventDate").text(new Date(event.eventDate).toDateString());
            $("#eventLocation").text(event.location);
            $("#eventOrganizer").text(event.organizer?.fullname);
            $("#eventDescription").html(event.description);
            $("#eventUser").val(user.fullname);

            if (event.comments != null && event.comments.length > 0) {

                let eventCommentsHTML = "";

                event.comments.forEach(item => {

                    eventCommentsHTML += '<div class="p-4 border rounded-lg bg-white shadow-sm">'
                        + '<div class="font-semibold text-gray-900">' + item.author + '</div>'
                        + '<div class="text-gray-700 mt-1">'
                        + item.content 
                        + '</div>'
                        + '</div>';
                });

                $("#eventComments").html(eventCommentsHTML);

            }
        }
    }
    
}

function commentSubmission() {

    const eventId = new URLSearchParams(window.location.search).get("eventId");
    let authorFullName = $("#eventUser").val();
    let authorContent = $("#eventUserComment").val();

    if (eventId != null && eventId != "") {

        let postData = JSON.stringify(
            {
                "id": null,
                "eventId": eventId,
                "author": authorFullName,
                "content": authorContent
            }
        );

        $.ajax({
            url: baseURL + "/Comments/" + eventId,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.token
            },
            contentType: "application/json",
            data: postData,
            success: function (res) {
                alert("Thank you! Your comment has been submitted. You can view it after page refresh.");
                $('#eventCommentForm')[0].reset();
                return res;
            },
            error: function (xhr) {
                console.log("API error:", xhr.status, xhr.responseText);
                return "";
            }
        });

    }
    else {
        alert("Following fields are mandatory to submit Comment form. \n - User Name \n - Content");
    }

}

function loadGoogleFont(font) {
    const formatted = font.replace(/['"]/g, "").replace(/,.*$/, "");
    document.getElementById("fontLoader").href =
        `https://fonts.googleapis.com/css2?family=${formatted.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
}

function formatFullDate(date) {
    const pad = (n) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    const ms = date.getMilliseconds().toString().padStart(3, "0");
    const fraction7 = ms + "0000"; // convert 3 → 7 digits

    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${fraction7}`;
}

function sampleRequest(id, fullname) {
    
    if ((id == null || id == 0 || id == "") && (fullname != null || fullname != 0 || fullname != "")) {

        $.ajax({
            url: "/Auth",
            method: "POST",
            headers: {
                "Authorization": "Bearer YOUR_TOKEN_HERE"
            },
            contentType: "application/json",
            data: JSON.stringify(
                {
                    "id": null,
                    "fullname": fullname,
                    "token": null
                }
            ),
            success: function (res) {
                console.log("Response:", res);
                localStorage.setItem("userSession", JSON.stringify(res));
                user = res;
                return res;
            },
            error: function (xhr) {
                console.log("API error:", xhr.status, xhr.responseText);
                return "";
            }
        });

    }
    else {
        user = JSON.parse(localStorage.getItem("userSession"));
        return user;
    }

}

